import Cycles "mo:base/ExperimentalCycles";
import Error "mo:base/Error";
import Principal "mo:base/Principal";

actor {
  type IC0 = actor {
    ecdsa_public_key : ({
      canister_id : ?Principal;
      derivation_path : [Blob];
      key_id : { curve: { #secp256k1; } ; name: Text };
    }) -> async ({ public_key : Blob; chain_code : Blob; });
    sign_with_ecdsa : ({
      message_hash : Blob;
      derivation_path : [Blob];
      key_id : { curve: { #secp256k1; } ; name: Text };
    }) -> async ({ signature : Blob });
  };

  let ic0 : IC0 = actor("aaaaa-aa");

  public shared (msg) func public_key() : async { #Ok : { public_key: Blob }; #Err : Text } {
    let caller = Principal.toBlob(msg.caller);
    try {
      let { public_key } = await ic0.ecdsa_public_key({
          canister_id = null;
          derivation_path = [ caller ];
          key_id = { curve = #secp256k1; name = "dfx-local-key" };
      });
      #Ok({ public_key })
    } catch (err) {
      #Err(Error.message(err))
    }
  };

  public shared (msg) func sign(message: Blob) : async { #Ok : { signature: Blob }; #Err : Text } {
    let caller = Principal.toBlob(msg.caller);
    try {
      Cycles.add(10_000_000_000);
      let result = await ic0.sign_with_ecdsa({
          message_hash = message;
          derivation_path = [ caller ];
          key_id = { curve = #secp256k1; name = "dfx-local-key" };
      });
      #Ok(result)
    } catch (err) {
      #Err(Error.message(err))
    }
  };
}

