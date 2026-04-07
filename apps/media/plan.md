# /upgrades — SIMD Tracker for Solana Media

## Goal

Create a new media-owned `/upgrades` section on `solana.com` for tracking Solana
Improvement Documents (SIMDs) from idea through activation.

This should be:

- media-owned from a routing and deployment perspective
- GitHub-synced for authoritative proposal metadata
- Keystatic-editable for DevRel editorial context
- production-safe under the existing monorepo rewrite model

---

## Product Scope

The Solana DevRel team needs a centralized place to track and communicate SIMD
proposals as they move from idea to activation. Current tracking is fragmented
across community tools and the raw GitHub repo. None provide an authoritative
Foundation editorial layer.

This feature adds:

- a new media-owned route: `/[locale]/upgrades`
- a new Keystatic collection: `upgrades`
- an automated sync pipeline from
  `solana-foundation/solana-improvement-documents`
- editorial enrichment fields for DevRel
- listing and detail pages in `apps/media`
- main-site rewrite/proxy support so `solana.com/upgrades` resolves to the media
  app

Out of scope:

- replacing the source SIMD repository
- editing proposal source markdown in Keystatic
- building a generalized governance platform beyond SIMDs

---

## Ownership And Routing

`/upgrades` is media-owned, but because the repo is split across multiple Next
apps, that ownership must be reflected in both `apps/media` and the app that
proxies media routes behind `solana.com`.

Required routing changes:

- `apps/media` adds `app/[locale]/upgrades/*`
- main-site rewrites are updated so `/upgrades` and `/[locale]/upgrades` resolve
  to the media deployment, the same way `/news` and `/podcasts` do
- shared cross-app navigation config is updated if `/upgrades` is linked from
  shared chrome
- media middleware is reviewed so the new route behaves correctly with i18n and
  lowercase normalization

Implementation note:

- this is not a media-only change set; the rewrite owner must be included in the
  implementation plan

---

## Content Model

### Collection: `upgrades`

Add a new Keystatic collection under `content/upgrades/*`.

Recommended file format:

- use `format: { data: "yaml" }` if supported cleanly by the existing Keystatic
  version for data-only entries
- otherwise store each entry as a minimal content-backed file and keep editorial
  MDX fields inside the schema

Target entry shape:

```text
content/upgrades/
├── simd-0001.yaml
├── simd-0048.yaml
├── simd-0286.yaml
└── ...
```

### Synced Fields

These are source-of-truth fields and are overwritten by sync:

| Field           | Type             | Source                              |
| --------------- | ---------------- | ----------------------------------- |
| `simdNumber`    | text             | filename / proposal id              |
| `title`         | text             | frontmatter                         |
| `status`        | select           | frontmatter                         |
| `category`      | select           | frontmatter                         |
| `type`          | select, optional | frontmatter                         |
| `authors`       | array of text    | frontmatter                         |
| `createdDate`   | date             | frontmatter                         |
| `updatedDate`   | date             | git history or frontmatter fallback |
| `featureGate`   | text, optional   | frontmatter                         |
| `supersedes`    | array of text    | frontmatter                         |
| `supersededBy`  | array of text    | frontmatter                         |
| `githubUrl`     | text             | constructed                         |
| `discussionUrl` | text, optional   | frontmatter `discussions-to`        |
| `summary`       | text             | extracted from `## Summary`         |
| `sourceSha`     | text             | last synced upstream blob sha       |

### Editorial Fields

These are preserved by sync:

| Field               | Type                             | Purpose                                                   |
| ------------------- | -------------------------------- | --------------------------------------------------------- |
| `editorialSummary`  | text                             | plain-language explanation                                |
| `impactAnalysis`    | mdx                              | who is affected and why                                   |
| `developerGuidance` | mdx                              | action-oriented guidance                                  |
| `relatedLinks`      | array of object `{ label, url }` | supporting resources                                      |
| `tags`              | relationship[] → `tags`          | reuse existing taxonomy                                   |
| `featured`          | checkbox                         | pin on listing                                            |
| `heroImage`         | image, optional                  | social/share art                                          |
| `editorialStatus`   | select, optional                 | internal marker like `not-started`, `drafted`, `reviewed` |

