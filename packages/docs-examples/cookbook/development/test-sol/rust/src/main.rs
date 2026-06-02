// #region airdrop
use anyhow::Result;
use solana_client::nonblocking::rpc_client::RpcClient;
use solana_commitment_config::CommitmentConfig;
use solana_sdk::{native_token::LAMPORTS_PER_SOL, signature::Signer, signer::keypair::Keypair};

#[tokio::main]
async fn main() -> Result<()> {
    let connection = RpcClient::new_with_commitment(
        "http://localhost:8899".to_string(),
        CommitmentConfig::confirmed(),
    );

    let wallet = Keypair::new();

    let airdrop_signature = connection
        .request_airdrop(&wallet.pubkey(), LAMPORTS_PER_SOL)
        .await?;
    loop {
        let confirmed = connection.confirm_transaction(&airdrop_signature).await?;
        if confirmed {
            break;
        }
    }

    let balance = connection.get_balance(&wallet.pubkey()).await?;
    println!("Balance: {} SOL", balance as f64 / LAMPORTS_PER_SOL as f64);

    Ok(())
}
// #endregion airdrop
