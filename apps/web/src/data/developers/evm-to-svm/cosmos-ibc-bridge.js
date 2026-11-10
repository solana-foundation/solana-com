// Header button labels are in the catalog (`navHeading.buttons`), index-aligned.
export const NAV_BUTTON_URLS = [
  "/developers/migrate-to-solana/cosmos/app-chain",
  "/developers/migrate-to-solana/cosmos/app-chain/halt-and-claim",
];

// Prose lives in the i18n catalog (`sections.<id>.prose`); each "prose"
// entry consumes the next catalog string, code blocks stay here untranslated.
export const RUNBOOK_SECTIONS = [
  {
    id: "when-to-use",
    blocks: ["prose"],
  },
  {
    id: "architecture",
    blocks: ["prose"],
  },
  {
    id: "solana-programs",
    blocks: [
      "prose",
      {
        language: "rust",
        code: `// Sketch of the mint instruction, modeled on Akash's AKT program. Account
// types and helpers such as trusted_root and verify_membership are yours.
pub fn mint_transfer(
    ctx: Context&lt;MintTransfer&gt;,
    transfer_id: TransferId,
    recipient: Pubkey,
    amount: u64,
) -&gt; Result&lt;()&gt; {
    let bridge = &amp;mut ctx.accounts.bridge;
    require!(bridge.enabled &amp;&amp; !bridge.paused, BridgeError::Disabled);

    // Pinned client for the expected chain ID, not frozen, and its consensus
    // state at the proof height still inside the trusting period.
    let root = ctx.accounts.light_client.trusted_root(
        &amp;bridge.chain_id,
        ctx.accounts.proof_buffer.height,
    )?;

    // Prove the escrow module stored this exact transfer record.
    verify_membership(&amp;ctx.accounts.proof_buffer, &amp;transfer_id, &amp;recipient, amount, &amp;root)?;

    require!(amount &lt;= bridge.per_transfer_max, BridgeError::OverTransferLimit);
    bridge.add_to_daily_minted(amount, Clock::get()?.unix_timestamp)?; // errors above daily_mint_cap

    // The status account is created with init from the transfer ID, so a second mint
    // or void for the same transfer fails before this handler runs.
    let status = &amp;mut ctx.accounts.status;
    if !is_valid_recipient(&amp;recipient) {
        status.outcome = Outcome::Voided; // the Cosmos side can refund it
        return Ok(());
    }

    token::mint_to(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            token::MintTo {
                mint: ctx.accounts.mint.to_account_info(),
                to: ctx.accounts.recipient_token_account.to_account_info(),
                authority: ctx.accounts.mint_authority.to_account_info(),
            },
            &amp;[&amp;[b"mint_authority", &amp;[ctx.bumps.mint_authority]]],
        ),
        amount,
    )?;
    status.outcome = Outcome::Minted;
    Ok(())
}`,
      },
      "prose",
    ],
  },
  {
    id: "cosmos-module",
    blocks: ["prose"],
  },
  {
    id: "operators",
    blocks: ["prose"],
  },
  {
    id: "authorities",
    blocks: ["prose"],
  },
  {
    id: "design-limits",
    blocks: ["prose"],
  },
  {
    id: "case-study-akash",
    blocks: ["prose"],
  },
  {
    id: "launch-checklist",
    blocks: ["prose"],
  },
];

// Card copy is in the catalog (`resourceCards`), index-aligned.
export const RESOURCE_CARD_URLS = [
  "https://github.com/akash-network/node/tree/main/contracts/solana",
  "https://github.com/lfdt-ibc/ibc-contracts/tree/main/ibc-solana",
  "https://squads.xyz",
];
