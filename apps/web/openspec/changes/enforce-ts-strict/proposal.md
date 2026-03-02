# Change: Enforce TypeScript Strict Mode in apps/web

## Why

`strict: false` and 121 JS/JSX files (~25% of source) leave the compiler blind
to null dereferences, implicit `any`, and unsafe assignments. Refactoring is
risky because breakages go undetected until runtime.

## What Changes

- Enable `strict: true` in `apps/web/tsconfig.json` — fixes errors in existing TS files first
- Convert all 121 JS/JSX files → TS/TSX in six batches (utilities → data → components)
- Replace 31+ explicit `any` usages with proper types (solana-lib props, react-slick arrows, event/community data)
- Remove `allowJs: true` from tsconfig once all JS is gone

## Impact

- Affected specs: `typescript-config`, `js-to-ts-conversion`, `any-elimination`
- Affected code:
  - `apps/web/tsconfig.json` — compiler flags
  - `apps/web/src/utils/*.js` (9 files) → `.ts`
  - `apps/web/src/hooks/*.js` (3 files) → `.ts`
  - `apps/web/src/lib/**/*.js` (3 files) → `.ts`
  - `apps/web/src/constants/developerContentConfig.js` → `.ts`
  - `apps/web/src/data/**/*.js` (17 files) → `.ts`
  - `apps/web/src/components/**/*.js/jsx` (89 files) → `.tsx`
  - `apps/web/src/__tests__/utils/fetcher.test.js` → `.ts`
  - `apps/web/src/app/api/podcast/episodes/route.js` → `.ts`

## Batching Strategy

Files are converted in dependency order — leaf utilities first, then data
files, then components — so each batch compiles cleanly before the next begins.

| Batch | Scope | Files |
|-------|-------|-------|
| 1 | `strict: true` + fix existing TS errors | — |
| 2 | utils, hooks, lib, constants | 16 |
| 3 | data/** | 17 |
| 4 | validators, ecdr, branding, community, possible, sharedPageSections | 33 |
| 5 | ramps, wallets, hackathon, nft-showdown, playgg, ai, accelerate, developers, shared, misc | 38 |
| 6 | Remaining (layout, newsletter, CookieConsent, GTM, SolFormattedMessage, ModalLauncher, api route, test) | 17 |
| 7 | Fix all explicit `any` usages | — |
| 8 | Remove `allowJs`, final build + test | — |
