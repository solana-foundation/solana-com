# Solana.com Navigation Restructure Functional Specification

## Overview

This specification defines the proposed Solana.com header, mega menu, footer,
URL migration, and supporting information architecture restructure.

The revised structure is audience and product-led, with `Ecosystem` acting as
the umbrella for network, community, events, founders, grants, and legacy
ecosystem material.

Final proposed primary navigation:

1. Use Solana
2. Build
3. Enterprise
4. Products
5. Ecosystem

`Network` is no longer a top-level header item. Network content remains
important and should live prominently under `Ecosystem`, with selected network
proof also linked from `Enterprise`.

This is a functional implementation spec. Agents should use it as the source of
truth for IA, sequencing, acceptance criteria, and instrumentation, while
following normal repo process separately where required.

Conceptual destinations in this document are intentional. Do not create
placeholder pages or dead links just to satisfy the menu structure. If a
destination does not have an approved page yet, use an existing canonical route
where one clearly fits, or omit that shipped link until the page is ready.

## Repo Context

The Solana.com repo is a monorepo with shared chrome used across multiple apps.

Important implementation areas:

- `packages/ui-chrome/src/header-section-metadata.ts`
- `packages/ui-chrome/src/header-sections.tsx`
- `packages/ui-chrome/src/header-list.*.tsx`
- `packages/ui-chrome/src/nav-section-content-config.tsx`
- `packages/ui-chrome/src/nav-types.ts`
- `packages/ui-chrome/src/nav-active.ts`
- `packages/ui-chrome/src/mobile-menu.tsx`
- `packages/ui-chrome/src/inkeep-searchbar.tsx`
- `packages/ui-chrome/src/inkeep-chat-button.tsx`
- `packages/ui-chrome/src/footer.tsx`
- `packages/i18n/messages/web/*/common.json`
- `apps/web/rewrites-redirects.ts`
- `apps/web/src/app/[locale]/*`
- `apps/media/app/api/posts/latest/route.ts`
- `apps/media/app/api/reports/latest/route.ts`

The shared `Header` and `Footer` are used by:

- `apps/web`
- `apps/docs`
- `apps/media`
- `apps/templates`

This means navigation changes affect more than the marketing app. Delivery must
include cross-app QA.

Current shared chrome is keyed around the existing section IDs `learn`,
`developers`, `solutions`, `network`, and `community`. Implementation must
update typed section IDs, icon mappings, menu content mappings, active-route
rules, desktop menu behavior, mobile menu behavior, and translations together.
Do not only rename visible labels.

## Current-State Findings

The current header is structurally organized as:

- Learn
- Developers
- Solutions
- Network
- Community

However, the English nav label for `nav.solutions.title` is already `Products`,
while the code, routes, and content still use `solutions`.

This creates a mismatch:

- Public label: Products
- Route namespace: `/solutions/*`
- Code namespace: `solutions`
- Analytics/history: solutions pages

The restructure should resolve this mismatch over time through staged URL
migration.

## Goals

1. Make the highest-priority audience paths obvious.
2. Put `Use Solana` first because wallet/user intent is significant and
   fragmented.
3. Remove `Learn`, `Solutions`, `Network`, and `Community` as top-level header
   labels.
4. Introduce `Enterprise` as the market-facing institutional path.
5. Introduce `Products` as the durable home for Foundation/product-team
   initiatives.
6. Use `Ecosystem` as the umbrella for network, community, events, founders,
   grants, jobs, and legacy ecosystem material.
7. Keep events visible because they are central to Solana.com promotional
   cycles.
8. Preserve critical canonical routes where they have strong existing value.
9. Use staged migration so the IA can move forward without forcing all content
   and URL migrations into one release.
10. Allow dynamic content inside mega menus without making critical paths
    dependent on dynamic content.

## Non-Goals

This specification does not define:

- Final visual design
- Final page copy
- Final SEO metadata
- Final legal-approved SOL, staking, or token language
- Final CMS schema changes
- Final redirect map for every route
- Final product page ownership model

## Primary Navigation

The primary header navigation should contain:

1. Use Solana
2. Build
3. Enterprise
4. Products
5. Ecosystem

