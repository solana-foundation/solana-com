// #region load
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

fn load_default_keypair() -> anyhow::Result<Keypair> {
    let home_path = env::var_os("HOME").unwrap();
    let default_keypair_path = ".config/solana/id.json"; // ! update if you want to use a different path
    let default_keypair_path = path::PathBuf::from(home_path).join(default_keypair_path);

    let default_keypair =
        keypair::read_keypair_file(default_keypair_path).expect("error reading keypair from path");

    println!("loaded keypair address -> {:?}", default_keypair.pubkey());

    Ok(default_keypair)
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
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
// #endregion load
