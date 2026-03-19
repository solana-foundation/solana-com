# `@workspace/ecosystem-data` plan

## Goal

Create a shared workspace package that stores reusable company records and their logo assets once, then lets apps such as `apps/accelerate` build event-specific sponsor lists from that canonical source.

This package should replace app-local duplicated company data in `apps/accelerate` while preserving the current rendering shape used by the sponsor UI through app-level composition.

The package should be designed so that company data and logo assets are atomic and composable:

- atomic: each company owns its own record and assets in one place
- composable: apps reference company atoms and add their own context-specific fields

## Why the current structure is limiting

Today `apps/accelerate` stores sponsor data per event in:

- `apps/accelerate/src/data/miami/sponsors.json`
- `apps/accelerate/src/data/hong-kong/sponsors.json`

That creates three problems:

1. Company metadata is duplicated across events.
2. Logo assets are mostly flat files under `public/images/sponsors/`, which does not scale to light/dark or multiple file formats.
3. Event sponsorship information and reusable company identity data are mixed into the same record even though sponsorship level is not a stable company property.

## Package boundary

Build a new package:

- `packages/ecosystem-data`

Responsibilities:

- Own the canonical company registry.
- Own company logo metadata.
- Export typed helpers for finding companies and selecting logos.
- Keep app consumption simple enough that `apps/accelerate` can compose event-specific sponsor data with minimal churn.

Design principle:

- the smallest reusable unit is a company package atom
- apps compose atoms into sponsors, speakers, partners, directory entries, or any future ecosystem listing
- the package must not own app-specific augmentation such as sponsorship level, event URLs, or sort order

Do not put app-specific presentation code in this package.

## Recommended file layout

```text
packages/ecosystem-data/
  package.json
  README.md
  tsconfig.json
  src/
    index.ts
    types.ts
    selectors.ts
    companies/
      index.ts
      registry.ts
      records/
        jito.ts
        solflare.ts
        ...
    logos/
      manifest.ts
  assets/
    companies/
      jito/
        logo-light.svg
        logo-dark.svg
        logo-light.png
      solflare/
        logo-dark.svg
        mark-light.svg
```

## Canonical data model

Keep only reusable company-owned data in this package.

This separation is what makes the package atomic and composable.

### `CompanyRecord`

One record per company in the ecosystem.

Suggested shape:

```ts
export type CompanyLogoVariant = {
  id: string;
  path: string;
  format: "svg" | "png" | "jpg" | "jpeg" | "webp";
  theme?: "light" | "dark";
  kind?: "logo" | "mark" | "wordmark";
  width?: number;
  height?: number;
  background?: "transparent" | "light" | "dark";
};

export type CompanyProfile = {
  website?: string;
  x?: string;
  linkedin?: string;
  github?: string;
  discord?: string;
  telegram?: string;
};

export type CompanyRecord = {
  id: string;
  slug: string;
  name: string;
  legalName?: string;
  profile?: Profile | null;
  tagline?: string;
  shortDescription?: string;
  sectors?: string[];
  profileType?: string;
  urls?: CompanyProfile;
  logos: CompanyLogoVariant[];
  defaultLogoId?: string;
};
```

Notes:

- `id` should be the stable internal key. Use it everywhere instead of event-local names.
- `slug` can remain URL-friendly and human-readable, but should not be the only identifier.
- `logos` replaces `logo` and `availableLogos` as the source of truth.
- a single `CompanyRecord` should be independently reusable anywhere in the monorepo without requiring an event dataset
- fields should only exist here if they are inherent to the company itself or its canonical public identity

### What does not belong in this package

Do not store fields here when they can vary by app, event, campaign, or presentation context.

Examples that should stay out of `@workspace/ecosystem-data`:

- `sponsorshipLevel`
- event-specific `url`
- sponsor ordering
- featured logo choice for a particular app surface
- hand-authored card copy written only for one app
- campaign-specific tags or categories

### Composition pattern

Apps should reference company atoms and layer their own augmentation on top:

```ts
const miamiSponsors = [
  { companyId: "jito", sponsorshipLevel: "Signature" },
  { companyId: "solflare", sponsorshipLevel: "Premium", featuredLogoId: "logo-dark" },
];
```

Then compose in the app:

```ts
const sponsors = miamiSponsors.map((entry) => {
  const company = getCompany(entry.companyId);
  return toSponsor(company, entry);
});
```

That means:

- company identity remains canonical
- app/event augmentation stays local to the app
- sponsorship level can vary freely without polluting shared data

## Logo storage format

Store logo files in a company-named folder, exactly as requested:

```text
assets/companies/<company-slug>/
```

Example:

```text
assets/companies/solflare/
  logo-light.svg
  logo-dark.svg
  logo-light.png
  mark-light.svg
```

Rules:

- One folder per company.
- File names should encode variant meaning instead of relying on implicit ordering.
- Prefer SVG when available.
- PNG/WebP remain valid fallbacks.
- Keep a manifest entry in the company record so apps do not need to inspect the filesystem.
- assets should be co-located with the company atom they belong to

Atomicity rule:

- no shared "misc sponsor logos" bucket
- each asset path must belong to exactly one company record
- each company record should remain valid if copied or imported on its own

