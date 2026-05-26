# Solana.com Navigation Build Plan

## Purpose

This plan turns the Solana.com navigation restructure into staged, checkable
implementation work for AI agents and human reviewers.

Use this file as the build source of truth. The companion functional strategy
is:

`plan/solana-com-navigation-functional-spec.md`

## Approved Direction

Final top-level navigation:

1. Use Solana
2. Build
3. Enterprise
4. Products
5. Ecosystem

`Learn`, `Network`, `Community`, and `Solutions` are no longer top-level header
labels. Their content remains discoverable through audience-led navigation.

Required hub routes to create in this delivery:

- `/use-solana`
- `/enterprise`
- `/products`
- `/ecosystem`
- `/network`

Important SEO decision:

- Keep `/solutions` and `/solutions/*` canonical.
- Do not redirect solution pages into `/enterprise/*`, `/products/*`, or
  `/ecosystem/*` as part of this delivery.
- Treat `Solutions` as a long-tail use-case route namespace and content type,
  not as a top-level header label.
- Header/footer menus may link directly to preserved `/solutions/*` pages when
  those pages are the best current destination for the audience intent.
- Preserve dynamic menu modules as part of the restructure. Each top-level menu
  may include a contextual promo/content slot for Breakpoint, current events,
  report highlights, product launches, or content highlights. The module is
  scoped by the current nav section and must never be the only path to critical
  content.

## Hybrid IA Model

The implementation should separate three concerns:

1. **Navigation bucket**: where the link appears in the header or footer.
2. **Route namespace**: where the canonical page lives.
3. **Content type**: whether the page is a solution/use case, product, ecosystem
   category, network proof page, guide, or hub.

This allows the same subject to have multiple audience-specific pages later
without forcing premature redirects now.

Example:

- `/solutions/depin`: broad DePIN solution/use-case page for long-tail SEO.
- Future `/enterprise/depin`: enterprise evaluator page, only if it has a
  materially different business-validation story.
- Future `/ecosystem/depin`: ecosystem landscape page, only if it has a
  materially different discovery/community story.

Do not create audience-specific duplicate pages unless their H1, search intent,
value proposition, proof points, and CTA path are meaningfully different.

## Legal Decision

This migration is primarily structural and can proceed without a separate legal
gate if implementation uses existing approved destination pages and neutral hub
copy.

Legal review is required only if the implementation adds or materially changes
copy about:

- SOL purchasing
- Staking rewards, yield, returns, or investment framing
- Token price or markets
- Issuance, inflation, or supply policy
- Financial advice or promotional claims

For this delivery, legal-sensitive items should link to existing pages or docs
with neutral labels. Do not add new staking, SOL, token price, or yield claims
inside navigation, footer, or hub-page copy.

## UI Implementation Standard

Use the repo's shadcn-style component system across new implementation work.

- Prefer `@workspace/ui` components for shared surfaces.
- Promote reusable shadcn-style primitives into `packages/ui` before using them
  across apps.
- Use existing app-local shadcn components only for app-local page composition
  when promotion would add unnecessary scope.
- Do not hand-roll custom buttons, accordions, dialogs, inputs, tabs, toggles,
  or tooltip behavior when a standard shadcn/Radix primitive exists.
- Shared chrome should continue to live in `packages/ui-chrome`, but interactive
  primitives should be built from `@workspace/ui` or Radix-backed shadcn
  patterns.
- Use `@solana-com/ui-chrome/link` or the existing cross-app link behavior for
  shared header/footer links.

Relevant existing primitives:

- `@workspace/ui/button`
- `@workspace/ui/dialog`
- `@workspace/ui/accordion`
- `@workspace/ui/input`
- `@workspace/ui/visually-hidden`
- app-local `apps/web/src/app/components/ui/*` where a primitive has not yet
  been promoted

## Repo Areas

Primary implementation areas:

