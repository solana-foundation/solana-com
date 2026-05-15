// #region transfer
use solana_client::nonblocking::rpc_client::RpcClient;
use solana_commitment_config::CommitmentConfig;
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

    let from_keypair = Keypair::new();
    let to_keypair = Keypair::new();

    // Airdrop SOL to sender
    let airdrop_signature = client
        .request_airdrop(&from_keypair.pubkey(), 5 * LAMPORTS_PER_SOL)
        .await?;

    loop {
        if client.confirm_transaction(&airdrop_signature).await? {
            break;
        }
    }

    // Fetch balances before transfer
    let from_balance_before = client.get_balance(&from_keypair.pubkey()).await?;
    let to_balance_before = client.get_balance(&to_keypair.pubkey()).await?;

    println!("Before transfer:");
    println!(
        "  From: {} ({} SOL)",
        from_keypair.pubkey(),
        from_balance_before as f64 / LAMPORTS_PER_SOL as f64
    );
    println!(
        "  To:   {} ({} SOL)",
        to_keypair.pubkey(),
        to_balance_before as f64 / LAMPORTS_PER_SOL as f64
    );

    // Create and send transfer transaction
    let transfer_ix = transfer(
        &from_keypair.pubkey(),
        &to_keypair.pubkey(),
        100 * LAMPORTS_PER_SOL,
    );

    let latest_blockhash = client.get_latest_blockhash().await?;
    let mut transaction = Transaction::new_with_payer(&[transfer_ix], Some(&from_keypair.pubkey()));
    transaction.sign(&[&from_keypair], latest_blockhash);

    let signature = client.send_and_confirm_transaction(&transaction).await?;
    println!("\nTransaction Signature: {}", signature);

    // Fetch balances after transfer
    let from_balance_after = client.get_balance(&from_keypair.pubkey()).await?;
    let to_balance_after = client.get_balance(&to_keypair.pubkey()).await?;

    println!("\nAfter transfer:");
    println!(
        "  From: {} ({} SOL)",
        from_keypair.pubkey(),
        from_balance_after as f64 / LAMPORTS_PER_SOL as f64
    );
    println!(
        "  To:   {} ({} SOL)",
        to_keypair.pubkey(),
        to_balance_after as f64 / LAMPORTS_PER_SOL as f64
    );

    Ok(())
}
// #endregion transfer
