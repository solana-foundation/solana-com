// #region read-account
// cargo run --release --bin read-account -- <token account> [commitment]
use anyhow::{anyhow, Result};
use gated_token::{arg, arg_pubkey, rpc_with};
use solana_commitment_config::CommitmentConfig;
use spl_token_2022_interface::{
    extension::StateWithExtensions,
    state::{Account, AccountState},
};

#[tokio::main]
async fn main() -> Result<()> {
    let token_account = arg_pubkey(1, "the token account")?;
    // Read at a stated commitment level. Use "finalized" for anything that
    // feeds a book of record; "confirmed" is enough for a display.
    let commitment = match arg(2, "the commitment").as_deref() {
        Ok("finalized") => CommitmentConfig::finalized(),
        _ => CommitmentConfig::confirmed(),
    };
    let rpc = rpc_with(commitment);
    let account = rpc
        .get_account_with_commitment(&token_account, commitment)
        .await?
        .value
        .ok_or_else(|| anyhow!("{token_account} not found at {commitment:?}"))?;
    let state = StateWithExtensions::<Account>::unpack(&account.data)?.base;

    println!("Mint: {}", state.mint);
    println!("Owner: {}", state.owner);
    println!("Balance (base units): {}", state.amount);
    let label = if state.state == AccountState::Frozen {
        "Frozen"
    } else {
        "Initialized"
    };
    println!("State: {label}");
    Ok(())
}
// #endregion read-account
