## ADDED Requirements

### Requirement: No JS/JSX Source Files

All source files under `apps/web/src/` SHALL use `.ts` or `.tsx` extensions.
No `.js` or `.jsx` files SHALL remain in `src/` after this change.

#### Scenario: utility file converted

- **WHEN** `src/utils/fetcher.js` is renamed to `src/utils/fetcher.ts`
- **THEN** all imports resolve, `tsc --noEmit` passes, and no runtime behaviour changes

#### Scenario: React component file converted

- **WHEN** a `.jsx` component is renamed to `.tsx`
- **THEN** props are typed, JSX compiles, and the component renders identically

### Requirement: Conversion Order by Dependency Depth

Files SHALL be converted in leaf-first order: utilities and data files before
the components that import them.

#### Scenario: utils converted before components

- **WHEN** `src/utils/*.ts` conversions are complete
- **THEN** components importing those utilities inherit correct types without additional casts
