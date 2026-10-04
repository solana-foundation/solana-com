// #region resume
use anyhow::{anyhow, Context, Result};
use solana_client::nonblocking::rpc_client::RpcClient;
use solana_commitment_config::CommitmentConfig;
use solana_sdk::{
    instruction::Instruction,
    pubkey::Pubkey,
    signature::{read_keypair_file, Keypair, Signer},
    transaction::Transaction,
};
use spl_token_2022_interface::{
    extension::{
        pausable::{instruction::resume, PausableConfig},
        BaseStateWithExtensions, StateWithExtensions,
    },
    state::Mint,
};

// The same keypair files and environment variables the CLI tab uses.
fn keypair_file(name: &str) -> std::path::PathBuf {
    let home = std::env::var("HOME").expect("HOME is set");
    std::path::Path::new(&home)
        .join(".config/solana")
        .join(name)
}

fn load_keypair(name: &str) -> Result<Keypair> {
    read_keypair_file(keypair_file(name)).map_err(|e| anyhow!("{name}: {e}"))
}

fn env(name: &str) -> Result<String> {
    std::env::var(name).map_err(|_| anyhow!("export {name} before running this example"))
}

fn pubkey(value: &str) -> Result<Pubkey> {
    value
        .parse()
        .with_context(|| format!("invalid address {value}"))
}

// Signs with the fee payer plus any extra signers, sends, and prints the signature.
async fn send(
    rpc: &RpcClient,
    payer: &Keypair,
    signers: &[&Keypair],
    instructions: &[Instruction],
) -> Result<()> {
    let blockhash = rpc.get_latest_blockhash().await?;
    let mut all_signers: Vec<&Keypair> = vec![payer];
    all_signers.extend_from_slice(signers);
    let transaction = Transaction::new_signed_with_payer(
        instructions,
        Some(&payer.pubkey()),
        &all_signers,
        blockhash,
    );
    let signature = rpc.send_and_confirm_transaction(&transaction).await?;
    println!("Signature: {signature}");
    Ok(())
}

const TOKEN_2022: Pubkey = spl_token_2022_interface::ID;

#[tokio::main]
async fn main() -> Result<()> {
    let payer = load_keypair("tokenization-demo.json")?;
    let pause_authority = load_keypair("demo-authorities/pause.json")?;
    let rpc = RpcClient::new_with_commitment(
        "https://api.devnet.solana.com".to_string(),
        CommitmentConfig::confirmed(),
    );
    let mint = pubkey(&env("MINT")?)?;

    // Lifts the pause. Balances and allowlist state are exactly as they were.
    let instruction = resume(&TOKEN_2022, &mint, &pause_authority.pubkey(), &[])?;
    send(&rpc, &payer, &[&pause_authority], &[instruction]).await?;

    // The pause flag lives in the mint's PausableConfig extension.
    let data = rpc.get_account_data(&mint).await?;
    let state = StateWithExtensions::<Mint>::unpack(&data)?;
    let config = state.get_extension::<PausableConfig>()?;
    println!("Paused: {}", bool::from(config.paused));
    Ok(())
}
// #endregion
