# Builder App Agent Guide

Use this guide after the root `AGENTS.md` when working in `apps/builder`.

## Overview

Landing page for BLDR Epoch//01 (San Francisco, March 9–10, 2027), served at
`solana.com/builder`. The public name is "BLDR"; the URL spells out "builder".

**Package name**: `solana-com-builder` **Default port**: 3007

Design source: Figma file "SOLANA - BUILDER EVENT", page "Landing Page" (Black
and White desktop frames).

## Structure

```
apps/builder/
├── src/
│   ├── app/[locale]/        # layout, page, not-found
│   ├── app/globals.css      # palette tokens, surface classes, chamfer utility
│   ├── assets/              # themeable inline SVGs (*.inline.svg)
│   ├── components/          # one file per page section, plus motion parts
│   ├── content/links.ts     # Luma, speaker and sponsor URLs
│   └── fonts/               # display and body font files
└── public/images/           # logos and the About photo
```

Copy lives in `packages/i18n/messages/builder/en/common.json`.

## How it is served

- `assetPrefix` is `/builder-assets`. Use `getImagePath()` from `src/config.ts`
  for anything in `public/`.
- `apps/web/rewrites-redirects.ts` proxies `/builder`, `/:locale/builder` and
  `/builder-assets/*` to this app (`BUILDER_APP_URL` in `apps/web/apps-urls.ts`,
  Vercel project `solana-com-bldr`; the pnpm package stays
  `solana-com-builder`).
- On production, `src/middleware.ts` redirects direct visits to the
  `*.vercel.app` host to `solana.com/builder` (308). Proxied requests and
  preview deployments are served as is. Assets are not redirected.

## SEO

- Title, description and social image alt are `builder.metadata.*` in the copy
  file; `src/app/metadata.ts` builds the tags.
- `src/lib/structured-data.ts` emits one JSON-LD graph: Event, organizer and
  FAQPage. The FAQ node reads the rendered FAQ strings. Add the venue's street
  address and ticket offers there when they are announced.
- Crawlers find the page through `solana.com/sitemap.xml`:
  `packages/sitemap/src/routes/builder.ts` reads `src/app/sitemap-routes.json`.
  Add new routes to that JSON file.
- The copy is English only, so every locale canonicalizes to `/builder`, there
  is no hreflang, and the sitemap lists the English URL alone. When translations
  ship, switch to per-locale canonicals with `languages` alternates and
  `createLocalizedEntries` in the sitemap route.

## Palettes

The design has a Black and a White version. They are the same layout with
surfaces A and B swapped, so sections pick a surface class (`surface-a`,
`surface-b`, `surface-accent`, `surface-black`, `surface-white`) and children
use the Tailwind colors `surface` and `ink`. The header toggle sets
`data-bldr-theme` on `<html>` and stores the choice in `localStorage`.

## Fonts

- **Display ("Solana Builder SF")**:
  `src/fonts/bldr-slab/BLDRSlab-Regular.woff2`, taken from the design studio's
  prototype and exposed as `font-display`. Replace it with the supplied file
  when the asset toolkit arrives. Headings are live text (`TurnHeading`); the
  outlined heading SVGs in `public/images/headings/` are no longer used.
- **Body ("Suisse Int'l")**: not in the repo. ABC Diatype stands in. To switch,
  replace the `src` paths in `src/app/[locale]/layout.tsx`. The studio's
  prototype embeds Suisse, but it is a licensed face and this repo is public, so
  do not copy it in without confirming the licence.

## Motion

Motion follows the design studio's prototype ("Buildr Landing Page" artifact).
The rule is steps, not fades: the page is built, not faded in. There is no
animation library: sections use CSS transitions that start when a `data-on`
attribute is set on first view (`useSeen` in `components/motion.tsx`), the FAQ
uses the Web Animations API, and the hero is stepped by hand.

- `TurnHeading` (`components/motion.tsx`): each letter turns a quarter into
  place on a tile, 45ms apart (70ms in the call to action).
- `Build`: a block's outline is drawn in six steps, its fill comes in from the
  left in four, then its content appears. Give each block the delay the
  prototype gives it.
