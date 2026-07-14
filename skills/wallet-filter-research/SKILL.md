---
name: wallet-filter-research
description:
  Research Solana wallet products discovered through The Grid, verify public
  wallet functionality through independent web research, and update the
  canonical wallet data in packages/ecosystem-data. Use when asked to refresh
  wallet filters, add new wallets, audit wallet features, remove stale filter
  claims, add newly supported functionality, reconcile The Grid wallet products
  with local Solana ecosystem records, or change the Solana.com wallet finder
  page at apps/web/src/app/[locale]/wallets/page.tsx and its wallet directory
  data-loading or UI integration.
---

# Wallet Filter Research

Keep the Solana.com wallet finder accurate. The process has three steps, in
order:

1. **Discover** — pull wallet company names and URLs from The Grid. That is all
   The Grid provides: a candidate list. Nothing else in the wallet data comes
   from The Grid.
2. **Research** — independently research each wallet on the web and populate
   every wallet data field from that research.
3. **Update** — update existing wallet records and add new ones in
   `packages/ecosystem-data` with the correct category, platforms, and feature
   tags based on the research.

## Step 1: Discover candidates from The Grid

Run:

```bash
node skills/wallet-filter-research/scripts/fetch_grid_wallets.mjs
```

This returns live Solana wallet products as `{ companyNames, urls }` pairs.
Compare them against `curatedWalletOverrides`, `WALLET_OVERRIDE_ALIASES`, and
`WALLET_COMPANY_ALIASES` in `packages/ecosystem-data/src/wallets` to identify
new, renamed, or changed wallet products.

The Grid is discovery input only:

- Treat Grid responses as a candidate name/URL list, never as wallet feature,
  category, platform, description, or logo truth.
- Do not fetch, scrape, or merge The Grid data in the Solana.com wallet finder
  runtime experience.
- Preserve the visible The Grid acknowledgement on the live wallet page, because
  the candidate URL list is sourced through The Grid.

When the request is a full refresh, research every wallet surfaced by The Grid
plus every local curated override/fallback wallet — not just products that are
new or renamed.

## Step 2: Research each wallet independently on the web

For each wallet, start from its URL (the canonical website from local data if it
exists, otherwise the Grid-discovered URL after resolving redirects) and
research outward through current public primary sources:

- official product pages, docs, security/architecture pages, pricing, FAQs
- official app store, Chrome Web Store, and Firefox Add-ons listings
- the wallet team's official GitHub/GitLab organizations
- official support articles, changelogs, blog posts, and announcements

Populate **all** wallet data fields from this research — name, canonical name,
description, website, category, platforms, features, aliases, and icon. Do not
carry forward previous local values without re-verifying them; wallet
capabilities change often.

### Evidence rules

- Prefer explicit support statements over inference. A source saying a wallet
  supports Solana is not enough to infer staking, Token Extensions, Blinks,
  Solana Pay, MPC, social recovery, or gas abstraction.
- Record conservative values when sources are unclear: leave the filter
  false/absent.
- Verify platform availability through product pages or official app store /
  browser extension listings.
- Verify open source through the wallet team's official repos, packages, docs,
  or product page. A public SDK is not enough for `open_source` unless it is the
  relevant wallet app, wallet protocol, or wallet infrastructure code.
- Verify payments filters separately: stablecoin support does not imply Solana
  Pay, buy crypto, sell crypto, card spend, remittance, or checkout.
- Verify custody filters separately. Passkeys, MPC, social login, and cloud
  backup can be custodial, non-custodial, or hybrid depending on the product.
- For infrastructure wallets, distinguish `mpc`, `private_key_infrastructure`,
  `spending_limits`, `social_recovery`, and `gas_abstraction`; do not mark all
  infrastructure features true by default.
- For hardware products, distinguish the physical device/platform from software
  companion apps. Merge only when the directory intentionally represents the
  product family.
- Do not use app store user reviews, Reddit, unrelated third-party blogs, or
  unsourced aggregator lists as primary evidence.
- Keep a short evidence matrix in notes for non-obvious changes: wallet, source
  URL, filter claim, old value, new value, and rationale.

### Descriptions

- Ground descriptions in wallet-specific language and concrete facts from
  official sources — usually two to four verified facts, without copying long
  marketing text verbatim.