- `packages/ui-chrome/src/header-section-metadata.ts`
- `packages/ui-chrome/src/header-sections.tsx`
- `packages/ui-chrome/src/header-list.*.tsx`
- `packages/ui-chrome/src/nav-section-content-config.tsx`
- `packages/ui-chrome/src/nav-section-renderers.tsx`
- `packages/ui-chrome/src/nav-types.ts`
- `packages/ui-chrome/src/nav-active.ts`
- `packages/ui-chrome/src/mobile-menu.tsx`
- `packages/ui-chrome/src/footer.tsx`
- `packages/ui-chrome/src/__tests__/nav-active.test.ts`
- `packages/i18n/messages/web/*/common.json`
- `apps/web/src/lib/media/post.ts`
- `apps/web/src/lib/media/report.ts`
- `apps/media/app/api/posts/latest/route.ts`
- `apps/media/app/api/reports/latest/route.ts`
- `apps/web/src/app/[locale]/use-solana`
- `apps/web/src/app/[locale]/enterprise`
- `apps/web/src/app/[locale]/products`
- `apps/web/src/app/[locale]/ecosystem`
- `apps/web/src/app/[locale]/network`
- `apps/web/rewrites-redirects.ts`
- `apps/web/scripts/generate-sitemap.ts`

Shared chrome is used by:

- `apps/web`
- `apps/docs`
- `apps/media`
- `apps/templates`

Cross-app QA is required.

## Current Route Facts

Existing routes available now:

- `/wallets`
- `/solana-wallets`
- `/learn`
- `/learn/what-is-a-wallet`
- `/learn/staying-safe-on-solana`
- `/learn/introduction-to-solana-tokens`
- `/learn/what-is-staking`
- `/staking`
- `/docs`
- `/docs/intro/quick-start`
- `/docs/intro/installation`
- `/docs/rpc`
- `/docs/tokens`
- `/docs/tokens/extensions`
- `/developers`
- `/developers/defi`
- `/developers/gaming`
- `/developers/payments`
- `/developers/templates`
- `/developers/guides`
- `/developers/cookbook`
- `/events`
- `/events/archive`
- `/community`
- `/validators`
- `/rpc`
- `/news`
- `/reports`
- `/podcasts`
- `/x402`
- `/x402/what-is-x402`
- `/agent-registry`
- `/agent-registry/what-is-agent-registry`
- `/skills`
- `/privacy`
- `/research`
- `/solutions`
- existing `/solutions/*` pages

Routes that must be created in this delivery:

- `/use-solana`
- `/enterprise`
- `/products`
- `/ecosystem`
- `/network`

Do not create these audience-specific leaf routes in this delivery unless
separate requirements prove they are materially distinct from existing solutions
pages:

- `/enterprise/depin`
- `/enterprise/payments`
- `/enterprise/stablecoins`
- `/enterprise/tokenization`
- `/enterprise/real-world-assets`
- `/enterprise/digital-assets`
- `/enterprise/internet-capital-markets`
- `/enterprise/financial-infrastructure`
- `/enterprise/financial-institutions`
- `/products/actions`
- `/products/agents`
- `/products/agent-registry`
- `/products/skills`
- `/products/solana-developer-platform`
- `/products/x402`
- `/ecosystem/depin`
- `/ecosystem/desci`
- `/ecosystem/btcfi`
- `/ecosystem/gaming`
- `/ecosystem/creators`
- `/ecosystem/founders`

Known redirect blockers:

- `/ecosystem(.*)` currently redirects to `/`; remove or narrow this before
  `/ecosystem` can be a real hub.
- `/enterprise` currently redirects to `/solutions/enterprise`; remove this
  before `/enterprise` can be a real hub.

## Canonical Routes To Preserve

These routes should remain canonical in this delivery:

- `/solutions`
- `/solutions/*`
- `/wallets`
- `/solana-wallets`, pending separate SEO decision
- `/learn`
- `/learn/*`
- `/staking`
- `/docs`
- `/docs/*`
- `/developers`
- `/developers/defi`
- `/developers/gaming`
- `/developers/payments`
- `/developers/templates`
- `/developers/guides`
- `/developers/cookbook`
- `/events`
- `/events/archive`
- `/community`
- `/validators`
- `/rpc`
- `/news`
- `/reports`
- `/podcasts`
- `/privacy`
- `/research`
- `/x402`
- `/x402/what-is-x402`
- `/agent-registry`
- `/agent-registry/what-is-agent-registry`
- `/skills`

Rationale:

- These routes are already strong, operational, cross-app, product-owned, or
  long-tail SEO targets.
- The new IA can link to them without requiring nested aliases.
- Preserving them avoids a large redirect migration and keeps search equity on.

## Solution Route Policy

