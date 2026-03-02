## ADDED Requirements

### Requirement: Strict TypeScript Compiler Configuration

`apps/web/tsconfig.json` SHALL have `"strict": true`, `"strictNullChecks": true`,
and `"allowJs": false` (or `allowJs` removed) once all JS/JSX files are converted.

#### Scenario: strict flag enabled

- **WHEN** a developer introduces an implicit `any` or unsafe `this` in a `.ts` file
- **THEN** `tsc --noEmit` reports a type error and the pre-commit hook blocks the commit

#### Scenario: allowJs removed

- **WHEN** a `.js` or `.jsx` file is added to `src/`
- **THEN** `tsc --noEmit` reports an error (file not included in compilation)

### Requirement: Null Safety Violations Fixed

All null / undefined dereference patterns surfaced by enabling `strictNullChecks`
SHALL be resolved. Both `strict` and `strictNullChecks` are currently `false` —
enabling them will expose violations that must be fixed.

#### Scenario: null dereference caught

- **WHEN** a value that may be `null` or `undefined` is accessed without a guard
- **THEN** `tsc --noEmit` reports a TS2531/TS2532 error

#### Scenario: optional chaining used as fix

- **WHEN** a null check violation is found in a converted file
- **THEN** it is fixed with optional chaining (`?.`), nullish coalescing (`??`), or an explicit guard — not with a non-null assertion (`!`) unless the value is provably non-null
