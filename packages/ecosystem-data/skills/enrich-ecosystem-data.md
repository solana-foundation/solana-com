# Enrich Ecosystem Company Data

Web search for all companies in the ecosystem-data registry and update their records with the latest publicly available information.

## Context

- Registry: `packages/ecosystem-data/src/companies/registry.ts`
- Types: `packages/ecosystem-data/src/types.ts`
- Package guide: `packages/ecosystem-data/README.md`
- Each company has a `CompanyRecord` with an optional `profile` field containing enriched data in a flat package-owned shape.
- The goal is to enrich canonical company data only. Event-specific sponsorship metadata stays in consuming apps.

## Workflow

### 1. Read current state

Read the registry and types files. Build a list of all company IDs and note which ones have `profile: null` (need enrichment) vs. a populated `profile` object (may need refresh).

Before research, run:

```bash
pnpm --filter @workspace/ecosystem-data audit:data
```

Use the audit output to spot companies that have asset folders and company records but are still missing enrichment or have obvious asset consistency issues.

### 2. Research each company

For every company with `profile: null`, launch parallel Agent subprocesses (subagent_type: "general-purpose") to research and gather:

| Field | Source hint |
|---|---|
| `tagline` | Official website hero/header, or X bio |
| `summary` | 1–2 sentence summary of what they do on Solana |
| `description` | 2–4 sentence detailed description |
| `sector` | One of: Infrastructure, DeFi, Payments, Gaming, Wallet, Exchange, DePIN, Community, Tokenization, Staking, Developer Tools, Policy, Robotics, Restaking |
| `status` | Optional lifecycle/status label when clearly supported by sources |
| `type` | One of: Company, Protocol, Platform, Community, DAO |
| `links.website` | Official homepage |
| `socials.x` | `x.com` or `twitter.com` handle |
| `socials.linkedin` | Company LinkedIn page |
| `socials.discord` | Invite link |
| `socials.telegram` | Community or announcements channel |
| `socials.github` | Organization page |

**Research strategy**: start from the company's canonical URL already present in the record. Treat that URL and the site it resolves to as the primary pull for company facts, messaging, and outbound official links. Use search only as a fallback to locate missing official profiles or to verify ambiguous details when the canonical site is incomplete.

**Source preference**:

1. canonical company URL from the record, including the official website it resolves to
2. official social profiles
3. reputable ecosystem directories or coverage used only to confirm, not invent, missing facts

If sources conflict, prefer the canonical company URL and the official website it resolves to. Do not fill fields from low-confidence directories, scraped profiles, or stale aggregator copy.

**Writing guidance**:

- `tagline`: short phrase, usually copied or lightly normalized from the official site
- `summary`: 1 to 2 sentences, plain factual summary
- `description`: 2 to 4 sentences with more product and ecosystem context
- Avoid slogans, hype, investor language, and unsupported claims
- Write in present tense and keep the wording durable outside a single campaign or event

### 3. Find and download brand logos

For every company, search for official brand/media/press pages that provide downloadable logo assets. Launch parallel Agent subprocesses to process companies in batches.

**Search strategy**:

1. Start from the company's canonical website URL in the record — it is the authority
2. Try common brand page paths: `{website}/brand`, `{website}/press`, `{website}/media`, `{website}/brand-assets`, `{website}/brandkit`
3. Search the web for: `"{company name} brand assets"`, `"{company name} media kit"`, `"{company name} press kit logos"`
4. If no brand page is found after 1–2 searches, skip the company and move on

**Source preference**:

1. Official brand/press/media pages on the company's own domain
2. Official documentation sites (e.g., `docs.{company}.com/resources/brand-kit`)
3. Direct asset URLs from the company's own CDN or website
4. Do not use third-party logo aggregators unless no official source exists

**Download rules**:

