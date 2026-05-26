# Solana.com Navigation Restructure Functional Specification

## Overview

This specification defines the proposed Solana.com header, mega menu, footer,
hub pages, and information architecture restructure.

The revised structure is audience and product-led:

1. Use Solana
2. Build
3. Enterprise
4. Products
5. Ecosystem

`Solutions` is no longer a top-level header label, but `/solutions` remains a
canonical long-tail SEO route namespace and content type. The restructure should
make the header audience-targeted while preserving solution endpoints and search
equity.

`Network` is no longer a top-level header item. Network content remains
important and should live prominently under `Ecosystem`, with selected network
proof also linked from `Enterprise`.

This is the functional strategy. The implementation checklist is:

`plan/solana-com-navigation-build-plan.md`

## Core IA Principle

Separate three concerns:

1. **Navigation bucket**: the user-facing top-level menu section.
2. **Route namespace**: the canonical URL where the page lives.
3. **Content type**: solution/use case, product, ecosystem category, network
   proof, guide, event, report, or hub.

The new nav does not require every page to move into a matching route namespace.
For example, an Enterprise menu item may link to `/solutions/tokenization` if
that is the strongest current canonical page for the user's intent.

## Hybrid Solutions Policy

Keep `/solutions` and `/solutions/*` canonical unless a separate SEO decision
approves a specific redirect.

The old plan to fully migrate `/solutions/*` into `/enterprise/*`,
`/products/*`, or `/ecosystem/*` is no longer the recommended direction.

Instead:

- Preserve `/solutions` as a Solutions / Use Cases hub.
- Preserve existing `/solutions/*` pages for long-tail search demand.
- Rework solution page copy, CTAs, related links, and reusable components so the
  pages work from audience-led menus.
- Let Enterprise, Products, Build, Ecosystem, and Use Solana menus link directly
  to preserved solution pages where those are the best current destinations.
- Create audience-specific leaf pages only when the intent is materially
  different from the broad solution page.
- Do not redirect solution pages to broad hubs.
- Do not add a `/solutions/:path*` fallback redirect.

Example:

- `/solutions/depin`: broad DePIN solution/use-case page.
- Future `/enterprise/depin`: enterprise evaluator page, only if it has a
  distinct business-validation story.
- Future `/ecosystem/depin`: ecosystem landscape page, only if it has a distinct
  ecosystem-discovery story.

These pages may share data, logos, stats, and proof-point components, but they
should not be thin duplicates.

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
- `apps/web/scripts/generate-sitemap.ts`
- `apps/media/app/api/posts/latest/route.ts`
- `apps/media/app/api/reports/latest/route.ts`

The shared `Header` and `Footer` are used by:

- `apps/web`
- `apps/docs`
- `apps/media`
- `apps/templates`

This means navigation changes affect more than the marketing app. Delivery must
include cross-app QA.

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

The restructure should resolve the public navigation mismatch without removing
the `/solutions` route namespace. `Products` should become a real audience/menu
bucket, while `/solutions/*` remains a route namespace for solution and use-case
SEO.

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
9. Preserve `/solutions` long-tail SEO and use audience-led menu placement
   rather than forced redirects.
10. Allow future audience-specific pages only when they have distinct search
    intent and value proposition.
11. Maintain dynamic promo/content modules inside mega menus without making
    critical paths dependent on dynamic content.

## Non-Goals

This specification does not define:

- A new visual design for the current navigation
- Final page copy
- Final SEO metadata
- Final legal-approved SOL, staking, or token language
- Final CMS schema changes
- Final redirect map for every route
- Final product page ownership model
- Full `/solutions/*` route migration

## Required Hub Pages

Create these real hub pages:

- `/use-solana`
- `/enterprise`
- `/products`
- `/ecosystem`
- `/network`

These hubs should be real audience entry points, not thin link lists. They
should link to existing canonical pages, including `/solutions/*`, where those
routes are the best current destination.

Current redirect blockers:

- `/ecosystem(.*)` currently redirects to `/`; remove or narrow this before
  `/ecosystem` can work.
- `/enterprise` currently redirects to `/solutions/enterprise`; remove this
  before `/enterprise` can work.

Do not redirect `/solutions/enterprise` to `/enterprise`. They serve different
roles:

- `/enterprise`: audience hub.
- `/solutions/enterprise`: solution/use-case page.

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

Design requirement:

- Preserve the current Solana.com nav design and interaction model.
- Treat shadcn/Radix components as implementation primitives only where needed
  for accessibility, behavior, maintainability, or shared reuse.
- Do not ship generic default shadcn styling in place of the existing Solana.com
  header, mega menu, mobile menu, or footer treatment.
- Keep visual changes targeted to what is required for the new IA to fit and
  remain accessible.

