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