- Do not stitch filter labels together ("self-custody", "multi-chain", "NFTs",
  "dApp access") into a description.
- Avoid generic filler ("secure", "seamless", "easy", "powerful", "manage your
  crypto", "access web3") unless the surrounding sentence contains concrete
  verified product detail.
- If official copy is vague, keep the description narrow and factual rather than
  inventing specificity, and note the source limitation.

### Icons

- Icons are part of the wallet data set. For every record, either import a
  verified icon from `packages/ecosystem-data/assets/wallets/icons/*.webp`,
  reuse a verified canonical company mark via `WALLET_COMPANY_ALIASES`, or
  intentionally fall back to `DEFAULT_WALLET_ICON_URL` when no reliable icon can
  be verified.
- During web research, pull every image version available for each wallet from
  official sources: favicon and apple-touch icons, app icons from App Store /
  Google Play / Chrome Web Store / Firefox Add-ons listings, Open Graph and
  Twitter card images, brand/media-kit assets, GitHub organization and
  repository avatars, and light/dark logo variants. Collect them all before
  choosing.
- From the collected versions, choose the highest-resolution official wallet
  product icon (square app-icon style preferred over wordmarks or OG banners) as
  the stored icon. Note in research notes which versions were found and which
  was chosen.
- Prefer official product, brand, repository, or app-store artwork. Do not use
  third-party scraped logos when an official source is available.
- Store icons as WebP. Convert PNG/JPG/JPEG sources with `magick`, e.g.
  `magick input.png -quality 90 packages/ecosystem-data/assets/wallets/icons/<wallet-slug>.webp`.
  Do not leave PNG/JPG/JPEG icons in `packages/ecosystem-data/assets/wallets`.

## Step 3: Update and add wallet records

Read `references/filter-taxonomy.md` before changing feature mappings or adding
new filter keys. Then, for each researched wallet:

- Check every applicable filter in the taxonomy — category, platforms, and every
  feature — not only newly added features.
- Update or add the record in
  `packages/ecosystem-data/src/wallets/wallet-data.ts` or the explicit overrides
  in `packages/ecosystem-data/src/wallets/index.ts`: name, canonical name,
  description, website, category, platforms, features, `lastVerified`, aliases,
  and icon.
- Remove any existing true feature/platform/category claim that cannot be
  re-verified from current primary-source evidence.
- Add new feature/platform/category values only when a primary source explicitly
  supports them.
- Update `lastVerified` to the research date only for wallets whose filters were
  reviewed end-to-end.
- Add or adjust `WALLET_COMPANY_ALIASES` only when a Grid product maps cleanly
  to an existing `packages/ecosystem-data/src/companies` company slug.
- Add or adjust `WALLET_OVERRIDE_ALIASES` when Grid naming differs from the
  curated wallet name.
- If a wallet has no local company record but should use canonical Solana
  branding assets, add it to `packages/ecosystem-data` following that package's
  README and audit command.

### Where the data lives

All wallet directory source data lives in `packages/ecosystem-data`:

- Wallet records, aliases, filter taxonomy, default icon export, and
  runtime-facing wallet types: `packages/ecosystem-data/src/wallets`.
- Wallet icon assets: `packages/ecosystem-data/assets/wallets/icons/*.webp`;
  default icon:
  `packages/ecosystem-data/assets/wallets/wallet-placeholder-icon.webp`.
- Company identity and logos: `packages/ecosystem-data/src/companies` and
  `packages/ecosystem-data/assets/companies`.

`apps/web` must not own wallet records, icon assets, aliases, filter claims, or
researched copy. Edit `apps/web` wallet files only for route, metadata,
rendering, query-state, or package data-loading integration changes:

- Page entrypoint: `apps/web/src/app/[locale]/wallets/page.tsx`.
- Server data integration: `apps/web/src/lib/wallets/get-wallet-directory.ts`.
- Directory UI: `apps/web/src/components/wallets/WalletDirectory.tsx` and its
  styles.
- Legacy compatibility re-export only (no source data):
  `apps/web/src/data/wallets/wallet-directory.ts`.

If the request touches the `/wallets` page experience, inspect those files
together before deciding whether the change belongs in `apps/web` or
`packages/ecosystem-data`.

### Validation

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
