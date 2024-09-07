use std::collections::BTreeMap;

use crate::{get_nft_principal, tower_nft_principal};
use crate::guard::*;
use crate::types::*;
use crate::utils::*;
use crate::query::*;

use ic_cdk::update;
use candid::{Nat, Principal};
use ic_cdk::api::call::CallResult;
use ic_cdk::caller;
use icrc_ledger_types::{icrc::generic_value::Value, icrc1::account::Account};

#[update(decoding_quota = 200, guard = "not_anon")]
pub async fn mint_profile(description: String, minting_number: Nat, faction: Nat) -> Result<String, String> {
    const MAX_DESCRIPTION_LENGTH: usize = 256;

    if description.len() > MAX_DESCRIPTION_LENGTH {
        return Err(format!("Description exceeds maximum length of {} bytes", MAX_DESCRIPTION_LENGTH));
    }

    if !is_within_32_digits(&minting_number.clone()) {
        return Err("Minting number must not exceed 32 digits".to_string());
    }

    if faction < Nat::from(1u8) || faction > Nat::from(4u8) {
        return Err("Faction must be a number between 1 and 4".to_string());
    }

    if let Some(true) = nfts_exist(NftCollection::Profile, vec![minting_number.clone()]).await?.first() {
        return Err("NFT already exists".to_string());
    }

    let new_token_id = minting_number;

    let nft_request = SetNFTItemRequest {
        token_id: new_token_id.clone(),
        owner: Some(Account {
            owner: caller(),
            subaccount: None,
        }),
        metadata: NFTInput::Class(vec![
            PropertyShared {
                name: "icrc7:metadata:uri:transactionId".to_string(),
                value: CandyShared::Text(description),
                immutable: true,
            },
            PropertyShared {
                name: "icrc7:metadata:attackable".to_string(),
                value: CandyShared::Bool(false),
                immutable: false,
            },
            PropertyShared {
                name: "faction".to_string(),
                value: CandyShared::Text(faction.to_string()),
                immutable: true,
            },
        ]),
        override_: false,
        created_at_time: Some(ic_cdk::api::time()),
    };

    let call_result: CallResult<()> = ic_cdk::call(
        get_nft_principal(NftCollection::Profile),
        "icrcX_mint",
        (vec![nft_request],)
    ).await;

    match call_result {
        Ok(_) => Ok(format!("NFT minted successfully with token ID: {}", new_token_id)),
        Err((code, msg)) => Err(format!("Error calling icrcX_mint: {:?} - {}", code, msg))
    }
}

async fn fetch_metadata(collection: NftCollection, valid_minting_numbers: Vec<Nat>) -> Result<Vec<Option<BTreeMap<String, Value>>>, String> {
    let metadata_call_result: CallResult<(Vec<Option<BTreeMap<String, Value>>>,)> = ic_cdk::call(
        get_nft_principal(collection),
        "icrc7_token_metadata",
        (valid_minting_numbers.clone(),)
    ).await;

    match metadata_call_result {
        Ok((metadata,)) => Ok(metadata),
        Err((code, msg)) => Err(format!("Error fetching metadata: {:?} - {}", code, msg)),
    }
}

// Not helpfile right now. We need to adjsut if getting our personal metadata.
async fn prepare_nft_requests(valid_minting_numbers: Vec<Nat>, metadata: Vec<Option<BTreeMap<String, Value>>>, owner: Principal) -> Vec<SetNFTItemRequest> {
    valid_minting_numbers.iter().zip(metadata.iter()).filter_map(|(token_id, token_metadata)| {
        let description = token_metadata.as_ref().and_then(|metadata| {
            metadata.get("icrc7:metadata:uri:transactionId")
                .and_then(|value| match value {
                    Value::Text(s) => Some(s.clone()),
                    _ => None,
                })
        });

        description.map(|desc| SetNFTItemRequest {
            token_id: token_id.clone(),
            owner: Some(Account::from(owner)),
            metadata: NFTInput::Class(vec![
                PropertyShared {
                    name: "icrc7:metadata:uri:transactionId".to_string(),
                    value: CandyShared::Text(desc),
                    immutable: true,
                },
                PropertyShared {
                    name: "icrc7:metadata:attackable".to_string(),
                    value: CandyShared::Bool(true),
                    immutable: true,
                },
            ]),
            override_: true,
            created_at_time: Some(ic_cdk::api::time()),
        })
    }).collect()
}

#[update(guard = "not_anon")] // TODO: Must guard for DAO only, or make private.
pub async fn steal_tower(minting_numbers: Vec<Nat>, target_principal: Principal) -> Result<String, String> {
    check_update_batch_size(&minting_numbers)?;

    let original_count = minting_numbers.len();
    let target_principal = target_principal;

    let exists_results = nfts_exist(NftCollection::Tower, minting_numbers.clone()).await?;
    let attackable_results = can_attack(NftCollection::Tower, minting_numbers.clone()).await?;

    let valid_nfts: Vec<(Nat, bool)> = minting_numbers.into_iter()
        .zip(exists_results.into_iter())
        .zip(attackable_results.into_iter())
        .filter_map(|((nft, exists), attackable)| {
            if exists && attackable {
                Some((nft, exists))
            } else {
                None
            }
        })
        .collect();

    if valid_nfts.is_empty() {
        return Ok("No valid NFTs to verify.".to_string());
    }

    let valid_minting_numbers: Vec<Nat> = valid_nfts.iter().map(|(nft, _)| nft.clone()).collect();

    let metadata = fetch_metadata(NftCollection::Tower, valid_minting_numbers.clone()).await?;

    let nft_requests = prepare_nft_requests(valid_minting_numbers, metadata, target_principal).await;

    if nft_requests.is_empty() {
        return Ok("No valid NFTs to verify after metadata check.".to_string());
    }

    let nft_requests_count = nft_requests.len();

    let call_result: CallResult<()> = ic_cdk::call(
        tower_nft_principal(),
        "icrcX_mint",
        (nft_requests,)
    ).await;

    match call_result {
        Ok(_) => {
            let attackable_count = nft_requests_count;
            let skipped_count = original_count - attackable_count;
            Ok(format!("{} NFTs successfully attackable. {} NFTs skipped (already attackable or non-existent).", attackable_count, skipped_count))
        },
        Err((code, msg)) => Err(format!("Error calling icrcX_mint: {:?} - {}", code, msg))
    }
}

