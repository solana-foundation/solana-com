# /upgrades — SIMD Tracker for Solana Media (V1)

## Goal

Create a media-owned `/upgrades` section on `solana.com` that gives the Solana
community a clear, low-maintenance, editorially useful view of major protocol
upgrades and their related SIMDs.

This V1 should:

- preserve authoritative SIMD metadata from GitHub
- keep sync strictly one-way into the media app
- make the main `/upgrades` page the primary editorial surface
- support DevRel updates on a roughly 2 to 4 week cadence
- surface status, recency, and SIMD relationships clearly
- favor list-based information design over card-heavy layouts

---

## Product Shape

The current `/news/solana-network-upgrades` page works because it is a single
editorial source that gets refreshed periodically. V1 should preserve that
model.

The new `/upgrades` experience should be:

- one media-owned upgrades overview page
- one synced dataset of SIMDs
- one lightweight editorial layer on top of that dataset
- optional detail pages only if they remain cheap and useful

The center of gravity is the overview page, not per-SIMD authored content.

---

## Ownership And Routing

`/upgrades` is media-owned and must be routed the same way `/news` and
`/podcasts` are routed today.

Required scope:

- add `/[locale]/upgrades` to `apps/media`
- update main-site rewrites so `/upgrades` resolves to the media app
- review shared chrome/navigation only if this route will be linked globally
- preserve normal media i18n behavior and lowercase normalization

This remains a cross-app implementation, but it should still ship as a simple
single-route-family feature.

---

## Editorial Model

### Principle

Do not turn every SIMD into a content type with its own heavy editorial burden.

DevRel is likely to update this surface every few weeks, not every day. The
model therefore needs to make periodic review easy and avoid stale longform
content on individual items.

### V1 Structure

V1 should use two layers:

1. a content-heavy overview page
2. a structured collection of synced SIMDs with minimal editorial overrides

### Overview Page

The `/upgrades` page should carry substantial editorial weight.

It should include:

- a strong intro explaining what the page tracks
- a plain-language description of how to interpret upgrade status
- an editorial “what matters now” section
- an optional “since last review” or “current focus” section
- a dense, scannable list of tracked upgrades
- supporting links to the source repository and related resources

This page should feel like an editorial dashboard, not a feed of content cards.

### Per-SIMD Editorial Scope

Per-SIMD content should stay minimal in V1.

Allowed editorial fields:

- `editorialNote`: short plain-language note
- `featured`: boolean
- `tags`: optional reuse of existing taxonomy
- `heroImage`: optional, only if needed

Do not add per-SIMD longform MDX fields in V1.

---

## Sync Model

### Objective

Keep SIMD metadata current automatically while keeping editorial control local
to the media repo.

### Directionality

Sync must be one-way:

- source of truth for SIMD metadata is the upstream SIMD repository
- generated/upserted content lands in `apps/media/content/upgrades/*`
- nothing writes back to the SIMD repo

This is an ingest pipeline, not a round-trip editorial workflow.

### File

`apps/media/scripts/sync-simds.ts`

### Runtime

Use a simple script runner in `apps/media`, for example:

```bash
pnpm --filter solana-com-media sync:simds
```

### Source

`solana-foundation/solana-improvement-documents`

### Sync Rules

The sync script should:

1. list SIMD proposal files from the upstream repo
2. fetch file contents and metadata
3. parse frontmatter
4. extract a short summary from the proposal body
5. write or update local `content/upgrades/*` entries
6. preserve media-owned editorial fields
7. output created / updated / unchanged / failed counts

The sync script owns only synced fields.

Editors own only the local editorial fields.

### Operational Model

The most practical automation for this repo is:

- a scheduled workflow in this repo runs the sync script
- that workflow updates local tracked content files
- those changes are reviewed and merged using this repo’s normal process

Important constraint:

- sync should never attempt to modify the upstream SIMD GitHub repository

Recommended cadence:

- metadata sync: daily or several times per week
- editorial refresh: manual, roughly every 2 to 4 weeks

---

## V1 Content Model

