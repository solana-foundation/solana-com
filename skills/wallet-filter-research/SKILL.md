---
name: wallet-filter-research
description:
  Research Solana wallet products discovered through The Grid, verify public
  wallet functionality, and update the Solana.com wallet directory
  override/filter data. Use when asked to refresh wallet filters, add new
  wallets, audit wallet features, remove stale filter claims, add newly
  supported functionality, or reconcile The Grid wallet products with local
  Solana ecosystem records.
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
3. When the request is a full refresh, audit every wallet currently surfaced by
   The Grid plus every local curated override/fallback wallet, not just products
   that are new or renamed.
4. For each wallet requiring research, use current public primary sources first:
   official product pages, documentation, app store listings, GitHub
   organizations, support pages, and announcement posts from the wallet team.
5. For each audited wallet, check every applicable filter in
   `references/filter-taxonomy.md`: category, platforms, and every feature. Do
   not only look for newly added features.
6. Remove any existing true feature/platform/category claim that cannot be
   re-verified from current primary-source evidence. If evidence is unclear,
   leave the filter false/absent.
7. Add new feature/platform/category values only when a primary source
   explicitly supports them.
8. Update `lastVerified` to the research date only for overrides whose filters
   were reviewed end-to-end.
9. Update only app-level wallet augmentation in
   `apps/web/src/data/wallets/wallet-directory.ts`. Do not move wallet feature
   booleans into `packages/ecosystem-data`.
10. Add or adjust `WALLET_COMPANY_ALIASES` only when a Grid product maps cleanly
    to an existing `packages/ecosystem-data` company slug.
11. Add or adjust `WALLET_OVERRIDE_ALIASES` when Grid naming differs from the
    curated wallet name.
12. If a wallet has no local company record but should use canonical Solana
    branding assets, add it to `packages/ecosystem-data` following that
    package's README and audit command.
13. Run targeted validation:

```bash
pnpm --filter solana-com check-types
pnpm --filter solana-com lint
pnpm --filter @workspace/ecosystem-data check-types
pnpm --filter @workspace/ecosystem-data audit:data
```

If a workspace does not define `check-types`, run its TypeScript compiler
directly, for example `pnpm --filter solana-com exec tsc --noEmit`. Run the
ecosystem-data commands only if that package changed.

## Research Rules

- Use current web research for every audited filter. Wallet capabilities change
  often, so do not rely on previous local values without re-verifying them.
- Prefer explicit support statements over inference.
- A source saying a wallet supports Solana is not enough to infer staking, Token
  Extensions, Blinks, Solana Pay, MPC, social recovery, or gas abstraction.
- Record conservative values when sources are unclear.
- Verify official platform availability through product pages or official app
  store / browser extension listings.
- Verify open source through the wallet team's official GitHub/GitLab, package,
  docs, or product page. A public SDK is not enough for `open_source` unless it
  is the relevant wallet app, wallet protocol, or wallet infrastructure code.
- Verify payments filters separately: stablecoin support is not enough to infer
  Solana Pay, buy crypto, sell crypto, card spend, remittance, or checkout
  functionality.
- Verify custody filters separately. Passkeys, MPC, social login, and cloud
  backup can be custodial, non-custodial, or hybrid depending on the product.
- For infrastructure wallets, distinguish `mpc`, `private_key_infrastructure`,
  `spending_limits`, `social_recovery`, and `gas_abstraction`; do not mark all
  infrastructure features true by default.
- For hardware products, distinguish the physical device/platform from software
  companion apps. Merge only when the directory intentionally represents the
  product family.
- Do not use app store user reviews, Reddit, unrelated third-party blogs, or
  unsourced aggregator lists as primary evidence for feature support.
- Treat The Grid responses as discovery metadata, not final wallet feature
  truth.
- Do not scrape or republish The Grid data outside the Solana.com wallet finder
  experience.
- Before editing, keep a short evidence matrix in notes for non-obvious changes:
  wallet, source URL, filter claim, old value, new value, and rationale.

## Filter Taxonomy

Read `references/filter-taxonomy.md` before changing feature mappings or adding
new filter keys.

## Reporting

When finished, summarize:

- wallets added, removed, or renamed
- stale or unsupported filters removed
- feature filters changed
- platform/category filters changed
- company aliases added
- sources used for non-obvious feature claims
- validation commands run
