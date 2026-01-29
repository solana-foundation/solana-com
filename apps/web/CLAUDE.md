# Solana.com - Main Website

> See root `/CLAUDE.md` for monorepo-wide configuration and shared tooling.

## Overview

The main Solana website (`solana.com`) serving landing pages, ecosystem
information, events, news aggregation, and marketing content.

**Package name**: `solana-com` **Default port**: 3000

## Tech Stack

- **Framework**: Next.js 15 (App Router) with next-intl
- **Styling**: Tailwind CSS, SCSS, styled-components, Bootstrap 5
- **Animation**: Framer Motion, GSAP
- **CMS**: Builder.io for dynamic content and redirects
- **UI Components**: Radix UI primitives, React Bootstrap
- **Testing**: Jest + React Testing Library
- **Icons**: Lucide React, React Feather

## Project Structure

```
apps/web/
├── src/
│   ├── app/
│   │   └── [locale]/          # Locale-based routing
│   │       ├── (home)/        # Homepage routes
│   │       ├── ai/            # AI-related pages
│   │       ├── breakpoint/    # Breakpoint conference
│   │       ├── branding/      # Brand assets
│   │       ├── developers/    # Developer resources
│   │       ├── ecosystem/     # Ecosystem directory
│   │       ├── events/        # Events calendar
│   │       ├── news/          # News aggregation
│   │       ├── solutions/     # Solutions pages
│   │       └── x402/          # X402 special section
│   ├── components/            # React components
│   ├── component-library/     # Design system components
│   ├── constants/             # App constants
│   ├── data/                  # Static data files
│   ├── hooks/                 # Custom React hooks
│   ├── i18n/                  # i18n configuration
│   ├── lib/                   # Utility libraries
│   ├── pages/                 # Legacy pages (being migrated)
│   ├── scss/                  # SCSS stylesheets
│   ├── types/                 # TypeScript types
│   └── utils/                 # Helper utilities
├── assets/                    # Static assets by section
├── content/guides/            # MDX guide content
├── public/                    # Public static files
└── __tests__/                 # Jest tests
```

## Local Development

```bash
# From monorepo root
pnpm dev --filter solana-com

# Or from this directory
pnpm dev

# Run tests
pnpm test

# Lint
pnpm lint
pnpm lint:fix

# Analyze bundle
ANALYZE=true pnpm build
```

## Key Integrations

### Builder.io CMS

- Dynamic page content
- URL redirects management (fetched at build time)
- API Key: `NEXT_PUBLIC_BUILDER_API_KEY`

### External APIs

- **Luma** - Events calendar (`LUMA_PRIVATE_API_KEY`)
- **YouTube** - Video content (`YOUTUBE_API_KEY`, `YOUTUBE_CHANNEL_ID`)
- **River** - Newsletter integration (`RIVER_KEY`)
- **Inkeep** - AI chat assistant (`INKEEP_API_KEY`)

### PostHog Analytics

- Client-side analytics via `posthog-js`

## SVG Handling

- `*.inline.svg` - Imported as React components via @svgr/webpack
- `*.svg` - Imported as static assets

## Routing Patterns

- All routes are under `[locale]` for i18n support
- Uses Next.js App Router with layouts and route groups
- Rewrites and redirects managed in `rewrites-redirects.mjs` + Builder.io

## Key Dependencies (App-Specific)

- `@builder.io/react` - Builder.io CMS integration
- `@typeform/embed` - Typeform embeds
- `gsap` - GreenSock animations (transpiled via next.config)
- `react-slick` / `slick-carousel` - Carousels
- `react-player` - Video playback
- `react-countup` - Animated counters
- `swr` - Data fetching with caching
- `unicornstudio-react` - Interactive backgrounds

## Build Configuration

- Memory allocation: 8192MB for builds
- Sentry source maps uploaded in production only
- Sitemap generated via `next-sitemap` postbuild

## Testing

```bash
pnpm test          # Run all tests
pnpm test:watch    # Watch mode
```

Tests located in `src/__tests__/` using Jest and React Testing Library.

<!-- OPENSPEC:START -->

# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `@/openspec/AGENTS.md` when the request:

- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big
  performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/openspec/AGENTS.md` to learn:

- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.

<!-- OPENSPEC:END -->
