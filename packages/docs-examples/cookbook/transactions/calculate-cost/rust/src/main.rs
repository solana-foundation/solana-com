// #region cost
use solana_client::nonblocking::rpc_client::RpcClient;
use solana_commitment_config::CommitmentConfig;
use solana_sdk::{
    native_token::LAMPORTS_PER_SOL, signature::Keypair, signer::Signer, transaction::Transaction,
};
use spl_memo_interface::{instruction::build_memo, v3::ID as MEMO_V3_PROGRAM_ID};

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let client = RpcClient::new_with_commitment(
        String::from("http://localhost:8899"),
        CommitmentConfig::confirmed(),
    );

    let signer_keypair = Keypair::new();

    // Airdrop SOL to the signer account so it exists for simulation
    let airdrop_signature = client
        .request_airdrop(&signer_keypair.pubkey(), LAMPORTS_PER_SOL)
        .await?;

    loop {
        if client.confirm_transaction(&airdrop_signature).await? {
            break;
        }
    }

    let memo = String::from("Memo message to be logged in this transaction");
    let memo_ix = build_memo(
        &MEMO_V3_PROGRAM_ID,
        memo.as_bytes(),
        &[&signer_keypair.pubkey()],
    );

    let latest_blockhash = client.get_latest_blockhash().await?;
    let mut transaction = Transaction::new_with_payer(&[memo_ix], Some(&signer_keypair.pubkey()));
    transaction.sign(&[&signer_keypair], latest_blockhash);

    // Simulate transaction to estimate compute units
    let sim_result = client.simulate_transaction(&transaction).await?;

    println!("Simulated transaction: \n{:#?}", sim_result);

    println!(
        "Estimated compute units: \n{:#?}",
        sim_result.value.units_consumed
    );

    let tx_cost = client.get_fee_for_message(transaction.message()).await?;
    println!("Estimated transaction cost: {} lamports", tx_cost);

    Ok(())
}
// #endregion cost
