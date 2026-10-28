---
name: update-sponsor-assets
description:
  Update Breakpoint sponsors from pasted spreadsheet rows and local logo
  folders, ZIPs, or images. Research company records, import distinct logo
  variants, prepare white transparent Breakpoint artwork, deduplicate files, and
  verify links. Preserve existing sponsors' tiers.
---

# Update sponsor assets

Complete the supplied batch in one pass: inspect inputs, research companies,
edit records and assets, integrate logos, and validate the result. Resolve
routine choices without a confirmation checkpoint. Ask only for a missing input
or an identity/tier ambiguity that prevents a correct update; continue
independent work.

## Inputs and scope

The user can paste this skill's path/link, local logo folder/ZIP/image paths,
and spreadsheet rows in any readable form. No special template is required.

- Match rows to company identities using names, canonical URLs, and artwork.
  Archive timestamps and ordering do not establish identity. A repeated company
  across several rows or folders is one company and one sponsor entry.
- Read ZIP contents before extracting into temporary storage, including nested
  ZIPs with corrected or watermark-free artwork. Do not extract absolute or
  parent-traversing paths. Ignore `.DS_Store`, `__MACOSX`, fonts, and unrelated
  brand collateral. Keep the supplied downloads intact.
- Spreadsheet contact names, emails, fees, legal/onboarding states, and booth
  details help identify a company; they are not public ecosystem profile fields.
  Do not copy them into records, app content, logs, or the final report.
- Preserve every existing sponsor's tier, membership, and relative order.
  Spreadsheet tiers describe placement for **new** sponsor entries, not
  permission to move existing entries. If the user asks only for company/assets
  preparation, do not add sponsors. If a new sponsor has no reliable supplied
  tier, prepare its company and artwork and ask for that placement while
  finishing the rest.
- A separate explicit instruction can authorize a tier move. Do not infer one
  from a spreadsheet row. Do not commit, push, open a PR, or deploy unless the
  user separately requests that delivery workflow.
- Limit research and cleanup to the supplied batch; do not enrich the entire
  registry or clean up unrelated duplicate groups.

## Repository context

Read root and Breakpoint `AGENTS.md`, then:

- [`packages/ecosystem-data/README.md`](../../../../packages/ecosystem-data/README.md),
  [`src/types.ts`](../../../../packages/ecosystem-data/src/types.ts), and
  [`src/companies/registry.ts`](../../../../packages/ecosystem-data/src/companies/registry.ts).
- [`enrich-ecosystem-data.md`](../../../../packages/ecosystem-data/skills/enrich-ecosystem-data.md)
  for research and logo conventions. Apply its profile and logo passes to this
  batch only. New companies also need a record, assets, and registry
  registration.
- [`solana-tone-of-voice/SKILL.md`](../../../../skills/solana-tone-of-voice/SKILL.md)
  before writing profile copy, plus a few nearby company records.
- [`src/content/sponsors.ts`](../../src/content/sponsors.ts),
  [`src/lib/sponsors.ts`](../../src/lib/sponsors.ts), and
  [`SponsorArtwork.tsx`](../../src/components/SponsorArtwork.tsx).

Run `pnpm --filter @workspace/ecosystem-data audit:data` before editing; record
baseline findings so unrelated null profiles or orphan assets are not mistaken
for regressions. Keep a temporary mapping of input → company ID → chosen logo →
source URLs → existing/new sponsor status. Preserve unrelated worktree changes.

## Research and links

Start with the existing canonical company URL, or the URL supplied in the row.
Verify the destination's identity. If no URL was supplied, discover the official
site through web research; email domains alone are insufficient evidence.

Populate or refresh `profile` with a factual tagline, 1–2 sentence summary, 2–4
sentence description, supported sector/type, website, useful app/docs URLs, and
verified official socials. Use the current schema's allowed values. Keep
existing IDs, slugs, and names stable. Register genuinely new companies once.
Keep event metadata in the app. Do not invent a Solana integration or a social
handle; omit unverified optional fields and report material uncertainty.

Verify **every stored URL in each touched company's profile**, including
unchanged ones. Use GET requests with redirects and timeouts; a HEAD failure is
not proof that the link is broken. A 200 response alone does not prove
correctness:

