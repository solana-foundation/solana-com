---
name: wallet-filter-research
description:
  Discover, verify, and maintain Solana wallet products using the canonical
  local registry in packages/ecosystem-data and current web research. Use when
  asked to refresh wallet data, find new Solana wallets, add or remove wallets,
  audit wallet features or platforms, correct stale claims, reconcile wallet
  aliases or company mappings, update wallet icons, or change the Solana.com
  wallet directory data-loading or UI integration.
---

# Wallet Filter Research

Maintain the Solana.com wallet directory as a local, maintained dataset. Treat
`packages/ecosystem-data/src/wallets/wallet-data.ts` as the canonical publishing
registry.

Follow three rules:

1. Start every audit from the local registry.
2. Use any useful discovery source: search engines, official sites, directories,
   aggregators, community discussions, app stores, repositories, and existing
   datasets can all provide leads or help expose gaps.
3. Weigh evidence by source quality. Verify important or non-obvious published
   claims against official sources when available, and never treat a single
   third-party source as automatic truth.

## 1. Build the local research queue

List all canonical wallet records:

```bash
pnpm --filter @workspace/ecosystem-data wallets:research-queue
```

Limit the queue when the request is targeted:

```bash
pnpm --filter @workspace/ecosystem-data wallets:research-queue -- --slug phantom
pnpm --filter @workspace/ecosystem-data wallets:research-queue -- --stale-before 2026-01-01
```

For a full refresh, audit every local record and then run the discovery pass
below. For a targeted request, audit the requested records and research directly
related renames, replacements, or product-family changes.

Do not interpret absence from search results as proof that a local wallet is
inactive. Look for affirmative evidence before removing or marking a product as
discontinued.

## 2. Discover candidates

Run current web searches across each relevant product class:

- consumer and mobile wallets
- browser and desktop wallets
- hardware wallets
- embedded wallets, wallet SDKs, and wallet-as-a-service products
- institutional custody, MPC, multisig, and treasury wallets
- payment, remittance, and stablecoin wallets

Use query families such as:

```text
"Solana wallet" official
"supports Solana" wallet
"Solana" "hardware wallet"
"Solana" "embedded wallet" SDK
"Solana" MPC wallet custody
"Solana" multisig wallet
"Solana" payment wallet USDC
```

Search official distribution surfaces separately where relevant:

- Apple App Store and Google Play
- Chrome Web Store and Firefox Add-ons
- official GitHub or GitLab organizations and repositories
- official product documentation, changelogs, and release announcements

Also consult relevant directories, aggregators, comparison pages, community
lists, social discussions, and public datasets. They are useful for discovery,
cross-checking, terminology, and identifying coverage gaps. Do not bulk-copy
their records or assume their fields are current; follow useful leads to
stronger or corroborating evidence.

Before publishing a candidate, establish the following with reliable evidence:

- a distinct, currently available wallet or wallet-infrastructure product
- explicit Solana support
- an official product or documentation URL
- at least one applicable local category and platform

Prefer official sources. When an official source is unavailable, use multiple
independent references and note the uncertainty. Keep ambiguous candidates in
working notes until the evidence is sufficient instead of forcing a decision.

## 3. Research and verify every field

For an existing record, begin with its local `website`. For a new candidate,
begin with the best URL found during discovery. Research outward through:

- official product, documentation, security, architecture, pricing, and FAQ
  pages
- official app-store and browser-extension listings
- official repositories and package registries
- official support articles, changelogs, blog posts, and announcements
- official brand or media kits for icon assets
- directories, comparison pages, reputable reporting, community discussions, and
  public datasets for discovery and cross-checking

Build a working evidence matrix before editing:

| Wallet | Filter or claim | Product surface | Source URL | Existing value | Verdict | Proposed value | Rationale |
| ------ | --------------- | --------------- | ---------- | -------------- | ------- | -------------- | --------- |

Review every wallet field during the current research pass: `name`, `aliases`,
`companyId`, `category`, `platforms`, `features`, `description`, `website`,
`icon`, and `lastVerified`. Carry values forward when they remain reasonably
supported; focus deeper verification on changed, uncertain, or high-impact
claims.

### Evidence standards

- Prefer explicit support statements over inference, especially for non-obvious
  capabilities and security claims.
- Treat generic Solana support as insufficient evidence for staking, Token
  Extensions, Blinks, Solana Pay, MPC, social recovery, or gas abstraction.
- Verify platforms from product pages, store listings, or corroborating current
  sources.
- Verify custody, recovery, MPC, multisig, and policy controls separately.
- Verify buy and sell flows separately; an on-ramp does not prove an off-ramp.
- Verify open source from the relevant wallet app, protocol, firmware, or SDK
  repository. An unrelated public SDK is insufficient.
- Use conservative values when evidence is unclear: omit the feature or record
  the uncertainty in working notes.
- Use app-store reviews, social posts, Reddit, community forums, and third-party
  pages to find candidates, terminology, reported issues, and conflicting
  claims. Do not use one such source as the sole support for capabilities,
  custody, recovery, or security claims.
- When no official source exists, third-party evidence may support a field if it
  is current, credible, corroborated where practical, and appropriately caveated
  in the working notes.

### Capability-attribution gate

Treat primary-source evidence as necessary but not sufficient. An official page
can describe an adjacent service, a third-party rail, or a restriction rather
than a capability of the wallet record.

Before adding any filter:

