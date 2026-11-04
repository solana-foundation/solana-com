// #region pause
// cargo run --release --bin pause
use anyhow::Result;
use gated_token::{env, load_keypair, rpc, send, TOKEN_2022};
use solana_sdk::signature::Signer;
use spl_token_2022_interface::{
    extension::{
        pausable::{instruction::pause, PausableConfig},
        BaseStateWithExtensions, StateWithExtensions,
    },
    state::Mint,
};

#[tokio::main]
async fn main() -> Result<()> {
    let rpc = rpc();
    let payer = load_keypair("tokenization-demo")?;
    // The pause authority is its own key, from step 1 of create the mint.
    let pause_authority = load_keypair("demo-authorities/pause")?;
    let mint = env("MINT")?;

    // Halts mint, burn, and transfer activity for every holder of the token.
    let instruction = pause(&TOKEN_2022, &mint, &pause_authority.pubkey(), &[])?;
    send(&rpc, &[&payer, &pause_authority], &[instruction]).await?;

    // The pause flag lives in the mint's PausableConfig extension.
    let data = rpc.get_account_data(&mint).await?;
    let state = StateWithExtensions::<Mint>::unpack(&data)?;
    let paused: bool = state.get_extension::<PausableConfig>()?.paused.into();
    println!("Paused: {paused}");
    Ok(())
}
// #endregion pause
