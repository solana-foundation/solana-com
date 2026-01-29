# Tasks: Migrate Builder.io to MDX

## 1. Export Builder Content (Phase 1)

- [x] 1.1 Create `apps/web/scripts/export-builder.ts` export script
- [x] 1.2 Configure Builder API client with existing API key
- [x] 1.3 Implement route list for all 50+ Builder pages
- [x] 1.4 Implement locale iteration (19 locales: en, ar, de, el, es, fi, fr, id,
      it, ja, ko, nl, pl, pt, ru, tr, uk, vi, zh)
- [x] 1.5 Add retry logic with exponential backoff (match existing
      `lib/builder/api.js` pattern)
- [x] 1.6 Save JSON files to `apps/web/builder/section-page/{locale}/{slug}.json`
- [ ] 1.7 Skip file creation when locale content is empty or has the same id as the default (en) locale
- [x] 1.8 Log export progress and errors
- [x] 1.9 Run export script and verify all routes exported
- [x] 1.10 Commit `builder/` directory to git

## 2. Download Builder Assets (Phase 1)

- [x] 2.1 Parse exported JSON for `cdn.builder.io` URLs
- [x] 2.2 Create asset download function with proper file extension detection
- [x] 2.3 Download assets to `apps/web/public/src/img/landings/`
- [x] 2.4 Generate `apps/web/builder/assets/manifest.json` mapping URLs to local
      paths
- [x] 2.5 Handle download failures gracefully (log and continue)
- [x] 2.6 Verify downloaded assets are readable (valid image files)
- [x] 2.7 Commit downloaded assets to git

## 3. Create MDX Infrastructure (Phase 2)

- [x] 3.1 Create `apps/web/content/landings/` directory structure
- [x] 3.2 Create `apps/web/content/landings/en/` directory
- [x] 3.3 Create `apps/web/content/landings/en/solutions/` directory
- [x] 3.4 Create MDX provider configuration with component mappings
- [x] 3.5 Configure MDX compilation (gray-matter for frontmatter, existing MDX
      dependencies)

## 4. Convert Priority Pages to MDX (Phase 2)

- [x] 4.1 Convert `/solutions` (index) to
      `content/landings/en/solutions/index.mdx`
- [x] 4.2 Convert `/solutions/token-extensions` to MDX
- [x] 4.3 Convert `/solutions/actions` to MDX
- [x] 4.4 Convert `/solutions/solana-permissioned-environments` to MDX
- [x] 4.5 Convert `/solutions/games-tooling` to MDX
- [x] 4.6 Convert `/solutions/payments-tooling` to MDX
- [x] 4.7 Convert `/solutions/commerce-tooling` to MDX
- [x] 4.8 Convert `/solutions/financial-infrastructure` to MDX
- [x] 4.9 Convert `/solutions/digital-assets` to MDX
- [x] 4.10 Convert `/solutions/real-world-assets` to MDX
- [x] 4.11 Convert `/solutions/gaming-and-entertainment` to MDX
- [x] 4.12 Convert `/solutions/artists-creators` to MDX
- [x] 4.13 Convert `/rpc` to `content/landings/en/rpc.mdx`
- [x] 4.14 Convert `/tos` to `content/landings/en/tos.mdx`
- [x] 4.15 Convert `/privacy-policy` to `content/landings/en/privacy-policy.mdx`
- [ ] 4.16 Convert available localized versions for each page (check Builder JSON
      for existing translations)
- [x] 4.17 Replace the asset URLs according to the file `apps/web/builder/assets/manifest.json`

## 5. Implement Route Handler (Phase 3)

- [x] 5.1 Create new `apps/web/src/pages/[locale]/[...slug].js` implementation
- [x] 5.2 Implement MDX file loading with `gray-matter` for frontmatter parsing
- [x] 5.3 Implement locale fallback logic (try locale, fall back to `en`)
- [x] 5.4 Implement `getStaticPaths` to enumerate all MDX files
- [x] 5.5 Implement `getStaticProps` to load MDX content and messages
- [x] 5.6 Render SEO metadata from frontmatter via `HTMLHead` component
- [x] 5.7 Wrap content in `Layout` component with `ModalLauncher`
- [x] 5.8 Handle 404 for missing pages

