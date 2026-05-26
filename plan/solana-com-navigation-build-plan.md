# Solana.com Navigation Migration Build Plan

## Purpose

This plan turns the Solana.com navigation restructure into staged, checkable
implementation work for AI agents and human reviewers.

The long-form strategic backup is preserved at:

`plan/solana-com-navigation-functional-spec.md`

Use this file as the build source of truth.

## Approved Direction

Final top-level navigation:

1. Use Solana
2. Build
3. Enterprise
4. Products
5. Ecosystem

`Network`, `Community`, `Learn`, and `Solutions` are no longer top-level header
labels. Their content remains discoverable through the new IA.

Required hub routes to create in this migration:

- `/use-solana`
- `/enterprise`
- `/products`
- `/ecosystem`
- `/network`

This is now a fuller migration. The work should create real destination pages
before redirecting legacy URLs. Redirects should not point to dead routes,
placeholder pages, or routes that immediately redirect elsewhere.

The `/solutions` namespace should be fully migrated. No `/solutions` route
should remain canonical after this delivery.

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
- `packages/ui-chrome/src/nav-types.ts`
- `packages/ui-chrome/src/nav-active.ts`
- `packages/ui-chrome/src/mobile-menu.tsx`
- `packages/ui-chrome/src/footer.tsx`
- `packages/ui-chrome/src/__tests__/nav-active.test.ts`
- `packages/i18n/messages/web/*/common.json`
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
- all listed `/solutions/*` pages in the route matrix below

Routes that must be created in this migration:

- `/use-solana`
- `/use-solana/apps`
- `/enterprise`
- `/enterprise/digital-assets`
- `/enterprise/financial-infrastructure`
- `/enterprise/financial-institutions`
- `/enterprise/internet-capital-markets`
- `/enterprise/payments`
- `/enterprise/real-world-assets`
- `/enterprise/stablecoins`
- `/enterprise/tokenization`
- `/products`
- `/products/actions`
- `/products/agents`
- `/products/agent-registry`
- `/products/agent-registry/what-is-agent-registry`
- `/products/skills`
- `/products/solana-developer-platform`
- `/products/x402`
- `/products/x402/what-is-x402`
- `/ecosystem`
- `/ecosystem/btcfi`
- `/ecosystem/creators`
- `/ecosystem/depin`
- `/ecosystem/desci`
- `/ecosystem/founders`
- `/ecosystem/gaming`
- `/network`

Known redirect blockers:

- `/ecosystem(.*)` currently redirects to `/`; this must be removed or narrowed
  before `/ecosystem` or `/ecosystem/*` can work.
- `/enterprise` currently redirects to `/solutions/enterprise`; this must be
  replaced after the new `/enterprise` page exists.
- `/developers/ai` and `/ai` currently redirect toward `/solutions/ai`; these
  should redirect to `/products/agents` once that destination exists.

## Canonical Routes To Preserve

These routes should remain canonical in this migration. They may be linked from
new hubs and menus, but they should not be moved unless a separate SEO decision
overrides this plan.

- `/wallets`
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

Rationale:

- These are already strong, operational, cross-app, or content-owned routes.
- The new IA can link to them without requiring nested aliases.
- Preserving them reduces unnecessary SEO and cross-app risk.

## Future-Only Routes

Do not create these routes during this migration unless product/content owners
provide real page requirements and approved copy.

- `/use-solana/tokens`
- `/use-solana/staking`
- `/products/pay-sh`
- `/products/data`
- `/products/tokens`
- `/enterprise/privacy`
- `/enterprise/case-studies`
- `/enterprise/contact`
- `/network/data`
- `/network/reports`
- `/network/status`

Use existing destinations instead:

- Tokens: `/learn/introduction-to-solana-tokens` or external Tokens surface
- Staking: `/staking` or `/learn/what-is-staking`
- Privacy: `/privacy`
- Reports: `/reports`
- Status: `https://status.solana.com/`
- Data/research: `/research`, `/validators`, `/rpc`, `/reports`, or external
  dashboards as appropriate

## Route Migration Matrix

Create each destination before adding its redirect.

All known `/solutions` pages must receive explicit redirects. After explicit
redirects are in place and verified, add a final legacy fallback for unknown
`/solutions/:path*` requests if the team wants old uncatalogued links to resolve
instead of 404.

