mod helper;

use ic_cdk::export::{
    candid::CandidType,
    serde::{Deserialize, Serialize},
    Principal,
};
use ic_cdk_macros::*;

#[import(canister = "ic00")]
struct IC00;

#[derive(CandidType, Serialize, Debug)]
struct Bundle {
    pub message: Vec<u8>,
    pub publickey: Vec<u8>,
    pub signature: Vec<u8>,
}

type CanisterId = Principal;

#[derive(CandidType, Serialize, Debug)]
struct ECDSAPublicKey {
    pub canister_id: Option<CanisterId>,
    pub derivation_path: Vec<Vec<u8>>,
    pub key_id: EcdsaKeyId,
}

#[derive(CandidType, Deserialize, Debug)]
struct ECDSAPublicKeyReply {
    pub public_key: Vec<u8>,
    pub chain_code: Vec<u8>,
}

#[derive(CandidType, Serialize, Debug)]
struct SignWithECDSA {
    pub message_hash: Vec<u8>,
    pub derivation_path: Vec<Vec<u8>>,
    pub key_id: EcdsaKeyId,
}

#[derive(CandidType, Deserialize, Debug)]
struct SignWithECDSAReply {
    pub signature: Vec<u8>,
}

#[derive(CandidType, Serialize, Debug, Clone)]
struct EcdsaKeyId {
    pub curve: EcdsaCurve,
    pub name: String,
}

#[derive(CandidType, Serialize, Debug, Clone)]
pub enum EcdsaCurve {
    #[serde(rename = "secp256k1")]
    Secp256k1,
}

#[update]
async fn sign(message: Vec<u8>) -> Result<Bundle, String> {
    assert!(message.len() == 32);
    let key_id = EcdsaKeyId {
        curve: EcdsaCurve::Secp256k1,
        name: "".to_string(),
    };
    //let ic00 = CanisterId::from_str("aaaaa-aa").unwrap();
    let publickey: Vec<u8> = {
        let request = ECDSAPublicKey {
            canister_id: None,
            derivation_path: vec![vec![2, 3]],
            key_id: key_id.clone(),
        };
        ic_cdk::println!("Sending signature request = {:?}", request);
        let res: ECDSAPublicKeyReply = IC00::ecdsa_public_key(request)
            .await
            .map_err(|e| format!("Failed to call ecdsa_public_key {}", e.1))?;
        ic_cdk::println!("Got response = {:?}", res);
        res.public_key
    };

    let signature: Vec<u8> = {
        let request = SignWithECDSA {
            message_hash: message.clone(),
            derivation_path: vec![vec![2, 3]],
            key_id,
        };
        ic_cdk::println!("Sending signature request = {:?}", request);
        let res: SignWithECDSAReply = IC00::sign_with_ecdsa(request)
            .await
            .map_err(|e| format!("Failed to call sign_with_ecdsa {}", e.1))?;

        ic_cdk::println!("Got response = {:?}", res);
        res.signature
    };

    let verified = helper::verify_signature(&message, &signature, &publickey);
    ic_cdk::println!("ECDSA signature verification {}", verified);

    Ok(Bundle {
        message,
        publickey,
        signature,
    })
}
