use solana_client::nonblocking::rpc_client::RpcClient;
use solana_commitment_config::CommitmentConfig;
use solana_sdk::{
    native_token::LAMPORTS_PER_SOL,
    signer::{
        keypair::{self, Keypair},
        Signer,
    },
};
use std::{env, path};

// #region load
fn load_default_keypair() -> anyhow::Result<Keypair> {
    let home_path = env::var_os("HOME").unwrap();
    let default_keypair_path = ".config/solana/id.json"; // ! update if you want to use a different path
    let default_keypair_path = path::PathBuf::from(home_path).join(default_keypair_path);

    let default_keypair =
        keypair::read_keypair_file(default_keypair_path).expect("error reading keypair from path");

    println!("loaded keypair address -> {:?}", default_keypair.pubkey());

    Ok(default_keypair)
}
// #endregion load

// Seeds `~/.config/solana/id.json` if it doesn't already exist so this example
// runs end-to-end without a prior `solana-keygen new`. Outside the docs region
// because real users will have generated this file themselves.
fn ensure_keypair_file_exists() -> anyhow::Result<()> {
    let home_path = env::var_os("HOME").unwrap();
    let default_keypair_path = path::PathBuf::from(home_path).join(".config/solana/id.json");
    if default_keypair_path.exists() {
        return Ok(());
    }
    if let Some(parent) = default_keypair_path.parent() {
        std::fs::create_dir_all(parent)?;
    }
    keypair::write_keypair_file(&Keypair::new(), &default_keypair_path)
        .map_err(|e| anyhow::anyhow!("failed to write keypair file: {e}"))?;
    Ok(())
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    ensure_keypair_file_exists()?;

    let client = RpcClient::new_with_commitment(
        String::from("http://localhost:8899"),
        CommitmentConfig::confirmed(),
    );

    let wallet = load_default_keypair()?;

    let transaction_signature = client
        .request_airdrop(&wallet.pubkey(), 5 * LAMPORTS_PER_SOL)
        .await?;
    loop {
        if client.confirm_transaction(&transaction_signature).await? {
            break;
        }
    }

    let balance = client.get_balance(&wallet.pubkey()).await?;
    println!("Account Balance: {}", balance / LAMPORTS_PER_SOL);

    Ok(())
}
