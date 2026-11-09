// #region force-transfer
// cargo run --release --bin force-transfer -- <from wallet> <to wallet> <amount>
use anyhow::Result;
use gated_token::{
    acl, arg, arg_pubkey, ata, env, load_keypair, mint_decimals, rpc, send, to_base_units,
    TOKEN_2022,
};
use solana_sdk::signature::Signer;
use spl_token_2022_interface::instruction::transfer_checked;

#[tokio::main]
async fn main() -> Result<()> {
    let rpc = rpc();
    let payer = load_keypair("tokenization-demo")?;
    let permanent_delegate = load_keypair("demo-authorities/delegate")?;
    let mint = env("MINT")?;
    let list = env("LIST")?;
    let from = arg_pubkey(1, "the source wallet")?;
    let to = arg_pubkey(2, "the destination wallet")?;
    let decimals = mint_decimals(&rpc, &mint).await?;

    // The destination still has to be able to hold the token, so it is opened
    // through the gate like any other recipient.
    let (destination, mut instructions) =
        acl::open_through_gate(&rpc, &payer.pubkey(), &mint, &to, &list).await?;
    // An ordinary TransferChecked, signed by the permanent delegate in place
    // of the holder.
    instructions.push(transfer_checked(
        &TOKEN_2022,
        &ata(&mint, &from),
        &mint,
        &destination,
        &permanent_delegate.pubkey(),
        &[],
        to_base_units(&arg(3, "the amount")?, decimals)?,
        decimals,
    )?);
    send(&rpc, &[&payer, &permanent_delegate], &instructions).await
}
// #endregion force-transfer
