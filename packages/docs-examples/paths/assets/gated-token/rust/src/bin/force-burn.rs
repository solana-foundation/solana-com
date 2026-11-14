// #region force-burn
// cargo run --release --bin force-burn -- <wallet> <amount>
use anyhow::Result;
use gated_token::{
    acl, arg, arg_pubkey, ata, env, load_keypair, mint_decimals, rpc, send, to_base_units,
    token_account_state, TOKEN_2022,
};
use solana_sdk::signature::Signer;
use spl_token_2022_interface::{
    extension::permissioned_burn::instruction::burn_checked, state::AccountState,
};

#[tokio::main]
async fn main() -> Result<()> {
    let rpc = rpc();
    let payer = load_keypair("tokenization-demo")?;
    let permanent_delegate = load_keypair("demo-authorities/delegate")?;
    let burn_authority = load_keypair("demo-authorities/burn")?;
    let mint = env("MINT")?;
    let list = env("LIST")?;
    let owner = arg_pubkey(1, "the wallet to burn from")?;
    let account = ata(&mint, &owner);
    let decimals = mint_decimals(&rpc, &mint).await?;

    // Token-2022 does not burn from a frozen account, so a frozen source is
    // thawed through the gate first. That only works while the wallet is listed.
    let mut instructions = Vec::new();
    if token_account_state(&rpc, &account).await? == Some(AccountState::Frozen) {
        instructions.push(acl::thaw_through_gate(
            &payer.pubkey(),
            &mint,
            &account,
            &owner,
            &list,
        ));
    }
    // The permanent delegate signs in place of the holder, and the burn
    // authority co-signs because the mint carries permissioned burn.
    instructions.push(burn_checked(
        &TOKEN_2022,
        &account,
        &mint,
        &burn_authority.pubkey(),
        &permanent_delegate.pubkey(),
        &[],
        to_base_units(&arg(2, "the amount")?, decimals)?,
        decimals,
    )?);
    send(
        &rpc,
        &[&payer, &permanent_delegate, &burn_authority],
        &instructions,
    )
    .await
}
// #endregion force-burn
