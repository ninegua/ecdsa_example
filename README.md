# ECDSA Signing Demo

Sample Motoko and Rust code on how to use the upcoming threshold ECDSA signing features of the Internet Computer.

Because this feature has yet to be enabled on the main network, these examples use a [mock implementation](https://fxa77-fiaaa-aaaae-aaana-cai.raw.ic0.app/organic/mockecdsa.html) that is essentially a canister with the same [interface as the IC Management Canister](https://github.com/dfinity/interface-spec/blob/master/spec/index.adoc#ic-method-ecdsa_public_key) would use.

You can simply change the canister to call from `ic00` used in these examples to `"aaaaa-aa"` once the feature goes live.

**IMPORTANT: PLEASE DO NOT USE THE MOCK IMPLEMENTATION HERE IN PRODUCTION**.

To run the demo, you will need a working installation of the [DFINITY SDK](https://github.com/dfinity/sdk) and also Rust toolchain such as [rustup](https://rustup.rs).

If you do not need Rust, please checkout the [motoko-only](https://github.com/ninegua/ecdsa_example/tree/motoko-only) branch.

```
dfx deploy
```

This should build and deploy all canisters including a frontend asset canister.
If all is successful, you may point your browser to the asset canister's URL and see the frontend UI of this demo.

![screenshot](https://github.com/ninegua/ecdsa_example/raw/master/screenshot.png) 
