// #region bip39
use anyhow::Result;
// https://crates.io/crates/tiny-bip39
use bip39::{Language, Mnemonic, Seed};
use solana_sdk::{signature::keypair_from_seed, signer::Signer};

fn main() -> Result<()> {
    let phrase = "pill tomorrow foster begin walnut borrow virtual kick shift mutual shoe scatter";
    let mnemonic = Mnemonic::from_phrase(phrase, Language::English)?;

    let seed = Seed::new(&mnemonic, "");
    let keypair = keypair_from_seed(seed.as_bytes()).unwrap();

    println!("recovered address {:?}", keypair.pubkey());

    Ok(())
}
// #endregion bip39