`Build` is the public header label for the existing developer audience path. The
Build menu's primary CTA or landing-page link should continue to route to the
existing `/developers` hub unless a separate SEO-approved migration creates a
better destination. Do not create a `/build` route as part of this restructure.

Persistent utilities:

- Search / Ask AI
- Language selector
- Optional contextual CTA

`Use Solana` may receive stronger visual treatment because it is the first-path
user entry point, but it still needs a mega menu.

## Header Behavior

Each top-level navigation item should open a mega menu on desktop.

Mega menus should include:

- Static high-intent links
- Optional short descriptions
- One dynamic content module where useful
- A clear primary CTA where applicable

On mobile, the navigation should collapse into an accessible menu with the same
hierarchy.

Functional acceptance criteria:

1. Desktop header shows the five top-level items in the specified order.
2. Each top-level item opens a menu and supports pointer and keyboard access.
3. Mobile menu exposes the same five sections and the same practical hierarchy.
4. Active state rules map existing routes into the new IA, including preserved
   routes such as `/learn`, `/developers`, `/solutions/*`, `/wallets`,
   `/events`, `/community`, `/validators`, `/news`, `/reports`, and `/podcasts`.
5. Cross-app links continue to use the shared chrome link behavior so docs,
   media, templates, and web routes do not accidentally become broken client
   transitions.
6. No shipped menu item points to a route that is known to redirect away from
   the intended destination unless that redirect is the intended canonical
   behavior.
7. Dynamic modules are additive. If they fail, static menu links remain visible
   and usable.

## Mega Menu Requirements

### Use Solana

Purpose: serve users, wallet users, retail visitors, and crypto-curious visitors
with fragmented but common intent.

Primary links:

- Wallets (`/wallets`)
- Learn the Basics (`/learn`)
- Safety
- Tokens
- Help / Ask AI

Conditional links, pending legal review:

- Staking (`/staking`)
- Issuance or token basics

Notes:

- `Use Solana` is acceptable as an action-based label because noun labels like
  `Users` are less clear.
- Inkeep/Search should be especially visible here because user questions are
  fragmented.
- SOL and staking-related content must use legally approved factual language.
- `Learn` should not be top-level; beginner education should be embedded here.
- `Use Solana` should be broader than wallets, but wallets are likely the
  highest-intent entry point.

Dynamic module:

- Popular help topic, wallet guide, safety guide, or user-facing explainer.

### Build

Purpose: help builders quickly start, build, debug, and scale on Solana.

Recommended sections:

- Start Building: Quickstart (`/docs/intro/quick-start`), Docs (`/docs`),
  Grants, Support
- Tools: Docs (`/docs`), RPC (`/rpc` or `/docs/rpc` depending on user intent),
  Templates (`/developers/templates`), SDKs, Token Extensions, Actions/Blinks,
  payment tooling, game tooling
- Build By Use Case: Tokens, Wallets, Payments (`/developers/payments`), DeFi
  (`/developers/defi`), Gaming (`/developers/gaming`), Agents

Notes:

- `Build` navigation should be task-based.
- `Tools` should be a subsection inside `Build`, not a top-level header item.
- `DeFi` should remain visible for crypto-native developer discoverability.
- `Internet Capital Markets` may appear in supporting copy, but developers still
  expect concrete technical labels.
- `Agents` should appear here because builders may arrive looking for agent
  tooling or integration guidance.
- `Support` should cover community and builder-journey assistance, not only
  direct ticket-based support.
- The existing secondary developer nav should be audited after the primary nav
  change.

Dynamic module:

- Latest developer guide, release, template, or technical update.

### Enterprise

Purpose: help organizations validate Solana as mature infrastructure for
financial products, payments, tokenization, privacy, and capital markets.

Primary links:

- Payments
- Tokenization
- Internet Capital Markets
- Privacy
- Real-World Assets
- Network Facts
- Data
- Reports
- Case Studies
- Contact

Notes:

- `Solutions` should not be used as the public top-level label.
- Enterprise pages should be organized around business outcomes and
  institutional validation.
- `Payments` should absorb institutional payments, stablecoins, remittance,
  settlement, and commerce tooling.
- `Internet Capital Markets` should absorb DeFi, liquidity, trading, RWAs where
  appropriate, and capital-market use cases.
