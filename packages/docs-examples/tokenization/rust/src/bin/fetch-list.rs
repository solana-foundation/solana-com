// #region fetch-list
use anyhow::{anyhow, Context, Result};
use solana_account_decoder_client_types::UiAccountEncoding;
use solana_client::nonblocking::rpc_client::RpcClient;
use solana_client::{
    rpc_config::{RpcAccountInfoConfig, RpcProgramAccountsConfig},
    rpc_filter::{Memcmp, RpcFilterType},
};
use solana_commitment_config::CommitmentConfig;
use solana_sdk::pubkey::Pubkey;

fn env(name: &str) -> Result<String> {
    std::env::var(name).map_err(|_| anyhow!("export {name} before running this example"))
}

fn pubkey(value: &str) -> Result<Pubkey> {
    value
        .parse()
        .with_context(|| format!("invalid address {value}"))
}

const GATE: Pubkey = Pubkey::from_str_const("GATEzzqxhJnsWF6vHRsgtixxSB8PaQdcqGEVTEHWiULz");

#[tokio::main]
async fn main() -> Result<()> {
    let rpc = RpcClient::new_with_commitment(
        "https://api.devnet.solana.com".to_string(),
        CommitmentConfig::confirmed(),
    );

    // $LIST is the allowlist address printed when the mint was created.
    let list_config = pubkey(&env("LIST")?)?;

    // ListConfig layout: discriminator (1), authority (32), seed (32), mode (1),
    // wallet count (8). Mode 0 is an allowlist, 2 a blocklist.
    let list = rpc.get_account(&list_config).await?;
    let modes = ["allow", "unused", "block"];
    println!("List: {list_config}");
    println!("Mode: {}", modes[list.data[65] as usize]);
    println!("Authority: {}", Pubkey::try_from(&list.data[1..33])?);

    // Every approved wallet is its own 65-byte entry account: discriminator (1),
    // wallet (32), list (32). Membership is read by filtering on the list pointer.
    let entries = rpc
        .get_program_ui_accounts_with_config(
            &GATE,
            RpcProgramAccountsConfig {
                filters: Some(vec![
                    RpcFilterType::DataSize(65),
                    RpcFilterType::Memcmp(Memcmp::new_raw_bytes(
                        33,
                        list_config.to_bytes().to_vec(),
                    )),
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
        let data = account
            .data
            .decode()
            .ok_or_else(|| anyhow!("undecodable entry"))?;
        wallets.push(Pubkey::try_from(&data[1..33])?.to_string());
    }
    if wallets.is_empty() {
        println!("Wallets: none");
    } else {
        println!("Wallets: {wallets:?}");
    }
    Ok(())
}
// #endregion
