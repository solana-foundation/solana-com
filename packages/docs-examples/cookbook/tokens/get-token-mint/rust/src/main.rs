// #region fetch
use solana_client::nonblocking::rpc_client::RpcClient;
use solana_commitment_config::CommitmentConfig;
use solana_sdk::pubkey;
use spl_token_2022_interface::{
    extension::{
        confidential_transfer::ConfidentialTransferMint,
        confidential_transfer_fee::ConfidentialTransferFeeConfig,
        metadata_pointer::MetadataPointer, mint_close_authority::MintCloseAuthority,
        permanent_delegate::PermanentDelegate, transfer_fee::TransferFeeConfig,
        transfer_hook::TransferHook, BaseStateWithExtensions, ExtensionType, StateWithExtensions,
    },
    state::Mint,
};

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let client = RpcClient::new_with_commitment(
        String::from("http://localhost:8899"),
        CommitmentConfig::confirmed(),
    );

    let mint_address = pubkey!("2b1kV6DkPAnxd5ixfnxCpjxmKwqjjaYmCZfHsFu24GXo");
    let mint_data = client.get_account_data(&mint_address).await?;
    let mint = StateWithExtensions::<Mint>::unpack(&mint_data)?;

    println!("Mint address: {:#?}", mint_address);
    println!("{:#?}\n", mint.base);

    let extension_types = mint.get_extension_types()?;
    println!("Extensions enabled: {:#?}\n", extension_types);

    extension_types
        .iter()
        .for_each(|extension_type| match extension_type {
            ExtensionType::TransferFeeConfig => {
                if let Ok(ext) = mint.get_extension::<TransferFeeConfig>() {
                    println!("{:#?}\n", ext);
                }
            }
            ExtensionType::MintCloseAuthority => {
                if let Ok(ext) = mint.get_extension::<MintCloseAuthority>() {
                    println!("{:#?}\n", ext);
                }
            }
            ExtensionType::PermanentDelegate => {
                if let Ok(ext) = mint.get_extension::<PermanentDelegate>() {
                    println!("{:#?}\n", ext);
                }
            }
            ExtensionType::ConfidentialTransferMint => {
                if let Ok(ext) = mint.get_extension::<ConfidentialTransferMint>() {
                    println!("{:#?}\n", ext);
                }
            }
            ExtensionType::ConfidentialTransferFeeConfig => {
                if let Ok(ext) = mint.get_extension::<ConfidentialTransferFeeConfig>() {
                    println!("{:#?}\n", ext);
                }
            }
            ExtensionType::TransferHook => {
                if let Ok(ext) = mint.get_extension::<TransferHook>() {
                    println!("{:#?}\n", ext);
                }
            }
            ExtensionType::MetadataPointer => {
                if let Ok(ext) = mint.get_extension::<MetadataPointer>() {
                    println!("{:#?}\n", ext);
                }
            }
            _ => {
                println!("{:?}: (not handled)\n", extension_type);
            }
        });

    Ok(())
}
// #endregion fetch
