// #region calc
use solana_client::nonblocking::rpc_client::RpcClient;
use solana_commitment_config::CommitmentConfig;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let client = RpcClient::new_with_commitment(
        String::from("http://localhost:8899"),
        CommitmentConfig::confirmed(),
    );

    let data_len = 1500;
    let rent_exemption_amount = client
        .get_minimum_balance_for_rent_exemption(data_len)
        .await?;

    println!("{rent_exemption_amount}");

    Ok(())
}
// #endregion calc