- Compare social destinations with links on the official site, documentation, or
  official organization profiles. Follow actual redirects, handle changes, and
  rebrands; never guess an X or Discord vanity URL from a company name.
- For LinkedIn, GitHub, and similar sites, check the organization identity and
  its backlink where available. Exclude unrelated similarly named entities.
- For Discord, use the official published invite and check invite metadata when
  accessible; the generic Discord landing page can return 200 for invalid codes.
- For client-rendered sites, inspect rendered anchors in a browser when HTML
  source lacks the official links. For 403/429/login challenges, cross-check
  authoritative sources and report the remaining access limit rather than
  claiming the destination was directly validated or deleting a good link.

Retain research and link-check evidence in temporary notes for the final report.
A blocked optional social does not block independent company and asset work.

## Logos and Breakpoint treatment

Import useful **distinct** full logos, wordmarks, marks, colorways, and
background variants into
`packages/ecosystem-data/assets/companies/<company-slug>/`. Prefer SVG when it
contains the same artwork as a PNG/JPEG. Preserve genuinely distinct existing
variants and meaningful supplied updates; do not import every duplicate format
or obsolete watermarked draft. Find official brand-kit/site assets if a
company's supplied artwork is missing or unusable.

Strip unused editor metadata (such as Adobe `aipgf` payloads and its export
wrappers) before publishing supplied SVGs. Verify rendered pixels and viewBox
are unchanged; keep paths, fills, masks, and cutouts intact.

Use explicit lowercase kebab-case filenames, static imports, descriptive IDs,
and accurate format/kind/theme/background metadata. `theme` describes the
surface on which the artwork is legible. Choose a versatile general
`defaultLogoId`.

Every company in this batch needs an exact `breakpoint-2026-white` selector:

- The artwork itself must be RGB **255,255,255** at every nontransparent pixel,
  with a genuinely transparent background and transparent interior cutouts. A
  black rectangle, near-white gray, gradient, CSS filter, or baked dark eye/
  letter counter is not a substitute. Breakpoint currently filters images white;
  that cannot repair opaque black relief shapes.
- Prefer supplied white transparent vector artwork. Preserve correct vector
  holes/masks and inspect rasterized output; do not blindly whiten every SVG
  path if some paths encode negative relief.
- Use **ImageMagick (`magick`)** for raster recoloring, background removal,
  negative-relief cutouts, or trimming when needed. Read transparency and color
  statistics first, preserve edge alpha, and choose the mask from the actual
  artwork. White-on-dark source files need different handling from colored-on-
  transparent originals. Avoid a universal threshold or flood-fill recipe that
  erases legitimate parts of a mark. Inspect the result against dark gray.
- For artwork whose alpha already contains all holes, recolor RGB while keeping
  alpha:
  `magick input.png -channel RGB -evaluate set 100% +channel -strip output.png`.
  This does **not** remove an opaque background or create missing relief.
- Crop excessive artboard padding without clipping antialiased edges. Set the
  Breakpoint entry's actual viewBox/pixel dimensions and `theme: "dark"`,
  `background: "transparent"`, `treatment: "monotone"`. Check aspect ratios.
- Use one physical file per distinct artwork. If an existing general white
  variant already satisfies Breakpoint, both selector entries can share its
  `source`, `fileName`, and `format`; do not copy it to a second event filename.

## Deduplicate and integrate

Check file hashes across the entire company asset tree for duplicates involving
this batch. Also compare rendered artwork after trimming transparent padding;
byte hashes miss SVG serialization differences, PNG/SVG copies, and differently
padded exports. Inspect candidates visually and preserve real color/layout
variants. A similarity score alone is not evidence to delete artwork.

Consolidate true duplicates into the best canonical asset, preferring vector
when equivalent. Update all imports and affected `logos` entries before removing
any file. Keep used selector IDs as aliases to the canonical import, including
`breakpoint-2026-white`. Remove redundant unused variant entries when
appropriate. Check other consumers before renaming an existing selector or file.

### Required duplicate-free completion check

Deduplication is part of the update, not an optional follow-up:

1. Collapse repeated spreadsheet rows and repeated input folders into one
   company mapping. Search existing registry records and aliases before creating
   an ID.