### Page-Level Editorial Content

Add a singleton or page-level content source for `/upgrades` containing:

- page title
- intro
- explanation of status meanings
- optional “current focus” section
- optional “last reviewed” text
- optional resources / CTA links

This gives DevRel one durable place to add heavier editorial context.

### Per-SIMD Collection

Create a new `upgrades` collection under `content/upgrades/*`.

Each entry should be primarily structured data.

Synced fields:

| Field           | Type             | Notes                           |
| --------------- | ---------------- | ------------------------------- |
| `simdNumber`    | text             | canonical proposal number       |
| `title`         | text             | from source frontmatter         |
| `status`        | select           | normalized enum                 |
| `category`      | select           | normalized enum                 |
| `type`          | select, optional | normalized enum                 |
| `authors`       | array of text    | structured, not comma-separated |
| `createdDate`   | date             | from source                     |
| `updatedDate`   | date             | git history or source fallback  |
| `featureGate`   | text, optional   | from source                     |
| `supersedes`    | array of text    | structured relationship hints   |
| `supersededBy`  | array of text    | structured relationship hints   |
| `githubUrl`     | text             | constructed                     |
| `discussionUrl` | text, optional   | from source                     |
| `summary`       | text             | extracted from source           |
| `sourceSha`     | text             | upstream sync marker            |

Minimal editorial fields:

| Field           | Type                               | Purpose                               |
| --------------- | ---------------------------------- | ------------------------------------- |
| `editorialNote` | text, optional                     | short plain-language note from DevRel |
| `featured`      | checkbox                           | promote in default list               |
| `tags`          | relationship[] to `tags`, optional | reuse existing taxonomy if useful     |
| `heroImage`     | image, optional                    | only if needed                        |

V1 deliberately does not include:

- per-SIMD `impactAnalysis` MDX
- per-SIMD `developerGuidance` MDX
- per-SIMD longform editorial bodies

---

## Route Structure

### Primary Route

- `/[locale]/upgrades`

This page should do the real work in V1.

Recommended page sections:

1. Intro / framing
2. Editorial overview
3. Optional current-focus or featured-upgrades section
4. Status explainer
5. Main upgrades list
6. Source / resource links

### Optional Detail Pages

`/[locale]/upgrades/[slug]` is optional in V1.

If included, detail pages should stay data-first:

- SIMD number
- title
- status
- category and type
- authors
- dates
- feature gate
- summary
- short editorial note
- GitHub and discussion links
- related SIMDs

If detail pages create too much surface area, defer them and keep GitHub as the
deep-link destination.

---

## Information Design

The overview page should be relatively content-heavy and list-based.

That means:

- prefer stacked lists or table-like rows over promotional cards
- emphasize hierarchy through typography and spacing, not oversized tiles
- make it easy to scan many upgrades quickly
- keep editorial text close to the data it explains

Recommended list structure:

- SIMD badge / number
- title
- status
- category / type
- updated date
- one- or two-line summary
- optional short editorial note
- optional related SIMD references

Recommended list behavior:

- default sort by recently updated
- filter by status
- filter by category
- optional filter by type
- search by SIMD number or title
- featured items pinned only in the default unfiltered view

This should feel more like a maintained technical tracker or dashboard than a
grid of marketing cards.

---

## SIMD Relationship Model

The relationship layer still matters in V1.

We should preserve and surface:

- `supersedes`
- `supersededBy`
- category
- type
- links to source proposal and discussion

How to honor that structure:

- keep relationship fields structured in the collection
- render related SIMD references inline in the overview list where helpful
- render full relationship links on detail pages if those pages ship

Relationship data should live in metadata, not hidden in prose.

---

## Data Layer

### Types

Create `lib/upgrade-types.ts` with a lean shape:

