// #region fetch-list
// cargo run --release --bin fetch-list
use anyhow::{anyhow, Result};
use gated_token::{acl, env, rpc};
use solana_account_decoder_client_types::UiAccountEncoding;
use solana_client::{
    rpc_config::{RpcAccountInfoConfig, RpcProgramAccountsConfig},
    rpc_filter::{Memcmp, RpcFilterType},
};
use solana_sdk::pubkey::Pubkey;

#[tokio::main]
async fn main() -> Result<()> {
    let rpc = rpc();
    // $LIST is the allowlist address create-the-mint printed. Layout:
    // discriminator (1), authority (32), seed (32), mode (1).
    let list = env("LIST")?;
    let data = rpc.get_account_data(&list).await?;
    let modes = ["Allow", "Unused", "Block"];
    println!("List: {list}");
    println!("Mode: {}", modes[data[65] as usize]);
    println!("Authority: {}", Pubkey::try_from(&data[1..33])?);

    // Every approved wallet is its own 65-byte entry account: discriminator
    // (1), wallet (32), list (32). Membership is read by filtering on the list.
    let entries = rpc
        .get_program_ui_accounts_with_config(
            &acl::GATE,
            RpcProgramAccountsConfig {
                filters: Some(vec![
                    RpcFilterType::DataSize(65),
                    RpcFilterType::Memcmp(Memcmp::new_raw_bytes(33, list.to_bytes().to_vec())),
                ]),
                account_config: RpcAccountInfoConfig {
                    encoding: Some(UiAccountEncoding::Base64),
                    ..Default::default()
                },
                ..Default::default()
            },
        )
        .await?;
    let mut wallets = Vec::new();
    for (_, account) in &entries {
        let data = account.data.decode().ok_or_else(|| anyhow!("bad entry"))?;
        wallets.push(Pubkey::try_from(&data[1..33])?.to_string());
    }
    println!("Wallets: {wallets:?}");
    Ok(())
}
// #endregion fetch-list
