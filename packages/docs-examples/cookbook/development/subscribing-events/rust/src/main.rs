// #region subscribe
use anyhow::Result;
use solana_client::{
    nonblocking::pubsub_client::PubsubClient, nonblocking::rpc_client::RpcClient,
    rpc_config::RpcAccountInfoConfig,
};
use solana_commitment_config::CommitmentConfig;
use solana_sdk::{native_token::LAMPORTS_PER_SOL, signature::Signer, signer::keypair::Keypair};
use tokio_stream::StreamExt;

#[tokio::main]
async fn main() -> Result<()> {
    let wallet = Keypair::new();
    let pubkey = wallet.pubkey();

    let connection = RpcClient::new_with_commitment(
        "http://localhost:8899".to_string(),
        CommitmentConfig::confirmed(),
    );
    let ws_client = PubsubClient::new("ws://localhost:8900").await?;

    let subscriber = tokio::spawn(async move {
        let config = RpcAccountInfoConfig {
            commitment: Some(CommitmentConfig::confirmed()),
            encoding: None,
            data_slice: None,
            min_context_slot: None,
        };

        let (mut stream, _) = ws_client
            .account_subscribe(&pubkey, Some(config))
            .await
            .expect("Failed to subscribe to account updates");

        // Print the first notification, then finish
        if let Some(account) = stream.next().await {
            println!("{:#?}", account);
        }
    });

    // Give the subscription time to register before the airdrop
    tokio::time::sleep(std::time::Duration::from_secs(1)).await;

    let airdrop_signature = connection
        .request_airdrop(&wallet.pubkey(), LAMPORTS_PER_SOL)
        .await?;
    loop {
        let confirmed = connection.confirm_transaction(&airdrop_signature).await?;
        if confirmed {
            break;
        }
    }

    // Wait for the subscriber to receive the notification
    subscriber.await?;
    Ok(())
}
// #endregion subscribe
