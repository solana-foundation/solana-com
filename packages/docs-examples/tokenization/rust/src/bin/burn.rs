// #region burn
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
    extension::{permissioned_burn::instruction::burn_checked, StateWithExtensions},
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

const TOKEN_2022: Pubkey = spl_token_2022_interface::ID;

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

// Decimals and mint authority, read from the mint account itself.
async fn mint_info(rpc: &RpcClient, mint: &Pubkey) -> Result<(u8, Option<Pubkey>)> {
    let data = rpc.get_account_data(mint).await?;
    let state = StateWithExtensions::<Mint>::unpack(&data)?;
    Ok((state.base.decimals, state.base.mint_authority.into()))
}

// Scales a decimal amount to base units without going through a float.
fn to_base_units(amount: &str, decimals: u8) -> Result<u64> {
    let (whole, fraction) = amount.split_once('.').unwrap_or((amount, ""));
    let width = decimals as usize;
    let mut digits = format!("{whole}{fraction:0<width$}");
    digits.truncate(whole.len() + width);
    digits
        .parse()
        .with_context(|| format!("invalid amount {amount}"))
}

#[tokio::main]
async fn main() -> Result<()> {
    // A holder burn on a permissioned-burn mint needs two signatures: the
    // holder and the burn authority configured on the mint.
    let holder = load_keypair("demo-holder.json")?;
    let burn_authority = load_keypair("demo-authorities/burn.json")?;
    let rpc = RpcClient::new_with_commitment(
        "https://api.devnet.solana.com".to_string(),
        CommitmentConfig::confirmed(),
    );
    let mint = pubkey(&env("MINT")?)?;
    let amount = arg(1, "the decimal amount")?;

    let (decimals, _) = mint_info(&rpc, &mint).await?;
    let token_account = ata(&mint, &holder.pubkey());

    // Token-2022 rejects a plain burn on this mint. The permissioned burn
    // instruction carries both signers.
    let instruction = burn_checked(
        &TOKEN_2022,
        &token_account,
        &mint,
        &burn_authority.pubkey(),
        &holder.pubkey(),
        &[],
        to_base_units(&amount, decimals)?,
        decimals,
    )?;
    send(&rpc, &holder, &[&burn_authority], &[instruction]).await?;
    Ok(())
}
// #endregion