`/solutions` remains the canonical long-tail use-case namespace.

Requirements:

- Keep `/solutions` and `/solutions/*` in sitemap output unless a specific page
  has already been retired by an approved redirect.
- Keep canonical metadata on `/solutions/*` pages pointing to `/solutions/*`.
- Rework page copy, CTAs, related links, and shared components as needed to make
  each solution useful from the new audience-led menus.
- Do not remove `/solutions` route files as part of this delivery.
- Do not add `/solutions/:path*` fallback redirects.
- Do not redirect solution pages to broad hubs.

Existing redirects that already mask solution page files should be audited, not
expanded blindly. If the team wants every `/solutions/*` page file to remain
servable, review current redirects for:

- `/solutions/games-tooling`
- `/solutions/solana-permissioned-environments`

## Audience Placement Matrix

This matrix defines menu placement, not canonical route migration.

| Canonical route                       | Primary menu placement | Secondary placement  | Action                                                                     |
| ------------------------------------- | ---------------------- | -------------------- | -------------------------------------------------------------------------- |
| `/solutions`                          | Enterprise or footer   | Ecosystem            | Keep canonical as Solutions / Use Cases hub.                               |
| `/solutions/enterprise`               | Enterprise             | Footer               | Keep canonical; `/enterprise` becomes separate audience hub.               |
| `/solutions/tokenization`             | Enterprise             | Products             | Keep canonical.                                                            |
| `/solutions/institutional-payments`   | Enterprise             | Build, Products      | Keep canonical.                                                            |
| `/solutions/commerce-tooling`         | Enterprise             | Products, Build      | Keep canonical unless existing content owner chooses a stronger canonical. |
| `/solutions/stablecoins`              | Enterprise             | Products             | Keep canonical.                                                            |
| `/solutions/real-world-assets`        | Enterprise             | Ecosystem            | Keep canonical.                                                            |
| `/solutions/financial-infrastructure` | Enterprise             | Products             | Keep canonical.                                                            |
| `/solutions/financial-institutions`   | Enterprise             | Network proof        | Keep canonical.                                                            |
| `/solutions/defi`                     | Enterprise             | Build, Ecosystem     | Keep canonical.                                                            |
| `/solutions/digital-assets`           | Enterprise             | Products, Ecosystem  | Keep canonical.                                                            |
| `/solutions/sdp`                      | Products               | Enterprise, Build    | Keep canonical.                                                            |
| `/solutions/ai`                       | Products               | Build, Enterprise    | Keep canonical.                                                            |
| `/solutions/actions`                  | Products               | Build                | Keep canonical.                                                            |
| `/solutions/payments-tooling`         | Build                  | Enterprise, Products | Keep canonical unless DevRel chooses `/developers/payments`.               |
| `/solutions/games-tooling`            | Build                  | Ecosystem            | Audit current redirect before deciding whether to restore canonical page.  |
| `/solutions/token-extensions`         | Build                  | Enterprise           | Keep canonical unless DevRel/SEO chooses docs as canonical.                |
| `/solutions/consumer`                 | Use Solana             | Products             | Keep canonical.                                                            |
| `/solutions/depin`                    | Ecosystem              | Enterprise           | Keep canonical as broad DePIN solution page.                               |
| `/solutions/desci`                    | Ecosystem              | Enterprise           | Keep canonical.                                                            |
| `/solutions/btcfi`                    | Ecosystem              | Enterprise           | Keep canonical.                                                            |
| `/solutions/gaming-and-entertainment` | Ecosystem              | Build                | Keep canonical.                                                            |
| `/solutions/artists-creators`         | Ecosystem              | Use Solana           | Keep canonical.                                                            |
| `/solutions/request-for-startups`     | Ecosystem              | Build                | Keep canonical.                                                            |
| `/x402`                               | Products               | Build                | Keep canonical unless product/SEO approves move.                           |
| `/agent-registry`                     | Products               | Build                | Keep canonical unless product/SEO approves move.                           |
| `/skills`                             | Products               | Build                | Keep canonical unless product/SEO approves move.                           |

Approved alias redirects may still exist for misspellings, legacy aliases, or
dead paths. Examples:

- `/token22` -> approved token extensions canonical
- `/solutions/token22` -> approved token extensions canonical
- `/tokenextensions` -> approved token extensions canonical
- `/solutions/tokenextensions` -> approved token extensions canonical
- `/solutions/commerce-and-payments` -> `/solutions/institutional-payments`

