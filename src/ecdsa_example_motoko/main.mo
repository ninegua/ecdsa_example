import IC00 "canister:ic00";
import Error "mo:base/Error";

actor {
  public func sign(message: Blob) : async { #Ok : { message: Blob; publickey: Blob; signature: Blob }; #Err : Text } {
    try {
      let { public_key } = await IC00.ecdsa_public_key({
          canister_id = null;
          derivation_path = [];
          key_id = { curve = #secp256k1; name = "" };
      });
      let { signature } = await IC00.sign_with_ecdsa({
          message_hash = message;
          derivation_path = [];
          key_id = { curve = #secp256k1; name = "" };
      });
      #Ok({ message = message; publickey = public_key; signature = signature})
    } catch (err) {
      #Err(Error.message(err))
    }
  }
}

