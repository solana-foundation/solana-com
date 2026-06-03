// #region priority
use solana_client::nonblocking::rpc_client::RpcClient;
use solana_commitment_config::CommitmentConfig;
use solana_compute_budget_interface::ComputeBudgetInstruction;
use solana_sdk::{
    native_token::LAMPORTS_PER_SOL, signature::Keypair, signer::Signer, transaction::Transaction,
};
use solana_system_interface::instruction::transfer;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let client = RpcClient::new_with_commitment(
        String::from("http://localhost:8899"),
        CommitmentConfig::confirmed(),
    );

    let sender = Keypair::new();
    let recipient = Keypair::new();

    let airdrop_signature = client
        .request_airdrop(&sender.pubkey(), 5 * LAMPORTS_PER_SOL)
        .await?;

    loop {
        if client.confirm_transaction(&airdrop_signature).await? {
            break;
        }
    }

    let set_compute_limit_ix = ComputeBudgetInstruction::set_compute_unit_limit(1_000_000);
    let set_compute_price_ix = ComputeBudgetInstruction::set_compute_unit_price(1);

    let transfer_ix = transfer(&sender.pubkey(), &recipient.pubkey(), LAMPORTS_PER_SOL);

    let latest_blockhash = client.get_latest_blockhash().await?;
    let mut transaction = Transaction::new_with_payer(
        &[set_compute_limit_ix, set_compute_price_ix, transfer_ix],
        Some(&sender.pubkey()),
    );
    transaction.sign(&[&sender], latest_blockhash);

    let signature = client.send_and_confirm_transaction(&transaction).await?;

    println!("Signature: {}", signature);
    println!("{:#?}", transaction);

    Ok(())
}
// #endregion priority