## Menu Listings

These are the launch menu listings under each top-level heading. They are menu
placement decisions, not route migrations. Links should point to the canonical
route shown unless a separate owner/SEO decision changes that route.

Do not ship links to placeholder pages, self-redirecting pages, or future-only
routes. If a listed route is not live at implementation time, omit that menu
item until it is live or link to the approved existing canonical route.

### Use Solana

Primary CTA:

- Use Solana hub: `/use-solana`

Wallets and onboarding:

- Wallets: `/wallets`
- Wallet directory: `/solana-wallets`, if retained as canonical
- Learn the basics: `/learn`
- What is Solana?: `/learn/what-is-solana`
- Getting started: `/learn/getting-started`
- What is a wallet?: `/learn/what-is-a-wallet`
- Sending and receiving SOL: `/learn/sending-and-receiving-sol`
- Transaction fees: `/learn/understanding-solana-transaction-fees`

Safety, tokens, and apps:

- Staying safe: `/learn/staying-safe-on-solana`
- Tokens: `/learn/introduction-to-solana-tokens`
- Staking: `/staking`
- What is staking?: `/learn/what-is-staking`
- Consumer apps: `/solutions/consumer`

Utility:

- Search / Ask AI: existing Inkeep entrypoint

Notes:

- Link staking only by existing route and neutral label.
- Do not create `/use-solana/staking` or `/use-solana/tokens` in this delivery.

### Build

Primary CTA:

- Developer hub: `/developers`

Start building:

- Docs: `/docs`
- Quickstart: `/docs/intro/quick-start`
- Install and setup: `/docs/intro/installation`
- Guides: `/developers/guides`
- Cookbook: `/developers/cookbook`
- Templates: `/developers/templates`

Tools and references:

- RPC docs: `/docs/rpc`
- RPC providers: `/rpc`
- Tokens docs: `/docs/tokens`
- Token Extensions: `/solutions/token-extensions`
- Actions and blinks: `/solutions/actions`
- Payments tooling: `/solutions/payments-tooling`

Build by use case:

- Payments: `/developers/payments`
- DeFi: `/developers/defi`
- Gaming: `/developers/gaming`
- Game tooling: `/solutions/games-tooling`, if restored as canonical; otherwise
  use `/developers/gaming`
- Agents and AI: `/solutions/ai`

Notes:

- `Build` is the public label. The canonical developer hub remains
  `/developers`.
- Do not create `/build`.

### Enterprise

Primary CTA:

- Enterprise hub: `/enterprise`

Business solutions:

- Enterprise overview solution: `/solutions/enterprise`
- Institutional payments: `/solutions/institutional-payments`
- Commerce tooling: `/solutions/commerce-tooling`
- Stablecoins: `/solutions/stablecoins`
- Tokenization: `/solutions/tokenization`
- Real-world assets: `/solutions/real-world-assets`
- Digital assets: `/solutions/digital-assets`
- Internet capital markets / DeFi: `/solutions/defi`
- Financial infrastructure: `/solutions/financial-infrastructure`
- Financial institutions: `/solutions/financial-institutions`
- DePIN: `/solutions/depin`

Validation and proof:

- Network hub: `/network`
- Validators: `/validators`
- Reports: `/reports`
- Research: `/research`
- Privacy: `/privacy`

Notes:

- `Enterprise` is the audience entry point.
- Existing `/solutions/*` pages remain the canonical use-case pages unless a
  separate audience-specific page is approved.
- Do not create `/enterprise/*` leaf pages for these topics in this delivery
  unless they are materially distinct from the solution page.

### Products

Primary CTA:

- Products hub: `/products`

Platforms and product surfaces:

- Solana Developer Platform: `/solutions/sdp`
- Actions and blinks: `/solutions/actions`
- Agents and AI: `/solutions/ai`
- x402: `/x402`
- Agent Registry: `/agent-registry`
- Skills: `/skills`

Product-adjacent solution pages:

- Token Extensions: `/solutions/token-extensions`
- Digital assets: `/solutions/digital-assets`
- Payments tooling: `/solutions/payments-tooling`

External or future product surfaces:

- Tokens surface: external Tokens destination if approved for navigation

Notes:

