// #region create
use solana_client::nonblocking::rpc_client::RpcClient;
use solana_commitment_config::CommitmentConfig;
use solana_sdk::{
    native_token::LAMPORTS_PER_SOL, signature::Keypair, signer::Signer, transaction::Transaction,
};
use solana_system_interface::{
    instruction::create_account as create_account_ix, program::ID as SYSTEM_PROGRAM_ID,
};

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let client = RpcClient::new_with_commitment(
        String::from("http://localhost:8899"),
        CommitmentConfig::confirmed(),
    );

    let from_keypair = Keypair::new(); // payer
    let new_account_keypair = Keypair::new();
    let data_len = 0;
    let rent_exemption_amount = client
        .get_minimum_balance_for_rent_exemption(data_len)
        .await?;

    let create_acc_ix = create_account_ix(
        &from_keypair.pubkey(),        // payer
        &new_account_keypair.pubkey(), // new account
        rent_exemption_amount,         // rent exemption fee
        data_len as u64,               // space reseved for new account
        &SYSTEM_PROGRAM_ID,            //assigned program address
    );

    let transaction_signature = client
        .request_airdrop(&from_keypair.pubkey(), LAMPORTS_PER_SOL)
        .await?;

    loop {
        if client.confirm_transaction(&transaction_signature).await? {
            break;
        }
    }

    let mut transaction =
        Transaction::new_with_payer(&[create_acc_ix], Some(&from_keypair.pubkey()));
    transaction.sign(
        &[&from_keypair, &new_account_keypair],
        client.get_latest_blockhash().await?,
    );

    client.send_and_confirm_transaction(&transaction).await?;

    let account = client.get_account(&new_account_keypair.pubkey()).await?;
    println!("{:#?}", account);

    Ok(())
}
// #endregion create