- `Tokenization` should remain market-facing and distinct from Token Extensions.
- `Privacy` should be a named enterprise topic.
- Enterprise should retain direct paths to network proof, reports, data, and
  facts even though `Network` is no longer top-level.
- SDP may appear here when framed as a platform for launching and scaling
  financial products.

Dynamic module:

- Latest case study, report, enterprise launch, or institutional proof point.

### Products

Purpose: provide a durable home for current and future
product-team/Foundation-led product surfaces.

Recommended sections:

- Platforms & Tools: Solana Developer Platform, Pay.sh, Agents, Data, Tokens.xyz
- Product updates driven by news engine

Notes:

- `Products` should be flexible enough to catch future Foundation/product-team
  priorities.
- `Products` should not be treated as a one-for-one replacement for all existing
  `/solutions/*` pages.
- `Platforms & Tools` should cover productized Foundation surfaces and durable
  product-team priorities.
- Product ordering may be driven by SEO, launch priority, or current strategic
  importance.
- x402 should be represented through Pay.sh unless x402 needs to remain a
  standalone route during migration.
- `Data` should be a product bucket for data-centric pages and tools.
- `Tokens.xyz` should have a Solana.com landing page that explains the surface
  and links out.
- Token Extensions should be deemphasized because adoption has been limited. It
  may still be referenced as protocol functionality where relevant.
- Agents should have a product page.
- Product pages should use factual language consistent with official releases.

Dynamic module:

- Latest product launch, changelog, release post, or integration update.

### Ecosystem

Purpose: act as the broad umbrella for network, community, events, grants,
founders, jobs, public engagement, and legacy/historical ecosystem material.

Recommended sections:

- Network
- Events
- Community
- Founders
- Grants and Funding
- Hackathons
- Jobs
- Ecosystem Partners
- Legacy and Historical Initiatives

Network links:

- Network overview
- Live Metrics
- Data
- Validators
- Fees
- Decentralization
- Explorers
- Dashboards
- Reports
- Issuance and Inception
- Status

Events links:

- Events
- Breakpoint
- Submit an event
- Host an event

Community links:

- Community
- News
- Podcasts
- Social channels
- Community resource hub

Notes:

- Breakpoint/event promo banner appears under Ecosystem but promo section will
  be available for any menu section.
- Events must remain easy to find because they are a major promotional cycle on
  Solana.com.
- Network must be prominent inside `Ecosystem`, because it still serves
  validators, analysts, funds, enterprise diligence, and technically curious
  users.
- `Ecosystem Partners` should cover teams, brands, and products that have
  supported Solana events, programs, and ecosystem initiatives, including
  previous event sponsors.
- Status should not be a top-level header item, but should be available from
  Ecosystem/Network and footer.
- `Ecosystem` may need a new landing page, but that should be staged.

Dynamic module:

- Breakpoint banner, upcoming event, ecosystem announcement, network report,
  grant/hackathon announcement, or community update.

## Event and Promotional Requirements

Events are not just community content in the current repo.

Current event-related behavior includes:

- Homepage event carousel
- `/events`
- Multiple Luma calendars
- Breakpoint promotional banner in the current Community mega menu
- Campaign/event pages such as Breakpoint, hackathons, privacyhack, and
  universities hackathon pages

Requirements:

1. Events should remain first-class inside `Ecosystem`.
2. `/events` should remain canonical.
3. Breakpoint banner should appear only under `Ecosystem`.
4. Event archive should remain discoverable.
5. Submit/host event CTAs should remain discoverable.
6. Homepage event modules should continue independently from nav IA.
7. Event content should not depend on a top-level `Community` header item.

## Footer Requirements

The footer should be large and explicit. It should help users recover if they
reach the bottom of a page without finding the right path.

Recommended footer columns:

- Use Solana
- Build
- Enterprise
- Products
- Ecosystem
- Foundation

### Use Solana

- Wallets (`/wallets`)
- Learn the Basics (`/learn`)
- Safety
- Tokens
- Help / Ask AI
- SOL or staking (`/staking`) links only if legally approved

### Build

- Start Building: Quickstart (`/docs/intro/quick-start`), Docs (`/docs`),
  Grants, Support
