# /upgrades — SIMD Tracker for Solana Media (V1)

## Goal

Create a media-owned `/upgrades` section on `solana.com` that gives the Solana
community a clear, low-maintenance view of major protocol upgrades and their
related SIMDs.

This V1 should:

- preserve authoritative SIMD metadata from GitHub
- keep editorial maintenance light for DevRel
- make updates easy to publish every 2 to 4 weeks
- surface relationships between upgrades and SIMDs clearly
- fit the existing media-app workflow without introducing unnecessary content
  complexity

---

## Product Shape

The current `/news/solana-network-upgrades` page has worked because it is a
single editorial source that gets refreshed periodically. The new `/upgrades`
experience should keep that strength instead of turning every SIMD into a
mini-article.

V1 product model:

- one media-owned upgrades landing page
- a synced dataset of SIMDs
- a lightweight editorial layer on top of that dataset
- optional SIMD detail pages only if the data supports them cleanly

The core editorial object is not “a rich body for every SIMD.” The core
editorial object is “an upgrades surface that is easy to refresh and easy to
scan.”

---

## Ownership And Routing

`/upgrades` is media-owned and must be routed the same way `/news` and
`/podcasts` are routed today.

Required scope:

- add `/[locale]/upgrades` to `apps/media`
- update main-site rewrites so `/upgrades` resolves to the media app
- review shared chrome/navigation only if this route will be linked globally
- preserve normal media i18n behavior and lowercase normalization

This is still a cross-app implementation, but the feature itself remains simple:
one route family owned by media.

---

## V1 Content Model

### Principle

Do not over-model the editorial side.

DevRel is unlikely to update every SIMD individually on a frequent basis. The
content model should therefore optimize for:

- easy periodic refreshes
- simple editorial control
- low risk of stale per-item longform copy

### Recommended Structure

V1 should use two layers:

1. page-level editorial content for the overall upgrades narrative
2. per-SIMD structured metadata with only minimal editorial overrides

### Page-Level Editorial Content

Add a singleton or page-level content source for `/upgrades` containing:

- page title
- intro / explanation of what this page tracks
- optional “last reviewed” text
- optional top-level highlights or callouts
- optional resources / CTA links

This is where DevRel can explain:

- what major upgrades matter right now
- how to interpret statuses
- what changed since the last editorial refresh

This matches the proven workflow of the existing upgrades post much better than
asking editors to maintain longform content on dozens of entries.

### Per-SIMD Entry Model

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

| Field           | Type                               | Purpose                                |
| --------------- | ---------------------------------- | -------------------------------------- |
| `editorialNote` | text, optional                     | short plain-language note from DevRel  |
| `featured`      | checkbox                           | promote on default listing             |
| `tags`          | relationship[] to `tags`, optional | reuse existing taxonomy if useful      |
| `heroImage`     | image, optional                    | only if needed for featured/social use |

V1 deliberately does not include:

- per-SIMD `impactAnalysis` MDX
- per-SIMD `developerGuidance` MDX
- per-SIMD longform editorial bodies

Those can be added later if actual editorial usage proves the need.

---

## Sync Model

### Objective

Keep SIMD metadata current automatically while making editorial refreshes easy
and infrequent.

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
6. preserve editorial-only fields
7. output created / updated / unchanged / failed counts

The sync script owns only synced fields.

Editors own only the minimal editorial fields.

### Automation

Use an automated GitHub workflow that persists generated changes back to this
repo, ideally by opening or updating a dedicated sync PR.

That keeps production current without making editors run the sync manually, but
still preserves normal git review and history.

Recommended cadence:

- scheduled daily or several times per week for metadata freshness
- editorial refreshes remain manual and happen roughly every 2 to 4 weeks

This split is important:

- metadata can stay fresh automatically
- editorial commentary can stay intentionally slower and more selective

---

## Route Structure

### V1 Listing Page

Primary route:

- `/[locale]/upgrades`

This page should do the real work in V1.

It should combine:

- page-level editorial framing
- a “what changed recently” feel through fresh metadata
- a structured list of tracked SIMDs

Recommended sections:

1. Hero / intro
2. Optional “currently notable” featured upgrades
3. Main upgrades list
4. Supporting resources / GitHub CTA

