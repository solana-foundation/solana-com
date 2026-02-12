<!-- OPENSPEC:START -->

# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `@/openspec/AGENTS.md` when the request:

- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/openspec/AGENTS.md` to learn:

- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.

<!-- OPENSPEC:END -->

# Solana Media - Blog & News

> See root `/CLAUDE.md` for monorepo-wide configuration and shared tooling.

## Overview

The Solana blog and media site, powered by TinaCMS for content management. Includes blog posts, podcasts, and marketing content with a visual CMS editing experience.

**Package name**: `solana-com-media`
**Default port**: 3002
**Asset prefix**: `/media-assets`

## Tech Stack

- **Framework**: Next.js 15 (App Router) with next-intl
- **CMS**: TinaCMS (Git-backed headless CMS)
- **Styling**: Tailwind CSS 4.x (latest), tw-animate-css
- **Animation**: Motion (formerly Framer Motion)
- **Code Highlighting**: Shiki
- **Diagrams**: Mermaid
- **UI Components**: Radix UI, Headless UI

## Project Structure

```
apps/media/
├── app/
│   ├── [locale]/              # Locale-based routing
│   │   ├── news/              # Blog posts listing
│   │   ├── podcast/           # Podcast episodes
│   │   └── [...slug]/         # Dynamic content pages
│   ├── admin/                 # TinaCMS admin interface
│   └── api/                   # API routes (RSS, etc.)
├── components/
│   ├── blocks/                # Content block components
│   ├── layout/                # Layout components
│   ├── podcast/               # Podcast components
│   ├── post/                  # Blog post components
│   ├── ui/                    # UI primitives
│   ├── magicui/               # Magic UI effects
│   └── motion-primitives/     # Animation primitives
├── content/                   # TinaCMS content (MDX/JSON)
│   ├── authors/               # Author profiles
│   ├── categories/            # Post categories
│   ├── ctas/                  # Call-to-action blocks
│   ├── global/                # Global settings
│   ├── links/                 # Link collections
│   ├── podcasts/              # Podcast episodes
│   ├── posts/                 # Blog posts (MDX)
│   ├── switchbacks/           # Switchback sections
│   └── tags/                  # Content tags
├── tina/
│   ├── config.tsx             # TinaCMS configuration
│   ├── collection/            # Content collection schemas
│   ├── fields/                # Custom field definitions
│   ├── queries/               # GraphQL queries
│   └── __generated__/         # Generated types (gitignored)
├── lib/                       # Utility libraries
├── i18n/                      # i18n configuration
├── scripts/                   # Build scripts
├── public/                    # Static files
│   └── uploads/               # Media uploads
└── openspec/                  # OpenAPI specifications
```

## Local Development

```bash
# Development with TinaCMS (recommended)
pnpm dev

# Development without TinaCMS
pnpm dev:build && next dev

# Build for production
pnpm build

# Build with local TinaCMS (no auth)
pnpm build-local

# Build with public local mode
pnpm build-public

# Format content files
pnpm format:content

# Clean generated files
pnpm clean
```

## TinaCMS Configuration

### Collections

Defined in `tina/collection/`:

- **Post** - Blog posts with rich content blocks
- **Podcast** - Podcast episodes with audio links
- **Author** - Author profiles
- **Category** - Post categories
- **Tag** - Content tags
- **CTA** - Call-to-action blocks
- **Switchback** - Alternating content sections
- **Global** - Site-wide settings
- **Link** - Reusable link collections

### Content Schema

Each collection has:

- TypeScript schema in `tina/collection/*.ts`
- Custom fields in `tina/fields/`
- Generated types in `tina/__generated__/`

### Admin Interface

Access the CMS at `/admin`:

- Visual editing interface
- Media management (uploads to `public/uploads/`)
- Branch switcher for content staging

### Environment Variables

```bash
NEXT_PUBLIC_TINA_CLIENT_ID  # TinaCMS client ID
NEXT_PUBLIC_TINA_BRANCH     # Git branch for content
TINA_TOKEN                  # TinaCMS API token
TINA_SEARCH_INDEXER_TOKEN   # Search indexing token
TINA_PUBLIC_IS_LOCAL        # Set "true" for local mode
```

## Content Authoring

### Blog Posts

Posts are MDX files in `content/posts/`:

```mdx
---
title: Post Title
date: 2024-01-15
author: content/authors/name.json
category: content/categories/tech.json
tags:
  - content/tags/solana.json
heroImage: /uploads/hero.jpg
---

Content here with **markdown** support.
```

### Content Blocks

Posts can include rich content blocks:

- Code blocks with Shiki highlighting
- Embedded tweets (react-tweet)
- Video embeds (react-player)
- Mermaid diagrams
- Custom CTA blocks

### Podcasts

Podcast episodes link to Simplecast:

- `SIMPLECAST_API_KEY` - API access
- `SIMPLECAST_PODCAST_ID` - Podcast identifier

## Key Dependencies (App-Specific)

- `tinacms`, `@tinacms/cli` - CMS framework
- `shiki` - Code syntax highlighting
- `react-tweet` - Twitter/X embeds
- `react-player` - Video playback
- `mermaid` - Diagram rendering
- `feed` - RSS feed generation
- `rss-parser` - RSS parsing
- `motion` - Animations
- `usehooks-ts` - React hooks collection

## API Routes

- `/api/rss` - RSS feed generation
- TinaCMS API routes (auto-generated)

## Build Process

The build script (`scripts/build.sh`) handles:

1. TinaCMS build (generates GraphQL client)
2. Next.js build
3. Conditional local vs cloud mode

## Lint-Staged Configuration

Pre-commit formatting:

- JS/TS files: ESLint + Prettier
- MDX/MD files: Prettier
- JSON/YAML files: Prettier

## Image Handling

- Local uploads: `public/uploads/`
- Remote images allowed from:
  - `assets.tina.io` (TinaCMS media)
  - `res.cloudinary.com`
  - `*.cloudfront.net`
  - `assets.getriver.io`

## Gotchas

1. **Generated Files**: Run `pnpm clean` to clear `tina/__generated__/` if types are stale
2. **Local Mode**: Set `TINA_PUBLIC_IS_LOCAL=true` to bypass authentication
3. **Branch Content**: TinaCMS uses Git branches for content staging
4. **Asset Prefix**: All assets served from `/media-assets/` path