- Tools: Docs (`/docs`), RPC (`/rpc` or `/docs/rpc`), Templates
  (`/developers/templates`), SDKs, Token Extensions, Actions/Blinks, payment
  tooling, game tooling
- Build By Use Case: Tokens, Wallets, Payments (`/developers/payments`), DeFi
  (`/developers/defi`), Gaming (`/developers/gaming`), Agents

### Enterprise

- Payments
- Tokenization
- Internet Capital Markets
- Privacy
- Real-World Assets
- Network Facts
- Data
- Reports
- Case Studies
- Contact

### Products

- Platforms & Tools: Solana Developer Platform, Pay.sh, Agents, Data, Tokens.xyz
- Product Updates

### Ecosystem

- Network
- Events
- Community
- Founders
- Grants
- Hackathons
- Jobs
- Ecosystem Partners
- Legacy initiatives
- Historical programs

Network should be a subsection inside `Ecosystem` rather than a separate footer
column.

- Live Metrics
- Validators
- Multiple Clients
- Fees
- Decentralization
- Explorers
- Dashboards
- Reports
- Issuance and Inception
- Status

### Foundation

- About
- Press
- Brand
- Careers
- Contact
- Legal
- Privacy
- Terms
- Solana Policy Institute
- Government engagement
- Policy resources

## Canonical URL Strategy

The final URL model should use the new information architecture where it creates
clarity and SEO value.

New IA labels do not require matching URL namespaces. Existing high-value or
operational routes should remain canonical when they already match the user
intent. New hubs should link to those routes instead of duplicating them, and
optional nested aliases should redirect or canonicalize back to the established
route unless SEO review approves a migration.

Canonical top-level hubs:

- `/use-solana`
- `/developers`
- `/enterprise`
- `/products`
- `/ecosystem`
- `/network`

Known current route conflicts and implementation requirements:

- `/ecosystem(.*)` currently redirects to `/`. Before `/ecosystem` can become a
  canonical hub, that redirect must be removed or replaced with narrower legacy
  redirects that do not capture the new hub.
- `/enterprise` currently redirects to `/solutions/enterprise`. Before
  `/enterprise` can become a canonical hub, that redirect must be removed or
  changed to the approved canonical destination.
- `/use-solana`, `/products`, and `/network` require real app routes before they
  are linked as landing-page destinations.
- Top-level header triggers may ship before these hubs exist because they open
  mega menus. Any menu CTA that points to a hub must wait until that hub exists
  or use an existing canonical destination.

Canonical routes that should remain because they are already strong or
operationally important:

- `/events`
- `/community`
- `/validators`
- `/wallets`
- `/docs`
- `/learn`
- `/news`
- `/reports`
- `/podcasts`
- `/rpc`
- `/developers/templates`
- `/developers/guides`
- `/developers/cookbook`

`/network` should become a canonical hub, but important existing routes such as
`/validators` should remain canonical unless a separate migration decision is
made.

Existing routes that should receive traffic, SEO, and ownership review before
any consolidation:

- `/solana-wallets`
- `/staking`
- `/x402`
- `/agent-registry`
- `/skills`

## Staged Migration Plan

The migration should be gradual. We won't attempt all page consolidation,
redirects, content rewrites, and dynamic menu work in one release.

### Stage 0: Approval and Planning

- Approve final top-level nav.
- Approve route migration principles.
- Identify page ownership by section.
- Identify legal-sensitive content.
- Identify event/promo ownership.

### Stage 1: Header and Footer Restructure

- Update shared chrome to support:
  - Use Solana
  - Build
  - Enterprise
  - Products
  - Ecosystem
- Build new large footer.
- Keep existing canonical pages live.
- Link to existing routes where new pages do not exist yet.
- Treat new IA labels as navigation groupings first; do not rename routes just
  to match the header labels.
- Update typed nav section IDs, section metadata, section component mappings,
  mobile menu mappings, active-route rules, and translations as one unit.
- Top-level header items may be menu triggers only; they do not need to navigate
  to new hub pages during Stage 1.
- Do not ship dead, placeholder, or self-redirecting CTA links for conceptual
  pages that do not exist yet.
- Add clear TODOs for routes that need future migration.
- Move Breakpoint/event banner into `Ecosystem`.
- Ensure header/footer work across `web`, `docs`, `media`, and `templates`.

