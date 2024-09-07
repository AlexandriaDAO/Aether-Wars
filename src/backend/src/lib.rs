
use icrc_ledger_types::icrc1::transfer::BlockIndex;
use icrc_ledger_types::icrc1::account::Account;
use icrc_ledger_types::icrc::generic_value::Value;
use std::collections::BTreeMap;

use crate::source_cards::SourceCard;
use crate::engine::Engine;

use ic_cdk;
use candid::{Nat, Principal};

pub const PROFILE_NFT_CANISTER_ID: &str = "fjqb7-6qaaa-aaaak-qc7gq-cai";
pub const TOWER_NFT_CANISTER_ID: &str = "rby3s-dqaaa-aaaak-qizqa-cai";
pub const LBRY_CANISTER_ID: &str = "hdtfn-naaaa-aaaam-aciva-cai";
pub const AETHER_CANISTER_ID: &str = "7hcrm-4iaaa-aaaak-akuka-cai";
pub const FRONTEND_CANISTER_ID: &str = "xo3nl-yaaaa-aaaap-abl4q-cai";

pub fn get_principal(id: &str) -> Principal {
    Principal::from_text(id).expect(&format!("Invalid principal: {}", id))
}

pub fn profile_nft_principal() -> Principal {
    get_principal(PROFILE_NFT_CANISTER_ID)
}

pub fn tower_nft_principal() -> Principal {
    get_principal(TOWER_NFT_CANISTER_ID)
}

pub fn lbry_principal() -> Principal {
    get_principal(LBRY_CANISTER_ID)
}

pub fn aether_principal() -> Principal {
    get_principal(AETHER_CANISTER_ID)
}

pub fn frontend_principal() -> Principal {
    get_principal(FRONTEND_CANISTER_ID)
}


fn get_nft_principal(collection: NftCollection) -> Principal {
    match collection {
        NftCollection::Profile => profile_nft_principal(),
        NftCollection::Tower => tower_nft_principal(),
    }
  }

mod nft_manager;
pub use nft_manager::*;

// mod realms;
// pub use realms::*;

mod source_cards;
pub use source_cards::{save_sc, bookmark_sc, delete_sc, get_sc, get_bookmarks};


mod engine;
pub use engine::{
  add_engine,
  add_my_engine,
  update_engine_status,
  delete_engine,
  get_engines,
  get_engines_by_owner,
  get_engine_by_id,
  get_my_engines,
  get_engines_not_owned_by,
  get_engines_not_owned_by_me
};

mod wallet_keys;
pub use wallet_keys::*;

ic_cdk::export_candid!();