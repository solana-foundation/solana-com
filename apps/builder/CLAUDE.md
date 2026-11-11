# BLDR (Builder) - Event Site

> See root `/CLAUDE.md` for monorepo-wide configuration and shared tooling.

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
  Vercel project `solana-com-builder`).

## Palettes

The design has a Black and a White version. They are the same layout with
surfaces A and B swapped, so sections pick a surface class (`surface-a`,
`surface-b`, `surface-accent`, `surface-black`, `surface-white`) and children
use the Tailwind colors `surface` and `ink`. The header toggle sets
`data-bldr-theme` on `<html>` and stores the choice in `localStorage`.

## Fonts

- **Display ("Solana Builder SF")**: `src/fonts/bldr-slab/BLDRSlab-Regular.ttf`,
  taken from the design studio's prototype and exposed as `font-display`.
  Replace it with the supplied file when the asset toolkit arrives. Headings are
  live text (`TurnHeading`); the outlined heading SVGs in
  `public/images/headings/` are no longer used.
- **Body ("Suisse Int'l")**: not in the repo. ABC Diatype stands in. To switch,
  replace the `src` paths in `src/app/[locale]/layout.tsx`. The studio's
  prototype embeds Suisse, but it is a licensed face and this repo is public, so
  do not copy it in without confirming the licence.

## Motion

Motion follows the design studio's prototype ("Buildr Landing Page" artifact)
and uses the `motion` package. The rule is steps, not fades: the page is built,
not faded in.

- `TurnHeading` (`components/motion.tsx`): each letter turns a quarter into
  place on a tile, 45ms apart (70ms in the call to action).
- `Build`: a block's outline is drawn in six steps, its fill comes in from the
  left in four, then its content appears. Give each block the delay the
  prototype gives it.
- `HeroIntro`: the lock-up rises and drops in piece by piece
  (`components/heroLockup.ts` holds the pieces, cut from the Figma export). On
  phones it adds the tagline, Register, "Rebuild the logo" and the date row.
- `SlashField`: the pattern is generated on a canvas, scrubbed in by scroll; a
  click deals a new one.
- `FaqList`: native `<details>`; the marker turns and the answer fills in four
  steps.
- `CtaLink`: live links cut their lower-right corner on hover (`btn-cut`).

Anything that starts hidden carries the `bldr-anim` class so the `<noscript>`
rule in the layout can show it. Reduced-motion users get the end state at once.

Not built from the prototype: the studio's cube film intro, the letter cubes
that turn under the pointer, and the Program and Speakers sections.

## Launch scope

Homepage only. Program and Speakers exist in Figma but are not built until that
content is announced. "Get involved" is not in Figma; it is composed from the
design's existing card styles.

Before launch:

1. Set the three URLs in `src/content/links.ts` (buttons are inert while
   `null`).
2. Replace placeholder copy, including FAQ answers, from the copy doc.
3. Create the `solana-com-builder` Vercel project and add it to the web app's
   related projects (or set `NEXT_PUBLIC_BUILDER_APP_URL`).

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
