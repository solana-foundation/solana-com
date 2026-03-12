## ADDED Requirements

### Requirement: App Router Page Migration

All pages under `apps/web/src/pages/[locale]/` SHALL be migrated to
`apps/web/src/app/[locale]/` following the established App Router pattern:
a server component `page.tsx` handling data fetching and translations, and a
co-located client component for rendering.

#### Scenario: Standard page migration

- **WHEN** a Pages Router page exists at `pages/[locale]/<route>.{js,jsx,tsx}`
- **THEN** a new directory `app/[locale]/<route>/` SHALL be created
- **AND** a server component `page.tsx` SHALL handle translations via `getTranslations()` and data fetching
- **AND** a client component `<route>.tsx` SHALL receive translations as props
- **AND** the `generateMetadata` function SHALL provide SEO metadata
- **AND** the original file SHALL be renamed with `_m_` prefix as backup

#### Scenario: Nested route migration

- **WHEN** a Pages Router page exists in a subdirectory (e.g., `pages/[locale]/developers/dao.tsx`)
- **THEN** it SHALL be migrated to `app/[locale]/developers/dao/page.tsx`
- **AND** the nested directory structure SHALL be preserved

#### Scenario: Index route migration

- **WHEN** a Pages Router page exists as `index.{js,jsx,tsx}` in a subdirectory
- **THEN** it SHALL be migrated to `app/[locale]/<parent>/page.tsx`
- **AND** the `page.tsx` SHALL serve as the directory index

### Requirement: Migration Skill Usage

Each page migration SHALL use the available `migrate-page` skill to automate
the conversion from Pages Router to App Router conventions.

#### Scenario: Skill-assisted migration

- **WHEN** migrating a page from Pages Router to App Router
- **THEN** the `migrate-page` skill SHALL be invoked to handle the conversion
- **AND** the `create-page` skill MAY be used for new page scaffolding when needed

### Requirement: Manual Verification Checkpoint

Each migrated page SHALL be manually verified before proceeding to the next
migration.

#### Scenario: Post-migration verification

- **WHEN** a page has been migrated to the App Router
- **THEN** the page SHALL be visually verified in the browser at its expected URL
- **AND** the page SHALL render without console errors
- **AND** i18n translations SHALL load correctly
- **AND** the task checklist SHALL be marked only after verification passes

### Requirement: Build Integrity

The application SHALL remain buildable throughout the migration process.

#### Scenario: Incremental build check

- **WHEN** a batch of pages has been migrated (at the end of each phase)
- **THEN** `pnpm build` SHALL complete without errors
- **AND** `pnpm lint` SHALL pass without new violations

### Requirement: URL Preservation

All existing URLs SHALL continue to work after migration with no route changes.

#### Scenario: Route parity

- **WHEN** a page existed at `/<locale>/<route>` under Pages Router
- **THEN** the same URL SHALL serve the migrated App Router page
- **AND** no redirects SHALL be needed
