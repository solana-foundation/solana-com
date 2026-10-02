// #region create
use anyhow::{anyhow, Result};
use solana_client::nonblocking::rpc_client::RpcClient;
use solana_commitment_config::CommitmentConfig;
use solana_sdk::{
    instruction::{AccountMeta, Instruction},
    pubkey::Pubkey,
    signature::{read_keypair_file, Keypair, Signer},
    transaction::Transaction,
};
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

#[tokio::main]
async fn main() -> Result<()> {
    let payer = load_keypair("tokenization-demo.json")?;
    let rpc = RpcClient::new_with_commitment(
        "https://api.devnet.solana.com".to_string(),
        CommitmentConfig::confirmed(),
    );

    // One address per operational power, from the keys generated in step 1.
    let authority = |role: &str| -> Result<Pubkey> {
        Ok(load_keypair(&format!("demo-authorities/{role}.json"))?.pubkey())
    };
    let metadata_authority = authority("metadata")?;
    let pause_authority = authority("pause")?;
    let permanent_delegate = authority("delegate")?;
    let burn_authority = authority("burn")?;

    let mint = Keypair::new();
    let decimals = 6;
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

    // The same extension set the Mosaic tokenized-security template turns on.
    // Default account state is Frozen: every new holder account starts frozen
    // and is opened through the gate. Rent covers the metadata too; the account
    // is allocated without it because initializing metadata reallocates it.
    let mint_len = ExtensionType::try_calculate_account_len::<Mint>(&[
        ExtensionType::MetadataPointer,
        ExtensionType::Pausable,
        ExtensionType::DefaultAccountState,
        ExtensionType::ConfidentialTransferMint,
        ExtensionType::PermanentDelegate,
        ExtensionType::PermissionedBurn,
        ExtensionType::ScaledUiAmount,
    ])?;
    let lamports = rpc
        .get_minimum_balance_for_rent_exemption(mint_len + metadata.tlv_size_of()?)
        .await?;

    let mint_instructions = vec![
        create_account(
            &payer.pubkey(),
            &mint.pubkey(),
            lamports,
            mint_len as u64,
            &TOKEN_2022,
        ),
        // Extension configs are initialized before the mint itself.
        metadata_pointer::instruction::initialize(
            &TOKEN_2022,
            &mint.pubkey(),
            Some(metadata_authority),
            Some(mint.pubkey()),
        )?,
        pausable::instruction::initialize(&TOKEN_2022, &mint.pubkey(), &pause_authority)?,
        default_account_state::instruction::initialize_default_account_state(
            &TOKEN_2022,
            &mint.pubkey(),
            &AccountState::Frozen,
        )?,
        confidential_transfer::instruction::initialize_mint(
            &TOKEN_2022,
            &mint.pubkey(),
            Some(payer.pubkey()),
            false,
            None,
        )?,
        initialize_permanent_delegate(&TOKEN_2022, &mint.pubkey(), &permanent_delegate)?,
        permissioned_burn::instruction::initialize(&TOKEN_2022, &mint.pubkey(), &burn_authority)?,
        scaled_ui_amount::instruction::initialize(
            &TOKEN_2022,
            &mint.pubkey(),
            Some(payer.pubkey()),
            1.0,
        )?,
        // The freeze authority starts as the mint authority. Token ACL's create
        // config requires the current freeze authority to sign, then moves it
        // to the mint config account.
        initialize_mint2(
            &TOKEN_2022,
            &mint.pubkey(),
            &payer.pubkey(),
            Some(&payer.pubkey()),
            decimals,
        )?,
        initialize_metadata(
            &TOKEN_2022,
            &mint.pubkey(),
            &metadata_authority,
            &mint.pubkey(),
            &payer.pubkey(),
            metadata.name.clone(),
            metadata.symbol.clone(),
            metadata.uri.clone(),
        ),
    ];

    // Token ACL config plus the gate program's allowlist, keyed by the mint
    // authority and the mint. Permissionless thaw is what lets an allowlisted
    // holder's account be opened by anyone who pays the fee.
    let mint_config = pda(&TOKEN_ACL, &[b"MINT_CONFIG", mint.pubkey().as_ref()]);
    let list_config = pda(
        &GATE,
        &[
            b"list_config",
            payer.pubkey().as_ref(),
            mint.pubkey().as_ref(),
        ],
    );
    let extra_metas = pda(
        &GATE,
        &[b"thaw_extra_account_metas", mint.pubkey().as_ref()],
    );
    let signer = AccountMeta::new_readonly(payer.pubkey(), true);
    let funder = AccountMeta::new(payer.pubkey(), true);
    let gate_instructions = vec![
        // createConfig (0): payer, authority, mint, mint config, system, token
        // program; the data carries the gate program.
        Instruction {
            program_id: TOKEN_ACL,
            accounts: vec![
                funder.clone(),
                signer.clone(),
                AccountMeta::new(mint.pubkey(), false),
                AccountMeta::new(mint_config, false),
                AccountMeta::new_readonly(SYSTEM_PROGRAM, false),
                AccountMeta::new_readonly(TOKEN_2022, false),
            ],
            data: [vec![0], GATE.to_bytes().to_vec()].concat(),
        },
        // setGatingProgram (2): authority, mint config.
        Instruction {
            program_id: TOKEN_ACL,
            accounts: vec![signer.clone(), AccountMeta::new(mint_config, false)],
            data: [vec![2], GATE.to_bytes().to_vec()].concat(),
        },
        // togglePermissionlessInstructions (8): freeze off, thaw on.
        Instruction {
            program_id: TOKEN_ACL,
            accounts: vec![signer.clone(), AccountMeta::new(mint_config, false)],
            data: vec![8, 0, 1],
        },
        // Gate createList (1): mode 0 is an allowlist; the seed is the mint.
        Instruction {
            program_id: GATE,
            accounts: vec![
                signer.clone(),
                funder.clone(),
                AccountMeta::new(list_config, false),
                AccountMeta::new_readonly(SYSTEM_PROGRAM, false),
            ],
            data: [vec![1, 0], mint.pubkey().to_bytes().to_vec()].concat(),
        },
        // Gate setupExtraMetas (4): records the list as the account the gate
        // reads on thaw.
        Instruction {
            program_id: GATE,
            accounts: vec![
                signer,
                funder,
                AccountMeta::new_readonly(mint_config, false),
                AccountMeta::new_readonly(mint.pubkey(), false),
                AccountMeta::new(extra_metas, false),
                AccountMeta::new_readonly(SYSTEM_PROGRAM, false),
                AccountMeta::new_readonly(list_config, false),
            ],
            data: vec![4],
        },
    ];

    let instructions = [mint_instructions, gate_instructions].concat();
    send(&rpc, &payer, &[&mint], &instructions).await?;
    println!("Mint: {}", mint.pubkey());
    println!("Freeze authority (Token ACL mint config): {mint_config}");
    println!("Allowlist: {list_config}");
    Ok(())
}
// #endregion