| Current route                                 | Destination                                       | Action                                                                                     |
| --------------------------------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `/solutions`                                  | `/enterprise`                                     | Redirect after `/enterprise` hub ships.                                                    |
| `/solutions/enterprise`                       | `/enterprise`                                     | Redirect.                                                                                  |
| `/enterprise`                                 | `/enterprise`                                     | Remove existing redirect to `/solutions/enterprise`.                                       |
| `/solutions/tokenization`                     | `/enterprise/tokenization`                        | Create destination page, then redirect.                                                    |
| `/solutions/institutional-payments`           | `/enterprise/payments`                            | Create destination page, then redirect.                                                    |
| `/solutions/commerce-tooling`                 | `/enterprise/payments`                            | Redirect after payments page includes commerce/tooling path.                               |
| `/solutions/stablecoins`                      | `/enterprise/stablecoins`                         | Create destination page, then redirect.                                                    |
| `/solutions/real-world-assets`                | `/enterprise/real-world-assets`                   | Create destination page, then redirect.                                                    |
| `/solutions/financial-infrastructure`         | `/enterprise/financial-infrastructure`            | Create destination page, then redirect.                                                    |
| `/solutions/financial-institutions`           | `/enterprise/financial-institutions`              | Create destination page, then redirect.                                                    |
| `/solutions/defi`                             | `/enterprise/internet-capital-markets`            | Create destination page, then redirect.                                                    |
| `/solutions/digital-assets`                   | `/enterprise/digital-assets`                      | Create destination page, then redirect.                                                    |
| `/solutions/sdp`                              | `/products/solana-developer-platform`             | Create destination page, then redirect.                                                    |
| `/solutions/ai`                               | `/products/agents`                                | Create destination page, then redirect.                                                    |
| `/ai`                                         | `/products/agents`                                | Change existing redirect.                                                                  |
| `/developers/ai`                              | `/products/agents`                                | Change existing redirect.                                                                  |
| `/solutions/actions`                          | `/products/actions`                               | Create destination page, then redirect.                                                    |
| `/x402`                                       | `/products/x402`                                  | Create destination page, then redirect.                                                    |
| `/x402/what-is-x402`                          | `/products/x402/what-is-x402`                     | Create destination page, then redirect.                                                    |
| `/agent-registry`                             | `/products/agent-registry`                        | Create destination page, then redirect.                                                    |
| `/agent-registry/what-is-agent-registry`      | `/products/agent-registry/what-is-agent-registry` | Create destination page, then redirect.                                                    |
| `/skills`                                     | `/products/skills`                                | Create destination page, then redirect.                                                    |
| `/solutions/payments-tooling`                 | `/developers/payments`                            | Redirect to preserved developer page.                                                      |
| `/solutions/games-tooling`                    | `/developers/gaming`                              | Redirect to preserved developer page.                                                      |
| `/solutions/token-extensions`                 | `/docs/tokens/extensions`                         | Redirect to preserved docs page.                                                           |
| `/token22`                                    | `/docs/tokens/extensions`                         | Change existing redirect.                                                                  |
| `/solutions/token22`                          | `/docs/tokens/extensions`                         | Change existing redirect.                                                                  |
| `/tokenextensions`                            | `/docs/tokens/extensions`                         | Change existing redirect.                                                                  |
| `/solutions/tokenextensions`                  | `/docs/tokens/extensions`                         | Change existing redirect.                                                                  |
| `/token-extensions`                           | `/docs/tokens/extensions`                         | Change existing redirect.                                                                  |
| `/solutions/consumer`                         | `/use-solana/apps`                                | Create destination page, then redirect.                                                    |
| `/solutions/depin`                            | `/ecosystem/depin`                                | Create destination page, then redirect.                                                    |
| `/solutions/desci`                            | `/ecosystem/desci`                                | Create destination page, then redirect.                                                    |
| `/solutions/btcfi`                            | `/ecosystem/btcfi`                                | Create destination page, then redirect.                                                    |
| `/solutions/gaming-and-entertainment`         | `/ecosystem/gaming`                               | Create destination page, then redirect.                                                    |
| `/solutions/artists-creators`                 | `/ecosystem/creators`                             | Create destination page, then redirect.                                                    |
| `/solutions/request-for-startups`             | `/ecosystem/founders`                             | Create destination page, then redirect.                                                    |
| `/solutions/solana-permissioned-environments` | `https://launch.solana.com/products/contra`       | Keep existing external redirect unless a real Solana.com product page is approved.         |
| `/solutions/:path*`                           | `/enterprise`                                     | Optional final fallback after all explicit redirects above. Keep below specific redirects. |
| `/ecosystem(.*)`                              | mixed                                             | Remove broad redirect. Add narrower legacy redirects only for known dead paths.            |

