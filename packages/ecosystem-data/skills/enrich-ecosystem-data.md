# Enrich Ecosystem Company Data

Web search for all companies in the ecosystem-data registry and update their records with the latest publicly available information.

## Context

- Registry: `packages/ecosystem-data/src/companies/registry.ts`
- Types: `packages/ecosystem-data/src/types.ts`
- Package guide: `packages/ecosystem-data/README.md`
- Each company has a `CompanyRecord` with an optional `gridProfile` field containing enriched data (tagline, descriptions, sector, socials, URLs).
- The goal is to enrich canonical company data only. Event-specific sponsorship metadata stays in consuming apps.

## Workflow

### 1. Read current state

Read the registry and types files. Build a list of all company IDs and note which ones have `gridProfile: null` (need enrichment) vs. a populated `gridProfile` object (may need refresh).

Before research, run:

```bash
pnpm --filter @workspace/ecosystem-data audit:data
```

Use the audit output to spot companies that have asset folders and company records but are still missing enrichment or have obvious asset consistency issues.

### 2. Research each company

For every company with `gridProfile: null`, launch parallel Agent subprocesses (subagent_type: "general-purpose") to web search and gather:

| Field | Source hint |
|---|---|
| `tagLine` | Official website hero/header, or X bio |
| `descriptionShort` | 1–2 sentence summary of what they do on Solana |
| `descriptionLong` | 2–4 sentence detailed description |
| `profileSector` | One of: Infrastructure, DeFi, Payments, Gaming, Wallet, Exchange, NFT, DePIN, Community, Tokenization, Staking, Developer Tools, Policy, Robotics, Restaking |
| `profileType` | One of: Company, Protocol, Platform, Community, DAO |
| Website URL | Official homepage |
| Twitter / X | `x.com` or `twitter.com` handle |
| LinkedIn | Company LinkedIn page |
| Discord | Invite link |
| Telegram | Community or announcements channel |
| GitHub | Organization page |

**Search strategy**: query `"<Company Name> Solana"` first, then fetch the company website for tagline and descriptions if needed.

**Source preference**:

1. official company website
2. official social profiles
3. reputable ecosystem directories or coverage used only to confirm, not invent, missing facts

If sources conflict, prefer the official website. Do not fill fields from low-confidence directories, scraped profiles, or stale aggregator copy.

**Writing guidance**:

- `tagLine`: short phrase, usually copied or lightly normalized from the official site
- `descriptionShort`: 1 to 2 sentences, plain factual summary
- `descriptionLong`: 2 to 4 sentences with more product and ecosystem context
- Avoid slogans, hype, investor language, and unsupported claims
- Write in present tense and keep the wording durable outside a single campaign or event

### 3. Update the registry

For each researched company, replace `"gridProfile": null` with a populated object matching this shape:

```ts
"gridProfile": {
  "name": "<Display Name>",
  "tagLine": "<Tagline>",
  "descriptionShort": "<Short description.>",
  "descriptionLong": "<Longer detailed description.>",
  "profileSector": {
    "name": "<Sector>"
  },
  "profileType": {
    "name": "<Type>"
  },
  "urls": [
    {
      "url": "https://...",
      "urlType": { "name": "website" }
    }
  ],
  "root": {
    "socials": [
      {
        "socialType": { "name": "Twitter / X" },
        "urls": [{ "url": "https://x.com/...", "urlType": { "name": "main" } }]
      },
      {
        "socialType": { "name": "LinkedIn" },
        "urls": [{ "url": "https://linkedin.com/company/...", "urlType": { "name": "main" } }]
      }
    ]
  }
}
```

Only include social entries where a URL was found. Omit socials with no discovered URL.

When enriching:

- preserve existing field ordering and object shape used by nearby records
- use the company display name already present in the record for `gridProfile.name` unless the registry itself clearly uses a different canonical style
- include the homepage in `urls` even when social links are sparse
- prefer direct organization URLs over link-in-bio or profile aggregators

### 4. Validate

After editing, confirm the file has valid TypeScript by running:

```bash
pnpm --filter @workspace/ecosystem-data exec tsc --noEmit
```

### Rules

- **Only modify `gridProfile`** — never touch `id`, `slug`, `name`, `logos`, `defaultLogoId`, or `gridProfileSlug`.
- Use factual, neutral language — no marketing superlatives.
- Match the tone of existing enriched records (Bridge, DoubleZero, KAST, Libeara, OSL, Superteam USA, velia.net).
- If reliable information cannot be found for a company, leave `gridProfile: null` and note it in the summary.
- Process companies in parallel to save time.
- Keep `packages/ecosystem-data/README.md` accurate if the enrichment workflow or expectations materially change.

### 5. Summary

Report:
- Companies enriched (with sector assigned)
- Companies skipped (with reason)
- Companies where data confidence is low
- Validation result from `pnpm --filter @workspace/ecosystem-data exec tsc --noEmit`
