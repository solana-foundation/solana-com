// #region read-account
use anyhow::{anyhow, Context, Result};
use solana_client::nonblocking::rpc_client::RpcClient;
use solana_commitment_config::CommitmentConfig;
use solana_sdk::pubkey::Pubkey;
use spl_token_2022_interface::{
    extension::StateWithExtensions,
    state::{Account, AccountState},
};

fn arg(index: usize, name: &str) -> Result<String> {
    std::env::args()
        .nth(index)
        .ok_or_else(|| anyhow!("usage: pass {name} as argument {index}"))
}

fn pubkey(value: &str) -> Result<Pubkey> {
    value
        .parse()
        .with_context(|| format!("invalid address {value}"))
}

#[tokio::main]
async fn main() -> Result<()> {
    let token_account = pubkey(&arg(1, "the token account address")?)?;

    // Read at a stated commitment level. Use "finalized" for anything that
    // feeds a book of record; "confirmed" is enough for a display.
    let commitment = match arg(2, "commitment").as_deref() {
        Ok("finalized") => CommitmentConfig::finalized(),
        _ => CommitmentConfig::confirmed(),
    };
    let rpc =
        RpcClient::new_with_commitment("https://api.devnet.solana.com".to_string(), commitment);
    let account = rpc
        .get_account_with_commitment(&token_account, commitment)
        .await?
        .value
        .ok_or_else(|| anyhow!("account {token_account} not found at {commitment:?}"))?;
    let state = StateWithExtensions::<Account>::unpack(&account.data)?;

    println!("Mint: {}", state.base.mint);
    println!("Owner: {}", state.base.owner);
    println!("Balance (raw): {}", state.base.amount);
    println!(
        "State: {}",
        if state.base.state == AccountState::Frozen {
            "Frozen"
        } else {
            "Initialized"
        }
    );
    Ok(())
}
// #endregion
