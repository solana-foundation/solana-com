---
name: wallet-filter-research
description:
  Research Solana wallet products discovered through The Grid, verify public
  wallet functionality, and update the Solana.com wallet directory
  override/filter data. Use when asked to refresh wallet filters, add new
  wallets, audit wallet features, or reconcile The Grid wallet products with
  local Solana ecosystem records.
---

# Wallet Filter Research

Use this skill to keep the Solana.com wallet finder accurate. The live page uses
The Grid for wallet discovery, `@workspace/ecosystem-data` for canonical company
identity/logo data, and Solana-maintained overrides for wallet-specific filter
functionality.

## Source Of Truth

- Candidate discovery: The Grid GraphQL API at
  `https://beta.node.thegrid.id/graphql`.
- Company identity and logos: `packages/ecosystem-data`.
- Wallet feature overrides: `apps/web/src/data/wallets/wallet-directory.ts`.
- Legacy seed data: `apps/web/src/data/wallets/wallet-data.ts`.
- UI labels and filter definitions:
  `apps/web/src/data/wallets/wallet-directory.ts`.

Always preserve visible attribution requirements on the site: link to
`https://thegrid.id/` with the text `Powered by The Grid`.

## Workflow

1. Run candidate discovery:
   ```bash
   node skills/wallet-filter-research/scripts/fetch_grid_wallets.mjs
   ```
2. Identify new, renamed, or changed wallet products by comparing Grid product
   names/root slugs with `curatedWalletOverrides`, `WALLET_OVERRIDE_ALIASES`,
   and `WALLET_COMPANY_ALIASES`.
3. For each wallet requiring research, use public primary sources first:
   official product pages, documentation, app store listings, GitHub
   organizations, support pages, and announcement posts from the wallet team.
4. Update only app-level wallet augmentation in
   `apps/web/src/data/wallets/wallet-directory.ts`. Do not move wallet feature
   booleans into `packages/ecosystem-data`.
5. Add or adjust `WALLET_COMPANY_ALIASES` only when a Grid product maps cleanly
   to an existing `packages/ecosystem-data` company slug.
6. Add or adjust `WALLET_OVERRIDE_ALIASES` when Grid naming differs from the
   curated wallet name.
7. If a wallet has no local company record but should use canonical Solana
   branding assets, add it to `packages/ecosystem-data` following that package's
   README and audit command.
8. Run targeted validation:
   ```bash
   pnpm --filter solana-com check-types
   pnpm --filter solana-com lint
   pnpm --filter @workspace/ecosystem-data check-types
   pnpm --filter @workspace/ecosystem-data audit:data
   ```
   Run the ecosystem-data commands only if that package changed.

## Research Rules

- Use current web research. Wallet capabilities change often.
- Prefer explicit support statements over inference.
- A source saying a wallet supports Solana is not enough to infer staking, Token
  Extensions, Blinks, Solana Pay, MPC, social recovery, or gas abstraction.
- Record conservative values when sources are unclear.
- Do not use Reddit, user reviews, or unsourced aggregator lists as primary
  evidence for feature support.
- Treat The Grid responses as discovery metadata, not final wallet feature
  truth.
- Do not scrape or republish The Grid data outside the Solana.com wallet finder
  experience.

## Filter Taxonomy

Read `references/filter-taxonomy.md` before changing feature mappings or adding
new filter keys.

## Reporting

When finished, summarize:

- wallets added, removed, or renamed
- feature filters changed
- company aliases added
- sources used for non-obvious feature claims
- validation commands run