### SIMD Detail Pages

V1 can support `/[locale]/upgrades/[slug]` if implementation cost stays low, but
they should remain data-first and lightweight.

If included, each detail page should show:

- SIMD number
- title
- status
- category and type
- authors
- dates
- feature gate
- summary
- short editorial note, if present
- links to discussion and GitHub
- related SIMDs via `supersedes` and `supersededBy`

If detail pages add too much complexity for V1, keep the first release focused
on the listing page and link directly to GitHub for full proposal details.

---

## How To Surface Updates Simply

The design should reflect a periodic-review workflow, not a newsroom workflow.

That means:

- avoid layouts that imply constant editorial churn
- emphasize status, recency, and relationship over long prose
- make it obvious what changed without requiring custom writing for each item

Recommended listing behavior:

- default sort: recently updated
- simple filters: status, category, optional type
- search by SIMD number or title
- featured SIMDs pinned only on the default view
- each card shows the key metadata at a glance

Recommended card structure:

- SIMD badge
- title
- status badge
- category / type badges
- summary
- updated date
- optional editorial note snippet

This gives DevRel one easy place to review the current state of upgrades and add
lightweight context only where needed.

---

## SIMD Relationship Model

The relationship layer still matters in V1.

We should preserve and surface:

- `supersedes`
- `supersededBy`
- category
- type
- links to source proposal and discussion

How to honor that structure in the UI:

- show relationship links on each detail page, if detail pages exist
- on the listing page, optionally show a small related-SIMD row for entries that
  supersede or are superseded
- keep relationship data structured in the content model, not embedded in prose

This keeps the experience useful for technical readers without requiring heavy
custom editorial content.

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

Do not overbuild the query layer beyond what the listing page needs.

---

## Metadata Strategy

We still need to honor the metadata around SIMDs and the process.

That means the product should reliably expose:

- lifecycle status
- proposal category / type
- authorship
- creation and update timing
- proposal source link
- discussion link
- proposal relationships

Metadata should carry most of the information burden in V1.

This is the right fit for a page that is updated every few weeks by humans but
refreshed continuously by sync automation.

---

## Components

Keep the component set small.

Suggested V1 components:

```text
components/upgrades/
├── upgrade-card.tsx
├── upgrade-filters.tsx
├── status-badge.tsx
├── category-badge.tsx
├── upgrade-hero.tsx
└── related-simds.tsx
```

Optional detail-page components:

```text
components/upgrades/
├── upgrade-header.tsx
└── upgrade-meta-sidebar.tsx
```

Avoid introducing extra component types unless the listing page actually needs
them.

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
│   ├── upgrade-card.tsx
│   ├── upgrade-filters.tsx
│   ├── status-badge.tsx
│   ├── category-badge.tsx
│   ├── upgrade-hero.tsx
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

The design should feel more like a maintained technical tracker than a stream of
articles.

V1 should emphasize:

- clarity
- scanability
- stable structure
- low editorial overhead

Avoid:

- article-heavy layouts
- too many content blocks
- interfaces that depend on frequent copy edits to stay useful

A good visual direction is:

- strong page intro
- compact featured area
- clean filter row
- dense but readable cards
- metadata-forward presentation

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
3. verify `/[locale]/upgrades` is useful without any per-SIMD longform content
4. verify editorial notes remain easy to edit in Keystatic
5. verify related SIMD links render correctly
6. verify proxied `/upgrades` works on staging

---

## Implementation Order

1. confirm rewrite ownership for `/upgrades`
2. add the lean `upgrades` collection
3. implement the sync script
4. add automated sync PR workflow
5. build the listing data layer and API
6. build the listing page and lightweight components
7. add optional detail pages only if they remain cheap and data-first
8. add metadata polish and end-to-end verification

---

## Definition Of Done

V1 is done when:

- `/upgrades` is reachable as a media-owned route on `solana.com`
- SIMD metadata sync runs automatically and persists changes back to git
- DevRel can make lightweight editorial updates without managing many content
  types
- the listing page clearly surfaces upgrade status, recency, and relationships
- related SIMDs are preserved and visible
- the experience remains useful even if editorial updates only happen every 2 to
  4 weeks