Recommended naming:

- `logo-light.svg`
- `logo-dark.svg`
- `wordmark-light.svg`
- `mark-dark.png`

## Export surface

Expose both canonical company data and app-friendly derived data.

```ts
export { companiesById, companiesBySlug, getCompany } from "./companies";
export { getCompanyLogo, getCompanyLogos } from "./selectors";
export type { CompanyRecord, CompanyLogoVariant } from "./types";
```

Key helper:

```ts
function toSponsor(company: CompanyRecord, augmentation: AppSponsorAugmentation): Sponsor
```

This adapter can live in the app or in a thin app-specific helper layer and should output the exact shape currently used by `apps/accelerate`:

- `slug`
- `name`
- `url`
- `sponsorshipLevel`
- `logo`
- `availableLogos`
- `profile`

That adapter is the migration hinge. It lets `apps/accelerate` keep its existing `Sponsors` component while the company source moves underneath it.

Recommended additional selectors:

```ts
getCompany(companyId: string): CompanyRecord | undefined
getCompanyLogos(companyId: string): CompanyLogoVariant[]
getCompanyLogo(companyId: string, options?: LogoSelectorOptions): CompanyLogoVariant | undefined
```

These selectors are the composable API surface. Consumers should not need to understand internal storage layout.

## Migration plan for `apps/accelerate`

### Phase 1: Introduce package

1. Add `packages/ecosystem-data` as a normal workspace package.
2. Define shared atomic types.
3. Add package instructions for asset usage and contribution rules.
4. Move a small pilot set of companies into canonical records.

### Phase 2: Add adapter compatibility

1. In `apps/accelerate`, keep Miami and Hong Kong sponsor augmentation in JSON.
2. Add an app-level adapter that composes those JSON records with `@workspace/ecosystem-data` company records.
3. Replace direct sponsor-object usage with the app-level composed result.

Target replacements:

- `src/app/[locale]/miami/page.tsx`
- `src/app/[locale]/hong-kong/page.tsx`

This should avoid a component rewrite.

### Phase 3: Move logos into company folders

1. Migrate canonical sponsor logos into package-owned company asset folders.
2. Add imported logo entries per company.
3. Compose app sponsor objects from imported package assets instead of mirrored `public/` files.

### Phase 4: Retire duplicated company data from app JSON

After both event pages compose from the package:

- keep `src/data/miami/sponsors.json` as app-level augmentation
- keep `src/data/hong-kong/sponsors.json` as app-level augmentation
- remove duplicated company metadata from those JSON files
- update or replace `scripts/sync-sponsors.ts`

## How `apps/accelerate` should consume it

Preferred end state:

```ts
import { getCompany, getCompanyLogo } from "@workspace/ecosystem-data";
```

Then inside `apps/accelerate`:

```ts
import sponsorsJson from "@/data/miami/sponsors.json";
import { composeSponsors } from "@/lib/sponsor-data";
```

The app should keep importing event-local JSON, but only as augmentation keyed by `companyId`.

Consumer rule:

- import selectors and derived datasets from the package
- do not reach into `assets/` directly unless the package explicitly documents that contract

## Sync and authoring strategy

The existing sponsor sync script in `apps/accelerate/scripts/sync-sponsors.ts` already contains logic for per-sponsor folders. That logic should move into the package or into a shared script that writes into `packages/ecosystem-data`.

Recommended direction:

- Keep raw ingestion separate from published package data.
- Generate typed TS modules or a canonical JSON artifact inside `packages/ecosystem-data/src/generated/`.
- Validate that every company has at least one logo variant or an explicit exception.
- keep app-specific augmentation generation outside this package

## Validation rules

Add validation during build or sync:

1. `companyId` must be unique.
2. `slug` must be unique.
3. `defaultLogoId` must exist in `logos`.
4. Logo `path` must point to a real asset.

## Recommendation on storage format

Use TypeScript modules, not hand-authored large JSON files, for the canonical package source.

Reasoning:

- easier typed validation
- easier helper composition
- clearer review diffs
- simpler derived exports
- easier atomic per-company authoring

JSON can still be generated for external consumers if needed.

## Proposed first milestone

Deliver the smallest replacement that unblocks reuse:

1. Create `packages/ecosystem-data`.
2. Add shared atomic types and selectors.
3. Add a package `README.md` with ecosystem asset instructions.
4. Add company records for every sponsor currently used by `apps/accelerate`.
5. In `apps/accelerate`, reduce Miami and Hong Kong JSON files to augmentation-only records.
6. Replace both `apps/accelerate` page imports with app-level composed data.
7. Preserve the existing `Sponsors` UI contract via an adapter.

## Open decisions

1. Whether `profile` should stay embedded as optional manual override data, or move into a separate enrichment layer.
2. Whether the sync source remains Google Sheets or moves to a more explicit registry workflow.

## Recommended answer to those decisions

For the first version:

- keep `profile` override support in the package
- keep all event-specific sponsor declarations outside the package
- keep the current `Sponsor` UI type as an app-derived compatibility layer
- import package-owned company assets directly instead of copying them into app `public/`

That gives you a clean long-term structure without forcing a full sponsor UI rewrite at the same time.