1. Identify the actor and product surface that performs the action: the wallet,
   an integrated provider, a companion product, a payment card or network, an
   exchange, or the user outside the product.
2. Restate the evidence using the taxonomy's exact user action. Do not map words
   that merely sound related to the filter.
3. Confirm that users can perform that action through the product surface owned
   by the canonical record. Evidence about a companion product applies only when
   that product is deliberately included in the same record and the taxonomy
   definition covers the action.
4. Distinguish a capability from a constraint. Mandatory ceilings, eligibility
   rules, compliance restrictions, regional availability, and support policies
   do not become features merely because an official source documents them.
5. Mark the filter `unsupported` or `uncertain` when any gate fails; do not add
   it to the registry.

Apply these hard exclusions:

- Add `sell_crypto` only for a direct, user-initiated off-ramp that converts
  crypto to fiat and pays a bank, card, or other fiat account. Crypto debit-card
  spending, point-of-sale conversion, ATM access through a spending card,
  transfers to an external exchange, and crypto-to-crypto swaps do not qualify.
- Add `spending_limits` only when a user, team, or administrator can configure
  or enforce spend controls or transaction policies. Provider-imposed card or
  ATM limits, regulatory or KYC caps, wallet balances, regional restrictions,
  and limits changeable only by support do not qualify.

For an “all filters” audit, include every category, platform, and feature key in
the matrix with a `supported`, `unsupported`, or `uncertain` verdict. Before
finishing, compare the edited feature list and description against rejected
filters and remove wording that would reintroduce or imply a rejected claim.

Read `references/filter-taxonomy.md` before changing category, platform, or
feature mappings. Keep it synchronized with
`packages/ecosystem-data/src/wallets/taxonomy.ts`.

### Names and aliases

- Use the current official product name as `name`.
- Add `aliases` for supported former names, abbreviations, acquisition-era
  names, or normalized variants needed for local reconciliation.
- Treat aliases found in third-party sources as leads. Confirm them through
  official usage or multiple reliable references before publishing.
- Set `companyId` only when the wallet maps cleanly to an existing canonical
  company record.

### Descriptions

- Draft original descriptions from the evidence matrix and existing local copy;
  do not copy source wording.
- Use two to four concrete, verified product facts when available.
- Trace non-obvious or changed claims to a source URL in the working notes.
- Avoid generic marketing language and lists of filter labels.
- Keep narrow descriptions when official materials are vague.

### Icons

- Prefer an official square product/app icon over a wordmark or banner. A
  reputable public asset is an acceptable fallback when its provenance and reuse
  rights are clear.
- Check official media kits, product assets, app stores, browser stores,
  repositories, favicons, and social preview images before choosing.
- Store wallet icons as WebP in `packages/ecosystem-data/assets/wallets/icons/`.
- Reuse a canonical company mark through `companyId` when it accurately
  represents the wallet product.
- Omit `icon` intentionally when no trustworthy product icon is available; the
  app will use `DEFAULT_WALLET_ICON`.

## 4. Reconcile and update the local registry

Update the single record in
`packages/ecosystem-data/src/wallets/wallet-data.ts`. Do not create app-owned
overrides, external-ID maps, or runtime enrichment layers.

For each researched record:

- remove claims that current evidence no longer supports
- add supported category, platform, and feature values
- update `lastVerified` only after an end-to-end review
- merge duplicate products under one stable local slug when they represent the
  same product
- preserve distinct products from the same company when their users,
  capabilities, or custody models differ
- remove a record only when reliable evidence confirms discontinuation,
  replacement, or lack of Solana support

For new records, add a verified local icon or intentionally use the placeholder.
Add a company record only when the identity should be reusable outside the
wallet directory; follow `packages/ecosystem-data/README.md`.

## Data ownership boundaries

`packages/ecosystem-data` owns all wallet source data:

- `src/wallets/wallet-data.ts`: canonical records, aliases, company links, and
  verification dates
- `src/wallets/taxonomy.ts`: categories, platforms, features, labels, and
  descriptions
- `assets/wallets/icons/`: wallet product icons
- `assets/wallets/wallet-placeholder-icon.webp`: default icon
- `src/companies/` and `assets/companies/`: reusable company identity and marks

`apps/web/src/app/[locale]/wallets/` owns only presentation and interpretation:

- `page.tsx`: route entrypoint
- `get-wallet-directory.ts`: local record-to-view-model integration
- `wallet-directory.ts`: view-model types and label helpers
- `WalletDirectory.tsx` and its stylesheet: filtering and rendering

The web app reads package-owned wallet data at runtime; research and enrichment
happen offline before reviewed changes are published to the local registry. The
package must not own React components, query-state, or filtering behavior.

## Validation

Run:

```bash
pnpm --filter @workspace/ecosystem-data wallets:research-queue -- --slug phantom
pnpm --filter @workspace/ecosystem-data check-types
pnpm --filter @workspace/ecosystem-data lint
pnpm --filter @workspace/ecosystem-data audit:data
pnpm --filter solana-com exec tsc --noEmit
pnpm --filter solana-com lint
```

Run the app commands only when wallet integration or UI files changed. If a
workspace command is unavailable, report it and use the closest targeted
equivalent.

## Reporting

Summarize:

- wallets added, removed, renamed, merged, or excluded
- aliases and company mappings changed
- feature, platform, and category changes
- icons added, replaced, or intentionally left on the placeholder
- sources supporting non-obvious claims
- validation commands and results