Persistent utilities:

- Search / Ask AI
- Language selector
- Optional contextual CTA

## Header Behavior

Each top-level navigation item should open a mega menu on desktop.

Mega menus should include:

- Static high-intent links
- Optional short descriptions
- A clear primary CTA where applicable
- A section-scoped dynamic promo/content module where configured

On mobile, the navigation should collapse into an accessible menu with the same
practical hierarchy.

Functional acceptance criteria:

1. Desktop header shows the five top-level items in the specified order.
2. Each top-level item opens a menu and supports pointer and keyboard access.
3. Mobile menu exposes the same five sections and practical hierarchy.
4. Active state rules map existing routes into the new IA, including preserved
   routes such as `/learn`, `/developers`, `/solutions/*`, `/wallets`,
   `/events`, `/community`, `/validators`, `/news`, `/reports`, and `/podcasts`.
5. Cross-app links continue to use shared chrome link behavior.
6. No shipped menu item points to a route that is known to redirect away from
   the intended destination unless that redirect is the intended canonical
   behavior.
7. Dynamic modules are additive. If they fail, static menu links remain visible
   and usable.
8. The header, mega menu, and mobile menu retain the current Solana.com visual
   design unless a targeted accessibility or fit issue requires adjustment.

Dynamic modules are a maintained capability, not a replacement for static IA.
They should resolve from the current nav section and support contextual
promotion such as Breakpoint under `Ecosystem`, report highlights under
`Enterprise` or `Ecosystem`, product launches under `Products`, and technical
content under `Build`.

## Mega Menu Requirements

The menu listings below are the concrete launch inventory under each top-level
heading. They are menu placement decisions, not route migrations. Links should
point to preserved canonical routes, including `/solutions/*`, when those pages
are the best current destination.

Do not ship links to placeholder pages, self-redirecting pages, or future-only
routes. If a listed route is not live at implementation time, omit that menu
item until it is live or link to the approved existing canonical route.

### Use Solana

Purpose: serve users, wallet users, retail visitors, and crypto-curious visitors
with fragmented but common intent.

Primary CTA:

- `/use-solana`

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

- `Use Solana` is acceptable as an action-based label because noun labels like
  `Users` are less clear.
- SOL and staking-related content must use legally approved factual language.
- `Learn` should not be top-level; beginner education should be embedded here.
- Link staking only with neutral labels and existing approved destinations.

### Build

Purpose: help builders quickly start, build, debug, and scale on Solana.

Primary CTA:

- `/developers`

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

- `Build` navigation should be task-based.
- `Tools` should be a subsection inside `Build`, not a top-level header item.
- Developers still expect concrete technical labels.
- The existing secondary developer nav should be audited after the primary nav
  change.

### Enterprise

Purpose: help organizations validate Solana as mature infrastructure for
financial products, payments, tokenization, privacy, capital markets, and other
business use cases.

Primary CTA:

- `/enterprise`

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

- `Solutions` should not be used as the public top-level label.
- Enterprise is an audience lens, not necessarily a route namespace for every
  use case.
- Enterprise may link to preserved `/solutions/*` pages when those pages are the
  best canonical destination.
- Create `/enterprise/*` leaf pages only when the enterprise version is
  materially different from the solution page.
- Enterprise should retain direct paths to network proof, reports, data, and
  facts even though `Network` is no longer top-level.

### Products

Purpose: provide a durable home for current and future product-team/Foundation
product surfaces.

Primary CTA:

- `/products`

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

- `Products` should be flexible enough to catch future product-team priorities.
- `Products` is not a one-for-one replacement for `/solutions/*`.
- Do not move `/x402`, `/agent-registry`, or `/skills` under `/products/*`
  without product and SEO approval.
- Product pages should use factual language consistent with official releases.
- Tokens.xyz may need a Solana.com explanatory landing page later, but that is
  not required for this delivery.

### Ecosystem

Purpose: act as the broad umbrella for network, community, events, grants,
founders, jobs, public engagement, and ecosystem categories.

Primary CTA:

- `/ecosystem`

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

- Events must remain easy to find.
- Breakpoint/event promo banner appears under `Ecosystem` by default.
- Network must be prominent inside `Ecosystem`.
- Ecosystem may link to preserved `/solutions/*` category pages where those are
  the canonical current destination.
- Create `/ecosystem/*` category pages only when the ecosystem version is
  materially different from the solution/use-case page.

## Event and Promotional Requirements

Events are not just community content in the current repo.

Requirements:

1. Events should remain first-class inside `Ecosystem`.
2. `/events` should remain canonical.
3. Breakpoint banner should appear under `Ecosystem` by default, with other
   section placements allowed only when explicitly configured.
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