## Navigation Link Targets

Header and footer links should use these targets at launch.

### Use Solana

Primary targets:

- `/use-solana`
- `/wallets`
- `/learn`
- `/learn/what-is-a-wallet`
- `/learn/staying-safe-on-solana`
- `/learn/introduction-to-solana-tokens`
- `/staking`
- `/use-solana/apps`

Notes:

- Link staking only by existing route and neutral label.
- Do not create `/use-solana/staking` or `/use-solana/tokens` in this migration.

### Build

Primary targets:

- `/developers`
- `/docs`
- `/docs/intro/quick-start`
- `/docs/intro/installation`
- `/docs/rpc`
- `/developers/templates`
- `/developers/guides`
- `/developers/cookbook`
- `/developers/payments`
- `/developers/defi`
- `/developers/gaming`
- `/products/actions`
- `/products/agents`

Notes:

- `Build` is the public label. The canonical developer hub remains
  `/developers`.
- Do not create `/build`.

### Enterprise

Primary targets:

- `/enterprise`
- `/enterprise/payments`
- `/enterprise/stablecoins`
- `/enterprise/tokenization`
- `/enterprise/real-world-assets`
- `/enterprise/digital-assets`
- `/enterprise/internet-capital-markets`
- `/enterprise/financial-infrastructure`
- `/enterprise/financial-institutions`
- `/network`
- `/reports`
- `/research`
- `/privacy`

Notes:

- `Enterprise` replaces the old market-facing `Solutions` bucket.
- The menu may link directly to `/network`, `/reports`, and `/research` for
  validation paths.

### Products

Primary targets:

- `/products`
- `/products/solana-developer-platform`
- `/products/actions`
- `/products/agents`
- `/products/agent-registry`
- `/products/skills`
- `/products/x402`
- external Tokens surface if approved for navigation

Notes:

- Do not create `/products/pay-sh`, `/products/data`, or `/products/tokens` in
  this migration unless real page requirements are added.

### Ecosystem

Primary targets:

- `/ecosystem`
- `/network`
- `/events`
- `/events/archive`
- `/community`
- `/news`
- `/podcasts`
- `/ecosystem/founders`
- `/ecosystem/depin`
- `/ecosystem/desci`
- `/ecosystem/btcfi`
- `/ecosystem/gaming`
- `/ecosystem/creators`
- `/validators`
- `https://status.solana.com/`

Notes:

- Events stay prominent.
- Breakpoint/event promo content belongs under `Ecosystem`.
- `Network` is not top-level, but `/network` exists as a canonical hub.

## Delivery Stages

Each stage should be independently reviewable. Do not start redirects for a
route group until that group's destination pages exist and pass QA.

### Stage 0: Proposal Checkpoint

Goal: confirm scope before code changes.

Tasks:

- Confirm this plan is the active source of truth.
- Confirm the long-form backup remains in
  `plan/solana-com-navigation-functional-spec-future.md`.
- Confirm no OpenSpec implementation proposal is required before coding, or
  create one under `apps/web/openspec/changes/` if the team requires formal
  approval tracking.
- Record route owners for `Use Solana`, `Enterprise`, `Products`, `Ecosystem`,
  and `Network`.

Acceptance checks:

- The five top-level nav labels are approved.
- The five hub routes are in scope for this delivery.
- Dynamic menu content is explicitly out of scope.
- Legal-sensitive content will use existing destinations and neutral labels.

### Stage 1: Route Foundation And Shared Page Components

Goal: create reusable page scaffolding and enough structure for all destination
routes.

Tasks:

- Add a small shared IA page data model for hub and migration pages.
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
  existing canonical routes.
- No page introduces new legal-sensitive claims.
- Pages use standard shadcn-style primitives rather than one-off interaction
  components.

Validation:

```bash
pnpm --filter solana-com lint
pnpm --filter solana-com test
```

### Stage 2: Destination Pages For Redirected Content

Goal: create every destination needed by the route migration matrix.

Tasks:

