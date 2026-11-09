// #region from-base58
use anyhow::Result;
use solana_sdk::{signature::Keypair, signer::Signer};

fn main() -> Result<()> {
    let keypair_base58 =
        "5MaiiCavjCmn9Hs1o3eznqDEhRwxo7pXiAYez7keQUviUkauRiTMD8DrESdrNjN8zd9mTmVhRvBJeg5vhyvgrAhG";

    let keypair = Keypair::from_base58_string(keypair_base58);
    println!("{:?}", keypair.pubkey());

    Ok(())
}
// #endregion from-base58
