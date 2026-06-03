// #region optimize
use solana_client::nonblocking::rpc_client::RpcClient;
use solana_commitment_config::CommitmentConfig;
use solana_compute_budget_interface::ComputeBudgetInstruction;
use solana_sdk::{
    instruction::Instruction, native_token::LAMPORTS_PER_SOL, pubkey::Pubkey, signature::Keypair,
    signer::Signer, transaction::Transaction,
};
use solana_system_interface::instruction::transfer;

/// Simulates a transaction and returns the compute units consumed
async fn get_simulation_compute_units(
    client: &RpcClient,
    instructions: &[Instruction],
    payer_key: &Pubkey,
) -> anyhow::Result<u64> {
    let recent_blockhash = client.get_latest_blockhash().await?;

    // Include compute budget instructions in simulation
    let simulation_instructions = vec![
        ComputeBudgetInstruction::set_compute_unit_price(100), // microLamports
        ComputeBudgetInstruction::set_compute_unit_limit(400_000), // High limit for simulation
    ];

    let mut all_instructions = simulation_instructions;
    all_instructions.extend_from_slice(instructions);

    let mut transaction = Transaction::new_with_payer(&all_instructions, Some(payer_key));
    transaction.message.recent_blockhash = recent_blockhash;

    match client.simulate_transaction(&transaction).await {
        Ok(simulation) => {
            println!("Simulated Transaction: {:#?}", simulation);

            if let Some(err) = simulation.value.err {
                eprintln!("Simulation error: {:?}", err);
                return Ok(200_000); // Fallback value
            }

            Ok(simulation.value.units_consumed.unwrap_or(200_000))
        }
        Err(error) => {
            eprintln!("Error during simulation: {}", error);
            Ok(200_000) // Fallback value
        }
    }
}

/// Builds an optimal transaction with compute budget instructions based on simulation
async fn build_optimal_transaction(
    client: &RpcClient,
    instructions: &[Instruction],
    signer: &Keypair,
    priority_fee: u64, // in microLamports
) -> anyhow::Result<Transaction> {
    let payer_pubkey = &signer.pubkey();
    let compute_units_future = get_simulation_compute_units(client, instructions, payer_pubkey);
    let blockhash_future = client.get_latest_blockhash();

    let (compute_units_result, recent_blockhash_result) =
        tokio::join!(compute_units_future, blockhash_future);

    let compute_units = compute_units_result?;
    let recent_blockhash = recent_blockhash_result?;

    let mut final_instructions = Vec::new();

    // Add priority fee instruction
    final_instructions.push(ComputeBudgetInstruction::set_compute_unit_price(
        priority_fee,
    ));

    // Add compute unit limit with 10% margin
    let units_with_margin = (compute_units as f64 * 1.1) as u64;
    println!("Compute Units Simulated: {}", compute_units);
    println!("Compute Units with extra 10% margin: {}", units_with_margin);
    final_instructions.push(ComputeBudgetInstruction::set_compute_unit_limit(
        units_with_margin as u32,
    ));

    // Add the actual instructions
    final_instructions.extend_from_slice(instructions);

    // Build and sign transaction
    let mut transaction = Transaction::new_with_payer(&final_instructions, Some(&signer.pubkey()));
    transaction.sign(&[signer], recent_blockhash);

    Ok(transaction)
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let client = RpcClient::new_with_commitment(
        String::from("http://localhost:8899"),
        CommitmentConfig::confirmed(),
    );

    let sender = Keypair::new();
    let recipient = Keypair::new();
    let amount = LAMPORTS_PER_SOL / 2; // 0.5 SOL

    // Request airdrop
    let signature = client
        .request_airdrop(&sender.pubkey(), LAMPORTS_PER_SOL)
        .await?;

    // Confirm airdrop
    let latest_blockhash = client.get_latest_blockhash().await?;
    client
        .confirm_transaction_with_spinner(
            &signature,
            &latest_blockhash,
            CommitmentConfig::confirmed(),
        )
        .await?;

    // Create transfer instruction
    let transfer_instruction = transfer(&sender.pubkey(), &recipient.pubkey(), amount);

    let priority_fee = 1; // microLamports

    // Build optimal transaction
    let transaction =
        build_optimal_transaction(&client, &[transfer_instruction], &sender, priority_fee).await?;

    // Send and confirm transaction
    let transaction_signature = client.send_and_confirm_transaction(&transaction).await?;

    println!("Transaction sent: {}", transaction_signature);

    Ok(())
}
// #endregion optimize