Schema guidance:

- use arrays for `authors`, `supersedes`, and `supersededBy` rather than
  comma-separated text
- keep `status`, `category`, and `type` normalized to lowercase enum values
- preserve `summary` as plain text for cards, search, API responses, and SEO

---

## Sync Workflow

### Objective

Automate sync so production content stays current without manual file creation.

### File

`apps/media/scripts/sync-simds.ts`

### Runtime

Add `tsx` to `apps/media` and run the script with:

```bash
pnpm --filter solana-com-media sync:simds
```

### Source

Repository: `solana-foundation/solana-improvement-documents`

Expected upstream process:

1. list proposal markdown files from `proposals/`
2. fetch file contents and metadata from GitHub
3. parse frontmatter
4. extract the first paragraph under `## Summary`
5. determine `updatedDate` from Git history when available
6. upsert local `content/upgrades/*` entries
7. preserve editorial-only fields on update
8. emit a machine-readable summary of created, updated, unchanged, and failed
   entries

### Sync Rules

- create new entries when upstream proposals appear
- update synced fields when upstream changes
- do not overwrite editorial fields
- optionally mark missing upstream proposals as `withdrawn` or `archived` only
  if the upstream repo makes that state explicit
- fail the run if parsing changes would silently drop data

### Automation Strategy

Preferred option: scheduled GitHub Action that commits synced content changes
back into this repo automatically.

Why this is the right default:

- production in this app is GitHub-backed, not local-filesystem-backed
- synced content should follow the same audited git history as other content
- Keystatic editors can continue enriching entries in normal repo workflows

Recommended automation design:

1. run nightly and optionally on-demand via `workflow_dispatch`
2. execute `pnpm --filter solana-com-media sync:simds`
3. if generated files changed, open or update a dedicated PR
4. auto-label it `content` / `simd-sync`
5. optionally auto-merge if CI passes and the repo policy allows it

Fallback:

- if fully automatic PR merge is not acceptable, still generate the PR
  automatically so the sync remains low-touch

Do not treat “scheduled action” as sufficient by itself; the workflow must
persist changes back to git.

---

## Routes

### Listing

Route:

- `/[locale]/upgrades`

Files:

```text
app/[locale]/upgrades/
├── page.tsx
└── client-page.tsx
```

Behavior:

- server component fetches initial slice for SEO and first paint
- client component owns filter/search/sort state and calls the API route for
  subsequent queries
- featured entries are rendered first, but only on the unfiltered default view

Filters:

- status: `all`, `idea`, `draft`, `review`, `accepted`, `implemented`,
  `activated`, `withdrawn`, `stagnant`, `living`
- class: `all`, `standard`, `meta`, `advisory`
- standard type: `all`, `core`, `networking`, `interfaces`
- search: SIMD number or title
- sort: `updated-desc` default, `created-desc`, `simd-asc`

Important adjustment:

- do not collapse `category` and `type` into a single API field
- expose them separately so `standard + core` and `standard + interfaces` are
  first-class filters

Card content:

- SIMD badge
- title
- status badge
- category and type badges
- summary
- updated date
- featured treatment when applicable

Pagination:

- cursor-based API pagination
- cursor should encode the active sort basis plus slug, not just raw slug
- any filter/search/sort change resets pagination

### Detail

Route:

- `/[locale]/upgrades/[slug]`

Files:

```text
app/[locale]/upgrades/[slug]/
└── page.tsx
```

Layout:

- header with SIMD number, title, status, category, type
- lifecycle bar based on normalized status
- metadata sidebar with authors, dates, feature gate, GitHub, discussion link
- synced summary section
- editorial summary, impact analysis, developer guidance when present
- related links when present
- related SIMDs from `supersedes` and `supersededBy`
- footer CTA to full GitHub proposal

