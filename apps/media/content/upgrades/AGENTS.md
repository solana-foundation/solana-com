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

## Required Structure

Every new article follows this 6-part skeleton, in order:

1. H1 title
2. Byline line: `<Timeframe> • Solana Foundation` (e.g.
   `Q3 2026 • Solana Foundation`)
3. Intro paragraph — what the upgrade is and why it matters
4. Key-facts table (2 columns; common rows: Status, Breaking Change?, Indexing
   Changes Required?, Action Required?)
5. `## Technical Details` with `###` subsections, one per sub-topic
6. `## About This Upgrade` closing section, ending with the fixed line:
   `**Learn more:** [Solana Upgrades](/upgrades)`

Reference examples: `alpenglow.mdx` and `reduced-slot-times.mdx`.

**Do not use `xdp.mdx` as a reference.** It predates the Keystatic migration
described in
`docs/superpowers/specs/2026-05-31-xdp-keystatic-migration-design.md` and does
not follow this structure.

## MDX Skeleton

Start every new article from this template:

```mdx
---
title: <Article Title>
description: >-
  <1-3 sentence SEO/meta description summarizing the upgrade and its impact.>
subtitle: <Short subtitle shown in the hero section>
publishedAt: <YYYY-MM-DDT00:00:00.000Z>
status: draft
author: solana-foundation
badges:
  - text: <e.g. "Under Development">
    color: yellow # green | yellow | red | purple
    variant: badge # badge | text
metrics:
  - value: <e.g. "150ms">
    label: <e.g. "Target finality">
categories:
  - category: upgrades
tags:
  - tag: announcements
---

# <Article Title>

<Timeframe> • Solana Foundation

<Intro paragraph: what this upgrade is and why it matters.>

|                            |     |
| -------------------------- | --- |
| Status                     |     |
| Breaking Change?           |     |
| Indexing Changes Required? |     |

## Technical Details

### <Subsection Title>

<Content>

## About This Upgrade

<Closing context: why this matters for the network long-term.>

**Learn more:** [Solana Upgrades](/upgrades)
```

## Keystatic Frontmatter Reference

Fields defined in `apps/media/keystatic.config.tsx`, `upgrades` collection:

| Field         | Type                              | Notes                                                   |
| ------------- | --------------------------------- | ------------------------------------------------------- |
| `title`       | slug/text                         | Required, becomes the URL slug                          |
| `status`      | select                            | `draft` \| `published`, defaults to `draft`             |
| `description` | text                              | SEO meta description                                    |
| `subtitle`    | text                              | Shown below title in hero                               |
| `badges`      | array of `{text, color, variant}` | `color`: green/yellow/red/purple; `variant`: badge/text |
| `metrics`     | array of `{value, label}`         | Key stat cards                                          |
| `heroImage`   | image                             | Optional, used as `og:image`                            |
| `author`      | relationship                      | Author entry                                            |
| `publishedAt` | datetime                          | Required                                                |
| `categories`  | array → categories                | Typically just `upgrades`                               |
| `tags`        | array → tags                      | Typically `announcements`                               |
| `body`        | MDX                               | The article content itself                              |

## Accuracy

Double-check SIMD numbers, metrics, and activation timelines before publishing.
Link to a primary source (SIMD proposal, Anza/Firedancer release notes) when a
natural place for one exists in the text. This is a reminder, not a hard
per-claim citation requirement.
