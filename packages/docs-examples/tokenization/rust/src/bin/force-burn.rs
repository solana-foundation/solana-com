// #region force-burn
use anyhow::{anyhow, Context, Result};
use solana_client::nonblocking::rpc_client::RpcClient;
use solana_commitment_config::CommitmentConfig;
use solana_sdk::{
    instruction::{AccountMeta, Instruction},
    pubkey::Pubkey,
    signature::{read_keypair_file, Keypair, Signer},
    transaction::Transaction,
};
use spl_token_2022_interface::{
    extension::{permissioned_burn::instruction::burn_checked, StateWithExtensions},
    state::{Account, AccountState, Mint},
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
const GATE: Pubkey = Pubkey::from_str_const("GATEzzqxhJnsWF6vHRsgtixxSB8PaQdcqGEVTEHWiULz");
const SYSTEM_PROGRAM: Pubkey = solana_system_interface::program::ID;

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

// A missing account counts as frozen: it will be created frozen by default.
async fn token_account_state(rpc: &RpcClient, address: &Pubkey) -> Result<(bool, bool)> {
    let account = rpc
        .get_account_with_commitment(address, CommitmentConfig::confirmed())
        .await?
        .value;
    match account {
        Some(account) => {
            let state = StateWithExtensions::<Account>::unpack(&account.data)?;
            Ok((true, state.base.state == AccountState::Frozen))
        }
        None => Ok((false, true)),
    }
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

// Token ACL thawPermissionless (discriminator 6). The program checks the owner
// with the gate program, which reads three extra accounts after the fixed
// nine: its extra-metas record for the mint, the allowlist, and the owner's
// entry on that list. The tutorial's list is keyed by the mint authority and
// the mint, which is how Mosaic derives it.
fn thaw_through_gate(
    authority: &Pubkey,
    mint: &Pubkey,
    token_account: &Pubkey,
    owner: &Pubkey,
    list_authority: &Pubkey,
) -> Instruction {
    let mint_config = pda(&TOKEN_ACL, &[b"MINT_CONFIG", mint.as_ref()]);
    let flag_account = pda(&TOKEN_ACL, &[b"FLAG_ACCOUNT", token_account.as_ref()]);
    let extra_metas = pda(&GATE, &[b"thaw_extra_account_metas", mint.as_ref()]);
    let list_config = pda(
        &GATE,
        &[b"list_config", list_authority.as_ref(), mint.as_ref()],
    );
    let wallet_entry = pda(
        &GATE,
        &[b"wallet_entry", list_config.as_ref(), owner.as_ref()],
    );
    Instruction {
        program_id: TOKEN_ACL,
        accounts: vec![
            AccountMeta::new(*authority, true),
            AccountMeta::new_readonly(*mint, false),
            AccountMeta::new(*token_account, false),
            AccountMeta::new(flag_account, false),
            AccountMeta::new_readonly(*owner, false),
            AccountMeta::new_readonly(mint_config, false),
            AccountMeta::new_readonly(TOKEN_2022, false),
            AccountMeta::new_readonly(SYSTEM_PROGRAM, false),
            AccountMeta::new_readonly(GATE, false),
            AccountMeta::new_readonly(extra_metas, false),
            AccountMeta::new_readonly(list_config, false),
            AccountMeta::new_readonly(wallet_entry, false),
        ],
        data: vec![6],
    }
}

#[tokio::main]
async fn main() -> Result<()> {
    let payer = load_keypair("tokenization-demo.json")?;
    let permanent_delegate = load_keypair("demo-authorities/delegate.json")?;
    let burn_authority = load_keypair("demo-authorities/burn.json")?;
    let rpc = RpcClient::new_with_commitment(
        "https://api.devnet.solana.com".to_string(),
        CommitmentConfig::confirmed(),
    );
    let mint = pubkey(&env("MINT")?)?;
    let from = pubkey(&arg(1, "the wallet to burn from")?)?;
    let amount = arg(2, "the decimal amount")?;

    let (decimals, _) = mint_info(&rpc, &mint).await?;
    let token_account = ata(&mint, &from);
    let (exists, frozen) = token_account_state(&rpc, &token_account).await?;
    let mut instructions = Vec::new();

    // Token-2022 does not burn from a frozen account, so a frozen source is
    // thawed through the gate first. That only succeeds while the wallet is
    // still on the allowlist.
    if exists && frozen {
        instructions.push(thaw_through_gate(
            &payer.pubkey(),
            &mint,
            &token_account,
            &from,
            &payer.pubkey(),
        ));
    }

    // Burns without the holder. The permanent delegate signs as the authority,
    // and because the mint carries permissioned burn on a separate key, the
    // burn authority co-signs.
    instructions.push(burn_checked(
        &TOKEN_2022,
        &token_account,
        &mint,
        &burn_authority.pubkey(),
        &permanent_delegate.pubkey(),
        &[],
        to_base_units(&amount, decimals)?,
        decimals,
    )?);

    send(
        &rpc,
        &payer,
        &[&permanent_delegate, &burn_authority],
        &instructions,
    )
    .await?;
    Ok(())
}
// #endregion
