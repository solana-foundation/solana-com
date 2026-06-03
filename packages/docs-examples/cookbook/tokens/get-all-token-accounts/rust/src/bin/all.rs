// #region all
use solana_account_decoder_client_types::UiAccountData;
use solana_client::{nonblocking::rpc_client::RpcClient, rpc_request::TokenAccountsFilter};
use solana_commitment_config::CommitmentConfig;
use solana_sdk::pubkey;
use spl_token_interface::ID as TOKEN_PROGRAM_ID;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let client = RpcClient::new_with_commitment(
        String::from("http://localhost:8899"),
        CommitmentConfig::confirmed(),
    );

    let authority_address = pubkey!("4kg8oh3jdNtn7j2wcS7TrUua31AgbLzDVkBZgTAe44aF");

    let token_accounts = client
        .get_token_accounts_by_owner(
            &authority_address,
            TokenAccountsFilter::ProgramId(TOKEN_PROGRAM_ID),
        )
        .await?;

    for token_account in token_accounts {
        if let UiAccountData::Json(parsed_data) = token_account.account.data {
            println!("{:#?}\n", parsed_data);
        }
    }

    Ok(())
}
// #endregion all
