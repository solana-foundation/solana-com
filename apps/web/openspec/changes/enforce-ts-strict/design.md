# Design: Enforce TypeScript Strict Mode

## Context

`apps/web/tsconfig.json` has `strict: false`, `strictNullChecks: false` and `allowJs: true`. 121 JS/JSX
files remain. The compiler accepts implicit `any`, unsafe `this`, and uninitialized
class properties.

## Goals / Non-Goals

- Goals: `strict: true`, zero JS/JSX files, zero explicit `any` in app code
- Non-Goals: migrating `apps/docs`, `apps/media`, or workspace packages; changing runtime behaviour

## Decisions

- **Enable `strict: true` first** — surfaces errors in existing TS files before JS conversion begins; prevents hidden regressions
- **Convert in dependency order** (utils → data → components) — each layer compiles before dependants are touched
- **Local type stubs over upstream fix** — `@solana-foundation/solana-lib` types are not owned by this repo; create `src/types/solana-lib.ts` stubs locally with a `// TODO: remove once solana-lib ships proper types` comment; once upstream types land, delete the stubs and update imports
- **`CustomArrowProps` from `react-slick`** — already declared in `@types/react-slick`; replace `props: any` with the correct import
- **`catch (error: unknown)`** — use `unknown` + `instanceof Error` narrowing; stricter than `any` and idiomatic TS 4+
- Use `as const` for data files (immutable literal types, no extra interface boilerplate)

## Risks / Trade-offs

- Both `strict` and `strictNullChecks` are currently `false` → enabling them in Phase 1 will surface violations across all existing TS files that must be fixed before conversion batches begin
- Large batch of file renames may surface import-path issues in tests → run `pnpm tsc --noEmit` after every batch
- `solana-lib` attribute shapes may not be fully documented → stub types can start broad (`Record<string, unknown>`) and be narrowed incrementally

## Migration Plan

1. Commit per phase (8 commits or fewer if batches are small)
2. Each commit must pass `pnpm tsc --noEmit` and `pnpm lint` before merge
3. Final commit removes `allowJs` and validates with `pnpm build`

## Open Questions

None.