- `HeroIntro`: the prototype's cube intro (its default, "Intro A"), ported from
  the studio's motion file onto the Figma lock-up (`components/heroLockup.ts`
  holds the pieces). The symbol block shrinks onto the line and turns face by
  face, pushing R, D, L, B out of its edge; the tiles drop, the row moves to the
  lock-up's place, EPOCH comes in under one 45° slash and //00 turns to //01.
  Afterwards a letter under the pointer turns to the next letter and back. It is
  CSS 3D transforms driven by `requestAnimationFrame` and the Web Animations
  API, as in the prototype: no WebGL. Geometry is in lock-up units (`--u`), so
  it scales without script. The server draws the intro's first frame (the symbol
  block, `data-bldr-poster`), so the first screen is not empty while the script
  loads; the intro hides it as it starts. On phones it adds the tagline,
  Register, "Rebuild the logo" (replays the intro) and the date row, whose cells
  light as they are dealt and under the pointer.
- `SlashField`: the pattern is generated on a canvas, scrubbed in by scroll; a
  click deals a new one. It is generated only once it is within a screen of the
  viewport.
- `FaqList`: native `<details>`; the marker turns and the answer fills in four
  steps.
- `CtaLink`: live links cut their lower-right corner on hover (`btn-cut`) and
  change colour at once (`hoverClassName`): a violet button turns white on a
  black ground and stays violet on a white one (`--bldr-btn-hover`). The outline
  button (`btn-ghost`) closes its line around the cut.

Anything that starts hidden carries the `bldr-anim` class so the `<noscript>`
rule in the layout can show it. Reduced-motion users get the end state at once.

## Load performance

Measured on a throttled phone, the first screen depends on how much script and
HTML arrive before the hero can start. Keep these in place:

- **Client messages**: `pickClientMessages` in the layout passes only the
  namespaces client components read. The merged catalog includes all of
  solana.com's copy (about 900 KB) and would be written into every page. Add a
  namespace there when a client component starts using `useTranslations`.
- **Solana menu**: `DeferredFabMenu` loads the FAB in its own chunk after the
  intro has played (`INTRO_DONE_EVENT`), or when idle on a page with no intro.
- **Shared packages**: `optimizePackageImports` in `next.config.ts` covers
  `@solana-com/ui-chrome` and `@workspace/ui`. Without it their whole indexes
  (site header and footer, dialogs, Radix) ship with the layout.
- **Tailwind**: `content` lists only the shared components this app renders.
- **Cookie banner**: stays in the layout's own script. It is the largest paint
  for a first-time visitor, so deferring it delays LCP.

Not built from the prototype: its two alternative intros (Lock-up and Block,
review options only) and the Program and Speakers sections.

## Launch scope

Homepage only, with the sections the copy doc covers: hero, overview, Get
involved (sponsor card), FAQ and the closing call to action. Program and
Speakers exist in the design but are not built until that content is announced.
`components/Campus.tsx` (the three venues) is built but not rendered: the copy
doc has no venue copy and its figures differ. "Get involved" is not in Figma; it
is composed from the design's existing card styles.

Before launch:

1. Set the two URLs in `src/content/links.ts` (buttons are inert while `null`).
2. Replace the FAQ questions and answers, which are still placeholders; the copy
   doc lists the FAQ heading only.
3. Confirm `solana.com/builder` reaches the `solana-com-bldr` Vercel project.
   The web app allows three related projects and all three are taken, so
   `/builder` resolves to `https://solana-com-bldr.vercel.app` (as Accelerate
   and Breakpoint do) unless `NEXT_PUBLIC_BUILDER_APP_URL` is set.

## Commands

```bash
pnpm dev --filter solana-com-builder
pnpm --filter solana-com-builder check-types
pnpm --filter solana-com-builder lint
```

The FAB menu package must be built once before type-checking or running:
`pnpm --filter @solana-foundation/fab-menu build`.

## Conventions

- Tailwind utilities only; no CSS modules or page-level CSS imports.
- Square corners throughout. Cut corners use the `chamfer` utility with
  `--chamfer` set per element.
- Locales fall back to English until the copy is final and the app is added to
  the Lingo scopes.