- Do not create `/products/pay-sh`, `/products/data`, or `/products/tokens` in
  this delivery unless real page requirements are added.
- Do not move `/x402`, `/agent-registry`, or `/skills` under `/products/*`
  without product and SEO approval.

### Ecosystem

Primary CTA:

- Ecosystem hub: `/ecosystem`

Network:

- Network hub: `/network`
- Validators: `/validators`
- RPC providers: `/rpc`
- Reports: `/reports`
- Research: `/research`
- Status: `https://status.solana.com/`

Events and community:

- Events: `/events`
- Event archive: `/events/archive`
- Breakpoint: `/breakpoint`
- Community: `/community`
- News: `/news`
- Podcasts: `/podcasts`

Ecosystem categories and programs:

- DePIN: `/solutions/depin`
- DeSci: `/solutions/desci`
- BTCFi: `/solutions/btcfi`
- Gaming and entertainment: `/solutions/gaming-and-entertainment`
- Artists and creators: `/solutions/artists-creators`
- Request for Startups / founders: `/solutions/request-for-startups`

Notes:

- Events stay prominent.
- Breakpoint/event promo content belongs under `Ecosystem` by default.
- `Network` is not top-level, but `/network` exists as a canonical hub.

## Dynamic Menu Module Requirements

Preserve a dynamic module inside mega menus for contextual promotion and content
highlights.

The module should be section-aware:

- Use Solana: wallet education, safety guides, beginner learn content
- Build: technical guides, releases, templates, docs updates
- Enterprise: reports, case studies, institutional announcements
- Products: launches, changelogs, product updates, product explainers
- Ecosystem: events, Breakpoint, grants, community, network reports

Functional requirements:

- Configure the module from the same nav section data used by static menu
  listings.
- Support one featured item per open menu at launch unless design explicitly
  approves a larger module.
- Allow a static fallback promo per section for campaign-critical items such as
  Breakpoint.
- Normalize dynamic content before rendering.
- Minimum normalized fields: `id`, `title`, `href`, `contentType`, `source`, and
  `navSection`.
- Optional fields: `description`, `eyebrow`, `image`, `publishedAt`, `tag`,
  `campaignId`, and `expiresAt`.
- Fail silently when dynamic content fetches fail.
- Avoid layout shift when a menu opens or when dynamic content resolves.
- Do not make dynamic cards the only path to critical pages such as `/events`,
  `/breakpoint`, `/reports`, `/news`, or `/docs`.
- Do not show a promo in the wrong audience menu just because it is globally
  high priority.

Implementation notes:

- Breakpoint and event promos belong under `Ecosystem` by default.
- A global campaign can appear in more than one menu only when each placement
  has an explicit section mapping.
- The dynamic module should use shadcn-style card/link primitives where possible
  and shared chrome link behavior for navigation.
- No new CMS schema is required for this delivery if existing APIs plus static
  section config can provide the needed featured items.

## Delivery Stages

Each stage should be independently reviewable.

### Stage 0: Proposal Checkpoint

Goal: confirm scope before code changes.

Tasks:

- Confirm this plan is the active source of truth.
- Confirm the companion spec is `plan/solana-com-navigation-functional-spec.md`.
- Confirm no OpenSpec implementation proposal is required before coding, or
  create one under `apps/web/openspec/changes/` if the team requires formal
  approval tracking.
- Record route owners for `Use Solana`, `Enterprise`, `Products`, `Ecosystem`,
  `Network`, and `Solutions`.
- Record ownership for dynamic menu modules, including who can approve
  Breakpoint, event, report, news, and product-launch placements.
- Confirm the launch module inventory and fallback promo for each top-level
  menu.

Acceptance checks:

- The five top-level nav labels are approved.
- The five hub routes are in scope for this delivery.
- `/solutions` and `/solutions/*` remain canonical.
- Dynamic menu modules are in scope as contextual, section-aware promo/content
  slots.
- Legal-sensitive content will use existing destinations and neutral labels.

### Stage 1: Route Foundation And Shared Page Components

Goal: create reusable page scaffolding and all required top-level hub routes.

Tasks:

- Add a small shared IA page data model for hub pages.
- Build reusable hub/page sections using shadcn-style components:
  - hero section
  - link group section
  - featured route card
  - CTA row
  - related links grid
