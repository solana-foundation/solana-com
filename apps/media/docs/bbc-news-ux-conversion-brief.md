# BBC-Inspired News UX Conversion Brief

Research run: July 3, 2026, Pacific/Auckland. BBC pages were fetched from the
current public web experience, with supporting BBC help and press pages used to
confirm product intent.

## Purpose

Convert the current `/news` experience in `apps/media` from a blog-like listing
into a news-first publishing surface inspired by the structure of BBC.com.

The goal is to adapt BBC's information architecture and editorial hierarchy, not
to reuse BBC branding, visual identity, copy, source code, or proprietary page
assets. The useful pattern to copy is the system: clear section fronts, strong
lead-story packaging, topical verticals, recirculation modules, live/video
content lanes, and campaign-quality promotional surfaces.

## Source Research

Primary BBC surfaces reviewed:

- [BBC home](https://www.bbc.com/)
- [BBC News](https://www.bbc.com/news)
- [BBC World](https://www.bbc.com/news/world)
- [BBC Business](https://www.bbc.com/business)
- [BBC article example](https://www.bbc.com/news/articles/ce375v12z0qo)
- [BBC video example](https://www.bbc.com/news/videos/c0lye4xr651o)
- [BBC Live](https://www.bbc.com/live)
- [BBC Live News](https://www.bbc.com/live/news)
- [BBC live story example](https://www.bbc.com/news/live/cd0m38xndp3t)
- [BBC help: available news content](https://help.bbc.com/hc/en-us/articles/39027623773331-What-types-of-news-content-will-be-available)
- [BBC Studios press release on the unified app/web experience](https://www.bbcstudiospressroom.com/press/bbc-launches-all-new-app-experience/)

## Executive Summary

BBC.com treats news as a structured publishing destination, not a single feed.
The News front uses a lead package, named editorial modules, media-specific
modules, "most read" and "most watched" recirculation, and links into durable
section fronts. Section fronts such as World and Business repeat the same
publisher pattern with their own lead packages, feature lanes, media lanes, and
latest-update rivers.

Solana News should move in the same direction:

- Make `/news` a front page with editorial modules instead of a filterable post
  grid.
- Promote categories into durable verticals with landing pages and metadata.
- Treat tags as topics, formats, campaigns, products, companies, or editorial
  flags, not as competing verticals.
- Preserve existing article-level customizations such as CTAs, switchbacks,
  reports, external links, and featured posts.
- Add an optional campaign hero system that can target `/news` and selected
  verticals for high-priority campaigns such as Breakpoint, without replacing
  the editorial lead by default.

## Current Solana Media State

The current media app already has a solid publishing foundation:

- `/news` is owned by `apps/media/app/[locale]/news/page.tsx` and renders
  `PostsClientPage` from `apps/media/app/[locale]/news/client-page.tsx`.
- The current News front fetches one featured post through `fetchFeaturedPost()`
  and a latest-post list through `fetchLatestPosts({ limit: 13 })`.
- The current client page excludes the featured post from the latest feed,
  creates filter buttons from `getNewsFilterOptions(posts)`, and renders a large
  featured article plus a card grid.
- Category landing pages exist at
  `apps/media/app/[locale]/news/category/[category]/page.tsx`, but they are thin
  latest-post lists with a title and back link.
- Article pages at `apps/media/app/[locale]/news/[...urlSegments]/page.tsx`
  already support category labels, author/date display, hero images, social
  sharing, MDX body content, table of contents, article CTAs, and switchbacks.
- Keystatic collections in `apps/media/keystatic.config.tsx` include `posts`,
  `links`, `categories`, `tags`, `ctas`, and `switchbacks`.
- External links are modeled in `apps/media/content/links` and can support
  BBC-style "around the web", event, sponsor, or ecosystem coverage modules.
- Switchbacks and CTAs already provide a useful base for report downloads,
  HubSpot forms, and article-adjacent conversion units.

The main gap is editorial structure. The current app has content types, but the
News front and category pages do not yet expose a full news hierarchy.

## BBC UX Structure To Adapt

### Global And Section Navigation

BBC separates the global site navigation from the News-specific section
navigation.

The global nav connects broad audience destinations such as Home, News, Sport,
Business, Technology, Health, Culture, Travel, Earth, Audio, Video, and Live.
Inside News, a secondary nav exposes section fronts such as US & Canada, UK,
Africa, Asia, Australia, Europe, Latin America, Middle East, In Pictures,
InDepth, and Verify.

Recommended Solana adaptation:

- Keep the shared Solana header and cross-app navigation intact.
- Add a News-specific vertical nav below the page masthead or near the top of
  `/news`.
- Treat this nav as editorial IA, not a dynamic list of every tag.
- Use stable category verticals that can sustain landing pages, SEO metadata,
  editorial ownership, and campaign targeting.

### News Front

BBC News is organized as a page of named modules. In the reviewed public page,
the front included a top-stories package, event/topic modules, exploration
modules, most-watched and most-read modules, and cross-section recirculation.

Recommended Solana adaptation:

- Replace the category filter UI on `/news` with an editorial front.
- Keep a latest river, but make it one module among several.
- Add a lead package with one primary story and several secondary stories.
- Add vertical modules for key categories such as Ecosystem, Developers,
  Payments, Institutions, Finance, and DeFi.
- Add media and format modules for videos, reports, case studies, podcasts, and
  external coverage when content exists.
- Add "Most read" only when analytics-backed ranking is available. Until then,
  use editor-selected or recent-by-vertical modules instead of pretending to
  know popularity.

### Vertical Landing Pages

BBC vertical pages are not just filtered feeds. World and Business both use
section-front composition: lead story groups, named feature lanes, media lanes,
and latest updates.

Recommended Solana adaptation:

- Keep existing category routes functional, but upgrade them into true vertical
  landing pages.
- Give each category a landing configuration, description, SEO metadata, and
  optional hero/campaign slots.
- Use a consistent template:
  - vertical masthead
  - optional targeted campaign hero
  - lead package
  - latest river
  - featured reports or case studies
  - external links or ecosystem coverage
  - related topic chips
- Avoid one-off page code per category unless a vertical has a clearly different
  editorial need.

### Article, Video, And Live Patterns

BBC articles show clear section and topic context, timestamps, bylines, media,
onward journeys, and related-topic modules. Video pages are first-class content
pages rather than just embeds. Live pages use a distinct live stream model with
summary points, newest-first updates, timestamps, and per-update sharing.

Recommended Solana adaptation:

- Strengthen article recirculation with related posts, related external links,
  and topic chips.
- Keep existing article CTAs and switchbacks, but make their placement and
  targeting part of the broader news front strategy.
- Treat video, podcast, report, and case study content as format modules on news
  fronts, even if they continue to use existing content collections.
- Do not build a full liveblog system in the first phase. Instead, leave room
  for a future "live" or "developing" content type if Solana events, network
  upgrades, or conferences need it.

## Proposed Solana News Information Architecture

### Primary Route Structure

Keep existing routes working:

- `/news`
- `/news/category/[category]`
- `/news/[...urlSegments]`
- `/podcasts`

Recommended future-facing route structure:

- `/news`
- `/news/[vertical]`
- `/news/topics/[topic]`
- `/news/reports`
- `/news/case-studies`
- `/news/videos`
- `/news/live` only if a live-update content model is added later

To avoid breaking current links, `/news/category/[category]` can remain as the
initial implementation route. A later routing cleanup can add `/news/[vertical]`
as the canonical public URL and redirect old category paths.

### Recommended Category Verticals

Categories should be durable verticals. They should be few enough to support
landing pages and broad enough to group content consistently.

Recommended canonical verticals:

| Vertical           | Purpose                                                               | Existing mapping                 |
| ------------------ | --------------------------------------------------------------------- | -------------------------------- |
| Ecosystem          | Ecosystem news, partnerships, teams, growth, community impact         | `ecosystem`                      |
| Developers         | Developer tooling, guides, hackathons, infrastructure, builders       | `developers`                     |
| Institutions       | Institutional adoption, enterprise, compliance, market infrastructure | `institutions`                   |
| Finance            | Markets, tokenization, stable assets, treasury, onchain finance       | `finance`                        |
| Payments           | Commerce, remittances, merchant payments, payouts, Solana Pay         | `payments`                       |
| DeFi               | Protocols, trading, liquidity, DEXs, DeFi product news                | `defi`                           |
| Consumer           | Consumer apps, mobile, gaming, social, creator experiences            | `consumer`                       |
| Network            | Upgrades, validators, performance, core protocol, releases            | `upgrades`, missing `validators` |
| Community & Events | Events, ecosystem moments, recaps, local communities                  | `community`, event-oriented tags |
| Breakpoint         | Active Breakpoint campaign and event coverage while needed            | `breakpoint`                     |

Breakpoint can remain a temporary or campaign-specific category while it has
enough active content and campaign needs. Long term, old Breakpoint coverage can
roll into Community & Events while active conference promotion uses targeted
campaign heroes.

## Taxonomy Cleanup Requirements

### Category Rules

Categories should answer "Which vertical does this content belong to?"

Requirements:

- Every published post must have at least one valid category.
- Every category slug referenced by content must exist in
  `apps/media/content/categories`.
- Category slugs should be lowercase kebab case.
- Category names should be human-readable labels used in navigation and page
  headings.
- Category descriptions should be useful enough to appear on vertical landing
  pages and in metadata.
- Categories should not be created for one-off topics, formats, products,
  campaigns, or editorial flags.

Current cleanup items found during audit:

- Content references missing category slugs including `merchant-payments`,
  `remittances`, `stablecoins`, `payouts`, and `validators`.
- These should become tags or topic mappings, except `validators`, which should
  map into the Network vertical.
- `upgrades` should be renamed or presented as Network if the vertical is meant
  to cover more than release announcements.

### Tag Rules

Tags should answer "What topics, products, formats, campaigns, or editorial
flags apply?"

Requirements:

- Tags should not duplicate category names unless there is a specific reason.
- Tags should be normalized to lowercase kebab case.
- Editorial flags such as `featured` should be separated from audience-facing
  topic tags if possible.
- Format tags such as `case-studies`, `reports`, `newsletter`, `video`, and
  `podcast` should be used consistently for module construction.
- Campaign tags such as `breakpoint` should be usable for targeting, but should
  not be the only way to build a vertical landing page.

Current cleanup items found during audit:

- Fix typo tag `bockchain`.
- Normalize duplicate or near-duplicate tags such as `technology` and `tech`.
- Normalize `stable-coin` toward `stablecoins`.
- Normalize raw-cased podcast tags such as `Solana Foundation` toward
  `solana-foundation`.
- Decide whether `developer` should become `developers`, `developer-tools`, or
  be removed when it duplicates the Developers category.
- Preserve useful topic tags such as `ai`, `depin`, `gaming`, `solana-pay`,
  `hackathon`, `reports`, `case-studies`, `events`, and `breakpoint`.

### Current Taxonomy Snapshot

The content audit found:

- `apps/media/content/posts`: 285 files.
- `apps/media/content/links`: 654 files.
- `apps/media/content/switchbacks`: 41 files.
- `apps/media/content/podcasts`: 18 files.
- Existing category files: `breakpoint`, `community`, `consumer`, `defi`,
  `developers`, `ecosystem`, `finance`, `institutions`, `payments`, and
  `upgrades`.
- Existing tag files: 106.

Top category usage across content:

| Category       | Count |
| -------------- | ----: |
| `finance`      |   341 |
| `institutions` |   268 |
| `ecosystem`    |   224 |
| `payments`     |   162 |
| `developers`   |   144 |
| `defi`         |    99 |
| `consumer`     |    71 |
| `upgrades`     |    51 |
| `community`    |    44 |
| `breakpoint`   |     4 |

Top tag usage includes `solana-foundation`, `finance`, `blockchain`,
`developer`, `announcements`, `partner`, `reports`, `case-studies`, `events`,
`breakpoint`, `defi`, `ecosystem`, `technology`, `payments`, and `featured`.

## CMS And Data Model Requirements

### Category Schema

Extend the `categories` collection in `apps/media/keystatic.config.tsx` so a
category can power a full landing page.

Recommended fields:

- `name`: existing display name.
- `slug`: existing path slug.
- `description`: existing summary, but editorially required for landing pages.
- `shortLabel`: compact nav label.
- `seoTitle`: custom title for vertical metadata.
- `seoDescription`: custom metadata description.
- `navOrder`: numeric sort order for News nav.
- `landingEnabled`: boolean.
- `landingHeroImage`: optional image.
- `landingIntro`: optional rich text or plain text.
- `relatedTags`: relationships to tags that should appear as topic chips.
- `featuredPosts`: optional manual post relationships for the lead package.
- `featuredLinks`: optional manual external link relationships.
- `modules`: optional structured module configuration.
- `campaignEligibility`: boolean or enum for whether campaign heroes can target
  this vertical.

### News Settings Singleton

Add a News settings singleton or equivalent structured configuration.

Recommended fields:

- `navCategories`: ordered category relationships.
- `frontLeadPosts`: optional manual post relationships.
- `frontModules`: ordered module definitions.
- `defaultLatestLimit`: number.
- `showExternalLinks`: boolean.
- `showReports`: boolean.
- `showCaseStudies`: boolean.
- `showPodcasts`: boolean.
- `showMostRead`: boolean, gated by analytics availability.
- `activeCampaignPromos`: relationships to campaign promo entries.

This avoids hard-coding BBC-style module choices into the route component and
lets editors adjust the front page without a deploy.

### Campaign Promo Collection

Add a reusable campaign promo model for high-impact banners.

Recommended fields:

- `title`
- `eyebrow`
- `description`
- `image`
- `imageAlt`
- `primaryCtaLabel`
- `primaryCtaUrl`
- `secondaryCtaLabel`
- `secondaryCtaUrl`
- `targetSurfaces`: `news-front`, `all-news-verticals`, or selected category
  slugs.
- `targetTags`: optional topic or campaign tags.
- `startAt`
- `endAt`
- `priority`
- `enabled`
- `dismissible`
- `externalCampaign`: boolean.
- `trackingId`
- `sponsorOrCampaignLabel`: visible disclosure when needed.

Campaign promos should be separate from article CTAs and switchbacks. CTAs and
switchbacks are article-level conversion units; campaign promos are landing-page
and vertical-level audience units.

## Optional Hero Banner Promo Requirement

The News experience needs a huge optional hero banner for targeted campaigns.
The banner should promote content or conversion goals that may sit outside the
News editorial vertical, such as Breakpoint registration, sponsorship interest,
developer challenges, reports, or newsletter growth.

### Banner Behavior

Requirements:

- The campaign hero is optional. If no eligible campaign is active, the
  component should not render.
- The campaign hero can target `/news`, selected category verticals, or both.
- The campaign hero should have start and end dates so expired campaigns do not
  remain live.
- The campaign hero should be labeled clearly enough that users understand it is
  a promotion or campaign unit.
- The campaign hero should support internal and external CTAs.
- The campaign hero should support at least one large image or video thumbnail.
- The campaign hero should not replace the editorial lead package unless editors
  explicitly configure it to do so.
- The campaign hero should have analytics identifiers for impressions and CTA
  clicks.
- The campaign hero should degrade cleanly on mobile and not push the full news
  page below the fold without showing editorial context.

### Breakpoint Example

A Breakpoint campaign could target:

- `/news`
- `/news/category/developers`
- `/news/category/ecosystem`
- `/news/category/community`
- `/news/category/breakpoint`

Likely CTAs:

- Register for Breakpoint.
- Become a sponsor.
- View the agenda.
- Watch past sessions.

Existing content already indicates this need. For example,
`apps/media/content/links/breakpoint-2026-become-a-sponsor.mdx` is a featured
external Breakpoint sponsor link with the `breakpoint` category. The campaign
hero model should make this kind of promotion first-class instead of relying on
ordinary link cards or article CTAs.

## News Front Requirements

The target `/news` page should contain these regions:

1. News masthead and vertical nav.
2. Optional campaign hero.
3. Lead editorial package.
4. Top stories grid.
5. Latest river.
6. Vertical modules.
7. Format modules.
8. External coverage module.
9. Reports or case studies module.
10. Optional most-read module, only when analytics-backed.

### Lead Editorial Package

Requirements:

- One primary story with larger image treatment.
- Three to six secondary stories.
- Support posts and possibly curated external links.
- Prefer manual editorial curation when configured.
- Fall back to latest published content when no manual curation exists.

### Latest River

Requirements:

- Keep cursor pagination from `fetchLatestPosts`.
- Support category and tag filters internally for vertical pages.
- Show strong date and category metadata.
- Avoid duplicating items already shown in the lead package.

### Vertical Modules

Requirements:

- Render only when a vertical has enough fresh content.
- Use category configuration for title, order, and description.
- Support mixed content from posts and external links where appropriate.
- Link to the vertical landing page.

### Format Modules

Requirements:

- Case studies should be built from a normalized `case-studies` tag or future
  format field.
- Reports should be built from switchbacks, tags, or a future content type.
- Videos and podcasts should have distinct card treatments.
- External links should be visually distinct from original Solana editorial
  posts.

## Vertical Landing Page Requirements

Each vertical page should contain:

1. Category masthead with name, description, and optional image.
2. Optional targeted campaign hero.
3. Lead package for the category.
4. Latest category river.
5. Related topic chips.
6. Featured reports, case studies, or external links when available.
7. Cross-links to adjacent verticals.

Existing category pages should be upgraded rather than replaced outright. The
current route already resolves a category, fetches posts by category, and has
metadata support through `categoryListingMetadata`.

Recommended implementation steps:

- Extend category metadata first.
- Add a shared `NewsVerticalPage` or module-based page component.
- Keep `/news/category/[category]` as the initial route.
- Add canonical metadata if a shorter `/news/[vertical]` route is introduced
  later.

## Article Page Requirements

The article page should keep existing functionality and add stronger
recirculation.

Keep:

- MDX body rendering.
- Author and published date.
- Category display.
- Hero image.
- Table of contents.
- Social sharing.
- Article CTA relationship.
- Switchback relationship.
- Report and HubSpot switchback behavior.

Add:

- Category breadcrumb or News pillar link.
- Topic chips from tags.
- Related posts from shared category and tags.
- Related external links from `apps/media/content/links`.
- Optional newsletter or campaign unit after article body.
- More deliberate handling for posts with multiple categories.

## Content Selection Logic

The current `fetchLatestPosts` and `fetchFeaturedPost` functions can be
extended, but the future system needs richer selectors.

Recommended selectors:

- `fetchNewsFrontConfig(locale)`
- `fetchNewsVerticalConfig(categorySlug, locale)`
- `fetchLeadPackage({ category, tags, limit, exclude })`
- `fetchLatestNews({ category, tags, limit, cursor, exclude })`
- `fetchFeaturedLinks({ category, tags, linkType, limit, exclude })`
- `fetchRelatedContent({ post, limit })`
- `fetchCampaignPromos({ surface, category, tags, now })`

These should preserve existing static-generation and revalidation assumptions.
The current News page uses `revalidate = 300`, which is a reasonable starting
point for a modular news front.

## Analytics And Ranking Requirements

BBC-style "Most read" and "Most watched" modules should not be launched as fake
popularity lists.

Options:

- Phase 1: use editor-selected modules or latest-by-format modules.
- Phase 2: use analytics-backed ranking when a reliable source is available.
- Phase 3: personalize or segment modules only after privacy, consent, and data
  reliability requirements are clear.

Campaign heroes should track:

- impression
- primary CTA click
- secondary CTA click
- target surface
- target vertical
- campaign id
- active date window

## Implementation Plan

### Phase 1: Taxonomy And CMS Foundations

- Decide and document canonical category verticals.
- Add missing category files or migrate content references to valid categories.
- Normalize tag slugs and casing.
- Add category landing metadata fields.
- Add News settings singleton.
- Add campaign promo collection.
- Add validation that published content cannot reference missing categories or
  tags.

### Phase 2: News Front

- Replace the current filter-first `/news` UI with a module-based News front.
- Preserve latest-post pagination.
- Add lead package, latest river, and vertical modules.
- Add optional campaign hero rendering.
- Keep existing featured-tag behavior as a fallback while manual front-page
  curation is introduced.

### Phase 3: Vertical Landing Pages

- Upgrade `/news/category/[category]` into vertical section fronts.
- Add category masthead, related tags, lead package, latest river, and external
  content modules.
- Add category-specific metadata from the extended category schema.
- Decide whether to introduce canonical `/news/[vertical]` routes.

### Phase 4: Recirculation And Formats

- Add related content modules to article pages.
- Add format modules for reports, case studies, videos, podcasts, and external
  links.
- Add analytics-backed "Most read" only when data exists.
- Evaluate a future live/developing-story model for events and network upgrades.

## Acceptance Criteria

- `/news` no longer reads as a simple post grid.
- `/news` has a news masthead, vertical nav, editorial lead package, latest
  river, and at least three modular content sections.
- Category pages have unique descriptions, metadata, and section-front layout.
- Campaign hero promos can be enabled for `/news` and selected categories.
- Campaign hero promos can be disabled or expire without code changes.
- Existing article CTAs and switchbacks keep working.
- Existing content URLs remain valid.
- All published content references valid category slugs.
- Tags are normalized and no longer used as category substitutes.
- External links can appear in appropriate News modules without looking like
  original editorial posts.
- The implementation has targeted tests for category resolution, promo
  targeting, content selection, and duplicate suppression across modules.

## Risks And Constraints

- The current category and tag model is loose, so cleanup should happen before
  relying on taxonomy for navigation.
- Some current category names are business-area labels rather than reader-facing
  news vertical names. Editorial naming should be confirmed before migration.
- A large campaign hero can overwhelm the News front if it always renders above
  the editorial lead. It should be targeted, time-boxed, and optional.
- "Most read" and "Most watched" modules need real analytics or should be
  omitted.
- The current metadata helpers should be reviewed for array-based categories and
  tags before relying on them for richer SEO output.
- External link cards need clear visual treatment so users understand when they
  are leaving Solana-owned editorial content.

## Open Questions

- Should Breakpoint remain a news category, or should it become a campaign/topic
  tag plus a dedicated event destination?
- Should the public canonical vertical route stay `/news/category/[category]`,
  or should the site move toward `/news/[vertical]` with redirects?
- Which verticals should be eligible for high-impact campaign heroes by default?
- Who owns manual curation of the News front: editorial, marketing, DevRel, or a
  shared process?
- Is there an existing analytics source that can support real "Most read" and
  "Most watched" modules?
- Should reports remain switchbacks, or should they become a first-class content
  collection for News modules?
