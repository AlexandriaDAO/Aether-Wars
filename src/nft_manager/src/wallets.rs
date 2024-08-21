use candid::{CandidType, Deserialize, Nat, Principal};
use icrc_ledger_types::icrc1::account::{Account, Subaccount};
use icrc_ledger_types::icrc1::transfer::{BlockIndex, NumTokens, TransferArg, TransferError};
use serde::Serialize;

#[derive(CandidType, Deserialize, Serialize)]
pub struct TransferArgs {
    amount: NumTokens,
    mint_number: u64,
    to_account: Account,
}

// Transfer's the ICRC token to the NFT owner.
#[ic_cdk::update]
async fn transfer(args: TransferArgs) -> Result<BlockIndex, String> {
    ic_cdk::println!(
        "Transferring {} tokens from nft {:?} to account {}",
        &args.amount,
        &args.mint_number,
        &args.to_account,
    );

    let transfer_args: TransferArg = TransferArg {
        // can be used to distinguish between transactions
        memo: None,
        // the amount we want to transfer
        amount: args.amount,
        // we want to transfer tokens from the default subaccount of the canister
        // from_subaccount: Some(args.from_subaccount),
        from_subaccount: Some(u64_to_subaccount(args.mint_number)),
        // if not specified, the default fee for the canister is used
        fee: None,
        // the account we want to transfer tokens to
        to: args.to_account,
        // a timestamp indicating when the transaction was created by the caller; if it is not specified by the caller then this is set to the current ICP time
        created_at_time: None,
    };

    // 1. Asynchronously call another canister function using `ic_cdk::call`.
    ic_cdk::call::<(TransferArg,), (Result<BlockIndex, TransferError>,)>(
        // 2. Convert a textual representation of a Principal into an actual `Principal` object. The principal is the one we specified in `dfx.json`.
        //    `expect` will panic if the conversion fails, ensuring the code does not proceed with an invalid principal.
        Principal::from_text("hdtfn-naaaa-aaaam-aciva-cai")
            .expect("Could not decode the principal."),
        // 3. Specify the method name on the target canister to be called, in this case, "icrc1_transfer".
        "icrc1_transfer",
        // 4. Provide the arguments for the call in a tuple, here `transfer_args` is encapsulated as a single-element tuple.
        (transfer_args,),
    )
    .await // 5. Await the completion of the asynchronous call, pausing the execution until the future is resolved.
    // 6. Apply `map_err` to transform any network or system errors encountered during the call into a more readable string format.
    //    The `?` operator is then used to propagate errors: if the result is an `Err`, it returns from the function with that error,
    //    otherwise, it unwraps the `Ok` value, allowing the chain to continue.
    .map_err(|e| format!("failed to call ledger: {:?}", e))?
    // 7. Access the first element of the tuple, which is the `Result<BlockIndex, TransferError>`, for further processing.
    .0
    // 8. Use `map_err` again to transform any specific ledger transfer errors into a readable string format, facilitating error handling and debugging.
    .map_err(|e| format!("ledger transfer error {:?}", e))
}


pub fn u64_to_subaccount(id: u64) -> Subaccount {
    let mut subaccount = [0; 32];
    let bytes = id.to_be_bytes();
    subaccount[28..].copy_from_slice(&bytes[4..]);
    
    // Log the generated subaccount
    ic_cdk::println!("Generated subaccount: {:?}", subaccount);
    
    subaccount
}