use k256::ecdsa::signature::digest::{
    generic_array::{typenum::U32, GenericArray},
    FixedOutputDirty, Reset, Update,
};
use k256::ecdsa::{signature, signature::DigestVerifier, Signature, VerifyingKey};
use std::convert::TryFrom;

#[derive(Default, Clone)]
struct Hash256([u8; 32]);

impl Reset for Hash256 {
    fn reset(&mut self) {}
}

impl FixedOutputDirty for Hash256 {
    type OutputSize = U32;
    fn finalize_into_dirty(&mut self, out: &mut GenericArray<u8, Self::OutputSize>) {
        out.copy_from_slice(&self.0);
    }
}

impl Update for Hash256 {
    fn update(&mut self, _data: impl AsRef<[u8]>) {
        todo!()
    }
}

impl TryFrom<&[u8]> for Hash256 {
    type Error = &'static str;

    fn try_from(bytes: &[u8]) -> Result<Self, Self::Error> {
        if bytes.len() != 32 {
            Err("Hash is not 32 bytes")
        } else {
            let mut arr = [0; 32];
            arr.copy_from_slice(bytes);
            Ok(Self(arr))
        }
    }
}

pub fn verify_signature(
    message_hash: &[u8],
    signature_bytes: &[u8],
    public_key_bytes: &[u8],
) -> bool {
    let signature: Signature = signature::Signature::from_bytes(signature_bytes)
        .expect("Response is not a valid signature");
    let verifying_key = VerifyingKey::from_sec1_bytes(public_key_bytes)
        .expect("Response is not a valid public key");
    let digest: Hash256 = Hash256::try_from(message_hash).expect("Message is not a valid SHA256");
    verifying_key.verify_digest(digest, &signature).is_ok()
}