- Create enterprise destination pages:
  - `/enterprise/payments`
  - `/enterprise/stablecoins`
  - `/enterprise/tokenization`
  - `/enterprise/real-world-assets`
  - `/enterprise/digital-assets`
  - `/enterprise/internet-capital-markets`
  - `/enterprise/financial-infrastructure`
  - `/enterprise/financial-institutions`
- Create product destination pages:
  - `/products/actions`
  - `/products/agents`
  - `/products/agent-registry`
  - `/products/agent-registry/what-is-agent-registry`
  - `/products/skills`
  - `/products/solana-developer-platform`
  - `/products/x402`
  - `/products/x402/what-is-x402`
- Create use/ecosystem destination pages:
  - `/use-solana/apps`
  - `/ecosystem/depin`
  - `/ecosystem/desci`
  - `/ecosystem/btcfi`
  - `/ecosystem/gaming`
  - `/ecosystem/creators`
  - `/ecosystem/founders`

Implementation guidance:

- Prefer moving or re-exporting existing page components first, then improving
  page copy/design in later work.
- Avoid duplicate canonical content. New pages should be canonical; old pages
  should redirect once destinations are verified.
- If a page reuses an existing component, update metadata and canonical path to
  the new destination.
- Do not preserve `/solutions/*` canonical metadata on the new page.

Acceptance checks:

- Every destination in the route migration matrix returns 200.
- Destination pages have correct metadata and canonical paths.
- Destination pages link back into the new IA, not to `/solutions/*`.
- No destination page imports app-local UI primitives when a shared
  `@workspace/ui` primitive exists.

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
- Move network, events, community, news, reports, podcasts, and status links
  under `Ecosystem`.
- Move productized surfaces under `Products`.
- Move institutional use cases under `Enterprise`.
- Move wallet, learn, safety, tokens, staking, and apps paths under
  `Use Solana`.
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

Acceptance checks:

- Desktop header shows exactly: `Use Solana`, `Build`, `Enterprise`, `Products`,
  `Ecosystem`.
- Mobile menu shows the same five sections.
- No visible top-level `Solutions`, `Network`, `Community`, or `Learn` label
  remains in shared primary navigation.
- No menu item links to `/solutions/*` after Stage 3.
- Shared chrome still works in `web`, `docs`, `media`, and `templates`.

Validation:

```bash
pnpm --filter @solana-com/ui-chrome lint
pnpm --filter @solana-com/ui-chrome check-types
pnpm --filter @solana-com/ui-chrome test
```

### Stage 4: Active Route Rules And Footer

Goal: make new IA state correct across existing and migrated paths.

Tasks:

- Update active route mapping for:
  - `/use-solana`, `/wallets`, `/learn`, `/staking`, `/solana-wallets`
  - `/developers`, `/docs`, `/rpc`, `/developers/templates`
  - `/enterprise`, `/enterprise/*`, preserved enterprise validation routes
  - `/products`, `/products/*`
  - `/ecosystem`, `/ecosystem/*`, `/events`, `/community`, `/news`, `/reports`,
    `/podcasts`, `/network`, `/validators`
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

- Active state is correct on migrated destinations and preserved canonical
  routes.
- Footer does not link to `/solutions/*`.
- Footer has no dead, self-redirecting, or placeholder links.
- Footer uses shared link behavior for cross-app routes.

Validation:

```bash
pnpm --filter @solana-com/ui-chrome test
pnpm --filter @solana-com/ui-chrome lint
```

### Stage 5: Redirect Batch

Goal: redirect legacy routes only after their destinations are real.

Tasks:

- Sunset the `/solutions` namespace as canonical.
- Remove the broad `/ecosystem(.*)` redirect.
- Replace `/enterprise -> /solutions/enterprise` with the new canonical
  `/enterprise` route.
- Add redirects from the route migration matrix.
- Add explicit redirects for every known `/solutions` route before any fallback
  redirect.
- Add optional `/solutions/:path* -> /enterprise` fallback only after explicit
  redirects have been verified and only below the explicit `/solutions/*`
  entries.
- Keep locale-prefixed redirect behavior through `withLocaleRedirects`.
- Keep external redirect for `/solutions/solana-permissioned-environments`
  unless a real internal product page has been approved.
- Update any existing redirect aliases that currently point to `/solutions/*`.
- Remove, move, or clearly retire the old `apps/web/src/app/[locale]/solutions`
  route files once their new destination pages are live and redirects are
  active. Reused components may remain under a neutral shared component
  directory.

