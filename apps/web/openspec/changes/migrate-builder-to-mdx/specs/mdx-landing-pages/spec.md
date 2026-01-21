# MDX Landing Pages

## ADDED Requirements

### Requirement: MDX Content Directory Structure

The system SHALL store landing page content as MDX files in a locale-organized
directory structure.

#### Scenario: Directory layout

- **WHEN** content is stored for landing pages
- **THEN** MDX files SHALL be located at
  `apps/web/content/landings/{locale}/{path}.mdx`
- **AND** nested routes SHALL use nested directories (e.g.,
  `content/landings/en/solutions/token-extensions.mdx`)
- **AND** index pages SHALL use `index.mdx` filename

#### Scenario: Locale directory presence

- **WHEN** a locale has translated content for a page
- **THEN** a locale-specific MDX file SHALL exist
- **AND** the `en/` directory SHALL contain MDX files for all pages

### Requirement: MDX Frontmatter Schema

The system SHALL use YAML frontmatter for page metadata and SEO configuration.

#### Scenario: Required frontmatter fields

- **WHEN** an MDX file is created
- **THEN** it SHALL include a `title` field
- **AND** it MAY include `seoTitle`, `seoDescription`, `seoImage` for SEO
  overrides
- **AND** it MAY include `noIndex`, `noFollow` boolean flags

#### Scenario: Frontmatter example

- **WHEN** creating a solutions page MDX file
- **THEN** the frontmatter SHALL follow this format:

```yaml
---
title: Token Extensions
seoTitle: Token Extensions - Programmable Tokens on Solana
seoDescription: Build advanced token features with Token Extensions
seoImage: /src/img/landings/token-extensions-og.png
noIndex: false
---
```

### Requirement: MDX Component Usage

The system SHALL support importing and using React components within MDX files.

#### Scenario: Component imports

- **WHEN** an MDX file needs to render a landing page component
- **THEN** the component SHALL be available through the MDX provider
- **AND** components from `@solana-foundation/solana-lib` SHALL be usable
  directly

#### Scenario: Supported components

- **WHEN** converting Builder content to MDX
- **THEN** the following components SHALL be available: Hero, Switchback,
  SwitchbackChain, CardDeck, Stats, Accordion, ConversionPanel, Trustbar,
  FeatureHighlight, Quote, QuoteSlider, Heading, Slider, Carousel,
  CommunityGallery, Switcher, ContentEditor, Section, NewsletterForm

### Requirement: Priority Routes Conversion

The system SHALL convert 16 priority routes from Builder JSON to MDX format.

#### Scenario: Priority routes list

- **WHEN** the migration is complete
- **THEN** MDX files SHALL exist for:
  - `/solutions` (index)
  - `/solutions/token-extensions`
  - `/solutions/actions`
  - `/solutions/solana-permissioned-environments`
  - `/solutions/games-tooling`
  - `/solutions/payments-tooling`
  - `/solutions/commerce-tooling`
  - `/solutions/financial-infrastructure`
  - `/solutions/digital-assets`
  - `/solutions/real-world-assets`
  - `/solutions/gaming-and-entertainment`
  - `/solutions/artists-creators`
  - `/rpc`
  - `/tos`
  - `/privacy-policy`

#### Scenario: Visual parity

- **WHEN** an MDX page is rendered
- **THEN** it SHALL display identically to the original Builder page
- **AND** no design changes SHALL be introduced

### Requirement: Dynamic Route Handler

The system SHALL provide a catch-all route that renders MDX landing pages.

#### Scenario: Route resolution

- **WHEN** a request arrives at `/[locale]/[...slug]`
- **THEN** the handler SHALL attempt to load
  `content/landings/{locale}/{slug}.mdx`
- **AND** if not found, it SHALL fall back to `content/landings/en/{slug}.mdx`
- **AND** if neither exists, it SHALL return a 404 page

#### Scenario: Locale parameter handling

- **WHEN** the locale is `en`
- **THEN** the handler SHALL load from `content/landings/en/`
- **AND** the builder locale SHALL be treated as "Default" for component
  compatibility

#### Scenario: Static path generation

- **WHEN** building the site
- **THEN** `getStaticPaths` SHALL enumerate all MDX files across all locales
- **AND** it SHALL use `fallback: "blocking"` for unlisted paths

### Requirement: SEO Metadata Rendering

The system SHALL render SEO metadata from MDX frontmatter.

#### Scenario: HTML head tags

- **WHEN** an MDX page is rendered
- **THEN** the page title SHALL use `seoTitle` or fall back to `title`
- **AND** meta description SHALL use `seoDescription`
- **AND** og:image SHALL use `seoImage` if provided
- **AND** robots meta SHALL respect `noIndex` and `noFollow` flags

### Requirement: Layout Integration

The system SHALL render MDX pages within the existing site layout.

#### Scenario: Layout wrapper

- **WHEN** an MDX page is rendered
- **THEN** it SHALL be wrapped in the `Layout` component
- **AND** the header, footer, and theme SHALL be consistent with other pages
- **AND** the `ModalLauncher` component SHALL be included
