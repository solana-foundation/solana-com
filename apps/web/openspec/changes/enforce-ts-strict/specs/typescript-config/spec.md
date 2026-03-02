## ADDED Requirements

### Requirement: Strict TypeScript Compiler Configuration

`apps/web/tsconfig.json` SHALL have `"strict": true` and `"allowJs": false`
(or `allowJs` removed) once all JS/JSX files are converted.

#### Scenario: strict flag enabled

- **WHEN** a developer introduces an implicit `any` or unsafe `this` in a `.ts` file
- **THEN** `tsc --noEmit` reports a type error and the pre-commit hook blocks the commit

#### Scenario: allowJs removed

- **WHEN** a `.js` or `.jsx` file is added to `src/`
- **THEN** `tsc --noEmit` reports an error (file not included in compilation)
