// #region freeze
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
const TOKEN_2022: Pubkey = spl_token_2022_interface::ID;
const TOKEN_ACL: Pubkey = Pubkey::from_str_const("TACLkU6CiCdkQN2MjoyDkVg2yAH9zkxiHDsiztQ52TP");

fn pda(program: &Pubkey, seeds: &[&[u8]]) -> Pubkey {
    Pubkey::find_program_address(seeds, program).0
}

const ATA_PROGRAM: Pubkey = Pubkey::from_str_const("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL");

// The associated token address is deterministic: owner, token program, mint.
fn ata(mint: &Pubkey, owner: &Pubkey) -> Pubkey {
    pda(
        &ATA_PROGRAM,
        &[owner.as_ref(), TOKEN_2022.as_ref(), mint.as_ref()],
    )
}

// Token ACL freeze (5) and thaw (4): authority, mint, token account, mint
// config, token program. Token ACL holds the mint's freeze authority, so the
// config authority signs.
fn acl_freeze_or_thaw(
    discriminator: u8,
    authority: &Pubkey,
    mint: &Pubkey,
    token_account: &Pubkey,
) -> Instruction {
    Instruction {
        program_id: TOKEN_ACL,
        accounts: vec![
            AccountMeta::new_readonly(*authority, true),
            AccountMeta::new_readonly(*mint, false),
            AccountMeta::new(*token_account, false),
            AccountMeta::new_readonly(pda(&TOKEN_ACL, &[b"MINT_CONFIG", mint.as_ref()]), false),
            AccountMeta::new_readonly(TOKEN_2022, false),
        ],
        data: vec![discriminator],
    }
}

#[tokio::main]
async fn main() -> Result<()> {
    // The Token ACL config authority is the key that created the mint.
    let payer = load_keypair("tokenization-demo.json")?;
    let rpc = RpcClient::new_with_commitment(
        "https://api.devnet.solana.com".to_string(),
        CommitmentConfig::confirmed(),
    );
    let mint = pubkey(&env("MINT")?)?;
    let wallet = pubkey(&arg(1, "the holder wallet to freeze")?)?;

    // Freezes the wallet's associated token account through Token ACL.
    let token_account = ata(&mint, &wallet);
    send(
        &rpc,
        &payer,
        &[],
        &[acl_freeze_or_thaw(
            5,
            &payer.pubkey(),
            &mint,
            &token_account,
        )],
    )
    .await?;
    Ok(())
}
// #endregion
