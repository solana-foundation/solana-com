---
name: page-design
description:
  Build or restyle solana.com (apps/web) pages so they match the latest design
  system, using the homepage (`app/[locale]/home.tsx`) and the tokenization
  solution page (`app/[locale]/solutions/tokenization`) as precedents. Handles
  diverse source content — Google Doc specs, PDFs, Notion docs, HTML templates,
  markdown briefs — and turns it into an on-system page. Use when creating a new
  landing/solution page, redesigning an old page, or reviewing a page for design
  alignment.
---

# Solana.com Page Design

Turn arbitrary source content (a Google Doc spec, PDF, Notion doc, HTML
template, or markdown brief) into a solana.com page that matches the latest
design system ("nd" — new design): black canvas, hairline dividers, Diatype
typography with tight tracking, pill buttons, and image-led card sections.

**Design precedents** (read these before building anything):

- `apps/web/src/app/[locale]/home.tsx` — homepage composition
- `apps/web/src/app/[locale]/solutions/tokenization/` — solution page
  composition (`page.tsx` server wrapper + client page component)
- Figma: **Solana — UI/UX System**
  (`https://www.figma.com/design/CjeDmGL4lGH4Z7MlXd36iX/Solana---UI-UX-System`,
  node `937-791`) — the authoritative design source. If the user supplies a
  Figma frame for the page, read it via the Figma MCP server
  (`get_design_context`, `get_variable_defs`); its variables map 1:1 to the code
  tokens (see design-system.md § Figma source of truth).

**Reference file**: [design-system.md](design-system.md) — full token tables,
typography classes, component inventory, and code skeletons. Read it whenever
you write JSX for a page.

## Step 1 — Ingest the source content

Normalize whatever the user provides into a plain-text content outline before
touching code.

| Source             | How to ingest                                                                                                                             |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Google Doc spec    | Ask for a share link/export, or use a connected Google Drive tool. Pull headings, copy blocks, stats, CTA text.                           |
| PDF                | Read directly with the Read tool (supports PDFs, paginated).                                                                              |
| Notion doc         | Use a connected Notion tool or ask for a markdown export.                                                                                 |
| HTML template/page | Extract **copy and section structure only**. Never import its CSS, fonts, colors, or layout — restyle everything into this design system. |
| Markdown/brief     | Use as-is.                                                                                                                                |

Produce an outline with: page goal, audience, hero headline + subtitle, stats
(if any), narrative/explainer copy, ecosystem/partner logos, product or feature
list, videos, news/related links, and the closing CTA (report download, contact,
etc.). Flag anything missing rather than inventing claims or numbers.

**Edit copy to system scale.** Source docs are usually too wordy:

- Hero title: ≤ 8 words, may use `\n` line breaks; mixed-weight emphasis via a
  `font-light` span on the de-emphasized part.
- Subtitles/descriptions: 1–2 sentences.
- Stat values: short ("$13B+", "3,000+"); labels ≤ 6 words.
- Section titles: 2–6 words.

## Step 2 — Compose the page

**The UX style is fixed; the page structure is not.** Let the source content
drive what sections exist and in what order — don't force every page into the
tokenization layout. What must stay constant is the visual language: tokens,
typography classes, divider rhythm, pill buttons, one accent color, subtle
staggered motion. A page that nails the style with a novel structure is correct;
a page that copies the tokenization structure with off-system styling is not.

The archetypes below are a **vocabulary, not a template**. They're proven
sections you can reuse, reorder, repeat, or skip. Sections are separated by
`<Divider />`; a `<Decor />` band once or twice per page breaks long runs of
dividers.

1. **Hero** — `SolutionHero` (solutions) or homepage-style hero. Title,
   subtitle, one or two CTAs (primary white pill, optionally paired with an
   outline pill), optional stat strip and promo/download card, UnicornScene
   animated background with webp fallback.
2. **Logos strip** — `Logos` row of ecosystem/partner logos.
3. **Explainer** — `WhatIsIt`: big heading + scroll-highlighted paragraph with
   the page's accent color, optional parallax image.
4. **Ecosystem/Projects** — `Projects` grid with stats per project.
5. **Products/Features** — `Products` list with toolkit image.
6. **Performance/Stats** — `Performance` / `StatsGrid` with animated counters.
7. **Card carousels** — `CardCarouselSection` wrapping `PlaceMediaCard`
   (events), `BigBannerCard` (news), `BigVideoCard` (videos).
8. **Videos** — `VideoGrid` + `VideoPlayerModal`.
9. **Latest news** — `LatestNews` fed by `fetchSolutionNews`.
10. **Closing CTA** — `SolutionReport` (report download + "what else" links) or
    `Community` (link cards).

