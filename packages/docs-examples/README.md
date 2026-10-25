# @workspace/docs-examples

Source of truth for the Kit, web3.js v3, and web3.js (legacy) code snippets
shown on [solana.com cookbook pages](../../apps/docs/content/cookbook). Every
file under `cookbook/` is real, runnable, and exercised against a local
[surfpool](https://github.com/solana-foundation/surfpool) instance on every PR —
so SDK renames or signature changes turn into red CI runs instead of rotted
documentation.

Docs pages never read these files directly. Instead, `blocks.json` files next to
the code declare **blocks** (one or more flavour tabs, each a `#region` slice),
and `pnpm --filter @workspace/docs-tooling examples:build` turns them, plus the
recorded `.output.txt` files, into committed snippets under
`apps/docs/content/snippets/examples/<dir>/<block>.mdx`. Pages import them:

```mdx
import SendSolTransfer from "/snippets/examples/cookbook/transactions/send-sol/transfer.mdx";

<SendSolTransfer />
```

CI fails when a snippet is stale (`examples:build --check`).

## Adding a snippet

1. Drop a runnable file under `cookbook/<section>/<page>/<flavour>.ts` (or
   `paths/<tab>/<path>/`), wrap the part you want rendered in
   `// #region <name>` / `// #endregion <name>` (Python: `# #region`).
2. Add a sibling `*.test.ts`. For examples with output, use `runExample()` from
   `test/record.ts`: it captures what the example prints, checks every logged
   signature on the local RPC (lines matching `failedLabel` must have FAILED),
   and records or shape-checks `<file>.output.txt`.
3. Record the output against Surfpool:
   `RECORD_OUTPUT=1 pnpm --filter @workspace/docs-examples exec vitest run <dir>`.
4. Declare the block in `<dir>/blocks.json`:

   ```json
   {
     "transfer": {
       "runnable": true,
       "tabs": [
         {
           "title": "Kit",
           "lang": "ts",
           "file": "kit.ts",
           "region": "transfer"
         },
         {
           "title": "Legacy",
           "lang": "ts",
           "file": "legacy.ts",
           "region": "transfer",
           "highlight": "24-30"
         }
       ]
     }
   }
   ```

   `runnable: true` shows each tab's recorded output (lookup: `output`, then
   `<file>.<region>.output.txt`, then `<file>.output.txt`). A tab without a
   recorded output gets no Run button. Optional: `outputNote` (block or tab),
   `runner` (browser runner in
   `apps/docs/public/docs-assets/scripts/run-examples.js`, e.g.
   `generate-keypair`).

5. Run `pnpm --filter @workspace/docs-tooling examples:build` and import the
   snippet from the page.

Without JavaScript the recorded output is visible under the code; with
JavaScript `run-examples.js` hides it behind a Run button.

## Job-path examples (`paths/`)

- `paths/payments/checkout`: USDC payment with an order reference (`pay.ts`),
  server-side verification by signature (`verify-payment.ts`,
  `verify_payment.py`), a Next.js route handler (`route.ts`) and a
  framework-free Node.js server (`server.ts`).
- `paths/payments/paywall-api`: x402-style paid request. `server.ts` answers 402
  with the price, `client.ts` pays with a signed USDC transfer and retries, the
  server verifies, settles and confirms. Hand-rolled on `@solana/kit` (no x402
  packages).
- `paths/assets/issue-asset`: Token-2022 asset with metadata, pausable,
  default-frozen accounts and a permanent delegate; a permitted transfer, a
  transfer to a frozen account that FAILS onchain (`Custom: 17`, fee still
  charged), pause/resume and a permanent-delegate transfer.
- `paths/defi/settle-trade`: a delivery-versus-payment trade of the issue-asset
  token against USDC. `price.ts` reads the live USDC/USD Pyth price feed account
  (cloned from mainnet; the test re-clones it first with `refetchFromMainnet` so
  its age check passes), `trade.ts` creates, funds and settles the trade with
  the Solana Foundation DvP program (cloned from mainnet), including a settle
  that FAILS onchain with `Custom: 4` (`LegNotFunded`) while the cash leg is
  unfunded. `dvp/` is the program's Codama-generated TypeScript client, vendored
  unchanged from `solana-foundation/dvp` at `df9919e` (MIT, excluded from
  oxfmt). The `config.ts`, `create-asset.ts`, `approve-holder.ts` and
  `blocked-transfer.ts` in that folder re-export the issue-asset files, because
  readers run this tutorial in their issue-asset project.

They read `RPC_URL`, `RPC_SUBSCRIPTIONS_URL` and `USDC_MINT` (devnet defaults,
as shown to readers); `vitest.config.ts` points them at the local surfnet, and
`test/global-setup.ts` installs the real devnet USDC mint account from
`test/fixtures/devnet-usdc-mint.json`. The Python test runs only when `$PYTHON`
(default `python3`) can import `solana` and `solders`
(`pip install "solana==0.40.1" solders`).

## Running the suite

```sh
pnpm --filter @workspace/docs-examples test
```

The suite boots its own surfpool through `@solana/surfpool`, so no CLI install
is needed. The instance uses a mainnet datasource so cookbook examples that look
up real accounts (USDC mint, Token Program, Metaplex Token Metadata, etc.)
resolve via lazy account cloning. Tests that don't need network state still run
hermetically against the same instance.

The Rust examples are driven by `scripts/run-rust-examples.sh`, which does need
the `surfpool` CLI on `$PATH`:

```sh
cargo install --git https://github.com/solana-foundation/surfpool --locked surfpool-cli
```
