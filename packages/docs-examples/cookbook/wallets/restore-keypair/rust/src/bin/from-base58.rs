// #region from-base58
use anyhow::Result;
use solana_sdk::{signature::Keypair, signer::Signer};

fn main() -> Result<()> {
    let keypair_base58 =
        "4UzFMkVbk1q6ApxvDS8inUxg4cMBxCQRVXRx5msqQyktbi1QkJkt574Jda6BjZThSJi54CHfVoLFdVFX8XFn233L";

    let keypair = Keypair::from_base58_string(keypair_base58);
    println!("{:?}", keypair.pubkey());

    Ok(())
}
// #endregion from-base58