Not every page needs every section, and content may demand a section that has no
archetype (a comparison table, a timeline, an interactive demo, a pricing grid).
Build it — using the layout/spacing/typography rules in
[design-system.md](design-system.md) — and slot it into the divider rhythm. As a
baseline, a good solution page is hero + 4–6 sections + closing CTA, but treat
that as a starting point, not a constraint.

## Step 3 — Reuse components; create shared ones only when required

Strict precedence order (full inventory of every tier in
[design-system.md](design-system.md) § Workspace packages and § Component
inventory):

1. **Reuse as-is** — in this order: workspace packages (`@workspace/ui`
   primitives, `@solana-com/ui-chrome` chrome/icons/Link), then
   `apps/web/src/component-library/*`, then
   `apps/web/src/components/solutions/*.v2.tsx`. Compose with props only. Per
   repo convention, import shared components from workspace packages — never via
   relative paths into another package or app.
2. **Extend, don't fork** — if a component is ~80% right, add an optional,
   non-breaking prop (see `SolutionHero`'s `showDownloadCard`, `extraCta`).
   Never copy-paste a component to tweak it.
3. **Promote** — if a one-off pattern from an older page is needed again,
   promote it into `src/component-library/` as a generic, props-driven component
   (no hardcoded copy, colors passed as props, i18n-ready).
4. **Create shared** — a genuinely new section that plausibly serves more than
   one page goes in `src/component-library/` (or `components/solutions/` if
   solution-specific), styled exclusively with `nd-*` tokens and `nd-heading-*`
   / `nd-body-*` classes. If it must be shared **across apps** (web + docs +
   media + templates), it belongs in `packages/ui` (generic primitive) or
   `packages/ui-chrome` (site chrome) instead — both are already wired into each
   app's Tailwind `content` globs, so `nd-*` tokens work there.
5. **Page-local last resort** — only pure composition/glue lives in the page's
   own client component.

**Never** build new pages from: non-`.v2` solutions components, Bootstrap/SCSS
module patterns, `src/pages/` legacy code, or raw hex colors that duplicate an
existing `nd-*` token.

## Step 4 — Scaffold the page

Whatever the page's section composition, the **file layout** follows the
tokenization page exactly (skeletons in [design-system.md](design-system.md)):

- `apps/web/src/app/[locale]/<path>/page.tsx` — server component: data fetching,
  `revalidate`, `generateMetadata` with `getTranslations` + `getAlternates`.
- `apps/web/src/app/[locale]/<path>/<name>.tsx` — `"use client"` page component
  composing the sections.
- `apps/web/src/data/<section>/<page>.ts` — structured data (logos, products,
  videos, links). No copy in JSX.
- `packages/i18n/messages/web/en/common.json` — all user-facing copy under a
  page namespace (e.g. `"icm"`, `"depin"`). Access via `useTranslations()` /
  `t.rich()`; routing helpers (`getAlternates`) come from
  `@workspace/i18n/routing`. English only; other locales are handled by the
  translation flow.
- Header, footer, theme, and the Inkeep chat button come from
  `@solana-com/ui-chrome` via the root layout — never re-add chrome inside a
  page. Internal links use ui-chrome's `Link`; stat/feature icons come from
  `@solana-com/ui-chrome/icons` before reaching for Lucide or new SVGs.
- Images in `apps/web/public/src/img/<section>/<page>/` — webp only (memory:
  jpeg/png get flagged), Figma-exported assets used directly rather than
  recreated in code.
- Set the page accent: pick one `nd-highlight-*` color, use it for
  `SelectionColor`, `WhatIsIt` highlight, and any accent details. One accent per
  page.

## Step 5 — Verify

- `pnpm lint` and `pnpm format:check` from the repo root (pre-commit runs both).
- `pnpm dev --filter solana-com` and check 390px, 768px, 1280px, 1440px widths —
  the system is a base/`md:`/`xl:` triplet; make sure all three are styled.
- Checklist:
  - [ ] Page wrapper is `bg-nd-bg`/`bg-black`; sections separated by `Divider`
  - [ ] All headings use `nd-heading-*`, body text `nd-body-*`; no ad-hoc font
        sizing where a class exists
  - [ ] Secondary text uses `text-nd-mid-em-text`, borders `nd-border-light`
  - [ ] Buttons are pill-shaped, white-on-black primary
  - [ ] All copy comes from i18n messages; no hardcoded strings in JSX
  - [ ] `generateMetadata` returns title, description, and `alternates`
  - [ ] Hero background has a webp placeholder/fallback for the UnicornScene
  - [ ] Images are webp and lazy-loaded below the fold
  - [ ] On-scroll reveals (`animate-fade-in-up` + intersection observer) on stat
        grids/cards, staggered ~100ms
