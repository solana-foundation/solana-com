# Builder Removal

## ADDED Requirements

### Requirement: Remove Builder SDK Dependencies

The system SHALL remove all Builder.io npm packages from the web app.

#### Scenario: Package removal

- **WHEN** the migration is complete
- **THEN** `@builder.io/react` SHALL be removed from `package.json` dependencies
- **AND** `@builder.io/sdk` SHALL be removed from `package.json` devDependencies
- **AND** `pnpm install` SHALL complete without Builder packages

### Requirement: Remove Builder Library Code

The system SHALL remove all Builder-specific library code from the codebase.

#### Scenario: Delete Builder directory

- **WHEN** the migration is complete
- **THEN** the entire `apps/web/src/lib/builder/` directory SHALL be deleted
- **AND** this includes `builderConstants.js`, `api.js`, `index.js`, `getUrls.js`
- **AND** this includes subdirectories `page/`, `breakpoint/`, `accelerate/`

#### Scenario: Delete Builder utility files

- **WHEN** the migration is complete
- **THEN** `apps/web/src/utils/builderConfigs.js` SHALL be deleted
- **AND** `apps/web/src/utils/customComponentGenerator.js` SHALL be deleted

### Requirement: Update Next.js Configuration

The system SHALL remove Builder-specific configuration from Next.js config.

#### Scenario: Remove CSP frame-ancestors

- **WHEN** the migration is complete
- **THEN** `next.config.ts` SHALL NOT include `*.builder.io` in
  `frame-ancestors` CSP directive
- **AND** `localhost:1234` (Builder preview) MAY be removed if no longer needed

#### Scenario: Remove Builder image domain

- **WHEN** the migration is complete
- **THEN** `next.config.ts` SHALL NOT include `cdn.builder.io` in the images
  `remotePatterns` configuration

### Requirement: Clean Up Imports

The system SHALL remove all imports of Builder modules throughout the codebase.

#### Scenario: Remove Builder component imports

- **WHEN** the migration is complete
- **THEN** no file SHALL import from `@builder.io/react`
- **AND** no file SHALL import from `@builder.io/sdk`
- **AND** no file SHALL import from `@/lib/builder/*`

#### Scenario: Remove Builder initialization

- **WHEN** the migration is complete
- **THEN** no file SHALL call `builder.init()`
- **AND** no file SHALL set `Builder.isStatic`
- **AND** no file SHALL call `Builder.registerComponent()`

### Requirement: Preserve Backup Data

The system SHALL retain the exported Builder content as a backup reference.

#### Scenario: Keep builder directory

- **WHEN** the migration is complete
- **THEN** the `apps/web/builder/` directory SHALL remain with exported JSON
  files
- **AND** the asset manifest SHALL remain for reference
- **AND** these files SHALL be committed to version control

### Requirement: Update Environment Variables Documentation

The system SHALL update documentation to reflect removed environment variables.

#### Scenario: Builder API key no longer required

- **WHEN** the migration is complete
- **THEN** `NEXT_PUBLIC_BUILDER_API_KEY` SHALL no longer be required for builds
- **AND** `NEXT_PUBLIC_BUILDER_NEWS_SETTINGS_ID` SHALL no longer be required
- **AND** documentation SHALL note these are deprecated

## REMOVED Requirements

### Requirement: Builder Preview Mode

**Reason**: Builder.io visual editor and preview functionality is no longer
needed after migration to MDX.

**Migration**: Content editing moves to direct MDX file editing in the
repository.

#### Scenario: Preview endpoint removed

- **WHEN** the migration is complete
- **THEN** `apps/web/src/pages/[locale]/edit-symbol.js` MAY be removed
- **AND** Builder preview query parameters SHALL no longer function
