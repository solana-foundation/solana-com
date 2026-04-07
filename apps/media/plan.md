# /upgrades — SIMD Tracker for Solana Media

## Context

The Solana DevRel team needs a centralized place to track and communicate SIMD
(Solana Improvement Document) proposals as they move from idea to activation.
Currently, SIMD tracking is fragmented across community tools (simd.watch,
simdigest.com, simd.wtf) and the raw GitHub repo. None provide the authoritative
editorial voice that the Foundation can offer.

This builds a new `/upgrades` route in the media app with a **data-first
approach**: SIMD metadata is synced from GitHub into Keystatic, and DevRel can
optionally enrich entries with editorial summaries, impact analysis, and
developer guidance through the CMS.

---

## Content Type: `upgrades` (Keystatic Collection)

### Synced Fields (from GitHub)

| Field           | Type              | Source                                                                                                |
| --------------- | ----------------- | ----------------------------------------------------------------------------------------------------- |
| `simdNumber`    | string            | Filename (e.g., "0048")                                                                               |
| `title`         | text              | SIMD frontmatter                                                                                      |
| `status`        | select            | SIMD frontmatter — Idea, Draft, Review, Accepted, Implemented, Activated, Withdrawn, Stagnant, Living |
| `category`      | select            | SIMD frontmatter — Standard, Meta, Advisory                                                           |
| `type`          | select (optional) | SIMD frontmatter — Core, Networking, Interfaces (Standard SIMDs only)                                 |
| `authors`       | text              | SIMD frontmatter (comma-separated names)                                                              |
| `createdDate`   | date              | SIMD frontmatter                                                                                      |
| `updatedDate`   | date              | SIMD frontmatter or git history                                                                       |
| `featureGate`   | text (optional)   | SIMD frontmatter                                                                                      |
| `supersedes`    | text (optional)   | SIMD number(s) this replaces                                                                          |
| `supersededBy`  | text (optional)   | SIMD number(s) that replace this                                                                      |
| `githubUrl`     | url               | Constructed from repo + filename                                                                      |
| `discussionUrl` | url (optional)    | SIMD frontmatter discussions-to field                                                                 |
| `summary`       | text              | First paragraph of SIMD "Summary" section                                                             |

### Editorial Fields (DevRel adds in CMS)

| Field               | Type                  | Purpose                                           |
| ------------------- | --------------------- | ------------------------------------------------- |
| `editorialSummary`  | text                  | Plain-language explanation of what this SIMD does |
| `impactAnalysis`    | MDX                   | Who does this affect? What changes?               |
| `developerGuidance` | MDX                   | What do developers need to know or do?            |
| `relatedLinks`      | array of {label, url} | External resources, blog posts, discussions       |
| `tags`              | relationship[] → tags | Reuse existing tags collection                    |
| `featured`          | checkbox              | Pin to top of listing                             |
| `heroImage`         | image (optional)      | For social sharing / featured display             |

### Content Directory

```
content/upgrades/
├── simd-0001.yaml   # Each SIMD is a YAML file (not MDX since body is editorial)
├── simd-0048.yaml
├── simd-0286.yaml
└── ...
```

---

## Sync Script

**File**: `scripts/sync-simds.ts`

**Approach**:

1. Fetch the `proposals/` directory listing from the GitHub API
   (`solana-foundation/solana-improvement-documents`)
2. For each `.md` file, fetch raw content and parse YAML frontmatter
3. Extract the "Summary" section (first paragraph after `## Summary`)
4. For each SIMD:
   - If no local file exists → create a new Keystatic entry with synced fields,
     empty editorial fields
   - If local file exists → update only synced fields, preserve editorial fields
5. Log created/updated/unchanged counts

**Run via**: `pnpm sync:simds` (package.json script) **Can be run**: Manually,
or via CI/scheduled action

---

## Routes

### Listing: `/[locale]/upgrades/`

```
app/[locale]/upgrades/
├── page.tsx           # Server component — fetches initial data, generates metadata
└── client-page.tsx    # Client component — filtering, search, load more
```

**Features**:

- Status filter pills: Draft | Review | Accepted | Implemented | Activated (+
  All)
- Category filter: Standard/Core | Standard/Networking | Meta | Advisory (+ All)
- Search by SIMD number or title
- Sort by: Updated (default), Created, SIMD Number
- Cards show: SIMD number badge, title, status pill, category, summary, updated
  date
- Featured SIMDs pinned to top
- Cursor-based pagination via API route

### Detail: `/[locale]/upgrades/[slug]/`

```
app/[locale]/upgrades/[slug]/
└── page.tsx           # Server component — full SIMD detail
```

**Layout**:

- Header: SIMD number + title, status badge, category/type badges
- Lifecycle bar: visual indicator showing where this SIMD is in the pipeline
- Metadata sidebar: authors, dates, feature gate, GitHub link, discussion link
- Body sections (conditionally rendered):
  - Summary (always — from GitHub sync)
  - Editorial Summary (if DevRel has written one)
  - Impact Analysis (if present)
  - Developer Guidance (if present)
  - Related Links (if present)
- Related SIMDs: supersedes/superseded-by links
- Footer CTA: link to GitHub proposal for full technical detail

---

## Data Layer

### Types: `lib/upgrade-types.ts`