### Stage 2: New Hub Pages

Create new hub pages:

- `/use-solana`
- `/enterprise`
- `/products`
- `/ecosystem`
- `/network`

These should be real landing pages, not thin link lists. They should complement
existing canonical routes such as `/wallets`, `/learn`, `/events`, `/community`,
`/validators`, `/docs`, and `/developers`, not replace them by default.

Before shipping `/ecosystem` and `/enterprise`, resolve the current redirects
that send those routes away from the intended canonical hubs.

### Stage 3: Priority Route Migration

Migrate high-priority `/solutions/*` routes into the new structure.

Do not treat `Products` as the default destination for all legacy `solutions`
content. Route each page based on audience, ownership, and intent.

Likely mappings:

- `/solutions/tokenization` -> `/enterprise/tokenization`
- `/solutions/institutional-payments` -> `/enterprise/payments`
- `/solutions/stablecoins` -> `/enterprise/payments` or
  `/enterprise/stablecoins`
- `/solutions/commerce-tooling` -> `/enterprise/payments`
- `/solutions/real-world-assets` -> `/enterprise/real-world-assets`
- `/solutions/financial-infrastructure` ->
  `/enterprise/financial-infrastructure`
- `/solutions/financial-institutions` -> `/enterprise/financial-institutions`
- `/solutions/enterprise` -> `/enterprise`
- `/solutions/sdp` -> `/products/solana-developer-platform`
- `/solutions/ai` -> `/products/agents` or `/enterprise/agents`, depending on
  final product framing
- `/solutions/actions` -> `/developers/actions` or `/products/pay-sh`, depending
  on final product framing
- `/solutions/games-tooling` -> `/developers/gaming`
- `/solutions/payments-tooling` -> `/developers/payments` or
  `/enterprise/payments`
- `/solutions/token-extensions` -> `/developers/tokens` or
  `/enterprise/tokenization`, depending on final positioning
- `/solutions/consumer` -> `/wallets`, `/use-solana/apps`, or another existing
  user-facing route based on content fit and SEO review
- `/solutions/depin`, `/solutions/desci`, `/solutions/btcfi`,
  `/solutions/gaming-and-entertainment`, `/solutions/artists-creators`, and
  `/solutions/request-for-startups` -> `Ecosystem` destinations or retained
  until a clear replacement exists

Do not redirect until replacement pages are ready and QA'd.

### Stage 4: Use Solana Consolidation

Create and consolidate user paths while preserving strong existing URLs:

- Wallets: keep `/wallets` canonical. Only create `/use-solana/wallets` as an
  alias if needed, and redirect or canonicalize it to `/wallets`.
- Existing wallet legacy path: review `/solana-wallets` traffic before deciding
  whether it redirects to `/wallets`, remains live, or becomes a transitional
  alias.
- Apps: prefer an existing high-value destination if one exists before creating
  `/use-solana/apps`.
- Safety: create `/use-solana/safety` only if there is no existing high-value
  safety route to preserve.
- Tokens: create `/use-solana/tokens` only after legal and SEO review; link to
  Tokens.xyz or product pages where that is the better user path.
- Basics: keep `/learn` canonical for broad education unless SEO review approves
  a narrower replacement. `/use-solana/basics` should not replace `/learn` by
  default.

Do not consolidate SOL or staking content until legal language is approved. If
staking is linked, preserve the existing `/staking` path unless SEO and legal
review approve a different destination.

### Stage 5: Products Consolidation

Create or consolidate product pages:

- `/products/solana-developer-platform`
- `/products/pay-sh`
- `/products/agents`
- `/products/data`
- `/products/tokens`

Existing routes such as `/x402`, `/agent-registry`, `/skills`, and
`/solutions/sdp` should be consolidated where it makes sense, but not forced
prematurely. Keep those existing routes live until replacement product pages are
complete, stronger than the existing destination, and approved for
redirect/canonical changes.

### Stage 6: Dynamic Content

Add dynamic mega menu modules using tagged content from media/report APIs and
event sources.

Dynamic content should be tag-driven and scoped:

- Use Solana: wallet/user guides, safety content, popular help topics
- Build: technical guides, templates, docs updates
- Enterprise: reports, case studies, institutional announcements
- Products: launches, changelogs, product updates
- Ecosystem: events, Breakpoint, grants, community, network reports

