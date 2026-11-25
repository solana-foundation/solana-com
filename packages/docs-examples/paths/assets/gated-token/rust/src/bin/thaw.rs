// #region thaw
// cargo run --release --bin thaw -- <wallet>
use anyhow::Result;
use gated_token::{acl, arg_pubkey, ata, env, load_keypair, rpc, send};
use solana_sdk::signature::Signer;

#[tokio::main]
async fn main() -> Result<()> {
    let rpc = rpc();
    // The Token ACL config authority is the key that created the mint.
    let payer = load_keypair("tokenization-demo")?;
    let mint = env("MINT")?;
    let token_account = ata(&mint, &arg_pubkey(1, "the wallet to thaw")?);

    // The authority thaw. Unlike the permissionless thaw, it does not ask the
    // gate.
    send(
        &rpc,
        &[&payer],
        &[acl::thaw(&payer.pubkey(), &mint, &token_account)],
    )
    .await
}
// #endregion thaw