2. Audit **every image file in the touched company folders**, including files
   not referenced by a record, and compare exact hashes against the entire
   company asset tree. Compare rendered artwork with transparent padding removed
   to find differently named, differently encoded, resized, or PNG/SVG copies.
3. Review every rendered-similarity candidate. Consolidate equivalent artwork;
   retain genuinely different colors, backgrounds, lockups, and cutouts.
   Multiple selector IDs sharing one physical canonical file are intentional
   aliases, not duplicate files. Do not remove a distinct variant to silence a
   warning.
4. Check the sponsor arrays for duplicate entries for the same company and logo
   variant, including accidental placement in two tiers. Preserve intentional
   distinct brands with different logo selectors and the marquee's deliberate
   animation repetitions. New input must not duplicate an existing sponsor.
5. After consolidation and SVG cleanup, rerun the asset helper and data audit.
   Confirm all imports still exist and each affected default/Breakpoint selector
   resolves. **Do not finish while a true duplicate involving this batch
   remains** or a deletion has left a dangling import. Resolve or explicitly
   report any candidate that cannot be confidently classified.

Report how many duplicate physical files were removed, that the final exact-hash
scan found zero duplicate groups involving the batch, and why any remaining
similarity candidates represent distinct variants. Existing unrelated duplicate
groups remain outside this batch unless the user requests wider cleanup.

For existing Breakpoint sponsors, update only logo dimensions/selection where
needed. For new sponsors in a sponsor-update request, append once to the
supplied tier, following the existing sponsorship-action ordering rule. Preserve
all existing tier assignments. The page and marquee derive from the same arrays;
do not add separate duplicate marquee entries or copy package logos into
public/. Use the chosen asset's actual dimensions for `width` and `height` in
the sponsor entry. No CSS changes are needed for a routine data/assets update.

## Validate before finishing

Run from the repository root, replacing sample slugs with the actual batch:

```bash
node apps/breakpoint/skills/update-sponsor-assets/scripts/audit-sponsor-assets.mjs company-a company-b --preview /tmp/breakpoint-logo-preview.png
pnpm --filter @workspace/ecosystem-data audit:data
pnpm --filter @workspace/ecosystem-data exec tsc --noEmit
pnpm --filter solana-com-breakpoint check-types
pnpm --filter solana-com-breakpoint exec vitest run src/tests/sponsors.test.ts
pnpm --filter solana-com-breakpoint test:sponsor-assets
```

The helper is read-only except for the explicitly requested preview PNG. It
checks **all logo imports**, not just the Breakpoint variant: TypeScript's
wildcard asset declarations can pass even when the file does not exist. It also
validates source/ filename/format consistency, the default selector, Breakpoint
RGBA at original rasterization size, metadata/aspect ratio, and scoped exact
duplicates. It lists possible rendered duplicates and profile URLs for manual
review; it does not prove link ownership or cutout correctness. Do not treat a
near-duplicate warning as an automatic deletion instruction. Original-size pixel
checks avoid resampling fringes being mistaken for nonwhite source pixels.

Open the preview and inspect silhouettes, counters, eyes, background edges, and
cropping. Resolve helper failures and review every candidate. Compare the data
audit against its baseline; do not repair unrelated findings. If Breakpoint
types fail solely because fab-menu declarations are unbuilt, run
`pnpm --filter @solana-foundation/fab-menu build` and retry.

Run targeted oxlint/oxfmt on changed files and `git diff --check`. Serve this
worktree's Breakpoint app and inspect `/breakpoint/sponsors` at desktop and
mobile widths, plus the homepage marquee when membership/assets changed. Verify
company modals, logo loading, tier placement, and horizontal overflow. Confirm
the server belongs to this worktree; use another free port if `3005` serves a
different one. If a missing-file build error occurs, check every asset import on
disk, repair references, and confirm the route compiles; do not assume a cache
problem.

Finish with companies/sectors, distinct variants added or reused, duplicate
files consolidated, link corrections, new sponsor placements (if any), and
validation results. Separate verified results from blocked links, missing
inputs, and pre-existing audit issues. Include source URLs for material
corrections. Do not claim the update is complete while an in-scope import,
image, or link is known to be broken.
