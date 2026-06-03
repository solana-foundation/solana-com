// #region balance
use solana_client::nonblocking::rpc_client::RpcClient;
use solana_commitment_config::CommitmentConfig;
use solana_sdk::pubkey;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let client = RpcClient::new_with_commitment(
        String::from("http://localhost:8899"),
        CommitmentConfig::confirmed(),
    );

    let token_account_address = pubkey!("GfVPzUxMDvhFJ1Xs6C9i47XQRSapTd8LHw5grGuTquyQ");
    let balance = client
        .get_token_account_balance(&token_account_address)
        .await?;
    println!("{:#?}", balance);

    Ok(())
}
// #endregion balance