```ts
import type { PageInfo } from "./post-types";

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
  editorialNote?: string;
  featured: boolean;
  tags: string[];
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

### Data Functions

Create:

- `lib/keystatic/upgrade-data.ts`
- `lib/upgrade-data.ts`

Core functions:

- `fetchUpgrades(params)`
- `fetchUpgradeBySlug(slug)` if detail pages are included
- `fetchFeaturedUpgrades()`

Requirements:

- server-side filtering
- server-side sorting
- cursor-based pagination if needed
- relationship fields preserved in normalized structured form

Do not overbuild beyond what the overview page needs.

---

## Metadata Strategy

V1 should let metadata do most of the informational work.

The product must reliably expose:

- lifecycle status
- category / type
- authorship
- create / update timing
- source proposal link
- discussion link
- proposal relationships

This is the right fit for a surface that is editorially refreshed every few
weeks but metadata-synced much more often.

---

## Components

Keep the component set small and list-oriented.

Suggested V1 components:

```text
components/upgrades/
├── upgrades-overview.tsx
├── upgrades-status-guide.tsx
├── upgrades-list.tsx
├── upgrade-list-item.tsx
├── upgrade-filters.tsx
├── status-badge.tsx
└── related-simds.tsx
```

Optional detail-page components:

```text
components/upgrades/
├── upgrade-header.tsx
└── upgrade-meta-sidebar.tsx
```

Avoid a card library for this feature unless a specific section truly needs one.

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
├── app/api/upgrades/latest/
│   └── route.ts
├── components/upgrades/
│   ├── upgrades-overview.tsx
│   ├── upgrades-status-guide.tsx
│   ├── upgrades-list.tsx
│   ├── upgrade-list-item.tsx
│   ├── upgrade-filters.tsx
│   ├── status-badge.tsx
│   └── related-simds.tsx
└── scripts/sync-simds.ts
```

Optional V1 detail-page files:

```text
apps/media/
├── app/[locale]/upgrades/[slug]/page.tsx
├── components/upgrades/upgrade-header.tsx
└── components/upgrades/upgrade-meta-sidebar.tsx
```

Likely files to modify:

- `apps/media/keystatic.config.tsx`
- `apps/media/lib/metadata.ts`
- `apps/media/package.json`
- `apps/media/middleware.ts`
- main-site rewrite config

---

## Design Direction

The design should feel like a maintained technical dashboard with editorial
context, not a feed of hero cards.

V1 should emphasize:

- clarity
- density
- scanability
- stable structure
- low editorial overhead

Avoid:

- large promotional card grids
- layout patterns that imply daily publishing
- component sprawl

Preferred visual direction:

- strong intro copy
- content-rich overview blocks
- compact list rows
- clear status hierarchy
- visible relationship metadata

---

## Verification

### Automated

1. test SIMD parsing helpers
2. test sync preservation of editorial fields
3. test `fetchUpgrades` filtering and sorting
4. test API query parsing and response shape
5. run `pnpm --filter solana-com-media typecheck`
6. run `pnpm --filter solana-com-media test`
7. run `pnpm --filter solana-com-media lint`
8. run `pnpm --filter solana-com-media build`

### Manual

1. run `pnpm --filter solana-com-media sync:simds`
2. verify new and updated entries are generated correctly
3. verify `/[locale]/upgrades` is useful even with only lightweight per-SIMD
   editorial fields
4. verify the overview page can carry heavier narrative/editorial content
5. verify related SIMD references render correctly
6. verify proxied `/upgrades` works on staging

---

## Implementation Order

1. confirm rewrite ownership for `/upgrades`
2. add the lean `upgrades` collection and overview content source
3. implement the one-way sync script
4. add scheduled sync automation in this repo
5. build the listing data layer and API
6. build the overview page and list-based components
7. add optional detail pages only if they stay cheap and useful
8. add metadata polish and end-to-end verification

---

## Definition Of Done

V1 is done when:

- `/upgrades` is reachable as a media-owned route on `solana.com`
- SIMD metadata sync runs one-way into the media repo
- DevRel can maintain the editorial overview without managing many content types
- the overview page clearly surfaces upgrade status, recency, and relationships
- list-based presentation works better than cards for scanning many updates
- related SIMDs are preserved and visible
- the experience remains useful even if editorial updates only happen every 2 to
  4 weeks