Footer columns may link to `/solutions/*` pages where those pages are the
canonical route for the linked topic.

Network should be a subsection inside `Ecosystem` rather than a separate footer
column.

## Canonical URL Strategy

New IA labels do not require matching URL namespaces. Existing high-value or
operational routes should remain canonical when they already match user intent.

Canonical top-level hubs:

- `/use-solana`
- `/developers`
- `/enterprise`
- `/products`
- `/ecosystem`
- `/network`
- `/solutions`

Canonical route families to preserve:

- `/solutions`
- `/solutions/*`
- `/events`
- `/community`
- `/validators`
- `/wallets`
- `/solana-wallets`, pending separate SEO decision
- `/docs`
- `/docs/*`
- `/learn`
- `/learn/*`
- `/news`
- `/reports`
- `/podcasts`
- `/rpc`
- `/developers`
- `/developers/templates`
- `/developers/guides`
- `/developers/cookbook`
- `/x402`
- `/agent-registry`
- `/skills`

Redirect policy:

- Remove or narrow redirects that block approved hubs, specifically current
  `/ecosystem(.*)` and `/enterprise` redirects.
- Keep `/solutions/*` canonical. Do not redirect solution pages to broad hubs.
- Keep or add redirects only for true aliases, misspellings, dead paths, or
  explicit retired pages.
- Do not add `/solutions/:path*` fallback redirects.
- Do not redirect unknown legacy solution paths to a broad hub.

## Audience-Specific Page Rules

Create audience-specific leaf pages only when the page is meaningfully distinct
from the existing solution page.

Before creating `/enterprise/{topic}`, `/products/{topic}`, or
`/ecosystem/{topic}`, confirm:

- The H1 and core promise are different from the existing solution page.
- The audience has a distinct evaluation path.
- The CTA path is different.
- The proof points or examples are different enough to avoid thin duplication.
- The canonical relationship is clear.

If those conditions are not met, link to the existing `/solutions/{topic}` page
from the relevant menu instead.

## Staged Plan

### Stage 0: Approval and Planning

- Approve final top-level nav.
- Approve that `/solutions` and `/solutions/*` remain canonical.
- Identify page ownership by section and solution topic.
- Identify legal-sensitive content.
- Identify event/promo ownership.
- Identify dynamic module ownership, launch inventory, and fallback promo for
  each top-level menu.

### Stage 1: Hub Pages

Create:

- `/use-solana`
- `/enterprise`
- `/products`
- `/ecosystem`
- `/network`

These should complement existing canonical routes and link to `/solutions/*`
where appropriate.

### Stage 2: Header and Footer Restructure

- Update shared chrome to support the five top-level nav items.
- Build the large footer.
- Keep existing canonical pages live.
- Link to existing routes where those routes are canonical.
- Update typed nav section IDs, metadata, content mappings, mobile menu
  mappings, active-route rules, and translations as one unit.
- Preserve the dynamic menu module and scope it by the current nav section.
- Move Breakpoint/event banner into `Ecosystem` unless another section has an
  explicitly approved placement.
- Preserve the current Solana.com nav visual design while changing labels,
  grouping, and content.
- Use shadcn/Radix primitives only where needed and adapt them to existing nav
  styling.
- Ensure header/footer work across `web`, `docs`, `media`, and `templates`.

### Stage 3: Solution Page Reframing

- Audit `/solutions` and `/solutions/*` for audience fit.
- Keep canonical paths.
- Update copy, CTAs, and related links so pages work from new audience menus.
- Extract shared components only when they support future distinct audience
  pages.
- Do not redirect solution pages as part of this stage.

### Stage 4: Redirect Cleanup

- Remove or narrow redirects that block `/ecosystem` and `/enterprise`.
- Keep `/solutions` and `/solutions/*` canonical.
- Preserve or update true alias redirects.
- Do not add broad `/solutions/:path*` redirects.

### Stage 5: Sitemap, Metadata, And Links

- Add new hub routes to sitemap.
- Keep live `/solutions` routes in sitemap.
- Keep canonical metadata on `/solutions/*`.
- Add canonical metadata for new hubs.
- Replace stale internal links only where they point to retired aliases or
  blocked routes.
- Keep intentional links to canonical `/solutions/*` pages.

### Stage 6: Dynamic Module Hardening

Harden dynamic mega menu modules using tagged content from media/report APIs,
event sources, and static fallback config.

Dynamic modules must fail silently. Static nav must remain usable.

## Content Placement Rules

### Wallets and User Education

Primary menu: Use Solana.

Canonical routes:

- `/wallets`
- `/solana-wallets`, pending separate SEO decision
- `/learn`
- `/staking`
- `/solutions/consumer`

### Payments

Primary menu: Enterprise.

Canonical route candidates:

