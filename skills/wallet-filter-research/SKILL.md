---
name: wallet-filter-research
description:
  Discover, verify, security-screen, and maintain Solana wallet products using
  the canonical local registry in packages/ecosystem-data and current web
  research. Use when asked to refresh wallet data, find new Solana wallets, add
  or remove wallets, check wallets for scam or security concerns, audit wallet
  features or platforms, correct stale claims, reconcile wallet aliases or
  company mappings, update wallet icons, or change the Solana.com wallet
  directory data-loading or UI integration.
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
- Add `card_spending` only for an integrated physical or virtual credit, debit,
  or prepaid payment card that spends the wallet or account balance at card-
  network merchants. Buying crypto with an external card, cashing out to an
  external card, gift cards, hardware signing cards, and a separate company or
  exchange card outside the canonical product surface do not qualify.
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

- Complete an icon-sourcing pass before publishing every new wallet record. A
  new record is not complete merely because the placeholder renders correctly.
- Prefer an official square product/app icon over a wordmark or banner. A
  reputable public asset is an acceptable fallback when its provenance and reuse
  rights are clear.
- Check official media kits, product assets, app stores, browser stores,
  repositories, favicons, and social preview images before choosing.
- Store wallet icons as WebP in `packages/ecosystem-data/assets/wallets/icons/`.
- Reuse a canonical company mark through `companyId` when it accurately
  represents the wallet product.
- Omit `icon` only after checking the official media kit, product site,
  distribution listings, repositories, and canonical company assets. Record the
  sources checked and why no trustworthy mark was available; the app will then
  use `DEFAULT_WALLET_ICON` intentionally.

## 4. Perform the security and scam check

Run this check for every new candidate before publishing it, for every wallet in
a full refresh, and whenever a targeted request raises trust or security
concerns. Complete it before editing the registry.

### Confirm the product identity

1. Match the official domain, legal entity, app-store developer, extension
   publisher, repository organization, and social accounts where available.
2. Follow store and download links from the official product site. Treat a
   similarly named app, token, website, or social account as a separate subject
   until the identity is proven.
3. Look for official warnings about fake apps, support accounts, airdrops,
   migrations, recovery services, and seed-phrase requests.
4. Record name collisions and impersonation campaigns without attributing them
   to the official wallet.

### Search for adverse evidence

Search the product name, domain, legal entity, former names, and publisher with
query families such as:

```text
"<wallet>" scam OR fraud OR phishing OR malware
"<wallet>" hacked OR exploit OR breach OR drained
"<wallet>" vulnerability OR audit OR incident OR disclosure
"<wallet>" regulator OR warning OR enforcement OR lawsuit
"<wallet>" frozen funds OR unauthorized transaction OR withdrawal
site:reddit.com "<wallet>" scam OR hacked OR drained
site:x.com "<wallet>" scam OR phishing OR hacked
site:apps.apple.com "<wallet>"
site:play.google.com "<wallet>"
site:chromewebstore.google.com "<wallet>"
```

Use current web search and inspect, when applicable:

- regulator, law-enforcement, court, sanctions, and consumer-warning records
- official security disclosures, status pages, incident reports, support
  notices, terms, custody disclosures, and privacy policies
- reputable security research, vulnerability databases, and technical
  postmortems
- app-store publisher details, update history, ratings, and written reviews
- reputable reporting and corroborated industry coverage
- social media, Reddit, forums, Trustpilot, and complaint sites

Use social and review sources to detect patterns and leads, not to establish
fraud by themselves. Open the underlying sources and verify dates, identity, and
product surface; search-result snippets and automated trust scores are not
findings.

For young or low-adoption products, check distribution age, update history,
review volume, repository activity, team or company identity, and availability
of independent evidence. Classify sparse evidence as `insufficient history`, not
as proof of safety or fraud.

### Classify each finding

Maintain a security evidence matrix in the working notes:

| Wallet | Finding | Source class and URL | Date | Official product affected? | Corroboration | Assessment | Rationale |
| ------ | ------- | -------------------- | ---- | -------------------------- | ------------- | ---------- | --------- |

Use these assessments:

- `confirmed harmful`: authoritative or independently reproducible evidence
  establishes fraud, malware, deliberate theft, or a compromised official
  distribution artifact
- `heightened concern`: credible, material evidence raises unresolved custody,
  solvency, regulatory, security, or operator-integrity concerns
- `monitor`: a confirmed incident, recurring complaint pattern, or credible
  allegation exists but does not establish that the official wallet is a scam
- `insufficient history`: too little independent adoption or operating history
  exists for a meaningful reputation conclusion
- `no material signal found`: the completed search found no material adverse
  evidence; never shorten this to `safe`, `trusted`, or `not a scam`

Separate these cases explicitly:

- malicious behavior by the official wallet or operator
- compromise of an official app, extension, dependency, or backend
- an operator security incident that did not affect the wallet
- losses caused by malicious dApps, exposed keys, social engineering, or user
  error
- support, KYC, account-freeze, or service-quality disputes
- fake products and accounts impersonating a legitimate wallet
- allegations that remain unverified or contradicted

An audit, bug bounty, app-store presence, funding announcement, or official
security claim can add context but does not prove that a wallet is safe. A past
incident also does not prove present fraud; record its scope, date, remediation,
and whether funds or signing keys were affected.

### Apply the publication gate

- Exclude a new candidate assessed as `confirmed harmful`. For an existing
  record, present the evidence and recommended removal prominently; do not make
  an unsupported accusation.
- Hold a new candidate with unresolved `heightened concern` for manual review.
  Do not silently publish it because its feature fields are otherwise verified.
- Publish or retain `monitor` wallets only when the official product identity is
  clear and the evidence does not establish malicious operation. Report the
  concern separately from the public description unless the data model has a
  reviewed field for risk disclosures.
- Do not reject a wallet solely because of isolated reviews, anonymous posts,
  low adoption, a domain-age score, or an incident involving an unrelated token,
  dApp, namesake, or impersonator.
- Link only to verified first-party domains and official distribution listings.
  Never substitute a sponsored search result, mirror, or support contact found
  solely through social media.
- Date the check and preserve the decisive source URLs in working notes. Repeat
  the search when evidence is stale, conflicting, or materially incomplete.

## 5. Reconcile and update the local registry

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
- security disposition for each reviewed wallet, including confirmed incidents,
  scam or impersonation reports, unresolved concerns, and insufficient history
- the distinction between official-product findings and third-party dApp,
  phishing, user-compromise, service-quality, or impersonation reports
- sources supporting non-obvious claims
- validation commands and results
