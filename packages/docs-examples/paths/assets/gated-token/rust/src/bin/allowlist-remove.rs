// #region allowlist-remove
// cargo run --release --bin allowlist-remove -- <wallet>
use anyhow::Result;
use gated_token::{acl, arg_pubkey, ata, env, load_keypair, rpc, send, token_account_state};
use solana_sdk::signature::Signer;
use spl_token_2022_interface::state::AccountState;

#[tokio::main]
async fn main() -> Result<()> {
    let rpc = rpc();
    let payer = load_keypair("tokenization-demo")?;
    let mint = env("MINT")?;
    let wallet = arg_pubkey(1, "the wallet to remove")?;
    let list = acl::list_config(&payer.pubkey(), &mint);
    let mut instructions = vec![acl::remove_wallet(&payer.pubkey(), &list, &wallet)];

    // Removing the entry stops future thaws but does not touch an account
    // that is already open, so freeze the wallet's token account in the same
    // transaction.
    let token_account = ata(&mint, &wallet);
    if let Some(state) = token_account_state(&rpc, &token_account).await? {
        if state != AccountState::Frozen {
            instructions.push(acl::freeze(&payer.pubkey(), &mint, &token_account));
        }
    }
    send(&rpc, &[&payer], &instructions).await
}
// #endregion allowlist-remove