- Use `@workspace/ui/button`, `@workspace/ui/accordion`, and other shadcn-style
  primitives where relevant.
- Keep new copy factual, short, and neutral.
- Add metadata helpers for canonical paths.

Suggested files:

- `apps/web/src/components/navigation-migration/*`
- `apps/web/src/app/[locale]/use-solana/page.tsx`
- `apps/web/src/app/[locale]/enterprise/page.tsx`
- `apps/web/src/app/[locale]/products/page.tsx`
- `apps/web/src/app/[locale]/ecosystem/page.tsx`
- `apps/web/src/app/[locale]/network/page.tsx`

Acceptance checks:

- `/use-solana`, `/enterprise`, `/products`, `/ecosystem`, and `/network` render
  without redirects.
- Pages are not empty link lists; each has a clear audience purpose and links to
  existing canonical routes, including `/solutions/*` where relevant.
- No page introduces new legal-sensitive claims.
- Pages use standard shadcn-style primitives rather than one-off interaction
  components.

Validation:

```bash
pnpm --filter solana-com lint
pnpm --filter solana-com test
```

### Stage 2: Solution Page Reframing

Goal: keep solution canonicals while making them work from audience-led menus.

Tasks:

- Audit each `/solutions/*` page for current audience fit.
- Update page CTAs and related links so Enterprise, Products, Build, Ecosystem,
  and Use Solana visitors land on useful next steps.
- Preserve each solution page's canonical path unless a separate SEO decision
  approves a different canonical.
- Reuse existing solution components where they remain appropriate.
- Extract shared proof-point, logo, stats, or project components only when the
  same data will support future audience-specific pages.
- Do not create duplicate audience-specific pages unless distinct requirements
  are approved.

Acceptance checks:

- `/solutions` and `/solutions/*` continue to return 200 unless an existing
  approved redirect already retires a specific page.
- Solution pages keep canonical metadata pointing to their `/solutions/*` route.
- Solution pages no longer depend on `Solutions` being a top-level nav label.
- Internal links from solution pages do not force users back into stale nav
  groupings.

Validation:

```bash
pnpm --filter solana-com lint
pnpm --filter solana-com test
```

### Stage 3: Shared Header And Mobile Menu

Goal: replace the old top-level nav with the new IA in shared chrome.

Tasks:

- Update `NavTopLevelSectionId` values to:
  - `use_solana`
  - `build`
  - `enterprise`
  - `products`
  - `ecosystem`
- Update header metadata, icon mapping, section content mapping, and mobile menu
  mapping together.
- Replace old `Learn`, `Developers`, `Solutions`, `Network`, and `Community`
  visible labels with the approved labels.
- Keep `Build` linked conceptually to `/developers`.
- Link audience menus to preserved canonical routes, including `/solutions/*`
  pages where they are the best current destination.
- Preserve and re-scope the dynamic menu module so each menu can show a
  contextual promo/content highlight.
- Add fallback promos for section-critical campaigns where required.
- Keep static links usable without dynamic content.
- Ensure desktop mega menus support pointer and keyboard access.
- Ensure mobile menu exposes the same practical hierarchy.

Suggested files:

- `packages/ui-chrome/src/nav-types.ts`
- `packages/ui-chrome/src/header-section-metadata.ts`
- `packages/ui-chrome/src/header-sections.tsx`
- `packages/ui-chrome/src/nav-section-content-config.tsx`
- `packages/ui-chrome/src/header-list.*.tsx`
- `packages/ui-chrome/src/mobile-menu.tsx`
- `packages/i18n/messages/web/*/common.json`
- `apps/web/src/lib/media/post.ts`
- `apps/web/src/lib/media/report.ts`

Acceptance checks:

- Desktop header shows exactly: `Use Solana`, `Build`, `Enterprise`, `Products`,
  `Ecosystem`.
- Mobile menu shows the same five sections.
- No visible top-level `Solutions`, `Network`, `Community`, or `Learn` label
  remains in shared primary navigation.
- Header/mobile menu may link to `/solutions/*` where those pages are canonical.
- Each mega menu can render a section-scoped dynamic module or its configured
  fallback.
- Breakpoint/event promo content is scoped to `Ecosystem` unless explicitly
  configured for another section.
- Dynamic content failures do not remove static menu links or break menu layout.
- Shared chrome still works in `web`, `docs`, `media`, and `templates`.