Suggested file:

- `apps/web/rewrites-redirects.ts`

Acceptance checks:

- Every legacy route in the matrix redirects to the approved destination.
- `/solutions` and every known `/solutions/*` page are no longer canonical.
- No rendered page is served from `apps/web/src/app/[locale]/solutions`.
- Every redirect destination returns 200 or an approved external destination.
- No redirect loops.
- Locale-prefixed legacy routes redirect to locale-prefixed internal
  destinations.
- `/ecosystem`, `/ecosystem/*`, `/enterprise`, `/products`, `/use-solana`, and
  `/network` are not blocked by redirects.

Validation:

```bash
pnpm --filter solana-com test
pnpm --filter solana-com build
```

### Stage 6: Internal Links, Sitemap, And Canonicals

Goal: remove stale internal paths and expose the new IA to search engines.

Tasks:

- Replace internal app links to `/solutions/*` with new destinations.
- Update Builder/static JSON references where they affect rendered links.
- Update sitemap generation to include new canonical routes and exclude
  redirected legacy routes.
- Update canonical metadata for migrated pages.
- Check Open Graph metadata for new hub and destination pages.
- Check localized alternate generation for new routes.

Suggested files:

- `apps/web/scripts/generate-sitemap.ts`
- `apps/web/src/app/[locale]/**/page.tsx`
- `apps/web/src/components/**`
- `apps/web/builder/**`
- `packages/i18n/messages/web/*/common.json`

Acceptance checks:

- `rg "/solutions"` finds no active user-facing internal links except redirect
  definitions, the optional final fallback, archived/builder source that is not
  rendered, or explicit migration comments.
- `rg "app/\\[locale\\]/solutions|/solutions/page"` confirms the old routed page
  tree is removed or no longer route-serving.
- Sitemap contains new canonical routes.
- Sitemap does not list redirected `/solutions/*` routes.
- Canonical metadata points to new routes.

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
- Legacy migrated URLs redirect correctly.
- Locale-prefixed migrated URLs redirect correctly.
- `docs`, `media`, and `templates` links do not break through client-side
  navigation.
- Dynamic content absence does not remove static nav paths.

## Out Of Scope For This Delivery

- Dynamic menu cards from media/report/event APIs.
- New CMS schema.
- New legal-sensitive SOL, staking, token-market, yield, or investment copy.
- New product pages for `/products/pay-sh`, `/products/data`, or
  `/products/tokens` unless owners provide real requirements.
- Reworking preserved canonical routes such as `/wallets`, `/learn`, `/docs`,
  `/developers`, `/events`, `/community`, `/validators`, `/news`, `/reports`,
  and `/podcasts`.
- Visual redesign beyond what is needed to make the new IA usable and polished.

## Dynamic Content Future Phase

Dynamic modules should be added only after the static IA, routes, redirects, and
footer are stable.

Future requirements:

- Normalize dynamic content before rendering.
- Minimum normalized fields: `id`, `title`, `href`, `contentType`, and `source`.
- Optional fields: `description`, `eyebrow`, `image`, `publishedAt`, `tag`, and
  `campaignId`.
- Fail silently when content fetches fail.
- Never make dynamic cards the only path to critical content.
- Avoid layout shift inside open menus.

## Analytics Future Phase

Add analytics after route migration and static navigation QA.

Recommended event schema version:

- `nav_ia_v1`

Core events:

- `nav_menu_opened`
- `nav_menu_closed`
- `nav_link_clicked`
- `nav_cta_clicked`
- `nav_search_opened`
- `ia_hub_page_viewed`
- `event_promo_clicked`
- `developer_start_clicked`
- `tokens_xyz_outbound_clicked`

Do not record raw search queries or AI prompts by default.

## Final Release Gate

The migration is ready to ship when:

- All five hub routes return 200.
- Every destination in the migration matrix returns 200.
- Every migrated legacy route redirects to its approved destination.
- `/solutions` and all known `/solutions/*` routes redirect.
- No shipped header/footer/mobile menu link points to `/solutions/*`.
- No redirect blocks `/use-solana`, `/enterprise`, `/products`, `/ecosystem`, or
  `/network`.
- Active nav state is correct for preserved and migrated routes.
- Shared chrome works across `web`, `docs`, `media`, and `templates`.
- Sitemap and canonical metadata use the new canonical routes.
- Targeted lint, typecheck, unit tests, and web build pass.
