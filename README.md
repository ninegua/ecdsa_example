# ECDSA Signing Demo

To run this demo you must be running dfx 0.9.3 or higher, and you will have to start replica and icx-proxy manually.

First, we start replica in one terminal:

```
~/.cache/dfinity/versions/0.9.3/ic-starter \
    --replica-path ~/.cache/dfinity/versions/0.9.3/replica \
    --subnet-features ecdsa_signatures \
    --dkg-interval-length=20 \
    --subnet-type system \
    --create-funds-whitelist '*'
```

This starts replica with all states saved in a randomly created temporary directory under `/tmp`, *everytime*.
If this is not what you want, please add `--state-dir <state_dir>` flag.
Also, by default replica binds port 8080 on localhost, and you can add flag `--http-port <port>` to change it.

Next, in another terminal, we'll start icx-proxy to listen at port 8000 and forward request to replica at 8080.

```
~/.cache/dfinity/versions/0.9.3/icx-proxy \
    --fetch-root-key \
    --address 127.0.0.1:8000 \
    --replica http://localhost:8080
```

Finally, in a third terminal, we deploy the canister:

```
dfx deploy
```

This should build and deploy both backend and frontend canisters.
If all is successful, you may point your browser to the asset canister's URL and see the frontend UI of this demo.

![screenshot](https://github.com/ninegua/ecdsa_example/raw/master/screenshot.png) 

At the moment the build is against IC commit [d004accc3904e24dddb13a11d93451523e1a8a5f](https://github.com/dfinity/ic/commit/d004accc3904e24dddb13a11d93451523e1a8a5f) because that is what dfx 0.9.3 uses.
If you want to run against newer version of IC (which has changed the ECDSA API), you will need to compile and run your own replica, and also don't forget to edit the file `src/ecdsa_example/Cargo.toml` to pin the same version.
