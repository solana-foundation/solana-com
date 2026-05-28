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

    tokio::spawn(async move {
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

        while let Some(account) = stream.next().await {
            println!("{:#?}", account);
        }
    });

    let airdrop_signature = connection
        .request_airdrop(&wallet.pubkey(), LAMPORTS_PER_SOL)
        .await?;
    loop {
        let confirmed = connection.confirm_transaction(&airdrop_signature).await?;
        if confirmed {
            break;
        }
    }
    Ok(())
}
// #endregion subscribe
