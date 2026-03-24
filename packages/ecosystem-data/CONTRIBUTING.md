# Contributing to `@workspace/ecosystem-data`

This guide walks you through adding a company to the ecosystem registry, from the bare minimum (just a logo) up to a fully enriched record generated from a URL.

## Index

- [Quick reference](#quick-reference)
- [Level 1: Just add a logo](#level-1-just-add-a-logo)
- [Level 2: Add multiple logo variants](#level-2-add-multiple-logo-variants)
- [Level 3: Add a profile](#level-3-add-a-profile)
- [Level 4: Generate a full record from a URL](#level-4-generate-a-full-record-from-a-url)
- [Updating an existing company](#updating-an-existing-company)
- [Common mistakes](#common-mistakes)
- [Validation commands](#validation-commands)

## Quick reference

```
packages/ecosystem-data/
├── assets/companies/<slug>/   # Logo files
├── src/companies/records/     # Company record modules
├── src/companies/registry.ts  # Central registry
└── src/types.ts               # Type definitions
```

---

## Level 1: Just add a logo

The absolute minimum to get a company into the registry.

### 1. Choose a slug

Pick a lowercase kebab-case slug for the company (e.g. `acme-labs`). This slug is used everywhere: folder names, file names, IDs.

### 2. Add the logo file

Create the asset folder and drop in a logo:

```
assets/companies/acme-labs/
  logo.svg
```

- Prefer SVG over PNG/WebP.
- Use lowercase kebab-case filenames.
- One file is enough to start.

### 3. Create the record file

Create `src/companies/records/acme-labs.ts`:

```ts
import type { CompanyRecord } from "../../types";
import acmeLabsLogo from "../../../assets/companies/acme-labs/logo.svg";

export const acmeLabs = {
  "id": "acme-labs",
  "slug": "acme-labs",
  "name": "Acme Labs",
  "profile": null,
  "defaultLogoId": "logo",
  "logos": [
    {
      "id": "logo",
      "fileName": "logo.svg",
      "format": "svg",
      "source": acmeLabsLogo
    }
  ]
} satisfies CompanyRecord;
```

Key rules:

- `id` and `slug` must match the folder name.
- The export name is the camelCase version of the slug.
- `profile: null` is fine — enrichment can come later.
- `satisfies CompanyRecord` ensures type safety.

### 4. Register the company

In `src/companies/registry.ts`, add the import and entry:

```ts
// Add import (keep alphabetical order)
import { acmeLabs } from "./records/acme-labs";

// Add to the companies array (keep alphabetical order)
export const companies = [
  acmeLabs,
  // ... existing entries
] as const satisfies readonly CompanyRecord[];
```

### 5. Validate

```bash
# Type check
pnpm --filter @workspace/ecosystem-data exec tsc --noEmit

# Audit for consistency
pnpm --filter @workspace/ecosystem-data audit:data
```

That's it. The company is now available via `getCompany("acme-labs")` and `getCompanyLogo("acme-labs")`.

---

## Level 2: Add multiple logo variants

If you have light/dark variants or separate mark and wordmark files, add them all to the asset folder:

```
assets/companies/acme-labs/
  logo-light.svg      # Full logo for dark backgrounds
  logo-dark.svg       # Full logo for light backgrounds
  logo-monotone.svg   # Single-color SVG for CSS recoloring
  mark.svg            # Icon/symbol only
  wordmark-light.svg  # Text only, for dark backgrounds
```

### Naming conventions

| Prefix | Meaning |
|---|---|
| `logo-` | Full logo (mark + text) |
| `mark-` | Icon/symbol only |
| `wordmark-` | Text only |

| Suffix | Meaning |
|---|---|
| `-light` | Designed for dark backgrounds |
| `-dark` | Designed for light backgrounds |
| `-color` | Full-color version (any background) |
| `-monotone` | Single-color asset intended to be tinted/overlaid in CSS at render time |

### Update the record

```ts
import type { CompanyRecord } from "../../types";
import acmeLabsLogoLight from "../../../assets/companies/acme-labs/logo-light.svg";
import acmeLabsLogoDark from "../../../assets/companies/acme-labs/logo-dark.svg";
import acmeLabsLogoMonotone from "../../../assets/companies/acme-labs/logo-monotone.svg";
import acmeLabsMark from "../../../assets/companies/acme-labs/mark.svg";

export const acmeLabs = {
  "id": "acme-labs",
  "slug": "acme-labs",
  "name": "Acme Labs",
  "profile": null,
  "defaultLogoId": "logo-light",
  "logos": [
    {
      "id": "logo-light",
      "fileName": "logo-light.svg",
      "format": "svg",
      "source": acmeLabsLogoLight,
      "theme": "dark"
    },
    {
      "id": "logo-dark",
      "fileName": "logo-dark.svg",
      "format": "svg",
      "source": acmeLabsLogoDark,
      "theme": "light"
    },
    {
      "id": "logo-monotone",
      "fileName": "logo-monotone.svg",
      "format": "svg",
      "source": acmeLabsLogoMonotone,
      "treatment": "monotone"
    },
    {
      "id": "mark",
      "fileName": "mark.svg",
      "format": "svg",
      "source": acmeLabsMark,
      "kind": "mark"
    }
  ]
} satisfies CompanyRecord;
```

Notes on logo metadata:

- **`theme`**: Which background this logo is _designed for_ — `"light"` means it looks good on a light background (i.e. it's a dark-colored logo), `"dark"` means it looks good on a dark background.
- **`kind`**: `"logo"` (default, full logo), `"mark"` (icon only), or `"wordmark"` (text only).
- **`treatment`**: `"brand"` (default) or `"monotone"` for a flat asset that the UI recolors in CSS.
- **`format`**: `"svg"`, `"png"`, `"jpg"`, `"jpeg"`, or `"webp"`.
- **`defaultLogoId`**: Should point to the most versatile variant.
- Import variable names use camelCase: `{companyName}{Kind}{Variant}` (e.g. `phantomMarkDark`).
- Prefer `*-monotone.svg` only for SVGs that are safe to tint at render time. Do not label a multi-color brand asset as monotone.

---

## Level 3: Add a profile

Enrich the record with company metadata. This is where the company goes from "a logo in the registry" to a fully described ecosystem entry.

### Profile fields

```ts
"profile": {
  "tagline": "Short phrase from official site",
  "summary": "1-2 sentence factual summary.",
  "description": "2-4 sentence description with Solana-specific context.",
  "sector": "Infrastructure",
  "type": "Company",
  "links": {
    "website": "https://acme-labs.com"
  },
  "socials": {
    "x": "https://x.com/acmelabs",
    "linkedin": "https://www.linkedin.com/company/acmelabs",
    "github": "https://github.com/acmelabs",
    "discord": "https://discord.gg/acmelabs",
    "telegram": "https://t.me/acmelabs"
  }
}
```

### Valid sectors

Community, DeFi, DePIN, Developer Tools, Exchange, Gaming, Infrastructure, Payments, Policy, Restaking, Robotics, Staking, Tokenization, Wallet

### Valid types

Community, Company, DAO, Platform, Protocol

### Writing guidelines

- **tagline**: Short phrase, usually taken or adapted from the official website.
- **summary**: 1-2 sentences. Plain factual summary of what the company does.
- **description**: 2-4 sentences. Include product details and Solana-specific context.
- Use factual, neutral language. No marketing superlatives or investor jargon.
- Write in present tense.
- Only include social links you can verify. Omit any you're unsure about.

---

## Level 4: Generate a full record from a URL

If you have a coding assistant or internal enrichment workflow available, you can use it to research a company from its website URL and generate a complete record with profile data and logos.

### Using a coding assistant

Ask your assistant to add the company using its URL:

```
Add <company-name> to ecosystem-data using https://example.com
```

The assistant should:

1. Research the company from its website and official sources
2. Download brand logos from the company's press or brand page
3. Generate a complete `CompanyRecord` with profile, logos, and metadata
4. Register it and run validation

### Manual research workflow

If you prefer to do it yourself:

1. **Start from the company's website** — this is the primary source of truth.
2. **Check for brand assets** — look for `/brand`, `/press`, `/media`, or `/brand-assets` pages.
3. **Find social links** — check the website footer, or search for the company on X, LinkedIn, GitHub, Discord.
4. **Write the profile** — follow the writing guidelines above and match the tone of existing records.
5. **Download logos** — prefer SVGs from official brand pages over screenshots or third-party sources.

### After generating

Always validate:

```bash
# Type check
pnpm --filter @workspace/ecosystem-data exec tsc --noEmit

# Audit for completeness
pnpm --filter @workspace/ecosystem-data audit:data
```

---

## Updating an existing company

- **To update profile data**: Edit only the `profile` field in the record file. Do not change `id`, `slug`, `name`, `logos`, or `defaultLogoId`.
- **To update logos**: Add new files to the asset folder, update the imports and `logos` array. Do not change `id`, `slug`, `name`, or `profile`.
- **To fix both**: Make separate, clear changes to each section.

---

## Common mistakes

| Mistake | Fix |
|---|---|
| Logo file in wrong folder | Must be in `assets/companies/<slug>/` |
| Forgot to add to registry | Import and add to `companies` array in `registry.ts` |
| `id` doesn't match slug | `id`, `slug`, and folder name must all match |
| Import path wrong | Path is `../../../assets/companies/<slug>/<file>` (3 levels up from records) |
| Using PNG when SVG exists | Always prefer SVG |
| Added event-specific data | Sponsorship level, sort order, and event URLs belong in the consuming app, not here |

---

## Validation commands

```bash
# Type check the package
pnpm --filter @workspace/ecosystem-data exec tsc --noEmit

# Run the audit (checks asset/record consistency)
pnpm --filter @workspace/ecosystem-data audit:data

# Lint
pnpm --filter @workspace/ecosystem-data lint
```
