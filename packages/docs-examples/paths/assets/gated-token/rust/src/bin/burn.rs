// #region burn
// cargo run --release --bin burn -- <amount>
use anyhow::Result;
use gated_token::{
    arg, ata, env, load_keypair, mint_decimals, rpc, send, to_base_units, TOKEN_2022,
};
use solana_sdk::signature::Signer;
use spl_token_2022_interface::extension::permissioned_burn::instruction::burn_checked;

#[tokio::main]
async fn main() -> Result<()> {
    let rpc = rpc();
    let holder = load_keypair("demo-holder")?;
    let burn_authority = load_keypair("demo-authorities/burn")?;
    let mint = env("MINT")?;
    let decimals = mint_decimals(&rpc, &mint).await?;

    // Token-2022 rejects a plain burn on this mint. The permissioned burn
    // instruction carries both signers: the holder and the burn authority.
    let instruction = burn_checked(
        &TOKEN_2022,
        &ata(&mint, &holder.pubkey()),
        &mint,
        &burn_authority.pubkey(),
        &holder.pubkey(),
        &[],
        to_base_units(&arg(1, "the amount")?, decimals)?,
        decimals,
    )?;
    send(&rpc, &[&holder, &burn_authority], &[instruction]).await
}
// #endregion burn
