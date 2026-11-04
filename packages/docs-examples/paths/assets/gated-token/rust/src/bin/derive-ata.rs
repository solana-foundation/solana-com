// #region derive-ata
// cargo run --release --bin derive-ata -- <wallet>
use anyhow::Result;
use gated_token::{arg_pubkey, ata, env};

fn main() -> Result<()> {
    let owner = arg_pubkey(1, "the custody wallet")?;
    // Deterministic: the address exists before the account does, so
    // monitoring and reconciliation can be wired up ahead of the first transfer.
    println!("Wallet address: {owner}");
    println!("Associated token address: {}", ata(&env("MINT")?, &owner));
    Ok(())
}
// #endregion derive-ata
