// #region create
use solana_sdk::{signature::Keypair, signer::Signer};

fn main() {
    let keypair = Keypair::new();
    let address = keypair.pubkey();

    println!("address: {address}")
}
// #endregion create
