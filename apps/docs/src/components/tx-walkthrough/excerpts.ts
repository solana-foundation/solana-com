/**
 * Code shown in the transaction walkthrough. Every excerpt is copied from the
 * file and lines it cites, with `// …` where lines are left out, and
 * tx-walkthrough.test.tsx checks each one against its source so the page
 * cannot drift:
 * - "repo": tested example code in this repository (packages/docs-examples),
 *   linked to the docs page that shows it;
 * - "github": the DvP program (solana-foundation/dvp) at the commit the DvP
 *   docs are written against, linked to the exact lines on GitHub.
 * Lines are 1-based and inclusive; the excerpt is dedented by the common
 * indent of the cited lines.
 */

export const DVP_REPO = "solana-foundation/dvp";
export const DVP_COMMIT = "df9919ed02c25a93620e7f6820107c9050ce3b92";

export type ExcerptSource =
  | {
      kind: "repo";
      /** Path from the repository root. */
      path: string;
      /** The docs page that shows this file. */
      href: string;
      /** That page's name. */
      page: string;
    }
  | { kind: "github"; path: string };

export interface Excerpt {
  id: string;
  lang: "ts" | "rust";
  /** File name shown above the code. */
  file: string;
  source: ExcerptSource;
  /** Cited line ranges, in order; `// …` separates them in `code`. */
  ranges: [number, number][];
  code: string;
}

/** The elision marker between ranges. */
export const ELISION = "// …";

export function githubUrl(path: string, ranges: [number, number][]) {
  const first = ranges[0][0];
  const last = ranges[ranges.length - 1][1];
  return `https://github.com/${DVP_REPO}/blob/${DVP_COMMIT}/${path}#L${first}-L${last}`;
}

/** "L231-250" or "L90-238" (first to last cited line). */
export function lineLabel(ranges: [number, number][]) {
  const first = ranges[0][0];
  const last = ranges[ranges.length - 1][1];
  return first === last ? `L${first}` : `L${first}–${last}`;
}

