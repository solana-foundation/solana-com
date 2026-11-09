# Upgrades Article Guide

Read this before drafting or editing any file in `content/upgrades/`. It covers
voice, required structure, Keystatic frontmatter, and sourcing expectations for
`/upgrades` articles.

## Voice & Tone

- Technical but accessible — assume a reader who understands Solana basics but
  not the specific mechanism being described.
- Impact-focused: explain WHY a change matters, not just WHAT changed.
- Use specific metrics and timelines instead of vague claims (`150ms finality`,
  `Q3 2026` — not "much faster" or "soon").
- Use "This means..." style statements to translate a technical fact into a
  concrete consequence for validators, developers, or users.
- Use analogies for complex mechanisms (e.g. XDP as "a shortcut that bypasses
  normal network processing").
- Active voice. No marketing hype or unsupported superlatives.
- Establish the status quo before the change. One sentence naming the current
  mechanism and its number, then the new one. Alpenglow defines consensus and
  TowerBFT's 12.8 seconds before introducing 150ms; Larger Transaction Sizes
  explains that 1232 came from a 1280-byte MTU before giving 4096.
- Say who has to do nothing, and say it early. Most readers are unaffected, and
  telling them so is what earns their attention for the rest: "If your
  application only sends transactions and reads account state, there is nothing
  to migrate."
- Mark a metric as an expectation or a constant. Any number a reader might
  hard-code needs its contingency stated: "The 150ms is an expectation, not a
  constant: it was measured against the stake distribution at the time of
  testing." Prefer "check the SIMD before hard-coding any number" to implying a
  guarantee.
- Quote literal errors, codes, and output — `-32015`,
  `MaxLoadedAccountsDataSizeExceeded`, `still running tower`, `block: null` —
  the exact string the reader will search for, not a description of it.
- Answer the obvious objection. When a reader would reasonably ask "why not just
  X?", say why not: "The ceiling stays at 4096 rather than going larger as this
  matches the standard 4 KiB memory page"; "Anza did not redefine `confirmed` as
  first-round notarization. That would break the guarantee `confirmed` carries
  today."
- State what is unresolved. "We are evaluating additional options." "There is no
  way around it." "SDKs other than Kit do not expose the method yet." A named
  gap is more useful than a smooth surface.

## House Style

- **onchain**, not "on-chain" — the repo standard (roughly 540 uses to 27 in
  `content/posts/`). Four files in this folder still use the hyphen; do not copy
  them.
- Cluster names lowercase mid-sentence: mainnet, devnet, testnet. Client and
  release names capitalized: Agave 4.3, Firedancer.
- Backtick anything a reader would type or grep: field names, error codes, RPC
  methods, CLI commands, feature-gate addresses.
- SIMDs as `SIMD-0296` — four digits, hyphenated.

## Required Structure

Articles come in two tiers. Pick the tier from the key-facts table's
`Breaking Change?` row: `No` is Tier 1, `Yes` is Tier 2.

### Tier 1 — Non-Breaking Upgrade

Most articles. Nothing downstream has to change, so the article only has to
explain the upgrade.

1. H1 title
2. Byline line: `<Timeframe> • Solana Foundation` (e.g.
   `Q3 2026 • Solana Foundation`)
3. Intro paragraph — what the upgrade is and why it matters
4. Key-facts table (see [Key-Facts Table](#key-facts-table))
5. `## Technical Details` with `###` subsections, one per sub-topic
6. `## About This Upgrade` closing section, ending with the fixed line:
   `**Learn more:** [Solana Upgrades](/upgrades)`

Reference examples: `100m-cu-blocks.mdx`, `reduced-slot-times.mdx`,
`new-cryptography.mdx`.

### Tier 2 — Breaking Change

When `Breaking Change?` is `Yes`, the article's main job is migration rather
than explanation. Tier 1's skeleton is a subset of this one; the sections
between the key-facts table and `## Technical Details` are what make it Tier 2.

1. H1 title
2. Byline line
3. Intro paragraph
4. Orientation — a short bullet list of what does and does not change for the
   reader. Tier 2 articles are long, so say up front who has to do nothing.
5. Key-facts table
6. **Breaking-changes summary table** — one row per affected audience, with the
   last column linking into the matching detail section:
   `| If your app | When | What you have to do |`
7. `## Migration Checklist` — an `<AudienceGroup>` of `<Audience>` panels, one
   per role (Users, Developers, Validator Operators, and so on). Each panel is a
   checklist of actions rather than prose, and links to its detail section.
8. `## Breaking Changes in Detail` — an `<AudienceGroup>` whose panels each
   carry a `### Breaking Change: <what changes>` heading and the full
   explanation. This is what steps 6 and 7 link into.
9. Optional reference sections, when the upgrade needs them:
   - a version-support matrix giving the first release of each dependency that
     handles the change (`## Support for V1 Transactions` in
     `larger-transaction-sizes.mdx`)
   - `## SDK Cheat Sheet`, a task-to-API table per language
10. `## Technical Details`
11. `## About This Upgrade`, ending with the fixed `**Learn more:**` line

Reference examples: `larger-transaction-sizes.mdx` (activated) and
`alpenglow.mdx` (still in development).

Steps 6, 7, and 8 describe the same set of changes three times at increasing
depth. Keep them in sync: every row of the summary table has a checklist entry
and a detail section, and every detail section is linked from both.

### Key-Facts Table

Two columns, with an empty header row. Which rows to include depends on whether
the upgrade has shipped:

| Row                                | Notes                                                                     |
| ---------------------------------- | ------------------------------------------------------------------------- |
| `Expected Mainnet Activation Date` | Before activation. Becomes `Mainnet Activation` once the upgrade is live. |
| `Devnet Activation`                | Devnet, or devnet and testnet together.                                   |
| `Breaking Change?`                 | `Yes` or `No`, plus a short qualifier. This decides the tier.             |
| `Indexing Changes Required?`       | `Yes` or `No`, plus what has to change.                                   |
| `Feature Gate`                     | The gate address, for upgrades that ship behind one.                      |

**Do not use `xdp.mdx` as a reference.** It predates the Keystatic migration and
follows neither structure.

## MDX Skeleton

Start every new article from this Tier 1 template, then add the Tier 2 sections
below if the upgrade is a breaking change.

```mdx
---
title: <Article Title>
description: >-
  <1-3 sentence SEO/meta description summarizing the upgrade and its impact.>
subtitle: <Short subtitle shown in the hero section>
publishedAt: <YYYY-MM-DDT00:00:00.000Z>
status: draft
author: solana-foundation
stage: in_development # planned | in_development | pending_activation | partially_active | live
release: <release slug, e.g. agave-4-3> # optional, omit for Unscheduled
order: <integer, e.g. 1> # optional, manual sort within the release
metrics:
  - value: <e.g. "150ms">
    label: <e.g. "Target finality">
additionalResources: # optional, renders as link cards in the hero
  - label: <e.g. "SIMD-0500 — Disable Deployment of sBPF v0, v1, and v2">
    url: <relative solana.com path or absolute URL>
categories:
  - category: upgrades
tags:
  - tag: announcements
---

# <Article Title>

<Timeframe> • Solana Foundation

<Intro paragraph: what this upgrade is and why it matters.>

|                                  |     |
| -------------------------------- | --- |
| Expected Mainnet Activation Date |     |
| Devnet Activation                |     |
| Breaking Change?                 |     |
| Indexing Changes Required?       |     |

## Technical Details

### <Subsection Title>

<Content>

## About This Upgrade

<Closing context: why this matters for the network long-term.>

**Learn more:** [Solana Upgrades](/upgrades)
```

### Tier 2 Additions

For a breaking change, insert these between the key-facts table and
`## Technical Details`:

```mdx
**Breaking Changes:**

| If your app               | When            | What you have to do                                        |
| ------------------------- | --------------- | ---------------------------------------------------------- |
| **<Verb>** <what it does> | <when it bites> | <the action>. [Learn more](#breaking-change-<detail-slug>) |

## Migration Checklist

<AudienceGroup>
<Audience title="For Users" summary="<one-line takeaway>">

<What changes for them, or that nothing does.>

</Audience>

<Audience title="For Developers" summary="<one-line takeaway>">

**If you <do the affected thing>** ([details](#breaking-change-<detail-slug>)):

- <action>
- <action>

</Audience>
</AudienceGroup>

## Breaking Changes in Detail

<AudienceGroup>
<Audience title="For <Audience>" summary="<one-line takeaway>">

### Breaking Change: <What Changes>

<Full explanation, and how to tell when the switch has happened.>

</Audience>
</AudienceGroup>
```

## Writing a Breaking Change

A Tier 2 article's job is to stop a reader shipping a bug. Three rules carry
most of that weight.

**Say whether it fails loudly or silently.** This is the most important sentence
in any breaking-change section. If it errors, give the code. If it does not,
name the wrong value the reader will see instead:

- "A stale consumer does not error on v1; it silently misreads it as v0 with an
  empty compute budget."
- "ComputeBudget scanning ... will report zero for every v1 transaction, without
  erroring. This is the most likely path to quietly wrong analytics rather than
  a loud failure."
- "Feeding both streams into one buffer compiles and runs. It also splices
  connection B's `bank_id = 7` onto connection A's data."

**Include the wrong-but-tempting action.** Readers reach for the obvious fix, so
say when it is wrong and what to do instead. "Do not switch before then: on
TowerBFT, `finalized` still means a 12.8-second wait." "The only thing you may
do with two `bank_id`s from the same stream is test whether they differ."

**Separate an accounting change from a real one.** When a metric moves without
the underlying reality moving, say so in those words and tell readers to
re-baseline: "Removing it is an accounting change, not a throughput regression,
but every dashboard, benchmark, alert threshold, and historical comparison whose
baseline included votes needs re-baselining."

Give every change a **when**, too. "Nothing breaks on activation day" and
"migrate only after Alpenglow is live" are different instructions, and readers
act on both.

`<Audience>` panels render collapsed, so the `summary` has to carry the takeaway
on its own — write it as a full instruction ("Register a BLS pubkey, then
upgrade to Agave 4.3."), not a label. Panel bodies are imperative bullets under
an `**If you <do the affected thing>**` lead, not prose.

## Keystatic Frontmatter Reference

Fields defined in `apps/media/keystatic.config.tsx`, `upgrades` collection:

| Field                 | Type                      | Notes                                                                                                                                                                                                                                                                                                                                           |
| --------------------- | ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `title`               | slug/text                 | Required, becomes the URL slug                                                                                                                                                                                                                                                                                                                  |
| `status`              | select                    | `draft` \| `published`, defaults to `draft`                                                                                                                                                                                                                                                                                                     |
| `description`         | text                      | SEO meta description                                                                                                                                                                                                                                                                                                                            |
| `subtitle`            | text                      | Shown below title in hero                                                                                                                                                                                                                                                                                                                       |
| `stage`               | select                    | `planned` \| `in_development` \| `pending_activation` \| `partially_active` \| `live` — use `pending_activation` instead of `in_development` once the article's release has shipped but this specific feature hasn't activated yet, and `partially_active` for a staged rollout where some feature gates are live on mainnet and others are not |
| `metrics`             | array of `{value, label}` | Key stat cards                                                                                                                                                                                                                                                                                                                                  |
| `additionalResources` | array of `{label, url}`   | Optional link cards in the hero. `url` is a relative solana.com path or an absolute URL.                                                                                                                                                                                                                                                        |
| `author`              | relationship              | Author entry                                                                                                                                                                                                                                                                                                                                    |
| `publishedAt`         | datetime                  | Required                                                                                                                                                                                                                                                                                                                                        |
| `release`             | relationship → releases   | Optional; unset = Unscheduled                                                                                                                                                                                                                                                                                                                   |
| `order`               | integer                   | Optional; manual sort position within the release                                                                                                                                                                                                                                                                                               |
| `categories`          | array → categories        | Typically just `upgrades`                                                                                                                                                                                                                                                                                                                       |
| `tags`                | array → tags              | Typically `announcements`                                                                                                                                                                                                                                                                                                                       |
| `body`                | MDX                       | The article content itself                                                                                                                                                                                                                                                                                                                      |

There is no `heroImage` field on this collection. The `og:image` for an upgrade
is generated from the entry at
`app/[locale]/upgrades/[slug]/social-image/route.tsx`, so there is nothing to
set in frontmatter.

## Keeping an Article Current

These articles are revised as a feature moves toward activation, not rewritten.
When the state changes:

- Update `stage`, and switch the byline to
  `**Updated <Month Year>** • Solana Foundation`. The plain
  `<Timeframe> • Solana Foundation` form is for an article not revised since
  publication. Do not change `publishedAt`.
- Move the tense with the feature. Before: "Solana is reducing slot times."
  After: "Solana's maximum transaction size is now 4096 bytes, up from 1232."
  Leave no future-tense sentence describing something that has shipped.
- Rename the key-facts row from `Expected Mainnet Activation Date` to
  `Mainnet Activation`, and give epoch, date, and approximate UTC time: "at the
  start of epoch 1035 on September 15, 2026 at approximately 01:00 UTC."
- For a staged rollout, keep a `### Rollout Status` subsection saying which
  gates are live on which clusters, and set `stage: partially_active`.
  `reduced-rent.mdx` and `reduced-slot-times.mdx` both do this.

## Accuracy

Double-check SIMD numbers, metrics, and activation timelines before publishing.

Link a primary source for anything a reader will act on: SIMD proposals,
Anza/Firedancer release notes, the commit that fixed a bug, the explorer's
feature-gate page, the first package version that supports a change. A claim a
reader has to take on trust should be the exception.

- Link a merged SIMD at its `blob/main/proposals/NNNN-*.md` path. Use a `pull/N`
  URL only while it is unmerged, and say it is a draft — the `proposals/` path
  404s until merge. "A draft proposal, SIMD-0596, would raise the account limit
  to 96."
- Give minimum versions, not "latest": "`@solana/kit` 8.0.0 or later", "Agave
  v4.2.2". Note when a version can read a change but not write it.
- Distinguish what is specified from what is deployed. A SIMD merging, a release
  shipping, and a feature gate activating are three separate events, and the
  article has to say which have happened.