Dynamic modules must fail silently. Static nav must remain usable.

### Stage 7: Redirects and Cleanup

- Add redirects only after destination pages are complete.
- Remove or narrow legacy redirects that block approved new hubs, including the
  current `/ecosystem(.*)` and `/enterprise` redirects.
- Update sitemap generation.
- Update canonical metadata.
- Update internal links.
- Remove stale nav labels.
- Clean up deprecated `/solutions/*` pages only after analytics confirms
  migration stability.

## Route Migration Principles

1. New URLs should be introduced before old URLs are removed.
2. Old high-traffic routes should redirect only after replacement pages exist.
3. Existing campaign/event URLs should remain stable unless there is a strong
   reason to move them.
4. Existing high-value routes such as `/wallets`, `/learn`, `/docs`,
   `/developers`, `/developers/guides`, `/developers/cookbook`,
   `/developers/templates`, `/rpc`, `/events`, `/community`, `/validators`,
   `/news`, `/reports`, and `/podcasts` should remain canonical unless SEO
   review approves a migration.
5. `/network` should become a canonical hub.
6. `/solutions/*` should gradually migrate into `/enterprise/*`, `/products/*`,
   `/developers/*`, `/use-solana/*`, or `/ecosystem/*` based on audience and
   intent.
7. New IA buckets can link to existing canonical route targets; a bucket name
   does not require a matching nested URL.
8. Product pages can link to external surfaces such as Tokens.xyz.
9. Internal nav labels should match user-facing IA even while route migration is
   staged.

## Content Placement Rules

### Wallets and User Education

Primary location:

- Use Solana

Canonical routes:

- `/wallets`
- `/learn`

Routes requiring review before consolidation:

- `/solana-wallets`
- `/staking`

Notes:

- `Use Solana` should make wallets and beginner education easy to find without
  forcing `/wallets` or `/learn` into nested `/use-solana/*` paths.
- `/solana-wallets` should not be redirected until traffic and SEO impact are
  reviewed.
- `/staking` should remain separate unless legal-approved language and SEO
  review support a different destination.

### Payments

Primary location: Enterprise.

Should include:

- Institutional payments
- Stablecoins
- Remittance
- Settlement
- Commerce tooling
- Relevant Pay.sh references

### Tokenization

Primary location: Enterprise.

Should cover:

- Asset tokenization
- Real-world assets
- Issuance use cases
- Institutional validation

Tokenization is separate from Token Extensions.

### Token Extensions

Primary treatment: deemphasized.

Should be referenced only where technically relevant, such as protocol or
developer content.

### Internet Capital Markets

Primary location: Enterprise.

Developer equivalent:

- DeFi

Should cover:

- Liquidity
- Trading
- DeFi
- RWAs where relevant
- Capital-market use cases

### Agents

Primary location: Products.

Secondary locations:

- Build
- Enterprise, if there is an institutional/product use case

Should be framed around productized agent workflows, Pay.sh, agent payments,
APIs, and Solana as fast, neutral infrastructure.

### Data

Primary locations:

- Products
- Enterprise
- Ecosystem / Network

Products framing:

- Data-centric products, APIs, tools, and product surfaces.

Enterprise framing:

- Business validation, institutional diligence, case studies, reports, and
  market proof.

Network framing:

- Live metrics, dashboards, network facts, reports, and technical proof.

### Tokens.xyz

Primary location:

- Products

Secondary possible location:

- Use Solana

Solana.com should provide an explanatory landing page, then link out to
Tokens.xyz.

This helps capture Solana.com SEO value while avoiding excessive token-price
discussion on Solana.com.

### Events

Primary location:

- Ecosystem

Canonical route:

- `/events`

Notes:

- Events should not become hidden just because Community leaves the top-level
  nav.
- Breakpoint banner belongs only in the `Ecosystem` menu.

### Network

Primary location:

- Ecosystem

Canonical hub:

- `/network`

Important preserved canonical routes:

- `/validators`
- Status external link
- Explorers external links

Enterprise should still link to network proof directly.

## Dynamic Content Requirements

Mega menus should support dynamic content modules.

Each dynamic module should be tag-driven and scoped to the current menu:

