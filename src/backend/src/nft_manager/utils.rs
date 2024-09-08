use candid::{Nat, Principal};
use icrc_ledger_types::icrc1::account::Subaccount;
use ic_cdk::api::time;
use sha2::{Sha256, Digest};
use num_traits::cast::ToPrimitive;
use num_bigint::BigUint;

const MAX_QUERY_BATCH_SIZE: usize = 100;
const MAX_UPDATE_BATCH_SIZE: usize = 20;

pub fn check_query_batch_size<T>(batch: &Vec<T>) -> Result<(), String> {
    if batch.len() > MAX_QUERY_BATCH_SIZE {
        Err(format!("Batch size exceeds maximum allowed ({})", MAX_QUERY_BATCH_SIZE))
    } else {
        Ok(())
    }
}

pub fn check_update_batch_size<T>(batch: &Vec<T>) -> Result<(), String> {
    if batch.len() > MAX_UPDATE_BATCH_SIZE {
        Err(format!("Batch size exceeds maximum allowed ({})", MAX_UPDATE_BATCH_SIZE))
    } else {
        Ok(())
    }
}

pub fn is_within_32_digits(number: &Nat) -> bool {
  let max_32_digit = Nat::from(10u128.pow(32) - 1);
  number <= &max_32_digit
}

pub fn batch_is_within_32_digits(numbers: &[Nat]) -> bool {
  let max_32_digit = Nat::from(10u128.pow(32) - 1);
  numbers.iter().all(|number| number <= &max_32_digit)
}

pub fn is_within_10_digits(number: &Nat) -> bool {
  let max_10_digit = Nat::from(10u128.pow(10) - 1);
  number <= &max_10_digit
}

pub fn principal(id: &str) -> Principal {
  Principal::from_text(id).expect(&format!("Invalid principal: {}", id))
}

pub fn to_nft_subaccount(id: Nat) -> Subaccount {
  let mut subaccount = [0; 32];
  let digits: Vec<u8> = id
      .0
      .to_string()
      .chars()
      .map(|c| c.to_digit(10).unwrap() as u8)
      .collect();
  
  let start = 32 - digits.len().min(32);
  subaccount[start..].copy_from_slice(&digits[digits.len().saturating_sub(32)..]);

  subaccount
}

fn hash_principal(principal: Principal) -> Nat {
  // Get the full representation of the principal
  let principal_bytes = principal.as_slice();
  
  // Hash the entire principal
  let hash = Sha256::digest(principal_bytes);
  
  // Convert the first 8 bytes of the hash to a Nat
  let mut bytes = [0u8; 8];
  bytes.copy_from_slice(&hash[..8]);
  Nat::from(u64::from_be_bytes(bytes))
}

pub fn hash_principal_to_digits(principal: Principal, digit_count: Nat) -> Nat {
  let digit_count_u32 = digit_count.0.to_u32()
      .expect("digit_count must fit within u32");
  
  if digit_count_u32 == 0 || digit_count_u32 > 32 {
      panic!("digit_count must be between 1 and 20");
  }
  
  let max_value = {
      let mut result = BigUint::from(1u32);
      for _ in 0..digit_count_u32 {
          result *= 10u32;
      }
      result
  };
  
  let hash_value = hash_principal(principal);
  Nat::from(hash_value.0 % max_value)
}