- Prefer SVG over PNG/WebP
- Download into `packages/ecosystem-data/assets/companies/<company-slug>/`
- Use explicit variant names: `logo-light.svg`, `logo-dark.svg`, `wordmark-light.svg`, `mark-dark.png`
- Use lowercase kebab-case for all filenames
- Logo kinds: `logo` (full logo with mark + text), `mark` (icon/symbol only), `wordmark` (text only)
- Verify downloaded files are valid — SVG content should start with `<svg` or `<?xml`, PNG files should not be zero bytes or HTML error pages
- Keep the existing logo file (renamed to a descriptive variant name if needed) and add new variants alongside it

**Record update pattern**:

```ts
import type { CompanyRecord } from "../../types";
import companyLogoLight from "../../../assets/companies/company/logo-light.svg";
import companyLogoDark from "../../../assets/companies/company/logo-dark.svg";
import companyMark from "../../../assets/companies/company/mark.svg";

export const company = {
  ...
  "defaultLogoId": "logo-light",
  "logos": [
    {
      "id": "logo-light",
      "fileName": "logo-light.svg",
      "format": "svg",
      "source": companyLogoLight,
      "theme": "light"
    },
    {
      "id": "logo-dark",
      "fileName": "logo-dark.svg",
      "format": "svg",
      "source": companyLogoDark,
      "theme": "dark"
    },
    {
      "id": "mark",
      "fileName": "mark.svg",
      "format": "svg",
      "source": companyMark,
      "kind": "mark"
    }
  ]
} satisfies CompanyRecord;
```

Key points:

- Import variable names use camelCase: `{companyName}Logo{Variant}` (e.g., `phantomLogoLight`)
- Each logo entry has: `id`, `fileName`, `format`, `source` (the import), and optionally `theme` (`"light"` / `"dark"`), `kind` (`"mark"` / `"wordmark"` / `"logo"`)
- `defaultLogoId` should point to the most versatile logo variant
- Only modify imports, `logos` array, and `defaultLogoId` — never touch `id`, `slug`, `name`, or `profile`

### 4. Update the registry (profile enrichment)

For each researched company, replace `"profile": null` with a populated object matching this shape:

```ts
"profile": {
  "tagline": "<Tagline>",
  "summary": "<Short description.>",
  "description": "<Longer detailed description.>",
  "sector": "<Sector>",
  "status": "<Optional status>",
  "type": "<Type>",
  "links": {
    "website": "https://..."
  },
  "socials": {
    "x": "https://x.com/...",
    "linkedin": "https://linkedin.com/company/..."
  }
}
```

Only include social entries where a URL was found. Omit social keys with no discovered URL.

When enriching:

- preserve existing field ordering and object shape used by nearby records
- do not duplicate the top-level company `name` inside `profile`
- include `links.website` even when social links are sparse
- use the existing company URL as the canonical research starting point before consulting search engines
- prefer direct organization URLs over link-in-bio or profile aggregators

### 5. Validate

After editing, confirm the file has valid TypeScript by running:

```bash
pnpm --filter @workspace/ecosystem-data exec tsc --noEmit
```

### Rules

- **Profile enrichment**: only modify `profile` — never touch `id`, `slug`, `name`, `logos`, `defaultLogoId`.
- **Logo enrichment**: only modify imports, `logos`, and `defaultLogoId` — never touch `id`, `slug`, `name`, or `profile`.
- Use factual, neutral language — no marketing superlatives.
- Match the tone of existing enriched records (Bridge, DoubleZero, KAST, Libeara, OSL, Superteam USA, velia.net).
- If reliable information cannot be found for a company, leave `profile: null` and note it in the summary.
- Process companies in parallel to save time.
- Keep `packages/ecosystem-data/README.md` accurate if the enrichment workflow or expectations materially change.

### 6. Summary

Report:
- Companies enriched (with sector assigned)
- Companies with logos updated (with variants added)
- Companies skipped (with reason)
- Companies where data confidence is low
- Validation result from `pnpm --filter @workspace/ecosystem-data exec tsc --noEmit`