- Use Solana: help articles, safety guides, wallet education
- Build: technical guides, releases, templates, docs updates
- Enterprise: case studies, reports, institutional announcements
- Products: launches, changelogs, product updates
- Ecosystem: events, Breakpoint, grants, community, network reports

Dynamic modules should never be the only path to critical content.

If dynamic content fails to load, the static menu must remain fully usable.

Implementation requirements:

- Normalize dynamic menu content before rendering. The menu should not depend on
  raw API response shapes.
- Minimum normalized fields: `id`, `title`, `href`, `contentType`, and `source`.
- Optional normalized fields: `description`, `eyebrow`, `image`, `publishedAt`,
  `tag`, and `campaignId`.
- Posts and reports may use the existing latest-content APIs with `tag` and
  `limit` query params.
- Events may use existing event sources, but event content should be normalized
  to the same card contract before entering shared chrome.
- Dynamic fetch failures, empty responses, and malformed records must render no
  dynamic module rather than breaking or delaying the static menu.
- Dynamic modules must not create layout shift that changes the position of
  static critical links after user interaction.

## Search / Ask AI Requirements

Search or Ask AI should be persistently available in the header.

Expected role:

- Capture long-tail user questions
- Reduce pressure on navigation
- Support fragmented retail/user intent
- Help users find documentation, wallet guidance, network facts, and product
  information

Search should be treated as complementary to IA, not a replacement for clear
primary paths.

## Localization Requirements

Localized high-performing content should influence prioritization.

Known high-performing localized topics include:

- Tokenization
- Institutional payments
- Wallets
- Basic Solana education

Localized menus do not need different IA by default, but translated pages should
preserve discoverability for high-intent topics.

## Legal and Compliance Considerations

Legal review is required before publishing or prominently linking content
related to:

- SOL
- Staking
- Token price
- Token purchasing
- Yield
- Issuance and inflation
- Investment language

Preferred language should be factual and consistent with official public
releases.

Tokens.xyz should be used as the primary destination for token-market surfaces
where appropriate.

## Analytics Requirements

Use lower snake case event names. Prefer one shared tracking helper in shared
chrome so header, mobile menu, and footer events use the same schema.

Common properties for all navigation analytics events:

- `event_schema_version`: `nav_ia_v1`
- `app_name`: value from `NEXT_PUBLIC_APP_NAME` where available
- `locale`
- `current_path`
- `nav_surface`: `header`, `mobile_menu`, `footer`, `hub_page`, or
  `developer_secondary_nav`
- `nav_section`: `use_solana`, `build`, `enterprise`, `products`, `ecosystem`,
  `network`, `foundation`, or `unknown`
- `nav_group`: submenu/group label when available
- `nav_item_id`: stable code/config ID when available
- `nav_item_label`
- `href`
- `destination_section`: best-known IA destination section
- `destination_type`: `internal`, `cross_app`, `external`, `dynamic`, `search`,
  or `cta`
- `is_external`
- `external_domain`: hostname for external links only
- `link_role`: `primary`, `secondary`, `cta`, `utility`, `dynamic_card`, or
  `promo`
- `position`: zero-based position inside the current group where practical
- `viewport`: `desktop`, `tablet`, or `mobile`

Event catalog:

### `nav_menu_opened`

Capture when a top-level desktop mega menu or mobile section is opened.

Additional properties:

- `trigger_method`: `hover`, `click`, `keyboard`, or `touch`
- `menu_variant`: `desktop_mega_menu` or `mobile_section`

### `nav_menu_closed`

Capture when practical, especially on mobile and keyboard flows.

Additional properties:

- `close_method`: `outside_click`, `escape`, `route_change`, `back`, or
  `unknown`
- `duration_ms`

### `nav_link_clicked`

Capture all static header, mobile menu, and footer link clicks.

Additional properties:

- `source_section`: same value as `nav_section`
- `source_group`: same value as `nav_group`
- `link_text`

### `nav_cta_clicked`

Capture primary CTAs inside menus and footer sections. This may be captured in
addition to `nav_link_clicked` when the CTA is strategically important.

Additional properties:

- `cta_id`
- `cta_label`
- `cta_context`: `use_solana`, `build`, `enterprise`, `products`, `ecosystem`,
  or `footer`

