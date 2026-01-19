# Solana Templates - Code Templates Showcase

> See root `/CLAUDE.md` for monorepo-wide configuration and shared tooling.

## Overview

A showcase site for Solana code templates and starter projects. Provides
browsable templates with filtering, search, and direct links to GitHub
repositories.

**Package name**: `solana-templates` **Default port**: 3001 **Asset prefix**:
`/templates-assets`

## Tech Stack

- **Framework**: Next.js 15 (App Router) with next-intl
- **Styling**: Tailwind CSS 3.4, SCSS, styled-components
- **Animation**: Framer Motion
- **Code Highlighting**: Shiki
- **URL State**: nuqs (type-safe URL search params)
- **UI Components**: Radix UI, React Bootstrap, Lucide icons

## Project Structure

```
apps/templates/
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Root layout (no [locale] wrapper)
│   │   ├── page.tsx           # Homepage
│   │   └── [slug]/            # Template detail pages
│   ├── components/            # React components
│   │   ├── TemplateCard/
│   │   ├── TemplateGrid/
│   │   ├── FilterSidebar/
│   │   └── SearchBar/
│   ├── fonts/                 # Custom fonts
│   ├── i18n/                  # i18n configuration
│   ├── lib/                   # Utility libraries
│   ├── scss/                  # SCSS stylesheets
│   └── types/                 # TypeScript types
├── public/                    # Static files
└── next.config.ts
```

## Local Development

```bash
# From monorepo root
pnpm dev --filter solana-templates

# Or from this directory
pnpm dev

# Type checking
pnpm check-types

# Lint
pnpm lint
pnpm lint:fix
```

## Key Features

### Template Discovery

- Browse Solana starter templates
- Filter by category, framework, difficulty
- Search functionality with URL state persistence

### URL State Management

Uses `nuqs` for type-safe URL search params:

```typescript
import { parseAsString, useQueryState } from "nuqs";

const [search, setSearch] = useQueryState("q", parseAsString);
const [category, setCategory] = useQueryState("category", parseAsString);
```

### Template Data

Templates sourced from `solana-foundation/templates` GitHub repository:

- Images from `raw.githubusercontent.com/solana-foundation/templates/**`
- Metadata and descriptions

## Key Dependencies (App-Specific)

- `nuqs` - URL search params state management
- `shiki` - Code syntax highlighting
- `marked` - Markdown parsing
- `framer-motion` - Animations
- `@inkeep/cxkit-react` - AI chat assistant
- `@workspace/ui` - Shared UI components

## Routing

Unlike other apps, templates uses simpler routing:

- No `[locale]` dynamic segment in most routes
- i18n handled via next-intl plugin
- Template detail pages: `/[slug]`

## Image Configuration

Allowed remote image sources:

- `raw.githubusercontent.com/solana-foundation/templates/**` - Template
  screenshots
- `placehold.co` - Placeholder images

## Environment Variables

- `TEMPLATES_APP_URL` - Base URL for the templates app
- Standard shared env vars from root turbo.json

## Build Configuration

- Asset prefix: `/templates-assets` for Vercel multi-project setup
- styled-components compiler enabled
- External workspace packages transpiled via `experimental.externalDir`

## Styling

Combines multiple styling approaches:

- Tailwind CSS for utility classes
- SCSS for custom styles
- styled-components for component styles
- Bootstrap utilities via react-bootstrap

## Conventions

1. **Components**: Functional components with TypeScript
2. **State**: URL state for filters/search (shareable links)
3. **Data**: Templates metadata fetched from GitHub API
4. **Images**: Optimized via Next.js Image from GitHub raw URLs
