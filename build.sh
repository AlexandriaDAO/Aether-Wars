# EVAN VERSION OG

set -x 

#!/bin/bash

# Step 1: Start dfx
dfx stop
dfx start --background --clean

# Step 2: II Canister
dfx deps pull
dfx deps init
dfx deps deploy
dfx deps deploy internet_identity
dfx deploy xrc --specified-id uf6dk-hyaaa-aaaaq-qaaaq-cai

# Step 3: Deploy nft_manager, which deploys icrc7

dfx canister create profile_nft --specified-id fjqb7-6qaaa-aaaak-qc7gq-cai
dfx build profile_nft
dfx canister update-settings profile_nft --add-controller forhl-tiaaa-aaaak-qc7ga-cai

dfx canister create tower_nft --specified-id rby3s-dqaaa-aaaak-qizqa-cai
dfx build tower_nft
dfx canister update-settings tower_nft --add-controller forhl-tiaaa-aaaak-qc7ga-cai


# Step 4: Generate all other backend canisters.

# For backend
cargo build --release --target wasm32-unknown-unknown --package backend
candid-extractor target/wasm32-unknown-unknown/release/backend.wasm > src/backend/backend.did
# For icp_swap
cargo build --release --target wasm32-unknown-unknown --package icp_swap
candid-extractor target/wasm32-unknown-unknown/release/icp_swap.wasm > src/icp_swap/icp_swap.did
# For tokenomics
cargo build --release --target wasm32-unknown-unknown --package tokenomics
candid-extractor target/wasm32-unknown-unknown/release/tokenomics.wasm > src/tokenomics/tokenomics.



cargo update

dfx deploy backend --specified-id forhl-tiaaa-aaaak-qc7ga-cai
dfx deploy icp_swap --specified-id 5qx27-tyaaa-aaaal-qjafa-cai
dfx deploy tokenomics --specified-id uxyan-oyaaa-aaaap-qhezq-cai



# Step 5: Configure Local Identities for token launches
dfx identity new minter --storage-mode plaintext
dfx identity use minter
export MINTER_ACCOUNT_ID=$(dfx ledger account-id)
export MINTER_ACCOUNT_PRINCIPAL=$(dfx identity get-principal)
dfx identity use default
export DEFAULT_ACCOUNT_ID=$(dfx ledger account-id)
export DEFAULT_ACCOUNT_PRINCIPAL=$(dfx identity get-principal)


# Step 6: Deploy the ICP & ICRC Ledger with LICP, LBRY, and AETHER tokens
dfx deploy --specified-id ryjl3-tyaaa-aaaaa-aaaba-cai icp_ledger_canister --argument "  
  (variant {  
    Init = record {  
      minting_account = \"$MINTER_ACCOUNT_ID\";  
      initial_values = vec {  
        record {  
          \"$DEFAULT_ACCOUNT_ID\";  
          record {  
            e8s = 9_000_000_000_000_000 : nat64;  
          };  
        };  
      };  
      send_whitelist = vec {};  
      transfer_fee = opt record {  
        e8s = 10_000 : nat64;  
      };  
      token_symbol = opt \"LICP\";  
      token_name = opt \"Local ICP\";  
    }  
  })  
"

dfx deploy LBRY --specified-id hdtfn-naaaa-aaaam-aciva-cai --argument '(variant { Init = 
record {
     token_symbol = "LBRY";
     token_name = "LBRY";
     minting_account = record { owner = principal "'$(dfx canister id icp_swap)'" };
     transfer_fee = 4_000_000;
     metadata = vec {};
     initial_balances = vec { record { record { owner = principal "'${MINTER_ACCOUNT_PRINCIPAL}'" }; 0 } };
     archive_options = record {
         num_blocks_to_archive = 1000;
         trigger_threshold = 2000;
         controller_id = principal "'$(dfx canister id icp_swap)'";
     };
     feature_flags = opt record {
        icrc2 = true;
     };
 }
})'

dfx deploy AETHER --specified-id 7hcrm-4iaaa-aaaak-akuka-cai --argument '(variant { Init = 
record {
     token_symbol = "AETHER";
     token_name = "AETHER";
     minting_account = record { owner = principal "'$(dfx canister id tokenomics)'" };
     transfer_fee = 10_000;
     metadata = vec {};
     initial_balances = vec { record { record { owner = principal "'${MINTER_ACCOUNT_PRINCIPAL}'" }; 0 } };
     archive_options = record {
         num_blocks_to_archive = 1000;
         trigger_threshold = 2000;
         controller_id = principal "'$(dfx canister id tokenomics)'";
     };
     feature_flags = opt record {
        icrc2 = true;
     };
 }
})'


echo "Backend canisters finished. Copy and paste remainder of the build script manually to deploy on the network."
exit 1

# Step 7: Deploy frontend Manually.

mkdir -p .dfx/local/canisters/LBRY
mkdir -p .dfx/local/canisters/AETHER
touch .dfx/local/canisters/LBRY/LBRY.did
touch .dfx/local/canisters/AETHER/AETHER.did

# mkdir -p .dfx/local/canisters/icp_ledger_canister
# curl https://raw.githubusercontent.com/dfinity/ic/b9a0f18dd5d6019e3241f205de797bca0d9cc3f8/rs/rosetta-api/icp_ledger/ledger.did -o .dfx/local/canisters/icp_ledger_canister/icp_ledger_canister.did

npm i
dfx deploy aether_frontend --specified-id xo3nl-yaaaa-aaaap-abl4q-cai



# Other Helpful Commands: 

# Send yourself ICP in the UI: 
dfx ledger transfer --amount 100_000 --memo 12345 5163534db2a1c0c61c7cbb23f328f913052cf10e85c6765757c93fe7a8f0a1b5



# subnet of choice: opn46-zyspe-hhmyp-4zu6u-7sbrh-dok77-m7dch-im62f-vyimr-a3n2c-4ae
# dfx canister create tower_nft --next-to fjqb7-6qaaa-aaaak-qc7gq-cai --network ic

# dfx canister update-settings --add-controller yog5q-6fxnl-g4zd4-s2nuh-f7fkw-ijb4e-z7dmo-jrarx-uoe2x-wx5sh-dae rby3s-dqaaa-aaaak-qizqa-cai --network ic

