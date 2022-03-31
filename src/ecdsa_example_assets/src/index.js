import { ecdsa_example } from "../../declarations/ecdsa_example";
import { publicKeyVerify, signatureNormalize, ecdsaVerify } from "secp256k1";
let sha256 = require("sha256");

function fromHex(hexString) {
  return Uint8Array.from(Buffer.from(hexString, 'hex'))
}

function verify() {
  let hash = fromHex(document.getElementById("sha256").value);
  let publickey = fromHex(document.getElementById("publickey").value);
  let signature = signatureNormalize(fromHex(document.getElementById("signature").value));
  console.log("hash", hash);
  console.log("publickey", publicKeyVerify(publickey));
  console.log("signature", signature);
  let verified = ecdsaVerify(signature, hash, publickey);
  console.log("verified = " + verified);
  document.getElementById("verified").innerHTML = "secp256k1 signature " + (verified ? "is verified" : "fails to verify");
  document.getElementById("verified").style.color = verified ? "#0D47A1" : "red";
  return false;
}

async function sign(e) {
  e.preventDefault();
  const button = document.getElementById("sign");
  const spinner = document.getElementById("spinner");
  const message = document.getElementById("message").value.toString();
  document.getElementById("sha256").value = sha256(message);
  let hash = sha256(message, { asBytes: true });
  console.log(hash);
  document.getElementById("signature").value = "";
  document.getElementById("verified").innerText = "";
  button.disabled = true;
  spinner.hidden = false;
  // Interact with foo actor, calling the greet method
  const res = await ecdsa_example.sign(hash);
  console.log(res);
  spinner.hidden = true;
  if (res.Ok) {
    document.getElementById("publickey").value = Buffer.from(res.Ok.publickey).toString("hex"); 
    document.getElementById("signature").value = Buffer.from(res.Ok.signature).toString("hex"); 
  } else {
    document.getElementById("error").innerText = res.Err;
  }
  button.disabled = false;
  return false;
}

window.addEventListener("load", () => {
   document.getElementById("sign").onclick = sign;
   document.getElementById("verify").onclick = verify;
   document.getElementById("message").oninput = (evt) => {
      const message = document.getElementById("message").value.toString();
      document.getElementById("sha256").value = message == "" ? "" : sha256(message);
      document.getElementById("signature").value = "";
      document.getElementById("verified").innerText = "";
   };
})
