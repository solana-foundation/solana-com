// #region create
use solana_client::nonblocking::rpc_client::RpcClient;
use solana_commitment_config::CommitmentConfig;
use solana_sdk::{
    native_token::LAMPORTS_PER_SOL, signature::Keypair, signer::Signer, transaction::Transaction,
};
use solana_system_interface::instruction::create_account;
use spl_token_2022_interface::{
    extension::{
        default_account_state::instruction::initialize_default_account_state, metadata_pointer,
        pausable, BaseStateWithExtensions, ExtensionType, StateWithExtensions,
    },
    instruction::{initialize_mint2, initialize_permanent_delegate},
    state::{AccountState, Mint},
};
use spl_token_metadata_interface::state::TokenMetadata;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let client = RpcClient::new_with_commitment(
        String::from("http://localhost:8899"),
        CommitmentConfig::confirmed(),
    );

    let payer = Keypair::new();
    let mint = Keypair::new();
    let token_program = spl_token_2022_interface::id();

    let airdrop_signature = client
        .request_airdrop(&payer.pubkey(), LAMPORTS_PER_SOL)
        .await?;
    loop {
        if client.confirm_transaction(&airdrop_signature).await? {
            break;
        }
    }

    // A compliance-ready Token-2022 mint: onchain metadata, pausable
    // transfers, a permanent delegate that can move or burn any balance, and
    // token accounts that start frozen until the issuer thaws them.
    let metadata = TokenMetadata {
        update_authority: Some(payer.pubkey()).try_into()?,
        mint: mint.pubkey(),
        name: String::from("Example Stablecoin"),
        symbol: String::from("EXUSD"),
        uri: String::from("https://example.com/exusd.json"),
        additional_metadata: vec![],
    };

    // Token metadata is written after the mint is initialized, so allocate
    // the account without it but fund rent for the full size.
    let mint_len = ExtensionType::try_calculate_account_len::<Mint>(&[
        ExtensionType::MetadataPointer,
        ExtensionType::Pausable,
        ExtensionType::PermanentDelegate,
        ExtensionType::DefaultAccountState,
    ])?;
    let metadata_len = metadata.tlv_size_of()?;
    let rent = client
        .get_minimum_balance_for_rent_exemption(mint_len + metadata_len)
        .await?;

    let instructions = vec![
        create_account(
            &payer.pubkey(),
            &mint.pubkey(),
            rent,
            mint_len as u64,
            &token_program,
        ),
        metadata_pointer::instruction::initialize(
            &token_program,
            &mint.pubkey(),
            Some(payer.pubkey()),
            Some(mint.pubkey()),
        )?,
        pausable::instruction::initialize(&token_program, &mint.pubkey(), &payer.pubkey())?,
        initialize_permanent_delegate(&token_program, &mint.pubkey(), &payer.pubkey())?,
        initialize_default_account_state(&token_program, &mint.pubkey(), &AccountState::Frozen)?,
        initialize_mint2(
            &token_program,
            &mint.pubkey(),
            &payer.pubkey(),
            Some(&payer.pubkey()),
            6,
        )?,
        spl_token_metadata_interface::instruction::initialize(
            &token_program,
            &mint.pubkey(),
            &payer.pubkey(),
            &mint.pubkey(),
            &payer.pubkey(),
            metadata.name.clone(),
            metadata.symbol.clone(),
            metadata.uri.clone(),
        ),
    ];

    let recent_blockhash = client.get_latest_blockhash().await?;
    let transaction = Transaction::new_signed_with_payer(
        &instructions,
        Some(&payer.pubkey()),
        &[&payer, &mint],
        recent_blockhash,
    );
    let signature = client.send_and_confirm_transaction(&transaction).await?;
    println!("Transaction Signature: {signature}");

    // Verify the mint and its extensions
    let mint_data = client.get_account_data(&mint.pubkey()).await?;
    let mint_state = StateWithExtensions::<Mint>::unpack(&mint_data)?;
    println!("Mint Address: {}", mint.pubkey());
    println!("Decimals: {}", mint_state.base.decimals);
    println!("Extensions: {:?}", mint_state.get_extension_types()?);

    Ok(())
}
// #endregion create
