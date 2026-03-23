# `@workspace/ecosystem-data`

Shared ecosystem company data and logo assets for the monorepo.

## Purpose

This package stores company information as atomic records and lets apps compose those records into event sponsors or other ecosystem listings.

The package owns:

- canonical company records
- canonical imported company assets
- selectors for reading company data and logos
- audit tooling for registry and asset completeness

The package does not own app-specific augmentation.

## Package model

There are two layers:

1. atomic company data
2. composable app-level references

Atomic company data lives in a single company record and includes:

- company identity
- optional package profile enrichment
- logo variants
- reusable URLs and descriptions

Each company record is stored as its own module:

```text
packages/ecosystem-data/src/companies/records/<company-slug>.ts
```

The registry composes those atomic modules into the exported lookups and selectors.

Composable event or campaign data should live in the consuming app and reference those company records by `companyId`.
For `apps/accelerate`, the JSON files remain the source of truth for sponsor augmentation.

## Asset layout

Each company gets its own asset folder:

```text
packages/ecosystem-data/assets/companies/<company-slug>/
```

Example:

```text
packages/ecosystem-data/assets/companies/jito/
  logo-light.svg
  logo-dark.svg
  logo-light.png
```

Do not add new files to a shared flat logo directory.

## Logo naming rules

Use explicit variant names:

- `logo-light.svg`
- `logo-dark.svg`
- `wordmark-light.svg`
- `mark-dark.png`

Guidelines:

- prefer SVG first
- add PNG/WebP only when needed
- keep filenames descriptive, not positional
- use lowercase kebab-case

## Authoring a company record

Each company should have:

1. one stable `id`
2. one canonical `slug`
3. one or more logo variants
4. optional event participation via separate event files

The company record should remain useful outside any single event.

## Populating registry companies with enrichment data

Company records can include an optional `profile` object with package-owned ecosystem metadata such as:

- `tagline`
- `summary` and `description`
- `sector`, optional `status`, and `type`
- `links.website`
- `socials.x`, `socials.linkedin`, `socials.discord`, `socials.telegram`, `socials.github`

Use the enrichment workflow in:

```text
packages/ecosystem-data/skills/enrich-ecosystem-data.md
```

That workflow is the source of truth for how to research and populate missing `profile` data in:

```text
packages/ecosystem-data/src/companies/registry.ts
```

Expected process:

1. read the registry and identify companies where `profile` is `null`
2. run the audit script to see which companies are missing enrichment or have asset mismatches:

```bash
pnpm --filter @workspace/ecosystem-data audit:data
```

3. research each company using publicly available sources, starting with the official website
4. populate only the `profile` field with neutral, factual copy and verified URLs using the flat package schema
5. omit socials that cannot be confidently verified
6. validate the package with:

```bash
pnpm --filter @workspace/ecosystem-data exec tsc --noEmit
```

Rules:

- only modify `profile`
- do not change `id`, `slug`, `name`, `logos`, `defaultLogoId`
- match the tone of existing enriched records
- leave `profile: null` when reliable information is not available

Recommended profile shape:

```ts
profile: {
  tagline: "Infrastructure that moves billions at scale.",
  summary: "Web3 development platform providing blockchain infrastructure and developer tooling.",
  description: "Longer durable description with Solana-specific context.",
  sector: "Infrastructure",
  type: "Platform",
  links: {
    website: "https://www.alchemy.com/",
  },
  socials: {
    x: "https://x.com/Alchemy",
    linkedin: "https://www.linkedin.com/company/alchemyinc/",
    github: "https://github.com/alchemyplatform",
  },
}
```

## What not to put here

Do not put context-specific fields into this package.

Examples:

- sponsorship level
- event-specific sponsor URL
- sort order for a specific page
- curated logo choice for one page or one theme treatment
- app-only marketing copy

## Using ecosystem assets

Consumers should use exported selectors instead of constructing asset paths manually.
Assets should be imported from this package, not copied into app `public/`.

Preferred usage:

```ts
import {
  getCompanyLogo,
  getCompany,
  resolveImportedAssetSrc,
} from "@workspace/ecosystem-data";
```

Patterns:

- use `getCompany(id)` when rendering a single ecosystem company
- use `getCompanyLogo(id, options)` when you need a theme-aware logo
- use `resolveImportedAssetSrc()` to convert an imported asset module into a URL string when needed
- use `getCompanyLogoSrc()` when an app needs a plain string URL for a translated or serialized payload
- compose app-specific sponsor objects in the consuming app from app JSON plus package data

Do not:

- hardcode paths into `assets/companies/...`
- duplicate company names or URLs in app-local JSON
- copy package logo assets into app-local asset folders
- move app-level augmentation into this package

## Contribution rules

When adding a new company:

1. create the company asset folder
2. add the logo files
3. add the company record
4. add any event references separately in the consuming app
5. run `pnpm --filter @workspace/ecosystem-data audit:data`
6. verify that selectors resolve a primary logo

When updating an existing company:

1. update the atomic company record first
2. only change event files if sponsorship participation changed

## Intended consumer pattern

Apps should compose data like this:

```ts
const sponsors = sponsorsJson.sponsors.map((entry) => {
  const company = getCompany(entry.companyId);
  const logo = getCompanyLogo(entry.companyId);
  return composeSponsor(company, entry, resolveImportedAssetSrc(logo.source));
});
```

That keeps:

- company ownership centralized
- app augmentation local
- logo handling consistent

## i18n integration

Locale files such as `packages/i18n/messages/web/en/common.json` should keep translated copy and reference canonical companies by ID.

Preferred locale shape:

```json
{
  "alt": "Phantom",
  "companyId": "phantom"
}
```

Then resolve the image source in app code:

```ts
const src = getCompanyLogoSrc("phantom");
```

This keeps:

- translated text in locale files
- canonical assets in `@workspace/ecosystem-data`
- image path generation in code instead of hardcoded locale strings

## Accelerate rule

For `apps/accelerate`:

- keep sponsor augmentation in JSON
- keep canonical company data and logos in `@workspace/ecosystem-data`
- import logos from the package during composition
- do not mirror canonical assets into `apps/accelerate/public`