- `/solutions/institutional-payments`
- `/solutions/commerce-tooling`
- `/developers/payments` for developer implementation content

### Tokenization

Primary menu: Enterprise.

Canonical route:

- `/solutions/tokenization`

Tokenization is separate from Token Extensions.

### Token Extensions

Primary menus:

- Build
- Enterprise, where technically relevant

Canonical route should be confirmed by DevRel/SEO:

- `/solutions/token-extensions`
- or `/docs/tokens/extensions`

### Internet Capital Markets And DeFi

Primary menu: Enterprise for business framing.

Developer equivalent:

- `/developers/defi`

Canonical solution route:

- `/solutions/defi`

### Agents And AI

Primary menu: Products.

Secondary menus:

- Build
- Enterprise, if institutional/product use case is relevant

Canonical current routes:

- `/solutions/ai`
- `/agent-registry`
- `/skills`

### Data

Primary menus:

- Products
- Enterprise
- Ecosystem / Network

Use existing destinations until a distinct data product page is approved:

- `/research`
- `/reports`
- `/network`
- `/validators`
- `/rpc`

### DePIN

Primary menu: Ecosystem.

Secondary menu:

- Enterprise, if the enterprise proof path is clear

Canonical current route:

- `/solutions/depin`

Future `/enterprise/depin` and `/ecosystem/depin` pages should exist only if
they are distinct from `/solutions/depin`.

### Events

Primary menu:

- Ecosystem

Canonical route:

- `/events`

### Network

Primary menu:

- Ecosystem

Canonical hub:

- `/network`

Important preserved canonical routes:

- `/validators`
- Status external link
- Explorers external links

Enterprise should still link to network proof directly.

## Dynamic Content Requirements

Mega menus should maintain dynamic promo/content modules as a section-aware
capability.

Each dynamic module should be tag-driven and scoped to the current menu:

- Use Solana: help articles, safety guides, wallet education
- Build: technical guides, releases, templates, docs updates
- Enterprise: reports, case studies, institutional announcements
- Products: launches, changelogs, product updates
- Ecosystem: events, Breakpoint, grants, community, network reports

Functional requirements:

- Configure dynamic modules from nav section config so the current menu decides
  what can appear.
- Support one featured item per open menu at launch unless design approves a
  larger module.
- Allow a static fallback promo for campaign-critical placements.
- Normalize dynamic content before rendering.
- Minimum normalized fields are `id`, `title`, `href`, `contentType`, `source`,
  and `navSection`.
- Optional fields are `description`, `eyebrow`, `image`, `publishedAt`, `tag`,
  `campaignId`, and `expiresAt`.
- Breakpoint and event promos belong under `Ecosystem` by default.
- A global campaign can appear in multiple menus only when each placement has an
  explicit section mapping.

Dynamic modules should never be the only path to critical content.

If dynamic content fails to load, the static menu must remain fully usable.

Dynamic content should not cause layout shift inside an open menu.

## Search / Ask AI Requirements

Search or Ask AI should be persistently available in the header.

Expected role:

- Capture long-tail user questions
- Reduce pressure on navigation
- Support fragmented retail/user intent
- Help users find documentation, wallet guidance, network facts, product
  information, and solution/use-case pages

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

Legal review is required before publishing or prominently linking new content
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

## Analytics Requirements

Use lower snake case event names. Prefer one shared tracking helper in shared
chrome so header, mobile menu, and footer events use the same schema.

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
- `nav_search_submitted`
- `nav_ai_chat_opened`
- `ia_hub_page_viewed`
- `event_promo_clicked`
- `developer_start_clicked`
- `tokens_xyz_outbound_clicked`

Common properties should include:

- `app_name`
- `locale`
- `current_path`
- `nav_surface`
- `nav_section`
- `nav_group`
- `nav_item_id`
- `nav_item_label`
- `href`
- `destination_section`
- `destination_type`
- `is_external`
- `link_role`
- `position`
- `viewport`

Do not record raw search query text or raw AI prompts by default.

## Open Questions

1. Exact visual treatment for `Use Solana` in the header.
2. Exact legal-approved language for staking and token content.
3. Whether `Enterprise` should lead with Payments, Tokenization, or the hub
   overview.
4. Whether `/solana-wallets` remains canonical alongside `/wallets`.
5. Whether `/solutions/games-tooling` and
   `/solutions/solana-permissioned-environments` should be restored as canonical
   pages or remain redirected.
6. Whether `/x402`, `/agent-registry`, and `/skills` remain canonical product
   routes or later receive product namespace aliases.
7. Which topics deserve distinct future audience-specific pages, such as
   `/enterprise/depin` or `/ecosystem/depin`.
8. Final list of dynamic content tags, section ownership, and fallback promos.
