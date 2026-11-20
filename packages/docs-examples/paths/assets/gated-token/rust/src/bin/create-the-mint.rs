// #region create
// cargo run --release --bin create-the-mint
use anyhow::{anyhow, Result};
use gated_token::{acl, load_keypair, rpc, send, TOKEN_2022};
use solana_sdk::signature::{Keypair, Signer};
use solana_system_interface::instruction::create_account;
use spl_token_2022_interface::{
    extension::{
        confidential_transfer, default_account_state, metadata_pointer, pausable,
        permissioned_burn, scaled_ui_amount, ExtensionType,
    },
    instruction::{initialize_mint2, initialize_permanent_delegate},
    state::{AccountState, Mint},
};
use spl_token_metadata_interface::{
    instruction::initialize as initialize_metadata, state::TokenMetadata,
};

#[tokio::main]
async fn main() -> Result<()> {
    let rpc = rpc();
    let payer = load_keypair("tokenization-demo")?;
    // One address per operational power, from the keys generated in step 1.
    let authority = |role: &str| -> Result<_> {
        Ok(load_keypair(&format!("demo-authorities/{role}"))?.pubkey())
    };
    let metadata_authority = authority("metadata")?;
    let pause_authority = authority("pause")?;
    let permanent_delegate = authority("delegate")?;
    let burn_authority = authority("burn")?;

    let mint = Keypair::new();
    let metadata = TokenMetadata {
        update_authority: Some(metadata_authority)
            .try_into()
            .map_err(|_| anyhow!("authority"))?,
        mint: mint.pubkey(),
        name: "Demo Tokenized Note".to_string(),
        symbol: "DEMOTN".to_string(),
        uri: "https://example.com/demotn.json".to_string(),
        additional_metadata: vec![],
    };

    // The extension set the Mosaic tokenized-security template turns on. Rent
    // covers the metadata too; the account is allocated without it because
    // initializing metadata reallocates it.
    let space = ExtensionType::try_calculate_account_len::<Mint>(&[
        ExtensionType::MetadataPointer,
        ExtensionType::Pausable,
        ExtensionType::DefaultAccountState,
        ExtensionType::ConfidentialTransferMint,
        ExtensionType::PermanentDelegate,
        ExtensionType::PermissionedBurn,
        ExtensionType::ScaledUiAmount,
    ])?;
    let rent = rpc
        .get_minimum_balance_for_rent_exemption(space + metadata.tlv_size_of()?)
        .await?;

    let (payer_key, mint_key) = (payer.pubkey(), mint.pubkey());
    let instructions = vec![
        create_account(&payer_key, &mint_key, rent, space as u64, &TOKEN_2022),
        // Extension configs are initialized before the mint itself.
        metadata_pointer::instruction::initialize(
            &TOKEN_2022,
            &mint_key,
            Some(metadata_authority),
            Some(mint_key),
        )?,
        pausable::instruction::initialize(&TOKEN_2022, &mint_key, &pause_authority)?,
        default_account_state::instruction::initialize_default_account_state(
            &TOKEN_2022,
            &mint_key,
            &AccountState::Frozen,
        )?,
        confidential_transfer::instruction::initialize_mint(
            &TOKEN_2022,
            &mint_key,
            Some(payer_key),
            false,
            None,
        )?,
        initialize_permanent_delegate(&TOKEN_2022, &mint_key, &permanent_delegate)?,
        permissioned_burn::instruction::initialize(&TOKEN_2022, &mint_key, &burn_authority)?,
        scaled_ui_amount::instruction::initialize(&TOKEN_2022, &mint_key, Some(payer_key), 1.0)?,
        // The freeze authority starts on the payer: Token ACL's create config
        // needs the current freeze authority to sign, then moves it to the
        // mint config.
        initialize_mint2(&TOKEN_2022, &mint_key, &payer_key, Some(&payer_key), 6)?,
        initialize_metadata(
            &TOKEN_2022,
            &mint_key,
            &metadata_authority,
            &mint_key,
            &payer_key,
            metadata.name.clone(),
            metadata.symbol.clone(),
            metadata.uri.clone(),
        ),
        // The Token ACL config plus the gate program's allowlist. Permissionless
        // thaw lets anyone open an allowlisted holder's account by paying the fee.
        acl::create_config(&payer_key, &payer_key, &mint_key),
        acl::enable_permissionless_thaw(&payer_key, &mint_key),
        acl::create_allowlist(&payer_key, &mint_key),
        acl::setup_extra_metas(&payer_key, &mint_key),
    ];

    send(&rpc, &[&payer, &mint], &instructions).await?;
    println!("Mint: {mint_key}");
    println!("Allowlist: {}", acl::list_config(&payer_key, &mint_key));
    println!(
        "Freeze authority (Token ACL mint config): {}",
        acl::mint_config(&mint_key)
    );
    Ok(())
}
// #endregion create
