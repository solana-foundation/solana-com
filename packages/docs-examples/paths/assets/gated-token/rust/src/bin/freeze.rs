// #region freeze
// cargo run --release --bin freeze -- <wallet>
use anyhow::Result;
use gated_token::{acl, arg_pubkey, ata, env, load_keypair, rpc, send};
use solana_sdk::signature::Signer;

#[tokio::main]
async fn main() -> Result<()> {
    let rpc = rpc();
    // The Token ACL config authority is the key that created the mint.
    let payer = load_keypair("tokenization-demo")?;
    let mint = env("MINT")?;
    let token_account = ata(&mint, &arg_pubkey(1, "the wallet to freeze")?);

    // Token ACL holds the mint's freeze authority; its config authority signs.
    send(
        &rpc,
        &[&payer],
        &[acl::freeze(&payer.pubkey(), &mint, &token_account)],
    )
    .await
}
// #endregion freeze
