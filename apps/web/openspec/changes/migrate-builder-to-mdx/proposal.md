# Change: Migrate Builder.io to MDX

## Why

Builder.io adds external dependency complexity, runtime SDK overhead, and vendor
lock-in for content that can be managed as static MDX files. Migrating to MDX
eliminates the external CMS dependency, improves build-time performance, enables
version-controlled content, and gives developers direct control over landing
page content.

## What Changes

- **Export Builder.io content** to JSON backup files (all 50+ routes, all 19
  locales)
- **Download Builder.io assets** to local `public/src/img/landings/` directory
- **Convert 16 priority landing pages** from Builder JSON to MDX format with
  frontmatter
- **Rewrite `[...slug].js`** to render MDX files instead of Builder components
- **BREAKING: Remove Builder.io SDK** (`@builder.io/react`, `@builder.io/sdk`)
  from dependencies
- **Remove Builder-specific code** (API calls, component registration, preview
  mode)

## Impact

- Affected specs: `content-export`, `mdx-landing-pages`, `builder-removal` (all
  new capabilities)
- Affected code:
  - `apps/web/src/pages/[locale]/[...slug].js` - Complete rewrite
  - `apps/web/src/lib/builder/` - Entire directory removed
  - `apps/web/src/utils/builderConfigs.js` - Removed
  - `apps/web/src/utils/customComponentGenerator.js` - Removed
  - `apps/web/package.json` - Remove Builder dependencies
  - `apps/web/next.config.ts` - Remove Builder CSP and image domains
  - New: `apps/web/content/landings/` - MDX content directory
  - New: `apps/web/scripts/export-builder.ts` - One-time export script
  - New: `apps/web/builder/` - JSON backup directory

## Scope Boundaries

### In Scope (Priority Routes)

- `/solutions/token-extensions`
- `/solutions/actions`
- `/solutions/solana-permissioned-environments`
- `/solutions/games-tooling`
- `/solutions/payments-tooling`
- `/solutions/commerce-tooling`
- `/solutions/financial-infrastructure`
- `/solutions/digital-assets`
- `/solutions/real-world-assets`
- `/solutions/gaming-and-entertainment`
- `/solutions/artists-creators`
- `/solutions`
- `/rpc`
- `/tos`
- `/privacy-policy`

### Out of Scope (Backup Only)

All other Builder routes are exported to JSON for backup but not converted to
MDX in this change. These include: `/`, `/2024outlook`, `/analytics/topledger`,
`/art-basel`, `/community/*`, `/demo-page`, `/developers/*`, `/local-sandbox`,
`/pyusd`, `/research`, `/staking`, `/tokenized-equities`, `/wallets`, and
remaining `/solutions/*` pages.

## Supported Locales

Content export covers all 19 locales: en (default), ar, de, el, es, fi, fr, id,
it, ja, ko, nl, pl, pt, ru, tr, uk, vi, zh. Files are only created if translated
content exists; English is required for all pages.

## Migration Strategy

1. Export phase runs independently as backup (no impact on live site)
2. MDX conversion maintains visual parity (no design changes)
3. New route handler includes locale fallback to `en`
4. Builder removal happens after MDX pages are verified working
