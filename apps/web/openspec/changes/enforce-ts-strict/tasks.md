# Tasks: Enforce TypeScript Strict Mode

## 1. Enable strict: true (Phase 1)

- [x] 1.1 Set `"strict": true` and `"strictNullChecks": true` in `apps/web/tsconfig.json`
- [x] 1.2 Run `pnpm tsc --noEmit` and collect all errors
- [x] 1.3 Fix null/undefined violations (TS2531/TS2532) — use `?.`, `??`, or explicit guards; avoid `!` non-null assertions
- [x] 1.4 Fix remaining strict errors in existing `.ts`/`.tsx` files (noImplicitAny, strictPropertyInitialization, noImplicitThis)

## 2. Convert utilities, hooks, lib, constants (Phase 2)

- [x] 2.1 `src/utils/Link.js` → `.ts`
- [x] 2.2 `src/utils/dateUtils.js` → `.ts`
- [x] 2.3 `src/utils/emailUtils.js` → `.ts`
- [x] 2.4 `src/utils/fetcher.js` → `.ts`
- [x] 2.5 `src/utils/followerFunctions.js` → `.ts`
- [x] 2.6 `src/utils/getNextRequestId.js` → `.ts`
- [x] 2.7 `src/utils/rpcUtils.js` → `.ts`
- [x] 2.8 `src/utils/stringUtils.js` → `.ts`
- [x] 2.9 `src/utils/ytUtils.js` → `.ts`
- [x] 2.10 `src/hooks/useIsomorphicLayoutEffect.js` → `.ts`
- [x] 2.11 `src/hooks/useReducedMotion.js` → `.ts`
- [x] 2.12 `src/hooks/useTransactionStats.js` → `.ts`
- [x] 2.13 `src/lib/markdown/index.js` → `.ts`
- [x] 2.14 `src/lib/podcast/index.js` → `.ts`
- [ ] 2.15 `src/lib/sitemap/media-urls.js` → `.ts` (deferred — CJS required by `next-sitemap.config.js` at runtime; convert alongside that file in Phase 6)
- [x] 2.16 `src/constants/developerContentConfig.js` → `.ts`

## 3. Convert data files (Phase 3)

- [x] 3.1 `src/data/developers/evm-to-svm/*.js` (12 files) → `.ts`, exports `as const`
- [x] 3.2 `src/data/developers/dao.js`, `defi.js`, `gaming.js`, `nfts.js`, `payments.js` → `.ts`, exports `as const`
- [x] 3.3 `src/data/ramps/ramps-data.js`, `wallets/wallet-data.js`, `wallets/wallet-filters.js` → `.ts`, exports `as const`
- [x] 3.4 `src/data/pyusd.js`, `research.js`, `staking.js`, `tokenized-equities.js`, `wallets.js` → `.ts`, exports `as const`
- [x] 3.5 `src/data/solutions/financial-institutions.js`, `request-for-startups.js` → `.ts`, exports `as const`

## 4. Convert simple components (Phase 4)

- [x] 4.1 `src/components/validators/*.js` (5 files) → `.tsx`
- [x] 4.2 `src/components/ecdr/*.js` (3 files) → `.tsx`
- [x] 4.3 `src/components/branding/*.jsx` (4 files) → `.tsx`
- [x] 4.4 `src/components/community/*.jsx` (4 files) → `.tsx`
- [x] 4.5 `src/components/possible/*.js/jsx` (16 files) → `.tsx`
- [x] 4.6 `src/components/sharedPageSections/HashAccordion.js` → `.tsx`

## 5. Convert page-feature components (Phase 5)

- [x] 5.1 `src/components/ramps/*.jsx` (6 files) → `.tsx`
- [x] 5.2 `src/components/wallets/*.jsx` (4 files) → `.tsx`
- [x] 5.3 `src/components/hackathon/**/*.jsx` (7 files) → `.tsx`
- [x] 5.4 `src/components/nft-showdown/*.jsx` (4 files) → `.tsx`
- [x] 5.5 `src/components/playgg/*.jsx` (4 files) → `.tsx`
- [x] 5.6 `src/components/ai/*.jsx` (3 files) → `.tsx`
- [x] 5.7 `src/components/accelerate/*.jsx` (3 files) → `.tsx`
- [x] 5.8 `src/components/developers/**/*.jsx` (3 files) → `.tsx`
- [x] 5.9 `src/components/shared/EmailSubscribeForm/IterableEmailSubscribeForm.jsx` → `.tsx`
- [x] 5.10 `src/components/shared/EmailSubscribeForm/index.js` → `.ts`
- [x] 5.11 `src/components/shared/Iterable/useIterableSignUp.jsx` → `.tsx`

## 6. Convert misc files (Phase 6)

- [x] 6.1 `src/components/layout.js` → `.tsx`
- [x] 6.2 `src/components/CookieConsent/CookieConsent.jsx` → `.tsx`
- [x] 6.3 `src/components/GTMTrackingSnippet.js` → `.tsx`
- [x] 6.4 `src/components/ModalLauncher/ModalLauncher.js` → `.tsx`
- [x] 6.5 `src/components/SolFormattedMessage/index.js` → `.tsx`
- [x] 6.6 `src/components/newsletter/artistsAndCreators/index.js` → `.tsx`
- [x] 6.7 `src/app/api/podcast/episodes/route.js` → `.ts`
- [x] 6.8 `src/__tests__/utils/fetcher.test.js` → `.ts`

## 7. Fix explicit any usages (Phase 7)

- [x] 7.1 Create `src/types/solana-lib.ts` — `SolanaLibAttributes` interface for accelerate component `attributes` props
- [x] 7.2 Replace `attributes: any` in all `src/components/accelerate/*.tsx` with `SolanaLibAttributes`
- [x] 7.3 Type react-slick arrow callbacks: `(props: any)` → `(props: CustomArrowProps)` from `react-slick`
- [x] 7.4 Add `CalendarEvent` interface in `src/types/` and replace `any` in `src/app/[locale]/events/`
- [x] 7.5 Add `CommunityPost` interface and replace `any` in `src/app/[locale]/community/`
- [x] 7.6 Replace `error: any` in catch blocks with `unknown` + type narrowing

## 8. Remove solana-lib stubs after upstream types land (Phase 8 — deferred)

- [ ] 8.0 Contribute proper types to `@solana-foundation/solana-lib` (separate PR upstream)
- [ ] 8.0.1 Once new solana-lib version published, bump `apps/web/package.json` dependency
- [ ] 8.0.2 Delete `src/types/solana-lib.ts`
- [ ] 8.0.3 Update all `import … from "@/types/solana-lib"` → import from `@solana-foundation/solana-lib`
- [ ] 8.0.4 Run `pnpm tsc --noEmit` to confirm no regressions

## 9. Final cleanup (Phase 9)

- [ ] 9.1 Remove `"allowJs": true` from `apps/web/tsconfig.json`
- [ ] 9.2 Remove `**/*.js` and `**/*.jsx` from `tsconfig.json` `include` array
- [ ] 9.3 Run `pnpm tsc --noEmit` — zero errors
- [ ] 9.4 Run `pnpm build --filter solana-com` — successful build
- [ ] 9.5 Run `pnpm test --filter solana-com` — tests pass

## Dependencies

- Tasks 1.x first (sets the error bar for all subsequent work)
- Batches 2–6 are independent within each batch; batches must be sequential
- Task 7.x after batch 5 (accelerate files must be .tsx before fixing their `any`)
- Task 8.x deferred — unblocked only after upstream solana-lib types are published
- Task 9.x last
