---
name: llms-txt-generator
description:
  Upgrade llmtxt-generator.py by scanning apps/ for doc structure changes, then
  regenerate llms.txt and llms-en.txt while only adding missing sections. Use
  when updating the generator, adding new doc sections, or refreshing LLM text
  files.
---

# LLMs.txt Generator Upgrader

## Goal

Upgrade `llmtxt-generator.py` using current app structure and existing
`apps/web/public/llms.txt`, then regenerate outputs. Only add new or missing
sections and links. Do not remove, rename, or rewrite existing sections unless
the user explicitly asks.

## Discovery: apps structure

1. Scan `apps/` to understand doc surfaces and routing structure.
2. Note any new top-level doc categories or developer resources that are not
   represented in the current `llms.txt`.

## Baseline: current llms.txt

1. Read `apps/web/public/llms.txt`.
2. Extract section headings (`##`) and link lists.
3. Treat this as the canonical baseline: preserve all existing sections and
   links, and avoid duplicates.

## Update the generator (llmtxt-generator.py)

Always edit the generator, not the output files.

- Add only missing sections or links to `CURATED_SECTIONS` or `ENGLISH_EXTRAS`
  so the generator reproduces the current `llms.txt` plus any new additions.
- Keep descriptions short, factual, and consistent with the current style.
- Keep URL patterns canonical (no `utm_` parameters).
- Keep `LOCALES` aligned with `packages/i18n/src/config.ts` and update
  `LANGUAGE_NAMES` for any newly added locale.
- If new routing patterns appear, update `normalize_llms_urls()` accordingly.

## Regeneration

From the repo root:

```
python llmtxt-generator.py
```

Outputs:

- `apps/web/public/llms.txt`
- `apps/web/public/llms-en.txt`

## Output constraints

- Only add new or missing sections/links; never delete existing ones.
- Preserve ordering unless a new section clearly belongs next to related ones.
- Do not fabricate `llms-full.txt`. Follow repo guidance or user instructions.
- For non-English locales, note the generator preserves existing content if the
  file exists; change this behavior only if explicitly requested.

## Verification

- `apps/web/public/llms.txt` contains all prior sections and any new additions.
- Locale files exist for all configured locales.
- Output URLs are canonical and contain no `utm_` parameters.

## Example requests

- "Upgrade llmtxt-generator.py after a new docs section"
- "Add missing llms.txt sections based on apps structure"
- "Add a new locale and regenerate llms files"