### `nav_dynamic_card_impression`

Capture when a dynamic module card becomes visible inside an open menu.

Additional properties:

- `content_id`
- `content_type`: `post`, `report`, `event`, `guide`, `template`, `release`, or
  `unknown`
- `content_source`: `posts_api`, `reports_api`, `events_source`, or `manual`
- `content_tag`
- `campaign_id`

### `nav_dynamic_card_clicked`

Capture dynamic module card clicks.

Additional properties:

- `content_id`
- `content_type`
- `content_source`
- `content_tag`
- `campaign_id`

### `nav_search_opened`

Capture when Search / Ask AI opens from the header, mobile menu, menu link, or
hub page.

Additional properties:

- `search_entrypoint`: `header_search`, `mobile_ask_ai`, `use_solana_help`,
  `docs_hero`, `hub_page`, or `unknown`
- `default_view`: `search` or `chat`
- `has_prefilled_query`

### `nav_search_submitted`

Capture only if supported without storing sensitive user input. Do not record
raw search query text by default.

Additional properties:

- `search_entrypoint`
- `query_length`
- `results_count`: when available
- `results_source`: `inkeep`, `site_search`, or `unknown`

### `nav_ai_chat_opened`

Capture when Ask AI opens in chat mode.

Additional properties:

- `search_entrypoint`
- `default_view`: `chat`

### `nav_ai_question_submitted`

Capture only if supported without storing sensitive user input. Do not record
raw prompts by default.

Additional properties:

- `search_entrypoint`
- `question_length`
- `conversation_source`: `inkeep` or `unknown`

### `ia_hub_page_viewed`

Capture for new IA hub pages, or enrich the existing `$pageview` with these
properties if that is cleaner in the current PostHog setup.

Additional properties:

- `ia_section`: `use_solana`, `build`, `enterprise`, `products`, `ecosystem`, or
  `network`
- `ia_landing_page`: `true`
- `canonical_path`

### `nav_product_outbound_clicked`

Capture outbound clicks from Products links and product CTAs.

Additional properties:

- `product_name`
- `outbound_category`: `product_surface`, `tool`, `docs`, `partner`, or
  `unknown`

### `tokens_xyz_outbound_clicked`

Capture Tokens.xyz outbound clicks separately because token-market surfaces are
business and compliance sensitive.

Additional properties:

- `origin_section`: `products`, `use_solana`, or `unknown`
- `origin_context`: `menu`, `footer`, `hub_page`, or `content`

### `event_promo_clicked`

Capture event and Breakpoint promo clicks from menus, footer, homepage modules,
and hub pages.

Additional properties:

- `promo_id`
- `promo_location`: `menu`, `footer`, `homepage`, `hub_page`, or `content`
- `promo_section`: source menu section when `promo_location` is `menu`
- `event_name`
- `event_route`
- `event_start_date`
- `campaign_id`

### `developer_start_clicked`

Capture high-intent builder starts such as Quickstart, Docs, Templates, and
developer hub clicks from Build.

Additional properties:

- `developer_destination`: `quickstart`, `docs`, `templates`, `rpc`, `cookbook`,
  `guides`, `support`, or `unknown`

Important reporting segments:

- Organic search
- Direct
- Referral
- Organic social
- Locale
- New vs returning users
- Build/developer page visitors
- Enterprise page visitors
- Use Solana/wallet visitors
- Ecosystem/event visitors

Cross-navigation between sections can be derived from `nav_link_clicked` where
`source_section` and `destination_section` differ.

## Open Questions

1. Exact visual treatment for `Use Solana` in the header.
2. Exact legal-approved language for staking, and token content.
3. Whether `Enterprise` should lead with Payments or Tokenization.
4. Whether `Products > Data` and `/network` data views are one shared hub or
   separate pages.
5. Final list of dynamic content tags.
6. Final redirect map for `/solutions/*`.
7. Whether `/x402`, `/agent-registry`, and `/skills` consolidate under
   `/products/*` or remain canonical product routes with product-nav placement.
8. Whether `/solana-wallets` consolidates into `/wallets`, and whether
   `/use-solana/wallets` should exist only as an alias to `/wallets`.
9. Final scope and timing for the new `/ecosystem` landing page.
