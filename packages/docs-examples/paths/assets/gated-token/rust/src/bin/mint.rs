// #region mint
// cargo run --release --bin mint -- <recipient> <amount>
use anyhow::Result;
use gated_token::{
    acl, arg, arg_pubkey, env, load_keypair, mint_decimals, rpc, send, to_base_units, TOKEN_2022,
};
use solana_sdk::signature::Signer;
use spl_token_2022_interface::instruction::mint_to;

#[tokio::main]
async fn main() -> Result<()> {
    let rpc = rpc();
    // The fee payer holds the mint authority on this mint.
    let payer = load_keypair("tokenization-demo")?;
    let mint = env("MINT")?;
    let list = env("LIST")?;
    let recipient = arg_pubkey(1, "the recipient wallet")?;
    let decimals = mint_decimals(&rpc, &mint).await?;

    // Create the account, thaw it through the gate, then mint: one transaction.
    let (token_account, mut instructions) =
        acl::open_through_gate(&rpc, &payer.pubkey(), &mint, &recipient, &list).await?;
    instructions.push(mint_to(
        &TOKEN_2022,
        &mint,
        &token_account,
        &payer.pubkey(),
        &[],
        to_base_units(&arg(2, "the amount")?, decimals)?,
    )?);
    send(&rpc, &[&payer], &instructions).await
}
// #endregion mint
