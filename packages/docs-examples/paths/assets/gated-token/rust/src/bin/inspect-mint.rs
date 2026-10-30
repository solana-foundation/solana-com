// #region inspect
// cargo run --release --bin inspect-mint
use anyhow::Result;
use gated_token::{acl, env, rpc};
use solana_sdk::pubkey::Pubkey;
use spl_token_2022_interface::{
    extension::{BaseStateWithExtensions, StateWithExtensions},
    state::Mint,
};

#[tokio::main]
async fn main() -> Result<()> {
    let rpc = rpc();
    let mint = env("MINT")?;

    // The mint account carries the extensions. The Token ACL config is a
    // separate account, derived from the mint: discriminator (1), bump (1),
    // thaw flag (1), freeze flag (1), mint (32), authority (32), gate (32).
    let data = rpc.get_account_data(&mint).await?;
    let state = StateWithExtensions::<Mint>::unpack(&data)?;
    let config_address = acl::mint_config(&mint);
    let config = rpc
        .get_account_with_commitment(&config_address, rpc.commitment())
        .await?
        .value;
    let mint_authority: Option<Pubkey> = state.base.mint_authority.into();
    let freeze_authority: Option<Pubkey> = state.base.freeze_authority.into();

    println!("mint: {mint}");
    println!("supply: {}", state.base.supply);
    println!("decimals: {}", state.base.decimals);
    println!("mintAuthority: {mint_authority:?}");
    println!("freezeAuthority: {freeze_authority:?}");
    println!(
        "tokenAcl: {}",
        config.is_some() && freeze_authority == Some(config_address)
    );
    if let Some(config) = &config {
        println!(
            "gatingProgram: {}",
            Pubkey::try_from(&config.data[68..100])?
        );
        println!("permissionlessThaw: {}", config.data[2] == 1);
    }
    println!("extensions: {:?}", state.get_extension_types()?);
    Ok(())
}
// #endregion inspect
