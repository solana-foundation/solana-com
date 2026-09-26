# Solana Docs - Developer Documentation

> See root `/CLAUDE.md` for monorepo-wide configuration and shared tooling.

## Overview

The Solana developer documentation site, providing comprehensive guides, API
references, cookbook recipes, and learning resources for building on Solana.

**Package name**: `solana-docs` **Default port**: 3003 **Asset prefix**:
`/docs-assets`

## Tech Stack

- **Framework**: Next.js 15 (App Router) with next-intl
- **Documentation**: Fumadocs (MDX-based documentation framework)
- **Code Highlighting**: CodeHike for advanced code blocks
- **Diagrams**: Mermaid for flowcharts and diagrams
- **Styling**: Tailwind CSS, SCSS
- **AI Integration**: Vercel AI SDK with OpenAI
- **UI Components**: Radix UI primitives, Fumadocs UI

## Project Structure

```
apps/docs/
├── src/
│   ├── app/
│   │   └── [locale]/
│   │       ├── developers/
│   │       │   ├── cookbook/     # Code recipes
│   │       │   └── bootcamp/     # Developer learning tracks
│   │       ├── learn/             # General learning content
│   │       └── docs/
│   │           ├── (main)/       # Core documentation
│   │           └── rpc/          # RPC API reference
│   ├── components/               # React components
│   ├── constants/                # App constants
│   ├── hooks/                    # Custom React hooks
│   ├── i18n/                     # i18n configuration
│   ├── lib/                      # Utility libraries
│   ├── markdown/                 # MDX processing utilities
│   ├── scss/                     # SCSS stylesheets
│   ├── types/                    # TypeScript types
│   └── utils/                    # Helper utilities
├── content/
│   ├── cookbook/                 # Cookbook MDX files
│   │   ├── accounts/
│   │   ├── development/
│   │   ├── tokens/
│   │   ├── transactions/
│   │   └── wallets/
│   ├── docs/                     # Main docs (localized)
│   │   ├── en/                   # English docs
│   │   ├── ar/, de/, es/...      # Translated docs
│   ├── learn/                    # General learning content
│   └── developers-learn/         # Bootcamp companion content
├── assets/                       # Static assets
└── public/                       # Public files
```

## Local Development

```bash
# From monorepo root
pnpm dev --filter solana-docs

# Or from this directory
pnpm dev

# Regenerate MDX sources (after content changes)
pnpm postinstall  # Runs fumadocs-mdx

# Lint
pnpm lint
pnpm lint:fix

# Analyze bundle
ANALYZE=true pnpm build
```

## Content Structure

### Fumadocs MDX

Content is organized using Fumadocs conventions:

- Files in `content/` are processed by `fumadocs-mdx`
- Generated source maps stored in `.source/` (gitignored)
- Supports frontmatter for metadata

### Content Categories

1. **Docs** (`/docs/*`) - Core Solana documentation
   - Core concepts (accounts, transactions, programs)
   - Client libraries (JavaScript, Rust, Python)
   - RPC API reference
   - Staking documentation

2. **Cookbook** (`/developers/cookbook/*`) - Code recipes
   - Accounts management
   - Token operations
   - Transaction handling
   - Wallet integration

3. **Learn** (`/learn/*`) - General Solana learning resources

4. **Developer bootcamp** (`/developers/bootcamp/*`) - Structured learning
   tracks and companion material

### Localization

Documentation is translated into multiple languages:

- Content stored in `content/docs/{locale}/`
- Uses next-intl for routing
- English (en) is the source language

## Key Features

### CodeHike Integration

Advanced code blocks with:

- Syntax highlighting
- Line highlighting
- Code annotations
- File tabs

### Mermaid Diagrams

Flowcharts and sequence diagrams rendered from markdown.

### AI Chat (Vercel AI SDK)

- OpenAI integration for documentation search
- Configured via `@ai-sdk/openai`

## Key Dependencies (App-Specific)

- `fumadocs-core`, `fumadocs-mdx`, `fumadocs-ui` - Documentation framework
- `codehike` - Advanced code blocks
- `mermaid` - Diagram rendering
- `ai`, `@ai-sdk/openai` - AI integration
- `@boxicons/react` - UI and file type icons
- `svg-pan-zoom` - Zoomable diagrams
- `zod` - Schema validation

## API Routes

The `src/app/api/markdown/[...slug]` route serves Markdown representations of
documentation pages. Inkeep feedback uses a server action under
`src/app/components/inkeep/`.

## Build Configuration

- Asset prefix: `/docs-assets` for Vercel multi-project deployment
- Memory allocation: 4096MB for builds
- Sentry integration for error tracking
- Fumadocs MDX processing runs on postinstall

## Content Conventions

### MDX Frontmatter

```yaml
---
title: Page Title
description: Page description
sidebarLabel: Sidebar Label (optional)
sidebarSortOrder: 1 (optional)
---
```

### Code Blocks

Use CodeHike syntax for enhanced code blocks:

````mdx
```ts title="example.ts" {1,3-5}
// highlighted lines
```
````

```

### Cross-References
Link to other docs using relative paths or Fumadocs link syntax.
```

### Video Content

- `<Embed url="...">` — a single YouTube video or a whole playlist
  (`youtube.com/playlist?list=...` or any URL with a `list=` param). Prefer this
  over a hand-written `<iframe>`; it renders through one shared component
  (`youtube-nocookie.com`, lazy thumbnail for single videos).
- `<VideoChapterList chapters={[{title, href, subtext?}]} label="Chapter">` — a
  sequential course/roadmap, numbered in order. Use for content where watch
  order matters.
- `<ProjectCardGrid projects={[{title, href}]}>` — a set of independent,
  unordered items (projects, demos). Use when order doesn't matter.
- Both list components also accept a `playlistId` instead of a static array,
  fetching the real playlist via `YOUTUBE_API_KEY`
  (`src/components/shared/playlist-to-chapters.ts`) so it stays in sync with
  YouTube automatically. Prefer this over hand-transcribing a playlist's videos;
  fall back to a static array only when you need per-item `subtext` or a curated
  subset/order the playlist itself doesn't have.
- Omit `href` (don't use `"#"`) to mark a chapter/project as not yet linked — it
  renders as a non-interactive placeholder card instead of a dead link.

### Sidebar Section Headers

The "Start here" sidebar tree (`src/app/[locale]/docs/(main)/main-page-tree.ts`)
turns each `"---Label---"` separator in `content/docs/en/meta.json` into a
collapsible section header (see `groupIntoSections` and
`docs-sidebar-page-tree.tsx`) — fumadocs' own separators are plain,
non-collapsible text. To add a new top-level sidebar group, add a
`"---Label---"` entry to that meta.json; no code changes are needed. This only
affects the "Start here" tab — other tabs (Resources, RPC, etc.) use fumadocs'
plain separators unchanged.

Use `"---:Label---"` (leading colon) instead to add a plain, non-collapsible
sub-divider _inside_ the currently-open group — it clusters a few items visually
without giving them their own collapse toggle. Example: "Video Guides" is one
collapsible group containing three plain sub-dividers ("Full Learning Paths",
"Hardware & DePIN", "More Video Content") rather than three separate top-level
groups.
