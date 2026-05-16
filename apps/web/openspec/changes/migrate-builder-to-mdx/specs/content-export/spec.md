# Content Export

## ADDED Requirements

### Requirement: Builder Content Export Script

The system SHALL provide a script at `apps/web/scripts/export-builder.ts` that
exports all Builder.io content to local JSON files.

#### Scenario: Export all pages for all locales

- **WHEN** the export script is executed
- **THEN** it SHALL fetch content from Builder.io API for the `section-page`
  model
- **AND** it SHALL iterate through all 50+ configured routes
- **AND** it SHALL request content for each of the 19 supported locales (en, ar,
  de, el, es, fi, fr, id, it, ja, ko, nl, pl, pt, ru, tr, uk, vi, zh)
- **AND** it SHALL save each page as a JSON file at
  `apps/web/builder/section-page/{locale}/{slug}.json`

#### Scenario: Skip empty locale content

- **WHEN** a page has no translated content for a specific locale
- **THEN** the script SHALL NOT create a JSON file for that locale
- **AND** the script SHALL log that the locale was skipped

#### Scenario: English content required

- **WHEN** exporting a page
- **THEN** the English (`en`) locale content MUST exist
- **AND** if English content is missing, the script SHALL log an error and
  continue

### Requirement: Builder Asset Download

The system SHALL download all images and files referenced in Builder content to
local storage.

#### Scenario: Download CDN assets

- **WHEN** the export script encounters a `cdn.builder.io` URL in content
- **THEN** it SHALL download the asset to
  `apps/web/public/src/img/landings/{filename}`
- **AND** it SHALL preserve or detect the correct file extension
- **AND** it SHALL create an asset manifest at
  `apps/web/builder/assets/manifest.json` mapping CDN URLs to local paths

#### Scenario: Handle asset download failures

- **WHEN** an asset download fails
- **THEN** the script SHALL log the error with the URL
- **AND** the script SHALL continue processing remaining assets
- **AND** the manifest SHALL mark the asset as failed

### Requirement: Export Configuration

The system SHALL use existing Builder configuration for API access.

#### Scenario: Use environment API key

- **WHEN** the export script runs
- **THEN** it SHALL read the API key from `NEXT_PUBLIC_BUILDER_API_KEY`
  environment variable
- **OR** it SHALL fall back to the hardcoded key in
  `apps/web/src/lib/builder/builderConstants.js`

#### Scenario: Export latest published version only

- **WHEN** fetching content from Builder.io
- **THEN** the script SHALL request only the latest published version
- **AND** it SHALL NOT fetch draft or historical versions