## 6. Visual Verification (Phase 3)

- [x] 6.1 Verify `/solutions` page renders correctly
- [x] 6.2 Verify `/solutions/token-extensions` page renders correctly
- [x] 6.3 Verify `/solutions/actions` page renders correctly
- [x] 6.4 Verify `/solutions/solana-permissioned-environments` page renders
      correctly
- [x] 6.5 Verify `/solutions/games-tooling` page renders correctly
- [x] 6.6 Verify `/solutions/payments-tooling` page renders correctly
- [x] 6.7 Verify `/solutions/commerce-tooling` page renders correctly
- [x] 6.8 Verify `/solutions/financial-infrastructure` page renders correctly
- [x] 6.9 Verify `/solutions/digital-assets` page renders correctly
- [x] 6.10 Verify `/solutions/real-world-assets` page renders correctly
- [x] 6.11 Verify `/solutions/gaming-and-entertainment` page renders correctly
- [x] 6.12 Verify `/solutions/artists-creators` page renders correctly
- [x] 6.13 Verify `/rpc` page renders correctly
- [x] 6.14 Verify `/tos` page renders correctly
- [x] 6.15 Verify `/privacy-policy` page renders correctly
- [x] 6.16 Verify locale fallback works (non-en locale without translation falls
      back to en)

## 7. Remove Builder Dependencies (Phase 4)

- [x] 7.1 Remove `@builder.io/react` from `package.json` dependencies
- [x] 7.2 Remove `@builder.io/sdk` from `package.json` devDependencies
- [x] 7.3 Delete `apps/web/src/lib/builder/` directory
- [x] 7.4 Delete `apps/web/src/utils/builderConfigs.js`
- [x] 7.5 Delete `apps/web/src/utils/customComponentGenerator.js`
- [x] 7.6 Remove `cdn.builder.io` from `next.config.ts` image remotePatterns
- [x] 7.7 Remove `*.builder.io` from CSP frame-ancestors in `next.config.ts`
- [x] 7.8 Remove or update `apps/web/src/pages/[locale]/edit-symbol.js`
      - Deleted `edit-symbol.js` (Builder symbol preview page)
      - Moved `HTMLHead` component from `components/builder/` to `components/`
      - Updated all imports referencing the old HTMLHead location
- [x] 7.9 Run `pnpm install` to update lockfile
- [x] 7.10 Update any remaining imports that reference Builder modules

## 8. Final Validation (Phase 4)

- [x] 8.1 Run `pnpm lint` and fix any errors
- [x] 8.2 Run `pnpm build` and verify successful build
- [~] 8.3 Run `pnpm test` and verify tests pass
      - Tests fail due to pre-existing snapshot issues unrelated to this migration:
        - Copyright year snapshots outdated (2025 → 2026)
        - Newsletter UI changed from link to button
        - Dynamic Radix IDs in snapshots
- [ ] 8.4 Verify no runtime errors on page navigation
- [ ] 8.5 Verify no console errors referencing Builder

## Dependencies

- Tasks 1.x and 2.x can run in parallel (export and asset download)
- Tasks 3.x must complete before 4.x (infrastructure before content)
- Tasks 4.x must complete before 5.x (content before route handler)
- Tasks 5.x and 6.x overlap (verify as you build)
- Tasks 7.x must wait until 6.x passes (remove only after verified working)
- Tasks 8.x are final validation

## Notes

- Phase 1 is non-breaking and can be deployed independently as backup
- Phases 2-3 can be developed on a feature branch
- Phase 4 is the breaking change that removes Builder
- Each converted page should be visually compared to production before
  proceeding
