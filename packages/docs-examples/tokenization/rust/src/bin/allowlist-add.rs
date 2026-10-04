// #region allowlist-add
use anyhow::{anyhow, Context, Result};
use solana_client::nonblocking::rpc_client::RpcClient;
use solana_commitment_config::CommitmentConfig;
use solana_sdk::{
    instruction::{AccountMeta, Instruction},
    pubkey::Pubkey,
    signature::{read_keypair_file, Keypair, Signer},
    transaction::Transaction,
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

fn arg(index: usize, name: &str) -> Result<String> {
    std::env::args()
        .nth(index)
        .ok_or_else(|| anyhow!("usage: pass {name} as argument {index}"))
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

// Token ACL and its gate program have no Rust client on this dependency line.
// Each instruction is one discriminator byte followed by an account list, so
// they are built here.
const GATE: Pubkey = Pubkey::from_str_const("GATEzzqxhJnsWF6vHRsgtixxSB8PaQdcqGEVTEHWiULz");
const SYSTEM_PROGRAM: Pubkey = solana_system_interface::program::ID;

fn pda(program: &Pubkey, seeds: &[&[u8]]) -> Pubkey {
    Pubkey::find_program_address(seeds, program).0
}

#[tokio::main]
async fn main() -> Result<()> {
    // The list authority is the key that created the mint.
    let payer = load_keypair("tokenization-demo.json")?;
    let rpc = RpcClient::new_with_commitment(
        "https://api.devnet.solana.com".to_string(),
        CommitmentConfig::confirmed(),
    );
    let mint = pubkey(&env("MINT")?)?;
    let wallet = pubkey(&arg(1, "the wallet to approve")?)?;

    // The allowlist is a gate-program account keyed by its authority and the
    // mint. Each approved wallet gets its own entry account under that list.
    let list_config = pda(
        &GATE,
        &[b"list_config", payer.pubkey().as_ref(), mint.as_ref()],
    );
    let wallet_entry = pda(
        &GATE,
        &[b"wallet_entry", list_config.as_ref(), wallet.as_ref()],
    );

    // Gate addWallet (discriminator 2): authority, payer, list, wallet, entry,
    // system program. Membership alone lets the wallet's token account be
    // thawed through the gate. If the wallet already holds a frozen account,
    // thaw it afterwards.
    let add_wallet = Instruction {
        program_id: GATE,
        accounts: vec![
            AccountMeta::new_readonly(payer.pubkey(), true),
            AccountMeta::new(payer.pubkey(), true),
            AccountMeta::new(list_config, false),
            AccountMeta::new_readonly(wallet, false),
            AccountMeta::new(wallet_entry, false),
            AccountMeta::new_readonly(SYSTEM_PROGRAM, false),
        ],
        data: vec![2],
    };
    send(&rpc, &payer, &[], &[add_wallet]).await?;
    Ok(())
}
// #endregion
