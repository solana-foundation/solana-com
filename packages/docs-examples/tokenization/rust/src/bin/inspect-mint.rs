// #region inspect
use anyhow::{anyhow, Context, Result};
use solana_client::nonblocking::rpc_client::RpcClient;
use solana_commitment_config::CommitmentConfig;
use solana_sdk::pubkey::Pubkey;
use spl_token_2022_interface::{
    extension::{pausable::PausableConfig, BaseStateWithExtensions, StateWithExtensions},
    state::Mint,
};

fn env(name: &str) -> Result<String> {
    std::env::var(name).map_err(|_| anyhow!("export {name} before running this example"))
}

fn pubkey(value: &str) -> Result<Pubkey> {
    value
        .parse()
        .with_context(|| format!("invalid address {value}"))
}

const TOKEN_ACL: Pubkey = Pubkey::from_str_const("TACLkU6CiCdkQN2MjoyDkVg2yAH9zkxiHDsiztQ52TP");

#[tokio::main]
async fn main() -> Result<()> {
    let rpc = RpcClient::new_with_commitment(
        "https://api.devnet.solana.com".to_string(),
        CommitmentConfig::confirmed(),
    );
    let mint = pubkey(&env("MINT")?)?;

    // The mint account carries the extensions. The Token ACL config is a
    // separate account, derived from the mint, that holds the gate program and
    // the permissionless-thaw flag: discriminator (1), bump (1), thaw flag (1),
    // freeze flag (1), mint (32), freeze authority (32), gate program (32).
    let data = rpc.get_account_data(&mint).await?;
    let state = StateWithExtensions::<Mint>::unpack(&data)?;
    let mint_config_address =
        Pubkey::find_program_address(&[b"MINT_CONFIG", mint.as_ref()], &TOKEN_ACL).0;
    let mint_config = rpc
        .get_account_with_commitment(&mint_config_address, CommitmentConfig::confirmed())
        .await?
        .value;
    let freeze_authority: Option<Pubkey> = state.base.freeze_authority.into();
    let mint_authority: Option<Pubkey> = state.base.mint_authority.into();

    println!("mint: {mint}");
    println!("supply: {}", state.base.supply);
    println!("decimals: {}", state.base.decimals);
    println!(
        "mintAuthority: {}",
        mint_authority.map_or("none".to_string(), |a| a.to_string())
    );
    println!(
        "freezeAuthority: {}",
        freeze_authority.map_or("none".to_string(), |a| a.to_string())
    );
    println!(
        "tokenAcl: {}",
        mint_config.is_some() && freeze_authority == Some(mint_config_address)
    );
    if let Some(config) = &mint_config {
        println!(
            "gatingProgram: {}",
            Pubkey::try_from(&config.data[68..100])?
        );
        println!("permissionlessThaw: {}", config.data[2] == 1);
    }
    println!("extensions: {:?}", state.get_extension_types()?);
    match state.get_extension::<PausableConfig>() {
        Ok(config) => println!("paused: {}", bool::from(config.paused)),
        Err(_) => println!("paused: n/a"),
    }
    Ok(())
}
// #endregion
