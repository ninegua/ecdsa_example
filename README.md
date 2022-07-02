# ECDSA Signing Demo

Sample Motoko and Rust code on how to use the upcoming threshold ECDSA signing features of the Internet Computer.

The [API of the IC Management Canister](https://github.com/dfinity/interface-spec/blob/master/spec/index.adoc#ic-method-ecdsa_public_key) specifies two functions, `ecdsa_public_key` and `sign_with_ecdsa` that can be called from a canister (not from a user).
One must attach enough cycles with the call when using `sign_with_ecdsa`.

To run the demo, you will need a working installation of the [DFINITY SDK](https://github.com/dfinity/sdk), [nodejs](https://nodejs.org) and also Rust toolchain such as [rustup](https://rustup.rs).

To run with Motoko only, please comment out the `ecdsa_example_rust` section in `dfx.json` before proceed.

The command below build and deploy all canisters including a frontend asset canister:

```
dfx deploy
```

If all is successful, you may point your browser to the asset canister's URL and see the frontend UI of this demo.

![screenshot](https://github.com/ninegua/ecdsa_example/raw/master/screenshot.png) 

