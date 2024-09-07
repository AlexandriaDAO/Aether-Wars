// This is the one file that has user authorized calls, because it's more secure. 
// If there's a ddoss problem we can just upgrade these to block the unmatched caller, since they're not using the frontend.
// Can't do batch versions here because icrc4 is not finalized, and so batch transfers not ready.

use crate::{lbry_principal, aether_principal, get_nft_principal};
use crate::utils::to_nft_subaccount;
use crate::query::{get_nft_balances, can_attack};
use crate::guard::not_anon;
use crate::types::NftCollection;
use ic_cdk::update;
use candid::Nat;
use icrc_ledger_types::icrc1::account::Account;
use icrc_ledger_types::icrc1::transfer::{BlockIndex, NumTokens, TransferArg, TransferError};

/*
I have to create a display first so take: 
-- nfts_of() and then get_nft_balances()
    This should return get_nft_bal


*/

#[update(guard = "not_anon")]
pub async fn withdraw(collection: NftCollection, mint_number: Nat) -> Result<(Option<BlockIndex>, Option<BlockIndex>), String> {
    let caller = ic_cdk::api::caller();

    if !can_attack(collection, vec![mint_number.clone()]).await?.get(0).unwrap_or(&false) {
        return Err("NFT is not verified".to_string());
    }

    let ownership_result = ic_cdk::call::<(Vec<Nat>,), (Vec<Option<Account>>,)>(
        get_nft_principal(collection),
        "icrc7_owner_of",
        (vec![mint_number.clone()],),
    )
    .await
    .map_err(|e| format!("Failed to call icrc7_owner_of: {:?}", e))?;

    let owner = ownership_result.0.get(0)
    .ok_or("No ownership information returned")?
    .as_ref()
    .ok_or("NFT not found")?;

    if owner.owner != caller {
        return Err("Caller is not the owner of the NFT".to_string());
    }

    let balances = get_nft_balances(vec![mint_number.clone()]).await?;
    let balance = balances.get(0).ok_or("Failed to get balance for NFT")?;

    // NFT wallet subaccount
    let subaccount = Some(to_nft_subaccount(mint_number.clone()));
    let to_account = Account {
        owner: caller,
        subaccount: None,
    };

    let mut lbry_result = None;
    let mut aether_result = None;

    // Check and transfer LBRY if sufficient
    if balance.lbry >= NumTokens::from(10_000_000u64) {
        let lbry_transfer_args = TransferArg {
            memo: None,
            amount: balance.lbry.clone(),
            from_subaccount: subaccount,
            fee: None,
            to: to_account.clone(),
            created_at_time: None,
        };

        // Withdraw LBRY
        match ic_cdk::call::<(TransferArg,), (Result<BlockIndex, TransferError>,)>(
            lbry_principal(),
            "icrc1_transfer",
            (lbry_transfer_args,),
        )
        .await
        {
            Ok((Ok(block_index),)) => {
                lbry_result = Some(block_index);
                ic_cdk::println!("Transferred {} LBRY from NFT# {} to {}", balance.lbry, mint_number, caller);
            }
            Ok((Err(e),)) => ic_cdk::println!("LBRY ledger transfer error: {:?}", e),
            Err(e) => ic_cdk::println!("Failed to call LBRY ledger: {:?}", e),
        }
    } else {
        ic_cdk::println!("LBRY balance ({}) is not enough to justify the transaction fee.", balance.lbry);
    }

    // Check and transfer AETHER if sufficient
    if balance.aether >= NumTokens::from(100_000u64) {
        let aether_transfer_args = TransferArg {
            memo: None,
            amount: balance.aether.clone(),
            from_subaccount: subaccount,
            fee: None,
            to: to_account,
            created_at_time: None,
        };

        // Withdraw AETHER
        match ic_cdk::call::<(TransferArg,), (Result<BlockIndex, TransferError>,)>(
            aether_principal(),
            "icrc1_transfer",
            (aether_transfer_args,),
        )
        .await
        {
            Ok((Ok(block_index),)) => {
                aether_result = Some(block_index);
                ic_cdk::println!("Transferred {} AETHER from NFT# {} to {}", balance.aether, mint_number, caller);
            }
            Ok((Err(e),)) => ic_cdk::println!("AETHER ledger transfer error: {:?}", e),
            Err(e) => ic_cdk::println!("Failed to call AETHER ledger: {:?}", e),
        }
    } else {
        ic_cdk::println!("AETHER balance ({}) is not enough to justify the transaction fee.", balance.aether);
    }

    if lbry_result.is_none() && aether_result.is_none() {
        Err("No transfers were executed due to insufficient balances".to_string())
    } else {
        Ok((lbry_result, aether_result))
    }
}