```typescript
interface UpgradeItem {
  id: string; // slug (e.g., "simd-0048")
  simdNumber: string; // "0048"
  title: string;
  status: SIMDStatus;
  category: SIMDCategory;
  type?: SIMDType;
  authors: string;
  createdDate: string;
  updatedDate: string;
  featureGate?: string;
  supersedes?: string;
  supersededBy?: string;
  githubUrl: string;
  discussionUrl?: string;
  summary: string;
  // Editorial
  editorialSummary?: string;
  impactAnalysis?: ContentDocument;
  developerGuidance?: ContentDocument;
  relatedLinks?: { label: string; url: string }[];
  tags: string[];
  featured: boolean;
  heroImage?: string;
  cursor?: string;
}

type SIMDStatus =
  | "idea"
  | "draft"
  | "review"
  | "accepted"
  | "implemented"
  | "activated"
  | "withdrawn"
  | "stagnant"
  | "living";
type SIMDCategory = "standard" | "meta" | "advisory";
type SIMDType = "core" | "networking" | "interfaces";
```

### Data functions: `lib/keystatic/upgrade-data.ts`

Follow `post-data.ts` pattern:

- `transformUpgrade(slug, entry)` → `UpgradeItem`
- `fetchUpgrades({ limit, cursor, status?, category?, search? })` →
  `{ items, pageInfo }`
- `fetchUpgradeBySlug(slug)` → `UpgradeItem | null`
- `fetchFeaturedUpgrades()` → `UpgradeItem[]`

### API Route: `app/api/upgrades/latest/route.ts`

Follow `posts/latest/route.ts` pattern:

- GET with query params: `limit`, `cursor`, `status`, `category`, `search`
- `unstable_cache` with `revalidate: 300`

### Metadata: add to `lib/metadata.ts`

- `upgradeListingMetadata()` — for `/upgrades`
- `upgradeDetailMetadata(slug)` — for `/upgrades/[slug]`

---

## Component Breakdown

### Listing Page Components

| Component        | Purpose                                                                                       |
| ---------------- | --------------------------------------------------------------------------------------------- |
| `UpgradeFilters` | Status pills + category dropdown + search input                                               |
| `UpgradeCard`    | Card for each SIMD in the grid — number badge, title, status, category, summary snippet, date |
| `StatusBadge`    | Colored pill showing SIMD status                                                              |
| `CategoryBadge`  | Badge for Standard/Meta/Advisory                                                              |

### Detail Page Components

| Component            | Purpose                                                       |
| -------------------- | ------------------------------------------------------------- |
| `UpgradeHeader`      | SIMD number, title, status/category badges                    |
| `LifecycleBar`       | Visual pipeline showing stages with current stage highlighted |
| `UpgradeMetaSidebar` | Authors, dates, feature gate, links                           |
| `EditorialSection`   | Renders editorial MDX content blocks (impact, guidance)       |
| `RelatedSIMDs`       | Links to supersedes/superseded-by SIMDs                       |

---

## Files to Create

```
apps/media/
├── content/upgrades/                          # Content directory (populated by sync)
├── lib/upgrade-types.ts                       # TypeScript types
├── lib/keystatic/upgrade-data.ts              # Data fetch/transform layer
├── app/[locale]/upgrades/
│   ├── page.tsx                               # Listing server component
│   └── client-page.tsx                        # Listing client component
├── app/[locale]/upgrades/[slug]/
│   └── page.tsx                               # Detail server component
├── app/api/upgrades/latest/
│   └── route.ts                               # Pagination API
├── components/upgrades/
│   ├── upgrade-card.tsx                        # Card component
│   ├── upgrade-filters.tsx                     # Filter controls
│   ├── status-badge.tsx                        # Status pill
│   ├── category-badge.tsx                      # Category badge
│   ├── lifecycle-bar.tsx                       # Visual lifecycle indicator
│   ├── upgrade-header.tsx                      # Detail page header
│   ├── upgrade-meta-sidebar.tsx                # Detail page sidebar
│   └── related-simds.tsx                       # Related SIMDs links
└── scripts/sync-simds.ts                       # GitHub sync script
```

## Files to Modify

| File                   | Change                                                       |
| ---------------------- | ------------------------------------------------------------ |
| `keystatic.config.tsx` | Add `upgrades` collection definition                         |
| `lib/metadata.ts`      | Add `upgradeListingMetadata()` and `upgradeDetailMetadata()` |
| `package.json`         | Add `sync:simds` script                                      |

---

## Design Direction

**Aesthetic**: Match the existing media site dark theme. Clean,
developer-focused, information-dense but scannable.

**Listing page**:

- Hero section with "Solana Upgrades" title and brief description
- Horizontal filter bar with status pills (colored by status) and category
  dropdown
- Search input for SIMD number/title
- Grid of cards (2-3 columns) with clear visual hierarchy: number → title →
  status → summary
- Featured SIMDs get a larger card treatment at top

**Detail page**:

- Clean document layout with metadata sidebar on desktop
- Lifecycle bar at top showing the full pipeline with current stage
  highlighted/glowing
- Editorial sections clearly differentiated from synced data (subtle visual
  treatment)
- Strong CTA to view full proposal on GitHub

**Status colors**:

- Draft: gray
- Review: yellow/amber
- Accepted: blue
- Implemented: purple
- Activated: green
- Withdrawn: red
- Stagnant: muted/dim

---

## Verification

1. `pnpm sync:simds` — verify it creates content files from GitHub
2. `pnpm dev --filter solana-com-media` — verify listing page renders with
   filters
3. Click through to detail pages — verify metadata and editorial sections render
4. Test Keystatic admin at `/keystatic` — verify upgrades collection is editable
5. Test filter combinations on listing page
6. Check metadata/SEO with browser dev tools
7. `pnpm build --filter solana-com-media` — verify production build succeeds

---

## Implementation Order

1. Types + Keystatic collection schema
2. Sync script (get real data flowing)
3. Data layer functions
4. API route
5. Detail page (simpler, validates data layer)
6. Listing page + client-side filtering
7. Components (status badges, lifecycle bar, cards)
8. Metadata/SEO
9. Polish and frontend design pass