#[update(guard = "not_anon")]
pub async fn destroy_tower(token_id: Nat) -> Result<BurnOk, String> {
    if !can_attack(NftCollection::Tower, vec![token_id.clone()]).await?.first().unwrap_or(&false) {
        println!("NFT verification failed for token_id: {:?}", token_id);
        return Err("NFT is not attackable".to_string());
    }

    if owner_of(NftCollection::Tower, vec![token_id.clone()]).await?.first().and_then(|o| o.as_ref()).map(|a| a.owner) != Some(caller()) {
        return Err("NFT is not owned by the caller".to_string());
    }

    let target_principal = Principal::from_text("forhl-tiaaa-aaaak-qc7ga-cai").unwrap();

    let mint_request = SetNFTItemRequest {
        token_id: token_id.clone(),
        owner: Some(Account::from(target_principal)),
        metadata: NFTInput::Class(vec![
            PropertyShared {
                name: "icrc7:metadata:uri:transactionId".to_string(),
                value: CandyShared::Text("Burned forever".to_string()),
                immutable: true,
            },
            PropertyShared {
                name: "icrc7:metadata:attackable".to_string(),
                value: CandyShared::Bool(true),
                immutable: true,
            },
        ]),
        override_: true,
        created_at_time: Some(ic_cdk::api::time()),
    };

    let mint_call_result: CallResult<()> = ic_cdk::call(
        tower_nft_principal(),
        "icrcX_mint",
        (vec![mint_request],)
    ).await;

    println!("Received mint call result: {:?}", mint_call_result);

    match mint_call_result {
        Ok(_) => {
            println!("Minted NFT to burn forever with token_id: {:?}", token_id);
            match burn_nft(NftCollection::Tower, token_id.clone()).await {
                Ok(result) => Ok(result),
                Err(err) => {
                    println!("Error burning NFT: {}. Attempting to return NFT to caller.", err);
                    let return_request = SetNFTItemRequest {
                        token_id: token_id.clone(),
                        owner: Some(Account::from(caller())),
                        metadata: NFTInput::Class(vec![
                            PropertyShared {
                                name: "icrc7:metadata:uri:transactionId".to_string(),
                                value: CandyShared::Text("Returned to caller".to_string()),
                                immutable: true,
                            },
                            PropertyShared {
                                name: "icrc7:metadata:attackable".to_string(),
                                value: CandyShared::Bool(true),
                                immutable: true,
                            },
                        ]),
                        override_: true,
                        created_at_time: Some(ic_cdk::api::time()),
                    };

                    let return_call_result: CallResult<()> = ic_cdk::call(
                        tower_nft_principal(),
                        "icrcX_mint",
                        (vec![return_request],)
                    ).await;

                    match return_call_result {
                        Ok(_) => Err("Failed to burn NFT, but returned it to caller.".to_string()),
                        Err((code, msg)) => Err(format!("Failed to burn NFT and return it to caller: {:?} - {}", code, msg)),
                    }
                }
            }
        },
        Err((code, msg)) => {
            println!("Error calling icrcX_mint: {:?} - {}", code, msg);
            Err(format!("Error calling icrcX_mint: {:?} - {}", code, msg))
        },
    }
}

async fn burn_nft(collection: NftCollection, token_id: Nat) -> Result<BurnOk, String> {
    println!("Attempting to burn NFT with token_id: {:?}", token_id);

    if !can_attack(collection, vec![token_id.clone()]).await?.first().unwrap_or(&false) {
        println!("NFT verification failed for token_id: {:?}", token_id);
        return Err("NFT is not attackable".to_string());
    }

    let burn_request = BurnRequest {
        memo: None,
        tokens: vec![token_id.clone()],
        created_at_time: None,
    };

    println!("Sending burn request: {:?}", burn_request);

    let call_result: CallResult<(BurnResponse,)> = ic_cdk::call(
        tower_nft_principal(),
        "icrcX_burn",
        (burn_request,)
    ).await;

    println!("Received call result: {:?}", call_result);

    match call_result {
        Ok((burn_response,)) => {
            println!("Burn response: {:?}", burn_response);
            match burn_response {
                BurnResponse::Ok(burn_results) => burn_results.into_iter().next()
                    .ok_or_else(|| {
                        println!("No burn result returned");
                        "No burn result returned".to_string()
                    }),
                BurnResponse::Err(err) => {
                    println!("Burn error: {:?}", err);
                    Err(format!("Burn error: {:?}", err))
                },
            }
        },
        Err((code, msg)) => {
            println!("Error calling icrcX_burn: {:?} - {}", code, msg);
            Err(format!("Error calling icrcX_burn: {:?} - {}", code, msg))
        },
    }
}