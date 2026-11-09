// #region allowlist-add
// cargo run --release --bin allowlist-add -- <wallet>
use anyhow::Result;
use gated_token::{acl, arg_pubkey, env, load_keypair, rpc, send};
use solana_sdk::signature::Signer;

#[tokio::main]
async fn main() -> Result<()> {
    let rpc = rpc();
    // The list authority is the key that created the mint.
    let payer = load_keypair("tokenization-demo")?;
    let mint = env("MINT")?;
    let wallet = arg_pubkey(1, "the wallet to allowlist")?;

    // This adds the entry only. A wallet that already holds a frozen account
    // on this mint thaws it through the gate afterwards (see src/acl.rs).
    let list = acl::list_config(&payer.pubkey(), &mint);
    send(
        &rpc,
        &[&payer],
        &[acl::add_wallet(&payer.pubkey(), &list, &wallet)],
    )
    .await
}
// #endregion allowlist-add
