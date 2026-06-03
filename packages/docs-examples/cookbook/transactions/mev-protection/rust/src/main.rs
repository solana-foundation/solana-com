// #region dontfront
use base64::{engine::general_purpose::STANDARD, Engine as _};
use solana_client::nonblocking::rpc_client::RpcClient;
use solana_commitment_config::CommitmentConfig;
use solana_sdk::{
    instruction::AccountMeta, native_token::LAMPORTS_PER_SOL, pubkey::Pubkey, signature::Keypair,
    signer::Signer, transaction::Transaction,
};
use solana_system_interface::instruction::transfer;
use std::str::FromStr;

// Jito block engine endpoint (mainnet)
const JITO_ENDPOINT: &str = "https://mainnet.block-engine.jito.wtf/api/v1/transactions";

// Any valid pubkey starting with "jitodontfront".
// Does not need to exist onchain.
const DONT_FRONT: &str = "jitodontfront111111111111111111111111111111";

// Jito tip accounts — pick one at random to reduce contention.
const TIP_ACCOUNTS: &[&str] = &[
    "96gYZGLnJYVFmbjzopPSU6QiEV5fGqZNyN9nmNhvrZU5",
    "HFqU5x63VTqvQss8hp11i4wVV8bD44PvwucfZ2bU7gRe",
    "Cw8CFyM9FkoMi7K7Crf6HNQqf4uEMzpKw6QNghXLvLkY",
    "ADaUMid9yfUytqMBgopwjb2DTLSokTSzL1zt6iGPaS49",
    "DfXygSm4jCyNCybVYYK6DwvWqjKee8pbDmJGcLWNDXjh",
    "ADuUkR4vqLUMWXxW9gh6D6L8pMSawimctcNZ5pGwDcEt",
    "DttWaMuVvTiduZRnguLF7jNxTgiMBZ1hyAumKUiL2KRL",
    "3AVi9Tg9Uo68tJfuvoKvqKNWKkC5wPdSSdeBnizKZ6jT",
];

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let rpc = RpcClient::new_with_commitment(
        "http://localhost:8899".to_string(),
        CommitmentConfig::confirmed(),
    );

    let sender = Keypair::new();
    let recipient = Keypair::new();
    let dontfront = Pubkey::from_str(DONT_FRONT)?;

    // Fund the sender so the tx is signable
    let airdrop = rpc
        .request_airdrop(&sender.pubkey(), LAMPORTS_PER_SOL)
        .await?;
    loop {
        if rpc.confirm_transaction(&airdrop).await? {
            break;
        }
    }

    // Build a transfer and append the dontfront account as read-only
    let mut transfer_ix = transfer(&sender.pubkey(), &recipient.pubkey(), 1_000_000);
    transfer_ix
        .accounts
        .push(AccountMeta::new_readonly(dontfront, false));

    // Jito tip — SOL transfer to a random tip account (min 1000 lamports)
    let tip_idx = (std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)?
        .subsec_nanos() as usize)
        % TIP_ACCOUNTS.len();
    let tip_account = Pubkey::from_str(TIP_ACCOUNTS[tip_idx])?;
    let tip_ix = transfer(&sender.pubkey(), &tip_account, 1_000);

    let recent_blockhash = rpc.get_latest_blockhash().await?;

    let transaction = Transaction::new_signed_with_payer(
        &[transfer_ix, tip_ix],
        Some(&sender.pubkey()),
        &[&sender],
        recent_blockhash,
    );

    // Serialize → base64
    let serialized = bincode::serialize(&transaction)?;
    let base64_tx = STANDARD.encode(&serialized);

    // Send via Jito block engine (not standard RPC). In tests we just verify the
    // transaction builds + serializes — the actual block-engine submit needs a
    // reachable Jito endpoint.
    let client = reqwest::Client::new();
    match client
        .post(JITO_ENDPOINT)
        .header("Content-Type", "application/json")
        .json(&serde_json::json!({
            "jsonrpc": "2.0",
            "id": 1,
            "method": "sendTransaction",
            "params": [base64_tx, {"encoding": "base64"}]
        }))
        .send()
        .await
    {
        Ok(response) => match response.json::<serde_json::Value>().await {
            Ok(body) => match body["result"].as_str() {
                Some(signature) => println!("Sent with dontfront protection: {signature}"),
                None => eprintln!("Jito returned: {:?}", body),
            },
            Err(e) => eprintln!("Failed to parse Jito response: {}", e),
        },
        Err(e) => eprintln!("Jito submission failed (expected in offline tests): {}", e),
    }

    Ok(())
}
// #endregion dontfront