Validation:

```bash
pnpm --filter @solana-com/ui-chrome lint
pnpm --filter @solana-com/ui-chrome check-types
pnpm --filter @solana-com/ui-chrome test
```

### Stage 4: Active Route Rules And Footer

Goal: make new IA state correct across preserved canonical and new hub routes.

Tasks:

- Update active route mapping for:
  - `/use-solana`, `/wallets`, `/learn`, `/staking`, `/solana-wallets`,
    `/solutions/consumer`
  - `/developers`, `/docs`, `/rpc`, `/developers/templates`
  - `/enterprise`, enterprise-placed `/solutions/*`, preserved enterprise
    validation routes
  - `/products`, product-placed `/solutions/*`, `/x402`, `/agent-registry`,
    `/skills`
  - `/ecosystem`, ecosystem-placed `/solutions/*`, `/events`, `/community`,
    `/news`, `/reports`, `/podcasts`, `/network`, `/validators`
- Rebuild footer with explicit columns:
  - Use Solana
  - Build
  - Enterprise
  - Products
  - Ecosystem
  - Foundation
- Keep `Network` as a subsection under `Ecosystem`, not a footer column.
- Use existing canonical destinations for preserved routes.

Suggested files:

- `packages/ui-chrome/src/nav-active.ts`
- `packages/ui-chrome/src/footer.tsx`
- `packages/ui-chrome/src/__tests__/nav-active.test.ts`
- `packages/i18n/messages/web/*/common.json`

Acceptance checks:

- Active state is correct on preserved `/solutions/*` routes and new hubs.
- Footer may link to `/solutions/*` where those pages are canonical.
- Footer has no dead, self-redirecting, or placeholder links.
- Footer uses shared link behavior for cross-app routes.

Validation:

```bash
pnpm --filter @solana-com/ui-chrome test
pnpm --filter @solana-com/ui-chrome lint
```

### Stage 5: Redirect Cleanup

Goal: unblock new hubs and clean up aliases without redirecting canonical
solution pages.

Tasks:

- Remove or narrow the broad `/ecosystem(.*)` redirect so `/ecosystem` works.
- Remove the `/enterprise -> /solutions/enterprise` redirect so `/enterprise`
  works as its own audience hub.
- Keep `/solutions` and `/solutions/*` canonical.
- Do not add `/solutions/:path*` fallback redirects.
- Do not redirect `/solutions/*` into `/enterprise/*`, `/products/*`, or
  `/ecosystem/*`.
- Keep or update only true alias redirects, such as misspellings or legacy
  shorthand paths.
- Audit current redirects that point to `/solutions/*` and confirm they still
  point to the intended canonical solution route.

Suggested file:

- `apps/web/rewrites-redirects.ts`

Acceptance checks:

- `/enterprise`, `/ecosystem`, `/products`, `/use-solana`, and `/network` are
  not blocked by redirects.
- `/solutions` and preserved `/solutions/*` routes return 200.
- Alias redirects have explicit, relevant destinations.
- No redirect loops.
- Locale-prefixed aliases keep expected locale behavior.

Validation:

```bash
pnpm --filter solana-com test
pnpm --filter solana-com build
```

### Stage 6: Internal Links, Sitemap, And Canonicals

Goal: expose the new IA without losing long-tail solution SEO.

Tasks:

- Replace only stale internal links that point to retired aliases or blocked
  hubs.
- Keep intentional internal links to canonical `/solutions/*` pages.
- Update Builder/static JSON references only where they affect rendered stale
  links.
- Update sitemap generation to include the five new hubs.
- Keep `/solutions` and preserved `/solutions/*` in sitemap output.
- Update canonical metadata for new hub pages.
- Preserve canonical metadata for `/solutions/*`.
- Check Open Graph metadata for new hub pages.
- Check localized alternate generation for new hub routes and preserved solution
  routes.

Suggested files:

- `apps/web/scripts/generate-sitemap.ts`
- `apps/web/src/app/[locale]/**/page.tsx`
- `apps/web/src/components/**`
- `apps/web/builder/**`
- `packages/i18n/messages/web/*/common.json`

Acceptance checks:

