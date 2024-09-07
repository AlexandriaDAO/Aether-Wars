use std::time::Duration;

use candid::{Encode, CandidType, Principal};
use ic_cdk_timers::set_timer;
use serde::{Serialize, Deserialize};
use ic_cdk::api::management_canister::main::{InstallCodeArgument, CanisterInstallMode};

const PROFILE_NFT_WASM: &[u8] = include_bytes!("./../../../../.dfx/local/canisters/profile_nft/profile_nft.wasm");
const TOWER_NFT_WASM: &[u8] = include_bytes!("./../../../../.dfx/local/canisters/tower_nft/tower_nft.wasm");

const PROFILE_NFT_CANISTER_ID: &str = "fjqb7-6qaaa-aaaak-qc7gq-cai";
const TOWER_NFT_CANISTER_ID: &str = "rby3s-dqaaa-aaaak-qizqa-cai";

#[derive(CandidType, Serialize, Deserialize)]
struct DeployArgs {
    icrc7_args: Option<Vec<u8>>,
    icrc3_args: Option<Vec<u8>>,
}

#[derive(CandidType, Serialize, Deserialize)]
pub enum DeployResult {
    Ok,
    Err(String),
}

// Triggers once, deploying icrc7, and never again. Should be commented out if ever hard redeployed.
#[ic_cdk::init]
fn init() {
    set_timer(Duration::from_secs(1), post_init);
}

fn post_init() {
    ic_cdk::spawn(async {
        match deploy_profile_nft().await {
            DeployResult::Ok => {
                ic_cdk::println!("ICRC7 deployed successfully");
            },
            DeployResult::Err(e) => ic_cdk::println!("Failed to deploy ICRC7: {}", e),
        }
        match deploy_tower_nft().await {
            DeployResult::Ok => {
                ic_cdk::println!("Tower NFT deployed successfully");
            },
            DeployResult::Err(e) => ic_cdk::println!("Failed to deploy Tower NFT: {}", e),
        }
    });
}


async fn deploy_profile_nft() -> DeployResult {
    let canister_id = match Principal::from_text(PROFILE_NFT_CANISTER_ID) {
        Ok(id) => id,
        Err(e) => return DeployResult::Err(format!("Invalid canister ID: {}", e)),
    };

    // Prepare null deploy arguments
    let deploy_args = DeployArgs {
        icrc7_args: None,
        icrc3_args: None,
    };

    // Encode the deploy arguments
    let encoded_args = match Encode!(&deploy_args) {
        Ok(args) => args,
        Err(e) => return DeployResult::Err(format!("Failed to encode arguments: {}", e)),
    };

    // Install the ICRC7 code
    let install_args = InstallCodeArgument {
        mode: CanisterInstallMode::Install,
        canister_id,
        wasm_module: PROFILE_NFT_WASM.to_vec(),
        arg: encoded_args,
    };

    match ic_cdk::api::management_canister::main::install_code(install_args).await {
        Ok(_) => DeployResult::Ok,
        Err((code, msg)) => DeployResult::Err(format!("Failed to install Wasm module: error code {:?}, message: {}", code, msg)),
    }
}

async fn deploy_tower_nft() -> DeployResult {
    let canister_id = match Principal::from_text(TOWER_NFT_CANISTER_ID) {
        Ok(id) => id,
        Err(e) => return DeployResult::Err(format!("Invalid canister ID: {}", e)),
    };

    // Prepare null deploy arguments
    let deploy_args = DeployArgs {
        icrc7_args: None,
        icrc3_args: None,
    };

    // Encode the deploy arguments
    let encoded_args = match Encode!(&deploy_args) {
        Ok(args) => args,
        Err(e) => return DeployResult::Err(format!("Failed to encode arguments: {}", e)),
    };

    // Install the ICRC7 code
    let install_args = InstallCodeArgument {
        mode: CanisterInstallMode::Install,
        canister_id,
        wasm_module: TOWER_NFT_WASM.to_vec(),
        arg: encoded_args,
    };

    match ic_cdk::api::management_canister::main::install_code(install_args).await {
        Ok(_) => DeployResult::Ok,
        Err((code, msg)) => DeployResult::Err(format!("Failed to install Wasm module: error code {:?}, message: {}", code, msg)),
    }
}