export const EXCERPTS: Record<string, Excerpt> = {
  build: {
    id: "build",
    lang: "ts",
    file: "trade.ts",
    source: {
      kind: "repo",
      path: "packages/docs-examples/paths/defi/settle-trade/trade.ts",
      href: "/developers/docs/defi/settle-trade/local",
      page: "Settle a trade",
    },
    ranges: [[231, 250]],
    code: `
const signature = await send(
  agent,
  [
    ...createAccounts,
    getSettleDvpInstruction({
      settlementAuthority: agent,
      swapDvp: trade.record,
      mintA: trade.asset,
      mintB: USDC_MINT,
      dvpAtaA: trade.escrowA,
      dvpAtaB: trade.escrowB,
      ...ata,
      tokenProgramA: T22,
      tokenProgramB: T,
      memoProgram: MEMO_PROGRAM_ADDRESS,
      legAExtrasCount: 0, // no transfer hooks on either mint
    }),
  ],
  options,
);
`.slice(1, -1),
  },
  message: {
    id: "message",
    lang: "ts",
    file: "config.ts",
    source: {
      kind: "repo",
      path: "packages/docs-examples/paths/assets/issue-asset/config.ts",
      href: "/developers/docs/assets/issue-asset/local",
      page: "Issue an asset",
    },
    ranges: [[36, 42]],
    code: `
const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();
const message = pipe(
  createTransactionMessage({ version: 0 }),
  (m) => setTransactionMessageFeePayerSigner(feePayer, m),
  (m) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, m),
  (m) => appendTransactionMessageInstructions(instructions, m),
);
`.slice(1, -1),
  },
  sign: {
    id: "sign",
    lang: "ts",
    file: "config.ts",
    source: {
      kind: "repo",
      path: "packages/docs-examples/paths/assets/issue-asset/config.ts",
      href: "/developers/docs/assets/issue-asset/local",
      page: "Issue an asset",
    },
    ranges: [[43, 45]],
    code: `
const transaction = await signTransactionMessageWithSigners(message);
assertIsTransactionWithBlockhashLifetime(transaction);
const signature = getSignatureFromTransaction(transaction);
`.slice(1, -1),
  },
  send: {
    id: "send",
    lang: "ts",
    file: "config.ts",
    source: {
      kind: "repo",
      path: "packages/docs-examples/paths/assets/issue-asset/config.ts",
      href: "/developers/docs/assets/issue-asset/local",
      page: "Issue an asset",
    },
    ranges: [[47, 50]],
    code: 'await sendAndConfirmTransaction(transaction, {\n  commitment: "confirmed",\n  skipPreflight: options.skipPreflight,\n});',
  },
  checks: {
    id: "checks",
    lang: "rust",
    file: "settle_dvp.rs",
    source: { kind: "github", path: "program/src/processor/settle_dvp.rs" },
    ranges: [
      [90, 101],
      [142, 143],
      [222, 231],
      [236, 238],
    ],
    code: `
verify_signer(settlement_authority_info, true)?;
verify_account_owner(swap_dvp_info, program_id)?;

let dvp = {
    let data = swap_dvp_info.try_borrow()?;
    SwapDvp::try_from_bytes(&data)?
};

require!(
    settlement_authority_info.address() == &dvp.settlement_authority,
    DvpSwapProgramError::SettlementAuthorityMismatch
);
// …
let now = Clock::get()?.unix_timestamp;
require!(now <= dvp.expiry_timestamp, DvpSwapProgramError::DvpExpired);
// …
let escrow_a_balance = get_token_account_balance(dvp_ata_a_info)?;
require!(
    escrow_a_balance >= dvp.amount_a,
    DvpSwapProgramError::LegNotFunded
);
let escrow_b_balance = get_token_account_balance(dvp_ata_b_info)?;
require!(
    escrow_b_balance >= dvp.amount_b,
    DvpSwapProgramError::LegNotFunded
);
// …
let (nonce_bytes, bump_bytes) = dvp.seed_buffers();
let swap_dvp_seeds = dvp.signing_seeds(&nonce_bytes, &bump_bytes);
let signer_seeds = [Signer::from(&swap_dvp_seeds)];
`.slice(1, -1),
  },
  seeds: {
    id: "seeds",
    lang: "rust",
    file: "swap_dvp.rs",
    source: { kind: "github", path: "program/src/state/swap_dvp.rs" },
    ranges: [[89, 105]],
    code: `
/// PDA seed array (with bump) for signing CPIs as the SwapDvp authority.
pub fn signing_seeds<'a>(
    &'a self,
    nonce_bytes: &'a [u8; 8],
    bump_bytes: &'a [u8; 1],
) -> [Seed<'a>; 8] {
    [
        Seed::from(SWAP_DVP_SEED),
        Seed::from(self.settlement_authority.as_ref()),
        Seed::from(self.user_a.as_ref()),
        Seed::from(self.user_b.as_ref()),
        Seed::from(self.mint_a.as_ref()),
        Seed::from(self.mint_b.as_ref()),
        Seed::from(nonce_bytes),
        Seed::from(bump_bytes),
    ]
}
`.slice(1, -1),
  },
  cpi: {
    id: "cpi",
    lang: "rust",
    file: "settle_dvp.rs",
    source: { kind: "github", path: "program/src/processor/settle_dvp.rs" },
    ranges: [[240, 253]],
    code: `
// Cash to seller, then asset to buyer. Order is irrelevant for
// correctness (the whole tx is atomic); spec lists cash first.
transfer_checked_cpi(
    dvp_ata_b_info,
    mint_b_info,
    user_a_destination_ata_b_info,
    swap_dvp_info,
    dvp.amount_b,
    decimals_b,
    token_program_b_info.address(),
    memo_program_info,
    leg_b_extras,
    &signer_seeds,
)?;
`.slice(1, -1),
  },
  invoke: {
    id: "invoke",
    lang: "rust",
    file: "token_utils.rs",
    source: {
      kind: "github",
      path: "program/src/processor/shared/token_utils.rs",
    },
    ranges: [
      [459, 468],
      [483, 487],
    ],
    code: `
let mut data = [0u8; 10];
data[0] = TRANSFER_CHECKED_DISCRIMINATOR;
data[1..9].copy_from_slice(&amount.to_le_bytes());
data[9] = decimals;

let instruction = InstructionView {
    program_id: token_program,
    accounts: metas_slice,
    data: &data,
};
// …
invoke_signed_with_bounds::<MAX_TRANSFER_CHECKED_ACCOUNTS>(
    &instruction,
    &infos[..total],
    signers,
)
`.slice(1, -1),
  },
  result: {
    id: "result",
    lang: "ts",
    file: "config.ts",
    source: {
      kind: "repo",
      path: "packages/docs-examples/paths/assets/issue-asset/config.ts",
      href: "/developers/docs/assets/issue-asset/local",
      page: "Issue an asset",
    },
    ranges: [[63, 72]],
    code: 'export async function fee(signature: Signature) {\n  const tx = await rpc\n    .getTransaction(signature, {\n      commitment: "confirmed",\n      encoding: "json",\n      maxSupportedTransactionVersion: 0,\n    })\n    .send();\n  return tx?.meta?.fee ?? 0n;\n}',
  },
};
