// #region fetch
use solana_client::nonblocking::rpc_client::RpcClient;
use solana_commitment_config::CommitmentConfig;
use solana_sdk::pubkey;
use spl_token_2022_interface::{
    extension::{
        immutable_owner::ImmutableOwner, transfer_fee::TransferFeeAmount,
        transfer_hook::TransferHookAccount, BaseStateWithExtensions, ExtensionType,
        StateWithExtensions,
    },
    state::Account,
};

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let client = RpcClient::new_with_commitment(
        String::from("http://localhost:8899"),
        CommitmentConfig::confirmed(),
    );

    // fetch token account and deserialize with extensions
    let token_account_address = pubkey!("GfVPzUxMDvhFJ1Xs6C9i47XQRSapTd8LHw5grGuTquyQ");
    let token_account_data = client.get_token_account(&token_account_address).await?;
    println!("{token_account_data:#?}");

    // fetch token account and manually deserialize extensions
    let account = client.get_account(&token_account_address).await?;
    let token_account = StateWithExtensions::<Account>::unpack(&account.data)?;

    let extension_types = token_account.get_extension_types()?;
    println!("\nExtension Types: {:#?}\n", extension_types);

    println!("Base Account: {:#?}\n", token_account.base);

    extension_types
        .iter()
        .for_each(|extension_type| match extension_type {
            ExtensionType::ImmutableOwner => {
                if let Ok(ext) = token_account.get_extension::<ImmutableOwner>() {
                    println!("{:#?}\n", ext);
                }
            }
            ExtensionType::TransferFeeAmount => {
                if let Ok(ext) = token_account.get_extension::<TransferFeeAmount>() {
                    println!("{:#?}\n", ext);
                }
            }
            ExtensionType::TransferHookAccount => {
                if let Ok(ext) = token_account.get_extension::<TransferHookAccount>() {
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
