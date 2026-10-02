// #region derive-ata
use anyhow::{anyhow, Context, Result};
use solana_sdk::pubkey::Pubkey;

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

const TOKEN_2022: Pubkey = spl_token_2022_interface::ID;
const ATA_PROGRAM: Pubkey = Pubkey::from_str_const("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL");

#[tokio::main]
async fn main() -> Result<()> {
    let mint = pubkey(&env("MINT")?)?;
    let owner = pubkey(&arg(1, "the custody wallet")?)?;

    // Deterministic: the address exists before the account does, so monitoring
    // and reconciliation can be wired up ahead of the first transfer.
    let (token_account, _) = Pubkey::find_program_address(
        &[owner.as_ref(), TOKEN_2022.as_ref(), mint.as_ref()],
        &ATA_PROGRAM,
    );
    println!("Wallet address: {owner}");
    println!("Associated token address: {token_account}");
    Ok(())
}
// #endregion