- `rg "/solutions"` may find intentional canonical solution links.
- No active user-facing link points to a retired alias or redirecting hub.
- Sitemap contains new hub routes.
- Sitemap keeps canonical `/solutions` routes that remain live.
- Canonical metadata on new hubs points to new hubs.
- Canonical metadata on preserved solution pages points to `/solutions/*`.

Validation:

```bash
pnpm --filter solana-com lint
pnpm --filter solana-com build
```

### Stage 7: Cross-App QA

Goal: verify shared chrome and links across deployed app boundaries.

Tasks:

- Run targeted validation for affected shared packages.
- Run targeted app validation for `web`.
- Smoke test shared header/footer in:
  - `apps/web`
  - `apps/docs`
  - `apps/media`
  - `apps/templates`
- Verify cross-app links use full reload behavior where required by
  `@solana-com/ui-chrome/url-config`.
- Verify search/Ask AI remains available in header and mobile menu.
- Verify dynamic module fallback behavior in at least one menu with content
  unavailable.

Validation:

```bash
pnpm --filter @workspace/ui check-types
pnpm --filter @solana-com/ui-chrome check-types
pnpm --filter @solana-com/ui-chrome test
pnpm --filter solana-com lint
pnpm --filter solana-com test
pnpm --filter solana-com build
```

Manual QA checklist:

- Desktop header opens each mega menu with pointer.
- Desktop header opens each mega menu with keyboard.
- Escape/outside click closes desktop menus.
- Mobile menu opens, expands each section, and exposes the same practical links.
- Footer links resolve.
- `/enterprise`, `/ecosystem`, `/products`, `/use-solana`, and `/network`
  resolve directly.
- `/solutions` and preserved `/solutions/*` resolve directly.
- Locale-prefixed routes behave as expected.
- `docs`, `media`, and `templates` links do not break through client-side
  navigation.
- Dynamic content absence does not remove static nav paths.
- Dynamic menu modules show section-appropriate content when configured.

## Out Of Scope For This Delivery

- New CMS schema.
- New legal-sensitive SOL, staking, token-market, yield, or investment copy.
- Redirecting the `/solutions` namespace.
- Creating audience-specific duplicate pages for every solution.
- Moving `/x402`, `/agent-registry`, or `/skills` under `/products/*` without
  separate product and SEO approval.
- Reworking preserved canonical routes such as `/wallets`, `/learn`, `/docs`,
  `/developers`, `/events`, `/community`, `/validators`, `/news`, `/reports`,
  `/podcasts`, and `/solutions/*`.
- Visual redesign beyond what is needed to make the new IA usable and polished.

## Dynamic Content Hardening

After the static IA is working, harden dynamic modules without changing the menu
contract:

- Add tests for normalization and fallback selection.
- Add analytics for impressions and clicks.
- Confirm cache behavior for media/report/event API-backed content.
- Confirm campaign expiry behavior.
- Confirm localized titles/descriptions where translated content exists.

## Analytics Future Phase

Add analytics after route migration and static navigation QA.

Recommended event schema version:

- `nav_ia_v1`

Core events:

- `nav_menu_opened`
- `nav_menu_closed`
- `nav_link_clicked`
- `nav_cta_clicked`
- `nav_dynamic_card_impression`
- `nav_dynamic_card_clicked`
- `nav_search_opened`
- `ia_hub_page_viewed`
- `event_promo_clicked`
- `developer_start_clicked`
- `tokens_xyz_outbound_clicked`

Do not record raw search queries or AI prompts by default.

## Final Release Gate

The migration is ready to ship when:

- All five hub routes return 200.
- `/solutions` and preserved `/solutions/*` routes remain canonical and
  return 200.
- No new redirect points a canonical solution page to a broad audience hub.
- Header/footer/mobile menu use the new five-section IA.
- Header/footer/mobile menu may link to `/solutions/*` where those pages are the
  canonical destination.
- Dynamic menu modules are section-scoped, have fallbacks, and do not remove
  static nav paths when unavailable.
- No redirect blocks `/use-solana`, `/enterprise`, `/products`, `/ecosystem`, or
  `/network`.
- Active nav state is correct for preserved solution pages, preserved canonical
  routes, and new hubs.
- Shared chrome works across `web`, `docs`, `media`, and `templates`.
- Sitemap and canonical metadata include the new hubs and preserve live solution
  canonicals.
- Targeted lint, typecheck, unit tests, and web build pass.
