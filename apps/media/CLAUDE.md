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

The Solana blog and media site, powered by Keystatic for content management. Includes blog posts, podcasts, and marketing content with a visual CMS editing experience.

**Package name**: `solana-com-media`
**Default port**: 3002
**Asset prefix**: `/media-assets`

## Tech Stack

- **Framework**: Next.js 15 (App Router) with next-intl
- **CMS**: Keystatic (Git-backed headless CMS)
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
│   ├── admin/                 # Legacy admin interface
│   ├── keystatic/             # Keystatic admin interface
│   └── api/                   # API routes (RSS, etc.)
├── components/
│   ├── blocks/                # Content block components
│   ├── layout/                # Layout components
│   ├── podcast/               # Podcast components
│   ├── post/                  # Blog post components
│   ├── ui/                    # UI primitives
│   ├── magicui/               # Magic UI effects
│   └── motion-primitives/     # Animation primitives
├── content/                   # Keystatic content (MDX/JSON)
│   ├── authors/               # Author profiles
│   ├── categories/            # Post categories
│   ├── ctas/                  # Call-to-action blocks
│   ├── global/                # Global settings
│   ├── links/                 # Link collections
│   ├── podcasts/              # Podcast episodes
│   ├── posts/                 # Blog posts (MDX)
│   ├── switchbacks/           # Switchback sections
│   └── tags/                  # Content tags
├── keystatic.config.tsx       # Keystatic configuration
├── lib/                       # Utility libraries
│   └── keystatic/             # Keystatic component blocks
├── i18n/                      # i18n configuration
├── scripts/                   # Build scripts
├── public/                    # Static files
│   └── uploads/               # Media uploads
└── openspec/                  # OpenAPI specifications
```

## Local Development

```bash
# Development
pnpm dev

# Build for production
pnpm build

# Format content files
pnpm format:content

# Clean generated files
pnpm clean
```

## Keystatic Configuration

### Collections

Defined in `keystatic.config.tsx`:

- **Post** - Blog posts with rich content blocks
- **Podcast** - Podcast episodes with audio links
- **Author** - Author profiles
- **Category** - Post categories
- **Tag** - Content tags
- **CTA** - Call-to-action blocks
- **Switchback** - Alternating content sections
- **Link** - Reusable link collections

### Singletons

- **Global** - Site-wide settings

### Admin Interface

Access the CMS at `/keystatic`:

- Visual editing interface
- Media management (uploads to `public/uploads/`)
- GitHub mode for production, local mode for development

### Environment Variables

```bash
KEYSTATIC_LOCAL              # Set "true" for local mode (filesystem storage)
KEYSTATIC_GITHUB_CLIENT_ID   # GitHub OAuth client ID (production)
KEYSTATIC_GITHUB_CLIENT_SECRET # GitHub OAuth client secret (production)
KEYSTATIC_SECRET             # Session signing secret (production)
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

- `@keystatic/core`, `@keystatic/next` - CMS framework
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
- Keystatic API routes (auto-generated via `@keystatic/next`)

## Build Process

The build runs:

1. Next.js build (includes Keystatic)
2. Conditional local vs GitHub mode based on `KEYSTATIC_LOCAL`

## Lint-Staged Configuration

Pre-commit formatting:

- JS/TS files: ESLint + Prettier
- MDX/MD files: Prettier
- JSON/YAML files: Prettier

## Image Handling

- Local uploads: `public/uploads/`
- Remote images allowed from:
  - `res.cloudinary.com`
  - `*.cloudfront.net`
  - `assets.getriver.io`

## Gotchas

1. **Local Mode**: Set `KEYSTATIC_LOCAL=true` to use filesystem storage (no GitHub auth needed)
2. **GitHub Mode**: Requires `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`, and `KEYSTATIC_SECRET`
3. **Asset Prefix**: All assets served from `/media-assets/` path