---

## Data Layer

### Types

Create `lib/upgrade-types.ts`.

```ts
import type { ContentDocument, PageInfo } from "./post-types";

export type SIMDStatus =
  | "idea"
  | "draft"
  | "review"
  | "accepted"
  | "implemented"
  | "activated"
  | "withdrawn"
  | "stagnant"
  | "living";

export type SIMDCategory = "standard" | "meta" | "advisory";
export type SIMDType = "core" | "networking" | "interfaces";

export type UpgradeItem = {
  id: string;
  slug: string;
  simdNumber: string;
  title: string;
  status: SIMDStatus;
  category: SIMDCategory;
  type?: SIMDType;
  authors: string[];
  createdDate: string | null;
  updatedDate: string | null;
  featureGate?: string;
  supersedes: string[];
  supersededBy: string[];
  githubUrl: string;
  discussionUrl?: string;
  summary: string;
  editorialSummary?: string;
  impactAnalysis?: ContentDocument;
  developerGuidance?: ContentDocument;
  relatedLinks: { label: string; url: string }[];
  tags: string[];
  featured: boolean;
  heroImage?: string | null;
  cursor?: string;
  url: string;
};

export type FetchUpgradesParams = {
  limit?: number;
  cursor?: string;
  status?: SIMDStatus;
  category?: SIMDCategory;
  type?: SIMDType;
  search?: string;
  sort?: "updated-desc" | "created-desc" | "simd-asc";
};

export type FetchUpgradesResponse = {
  items: UpgradeItem[];
  pageInfo: PageInfo;
};
```

### Reader/Data Functions

Create `lib/keystatic/upgrade-data.ts`.

Follow existing media patterns:

- `transformUpgrade(slug, entry) => Promise<UpgradeItem | null>`
- `fetchUpgrades(params) => Promise<FetchUpgradesResponse>`
- `fetchUpgradeBySlug(slug) => Promise<UpgradeItem | null>`
- `fetchFeaturedUpgrades(limit?) => Promise<UpgradeItem[]>`

Implementation requirements:

- resolve tag relationships to string names
- normalize enum casing
- sort server-side before pagination
- apply search/filter server-side, not only in the client
- preserve JSON-serializable content documents for RSC boundaries

Add a thin re-export file:

- `lib/upgrade-data.ts`

### API Route

Create:

- `app/api/upgrades/latest/route.ts`

Query params:

- `limit`
- `cursor`
- `status`
- `category`
- `type`
- `search`
- `sort`

Caching:

- use `unstable_cache`
- `revalidate: 300`
- distinct cache keys per query combination
- return plain-text-safe fields for listing cards

### Metadata

Add to `lib/metadata.ts`:

- `upgradeListingMetadata()`
- `upgradeDetailMetadata(slug)`

Metadata expectations:

- canonical URLs use `/upgrades`
- detail pages prefer `heroImage`, then site fallback image
- noindex on missing entries

---

## Components

Create:

```text
components/upgrades/
├── upgrade-card.tsx
├── upgrade-filters.tsx
├── status-badge.tsx
├── category-badge.tsx
├── lifecycle-bar.tsx
├── upgrade-header.tsx
├── upgrade-meta-sidebar.tsx
└── related-simds.tsx
```

Component guidance:

- keep listing cards compact and text-forward
- use separate badges for `category` and `type`
- lifecycle bar should be derived from normalized status, not hardcoded per page
- keep editorial sections visually distinct from synced source data

---

## Files To Create

```text
apps/media/
├── content/upgrades/
├── lib/upgrade-types.ts
├── lib/upgrade-data.ts
├── lib/keystatic/upgrade-data.ts
├── app/[locale]/upgrades/
│   ├── page.tsx
│   └── client-page.tsx
├── app/[locale]/upgrades/[slug]/
│   └── page.tsx
├── app/api/upgrades/latest/
│   └── route.ts
├── components/upgrades/
│   ├── upgrade-card.tsx
│   ├── upgrade-filters.tsx
│   ├── status-badge.tsx
│   ├── category-badge.tsx
│   ├── lifecycle-bar.tsx
│   ├── upgrade-header.tsx
│   ├── upgrade-meta-sidebar.tsx
│   └── related-simds.tsx
└── scripts/sync-simds.ts
```

