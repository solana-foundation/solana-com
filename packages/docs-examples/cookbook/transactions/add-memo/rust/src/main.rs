// #region memo
use solana_client::{nonblocking::rpc_client::RpcClient, rpc_config::RpcTransactionConfig};
use solana_commitment_config::CommitmentConfig;
use solana_sdk::{
    native_token::LAMPORTS_PER_SOL, signature::Keypair, signer::Signer, transaction::Transaction,
};
use solana_transaction_status_client_types::{
    option_serializer::OptionSerializer, UiTransactionEncoding,
};
use spl_memo_interface::{instruction::build_memo, v3::ID as MEMO_V3_PROGRAM_ID};

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let client = RpcClient::new_with_commitment(
        String::from("http://localhost:8899"),
        CommitmentConfig::confirmed(),
    );

    let signer_keypair = Keypair::new();
    let memo = String::from("Memo message to be logged in this transaction");

    let memo_ix = build_memo(
        &MEMO_V3_PROGRAM_ID,
        memo.as_bytes(),
        &[&signer_keypair.pubkey()],
    );

    let transaction_signature = client
        .request_airdrop(&signer_keypair.pubkey(), 5 * LAMPORTS_PER_SOL)
        .await?;
    loop {
        if client.confirm_transaction(&transaction_signature).await? {
            break;
        }
    }

    let mut transaction = Transaction::new_with_payer(&[memo_ix], Some(&signer_keypair.pubkey()));
    transaction.sign(&[&signer_keypair], client.get_latest_blockhash().await?);

    let signature = client.send_and_confirm_transaction(&transaction).await?;

    // Fetch the transaction details with config
    let tx_details = client
        .get_transaction_with_config(
            &signature,
            RpcTransactionConfig {
                encoding: Some(UiTransactionEncoding::Json),
                commitment: Some(CommitmentConfig::confirmed()),
                max_supported_transaction_version: Some(0),
            },
        )
        .await?;

    // Extract and display logs
    if let Some(meta) = tx_details.transaction.meta {
        if let OptionSerializer::Some(logs) = meta.log_messages {
            println!("\nTransaction Logs:");
            for log in logs {
                println!("  {}", log);
            }
        }
    }

    Ok(())
}
// #endregion memo
