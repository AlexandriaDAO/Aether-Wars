use crate::{ALLOWED_CALLERS, CURRENT_THRESHOLD, LBRY_THRESHOLDS, TOTAL_LBRY_BURNED, TOTAL_AETHER_MINTED, AETHER_PER_THRESHOLD};
use candid::Principal;
use ic_cdk::{caller, query};

#[query]
pub fn get_total_LBRY_burn() -> u64 {
    TOTAL_LBRY_BURNED.with(|total_burned| {
        let total_burned: std::sync::MutexGuard<u64> = total_burned.lock().unwrap();
        *total_burned
    })
}

#[query]
pub fn get_total_AETHER_minted() -> u64 {
    TOTAL_AETHER_MINTED.with(|mint| {
        let mint: std::sync::MutexGuard<u64> = mint.lock().unwrap();
        *mint
    })
}

#[query]
pub fn get_current_AETHER_rate() -> u64 {
    let current_threshold = CURRENT_THRESHOLD.with(|current_threshold| {
        let current_threshold = current_threshold.lock().unwrap();
        *current_threshold
    });
    AETHER_PER_THRESHOLD[current_threshold as usize]
}
#[query]
pub fn get_current_LBRY_threshold() -> u64 {
    let current_threshold = CURRENT_THRESHOLD.with(|current_threshold| {
        let current_threshold = current_threshold.lock().unwrap();
        *current_threshold
    });
    LBRY_THRESHOLDS[current_threshold as usize]
}

#[query]
pub fn get_max_stats() -> (u64,u64) {
    let max_threshold=  LBRY_THRESHOLDS[LBRY_THRESHOLDS.len() -1];
    let total_burned = get_total_LBRY_burn();
    (max_threshold, total_burned)
}
#[query]
pub fn get_allowed_callers() -> Vec<Principal> {
    ALLOWED_CALLERS.with(|callers| callers.borrow().iter().cloned().collect())
}
#[query]
pub fn your_principal() -> Result<String,String> {
    Ok(caller().to_string())
}