### Likely Files To Modify In `apps/media`

| File                   | Change                                                                |
| ---------------------- | --------------------------------------------------------------------- |
| `keystatic.config.tsx` | add `upgrades` collection                                             |
| `lib/metadata.ts`      | add listing/detail metadata helpers                                   |
| `package.json`         | add `sync:simds` script and `tsx`                                     |
| `middleware.ts`        | confirm route handling remains correct                                |
| `next.config.ts`       | review `outputFileTracingIncludes` if content glob assumptions change |
| `__tests__/`           | add data-layer and API coverage                                       |

### Likely Files To Modify Outside `apps/media`

| File Area                | Change                         |
| ------------------------ | ------------------------------ |
| main-site rewrite owner  | proxy `/upgrades` to media     |
| shared chrome/nav config | add `/upgrades` link if needed |

---

## Design Direction

### Aesthetic

Match the media site’s dark, editorial, developer-facing tone:

- information-dense
- scannable
- visually structured, not decorative
- stronger hierarchy than the current `/news` card grid

### Listing

- hero with concise explanation of what SIMDs are and why this page exists
- horizontal filter row with status pills plus separate class/type controls
- search field for SIMD number/title
- grid of cards with clear hierarchy: number, title, status, summary, date
- featured entries use a larger, more prominent card only in default view

### Detail

- document-style layout with metadata sidebar on desktop
- lifecycle bar near the top
- source-derived content and editorial content clearly separated
- strong CTA to GitHub for full proposal text

### Status Color Mapping

- `draft`: subdued neutral
- `review`: amber
- `accepted`: violet
- `implemented`: cyan
- `activated`: green
- `withdrawn`: orange/red
- `stagnant`: muted
- `idea` and `living`: define explicit colors during implementation

Avoid locking exact token names in the plan unless they already exist in the
design system.

---

## Verification

### Automated

1. add unit tests for SIMD parsing helpers
2. add tests for `fetchUpgrades` filtering, sorting, and pagination
3. add API route tests for query parsing and cached response shape
4. run `pnpm --filter solana-com-media typecheck`
5. run `pnpm --filter solana-com-media test`
6. run `pnpm --filter solana-com-media lint`
7. run `pnpm --filter solana-com-media build`

### Manual

1. run `pnpm --filter solana-com-media sync:simds`
2. verify new content files are created or updated without wiping editorial
   fields
3. verify `/[locale]/upgrades` renders correctly with filter changes, search,
   sort, and load-more behavior
4. verify detail pages render editorial sections conditionally
5. verify `/keystatic` can edit the new collection in local mode
6. verify the proxied `solana.com/upgrades` route works once rewrites are in
   place

---

## Implementation Order

1. define route ownership and add main-site rewrite/proxy work to the scope
2. add the `upgrades` Keystatic collection and types
3. implement the sync script and verify idempotent content generation
4. add automated sync workflow that commits or PRs generated changes
5. build the reader/data layer
6. add API route and tests
7. build detail page
8. build listing page with server-driven filter/search/sort state
9. add metadata and route-level polish
10. validate proxied routing and editorial workflow end-to-end

---

## Definition Of Done

This plan is complete when:

- `/upgrades` is owned by media and reachable on `solana.com`
- SIMD metadata sync runs automatically and persists changes back to git
- DevRel can enrich synced entries in Keystatic without losing editorial fields
- listing and detail pages work for locale-prefixed routes
- server-side filtering, sorting, search, and pagination behave consistently
- tests cover the core data and API behavior
- the media app builds cleanly and the proxy route works in staging
