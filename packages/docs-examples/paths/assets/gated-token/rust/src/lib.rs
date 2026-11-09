// #region common
// src/lib.rs: the connection, key files, and send helper every binary uses.
pub mod acl;

use anyhow::{anyhow, Context, Result};
use solana_client::rpc_request::{RpcError, RpcResponseErrorData};
use solana_client::{client_error::ClientErrorKind, nonblocking::rpc_client::RpcClient};
use solana_commitment_config::CommitmentConfig;
use solana_sdk::{
    instruction::Instruction,
    pubkey::Pubkey,
    signature::{read_keypair_file, Keypair, Signer},
    transaction::Transaction,
};
use spl_token_2022_interface::{
    extension::StateWithExtensions,
    state::{Account, AccountState, Mint},
};

pub const TOKEN_2022: Pubkey = spl_token_2022_interface::ID;

// Devnet unless RPC_URL points somewhere else, for example a local Surfpool at
// http://127.0.0.1:8899.
pub fn rpc_with(commitment: CommitmentConfig) -> RpcClient {
    let url =
        std::env::var("RPC_URL").unwrap_or_else(|_| "https://api.devnet.solana.com".to_string());
    RpcClient::new_with_commitment(url, commitment)
}

pub fn rpc() -> RpcClient {
    rpc_with(CommitmentConfig::confirmed())
}

// Key files live in ~/.config/solana, as solana-keygen writes them.
pub fn load_keypair(name: &str) -> Result<Keypair> {
    let home = std::env::var("HOME").context("HOME is not set")?;
    let path = std::path::Path::new(&home)
        .join(".config/solana")
        .join(format!("{name}.json"));
    read_keypair_file(&path).map_err(|e| anyhow!("{}: {e}", path.display()))
}

pub fn env(name: &str) -> Result<Pubkey> {
    let value =
        std::env::var(name).map_err(|_| anyhow!("export {name} before running this binary"))?;
    value
        .parse()
        .with_context(|| format!("${name} is not an address"))
}

pub fn arg(index: usize, name: &str) -> Result<String> {
    std::env::args()
        .nth(index)
        .ok_or_else(|| anyhow!("pass {name} as argument {index}"))
}

pub fn arg_pubkey(index: usize, name: &str) -> Result<Pubkey> {
    arg(index, name)?
        .parse()
        .with_context(|| format!("{name} is not an address"))
}

// Sends the instructions in one transaction, paid by the first signer, and
// waits for "confirmed". A rejected transaction prints the program error and
// sets a non-zero exit code instead of returning an error.
pub async fn send(
    rpc: &RpcClient,
    signers: &[&Keypair],
    instructions: &[Instruction],
) -> Result<()> {
    let blockhash = rpc.get_latest_blockhash().await?;
    let transaction = Transaction::new_signed_with_payer(
        instructions,
        Some(&signers[0].pubkey()),
        signers,
        blockhash,
    );
    match rpc.send_and_confirm_transaction(&transaction).await {
        Ok(signature) => println!("Signature: {signature}"),
        Err(error) => {
            // The first failing program in the log is where the transaction stopped.
            let logs = match error.kind() {
                ClientErrorKind::RpcError(RpcError::RpcResponseError {
                    data: RpcResponseErrorData::SendTransactionPreflightFailure(result),
                    ..
                }) => result.logs.clone().unwrap_or_default(),
                _ => vec![],
            };
            match logs.iter().find(|line| line.contains(" failed: ")) {
                Some(line) => println!("Failed: {line}"),
                None => println!("Failed: {error}"),
            }
            std::process::exit(1);
        }
    }
    Ok(())
}

// The associated token account of an owner for this Token-2022 mint.
pub fn ata(mint: &Pubkey, owner: &Pubkey) -> Pubkey {
    acl::pda(
        &acl::ATA_PROGRAM,
        &[owner.as_ref(), TOKEN_2022.as_ref(), mint.as_ref()],
    )
}

pub async fn mint_decimals(rpc: &RpcClient, mint: &Pubkey) -> Result<u8> {
    let data = rpc.get_account_data(mint).await?;
    Ok(StateWithExtensions::<Mint>::unpack(&data)?.base.decimals)
}

// Whether a token account exists and whether it is frozen.
pub async fn token_account_state(
    rpc: &RpcClient,
    address: &Pubkey,
) -> Result<Option<AccountState>> {
    let account = rpc
        .get_account_with_commitment(address, rpc.commitment())
        .await?
        .value;
    match account {
        Some(account) => Ok(Some(
            StateWithExtensions::<Account>::unpack(&account.data)?
                .base
                .state,
        )),
        None => Ok(None),
    }
}

// Scales a decimal amount such as "1.5" to base units without a float.
pub fn to_base_units(amount: &str, decimals: u8) -> Result<u64> {
    let (whole, fraction) = amount.split_once('.').unwrap_or((amount, ""));
    let width = decimals as usize;
    let mut digits = format!("{whole}{fraction:0<width$}");
    digits.truncate(whole.len() + width);
    digits
        .parse()
        .with_context(|| format!("invalid amount {amount}"))
}
// #endregion common
