import { ecdsa_example_motoko } from "../../declarations/ecdsa_example_motoko";
import { ecdsa_example_rust } from "../../declarations/ecdsa_example_rust";
import { publicKeyVerify, signatureNormalize, ecdsaVerify } from "secp256k1";
let sha256 = require("sha256");

function fromHex(hexString) {
  return Uint8Array.from(Buffer.from(hexString, "hex"));
}

function verify(e) {
  let output = document.getElementById("verified");
  let hash = fromHex(document.getElementById("sha256").value);
  let public_key = fromHex(document.getElementById("public_key").value);
  let signature = signatureNormalize(
    fromHex(document.getElementById("signature").value)
  );
  console.log("hash", hash);
  console.log("public_key", publicKeyVerify(public_key));
  console.log("signature", signature);
  let verified = ecdsaVerify(signature, hash, public_key);
  console.log("verified = " + verified);
  output.innerHTML =
    "secp256k1 signature " + (verified ? "is verified" : "fails to verify");
  output.style.color = verified ? "#0D47A1" : "red";
  return true;
}

async function sign(e) {
  const error = document.getElementById("error");
  const button = document.getElementById("sign");
  const message = document.getElementById("message").value.toString();
  document.getElementById("sha256").value = sha256(message);
  let hash = sha256(message, { asBytes: true });
  console.log("hash", hash);
  document.getElementById("public_key").value = "";
  document.getElementById("signature").value = "";
  document.getElementById("verified").innerText = "";
  button.disabled = true;
  let ecdsa_example = document.getElementById("motoko").checked
    ? ecdsa_example_motoko
    : ecdsa_example_rust;

  // Get public key
  let spinner = document.getElementById("spinner-pubkey");
  spinner.hidden = false;
  let res;
  try {
    res = await ecdsa_example.public_key();
    console.log(res);
    spinner.hidden = true;
  } catch (err) {
    error.innerText = err.message;
    spinner.hidden = true;
    return;
  }
  if (res.Ok) {
    document.getElementById("public_key").value = Buffer.from(
      res.Ok.public_key
    ).toString("hex");
  } else {
    error.innerText = res.Err;
    return;
  }

  // Get signature
  spinner = document.getElementById("spinner-signature");
  spinner.hidden = false;
  try {
    res = await ecdsa_example.sign(hash);
    console.log(res);
    spinner.hidden = true;
  } catch (err) {
    error.innerText = err.message;
    spinner.hidden = true;
    return;
  }
  if (res.Ok) {
    document.getElementById("signature").value = Buffer.from(
      res.Ok.signature
    ).toString("hex");
  } else {
    document.getElementById("error").innerText = res.Err;
  }
  button.disabled = false;
}

window.addEventListener("load", () => {
  document.getElementById("sign").onclick = sign;
  document.getElementById("verify").onclick = verify;
  document.getElementById("message").oninput = (evt) => {
    const message = document.getElementById("message").value.toString();
    document.getElementById("sha256").value =
      message == "" ? "" : sha256(message);
    document.getElementById("public_key").value = "";
    document.getElementById("signature").value = "";
    document.getElementById("verified").innerText = "";
  };
});
