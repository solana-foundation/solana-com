---
name: wallet-filter-research
description:
  Research Solana wallet products discovered through The Grid, verify public
  wallet functionality, and update the canonical wallet data in
  packages/ecosystem-data. Use when asked to refresh wallet filters, add new
  wallets, audit wallet features, remove stale filter claims, add newly
  supported functionality, reconcile The Grid wallet products with local Solana
  ecosystem records, or change the Solana.com wallet finder page at
  apps/web/src/app/[locale]/wallets/page.tsx and its wallet directory
  data-loading or UI integration.
---

# Wallet Filter Research

Use this skill to keep the Solana.com wallet finder accurate. The live page at
`apps/web/src/app/[locale]/wallets/page.tsx` uses The Grid for wallet URL
discovery and `@workspace/ecosystem-data` for canonical wallet data, company
identity, logos, icons, and wallet-specific filter functionality.

All wallet directory source data now lives in `packages/ecosystem-data`.
`apps/web` should not own wallet records, wallet icon assets, aliases, filter
claims, default wallet images, or researched wallet copy.

## Covered Runtime Surface

- Page entrypoint: `apps/web/src/app/[locale]/wallets/page.tsx`.
- Server data integration: `apps/web/src/lib/wallets/get-wallet-directory.ts`.
- Directory UI: `apps/web/src/components/wallets/WalletDirectory.tsx` and its
  styles.
- Legacy app compatibility imports:
  `apps/web/src/data/wallets/wallet-directory.ts`.
- Canonical wallet records, taxonomy, aliases, icon exports, and runtime wallet
  types: `packages/ecosystem-data/src/wallets`.

Edit `apps/web` wallet files only for route, metadata, rendering, query-state,
attribution, The Grid fetch/merge behavior, or other runtime integration
changes. Put wallet products, filters, researched descriptions, aliases, default
assets, and icon source-of-truth changes in `packages/ecosystem-data`.

## Source Of Truth

- Candidate discovery: The Grid GraphQL API at
  `https://beta.node.thegrid.id/graphql`.
- Package root for all wallet data and assets: `packages/ecosystem-data`.
- Company identity and logos: `packages/ecosystem-data/src/companies` and
  `packages/ecosystem-data/assets/companies`.
- Wallet records, aliases, filter taxonomy, default wallet icon export, and
  runtime-facing wallet types: `packages/ecosystem-data/src/wallets`.
- Wallet icon assets: `packages/ecosystem-data/assets/wallets/icons/*.webp`.
- Default wallet icon:
  `packages/ecosystem-data/assets/wallets/wallet-placeholder-icon.webp`.
- Legacy app compatibility imports:
  `apps/web/src/data/wallets/wallet-directory.ts` re-exports package wallet
  directory data for older app imports only. Do not add wallet source data to
  `apps/web/src/data/wallets`.
- UI labels and filter definitions: `packages/ecosystem-data/src/wallets`.

Always preserve visible attribution requirements on the site: link to
`https://thegrid.id/` with the text `Powered by The Grid`.

## Workflow

1. Run candidate discovery:
   ```bash
   node skills/wallet-filter-research/scripts/fetch_grid_wallets.mjs
   ```
2. If the request touches the `/wallets` page experience, inspect
   `apps/web/src/app/[locale]/wallets/page.tsx`,
   `apps/web/src/lib/wallets/get-wallet-directory.ts`, and
   `apps/web/src/components/wallets/WalletDirectory.tsx` together before
   deciding whether the change belongs in `apps/web` or
   `packages/ecosystem-data`.
3. Identify new, renamed, or changed wallet products by comparing Grid product
   names/root slugs with `curatedWalletOverrides`, `WALLET_OVERRIDE_ALIASES`,
   and `WALLET_COMPANY_ALIASES`.
4. When the request is a full refresh, audit every wallet currently surfaced by
   The Grid plus every local curated override/fallback wallet, not just products
   that are new or renamed.
5. For each wallet requiring research, use current public primary sources first:
   official product pages, documentation, app store listings, GitHub
   organizations, support pages, and announcement posts from the wallet team.
6. For each audited wallet, check every applicable filter in
   `references/filter-taxonomy.md`: category, platforms, and every feature. Do
   not only look for newly added features.
7. For each audited wallet, verify all wallet data fields in
   `packages/ecosystem-data/src/wallets/wallet-data.ts` or the explicit
   overrides in `packages/ecosystem-data/src/wallets/index.ts`: name, canonical
   name, description, website, category, platforms, features, `lastVerified`,
   aliases, and icon.
8. Remove any existing true feature/platform/category claim that cannot be
   re-verified from current primary-source evidence. If evidence is unclear,
   leave the filter false/absent.
9. Add new feature/platform/category values only when a primary source
   explicitly supports them.
10. Update `lastVerified` to the research date only for overrides whose filters
    were reviewed end-to-end.
11. Update wallet records, icon imports, aliases, and filter tags in
    `packages/ecosystem-data/src/wallets`. Do not derive wallet feature,
    category, platform, description, or logo claims from The Grid at runtime.
12. Add or adjust `WALLET_COMPANY_ALIASES` only when a Grid product maps cleanly
    to an existing `packages/ecosystem-data/src/companies` company slug.
13. Add or adjust `WALLET_OVERRIDE_ALIASES` when Grid naming differs from the
    curated wallet name.
14. If a wallet has no local company record but should use canonical Solana
    branding assets, add it to `packages/ecosystem-data` following that
    package's README and audit command.
15. Run targeted validation:

```bash
pnpm --filter solana-com check-types
pnpm --filter solana-com lint
pnpm --filter @workspace/ecosystem-data check-types
pnpm --filter @workspace/ecosystem-data lint
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
- Wallet icons are part of the wallet data set. For every wallet record, either
  import a verified wallet icon from
  `packages/ecosystem-data/assets/wallets/icons/*.webp`, reuse a verified
  canonical company mark/logo through `WALLET_COMPANY_ALIASES`, or intentionally
  rely on `DEFAULT_WALLET_ICON_URL` only when no reliable icon can be verified.
- Store wallet icon assets as WebP. If a source asset is PNG/JPG/JPEG, convert
  it with `magick` before committing, for example:
  `magick input.png -quality 90 packages/ecosystem-data/assets/wallets/icons/<wallet-slug>.webp`.
- Do not leave PNG/JPG/JPEG wallet icons in
  `packages/ecosystem-data/assets/wallets`.
- Prefer official product, brand, repository, or app-store artwork for wallet
  icons. Do not use third-party scraped logos when an official source is
  available.
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
- wallet icons added, replaced, converted, or intentionally left on the default
  icon
- sources used for non-obvious feature claims
- validation commands run
