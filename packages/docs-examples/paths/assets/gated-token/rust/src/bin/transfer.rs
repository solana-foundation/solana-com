// #region transfer
// cargo run --release --bin transfer -- <recipient> <amount>
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
    // The holder signs and pays for its own transfer.
    let holder = load_keypair("demo-holder")?;
    let mint = env("MINT")?;
    let list = env("LIST")?;
    let recipient = arg_pubkey(1, "the recipient wallet")?;
    let decimals = mint_decimals(&rpc, &mint).await?;

    // The thaw is where an unlisted recipient fails: the gate rejects the
    // owner and the whole transaction is dropped before any token moves.
    let (destination, mut instructions) =
        acl::open_through_gate(&rpc, &holder.pubkey(), &mint, &recipient, &list).await?;
    instructions.push(transfer_checked(
        &TOKEN_2022,
        &ata(&mint, &holder.pubkey()),
        &mint,
        &destination,
        &holder.pubkey(),
        &[],
        to_base_units(&arg(2, "the amount")?, decimals)?,
        decimals,
    )?);
    send(&rpc, &[&holder], &instructions).await
}
// #endregion transfer
