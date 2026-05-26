// #region check
use anyhow::Result;
use solana_sdk::pubkey;

fn main() -> Result<()> {
    // on curve address
    let on_curve_public_key = pubkey!("5oNDL3swdJJF1g9DzJiZ4ynHXgszjAEpUkxVYejchzrY");
    println!("is on curve: {}", on_curve_public_key.is_on_curve());

    let off_curve_public_key = pubkey!("4BJXYkfvg37zEmBbsacZjeQDpTNx91KppxFJxRqrz48e");
    println!("is off curve: {}", off_curve_public_key.is_on_curve());
    Ok(())
}
// #endregion check
