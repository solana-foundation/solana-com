# Project Context

## Purpose

Solana Media is a Next.js-based content management and distribution platform for publishing news articles and podcasts about the Solana blockchain ecosystem. It's part of a monorepo architecture where the media app (`solana-com-media.vercel.app`) is deployed separately and proxied through the main Solana.com website via Next.js rewrites.

**Key Features:**

- News articles publishing at `/news`
- Podcast management and distribution at `/podcasts`
- Multi-language support (i18n) via `@workspace/i18n`
- TinaCMS-powered content management with admin panel at `/admin`
- RSS feed integration for podcast episodes
- SEO optimization with metadata management

## Tech Stack

### Core Framework

- **Next.js 15** with App Router (React Server Components)
- **React 19** with Next.js catalog versions
- **TypeScript 5.8** (strict mode disabled)

### Content & CMS

- **TinaCMS 2.8** - Headless CMS for content management
- **MDX** - Markdown with JSX for content
- **RSS Parser** - For podcast episode fetching

### Styling & UI

- **Tailwind CSS 4** with custom plugins
- **Radix UI** components
- **shadcn/ui** pattern (components.json configured)
- **ABC Diatype** custom web fonts via Next.js local fonts
- **CSS Variables** for theming with dark mode support

### Internationalization

- **next-intl** for i18n routing and translations
- **RTL Detect** for language direction detection

### Shared Packages (Monorepo)

- `@solana-com/ui-chrome` - Shared header/footer component
- `@workspace/i18n` - Centralized i18n configuration
- `@workspace/config-typescript` - Shared TypeScript config

### Monitoring & Analytics

- **Sentry** for error tracking
- **Google Tag Manager** (GTM-TNX63HZ)
- **Google Analytics** (G-94WS0LRZRS)

### Development Tools

- **pnpm 10** - Package manager
- **Turbo** - Monorepo task runner
- **ESLint 9** with MDX plugin support
- **Prettier** - Code formatter
- **Husky & lint-staged** - Git hooks for pre-commit checks

## Project Conventions

### Code Style

**Prettier Configuration:**

- Print width: 80 (100 for MDX files)
- Tab width: 2 spaces
- Trailing commas: ES5 style
- Double quotes
- Semicolons enabled
- Prose wrap: Preserve (for MDX)

**ESLint:**

- Extends `next/core-web-vitals` and `prettier`
- Includes `eslint-plugin-mdx` for linting MDX files
- Disabled rules: `react/no-unescaped-entities`, `@next/next/no-img-element`

**TypeScript:**

- Strict mode disabled
- Path aliases: `@/*` and `@@/*` map to root directory
- Incremental compilation enabled

### Architecture Patterns

**Directory Structure:**

```
app/                    # Next.js App Router
├── [locale]/          # Locale-prefixed routes
│   ├── news/          # News articles
│   ├── podcasts/      # Podcast management
│   └── layout.tsx     # Root locale layout
├── api/               # API routes
└── admin/             # TinaCMS admin panel
components/            # React components
├── ui/                # Radix/shadcn UI components
├── blocks/            # Content block components
├── podcast/           # Podcast-specific components
├── post/              # Post-specific components
└── layout/            # Layout components
lib/                   # Business logic and utilities
content/               # Content files (managed by TinaCMS)
tina/                  # TinaCMS configuration
├── collection/        # Content collection schemas
├── fields/            # Reusable field definitions
└── queries/           # GraphQL queries
```

**Server/Client Component Split:**

- Page components are server components (async)
- Client pages (e.g., `client-page.tsx`) handle interactivity
- Pattern: Server fetches data → passes to client component

**Data Fetching:**

- Server-side fetching from TinaCMS via generated client
- RSS feed caching with custom logic
- ISR (Incremental Static Regeneration):
  - News listing: 300 seconds
  - Podcasts: 1800 seconds (30 minutes)

**Component Composition:**

- shadcn/ui pattern with CVA (class-variance-authority)
- Radix UI for accessible primitives
- TinaCMS Markdown renderer with custom components

### Testing Strategy

No formal test suite is currently implemented. Testing relies on manual testing and type checking.

### Git Workflow

- Pre-commit hooks via Husky enforce linting and formatting
- lint-staged runs on modified files only
- Main branch: `main`
- Feature branches: `feat/*`, `fix/*`, etc.

## Domain Context

**Solana Ecosystem:**

- Content focused on blockchain, DeFi, NFTs, Web3 innovation
- Multi-language support for global audience
- Integration with Solana.com main site via rewrites
- Shared branding via `@solana-com/ui-chrome`

**Content Types:**

- **Posts**: News articles with featured posts, categories, tags, authors
- **Podcasts**: Show definitions with RSS-based episode management
- **Authors**: Profile information and credentials
- **Categories/Tags**: Content organization and filtering
- **CTAs**: Call-to-action blocks for engagement

**Data Relationships:**

- Posts linked to: authors, tags, categories, CTAs
- Podcasts linked to: categories, tags, hosts, episodes via RSS

## Important Constraints

- **Locale Routing**: All public routes must be prefixed with `[locale]`
- **Admin Routes**: Exempt from locale prefixing
- **Asset Prefix**: Static assets served from `/media-assets`
- **Image Sources**: Must be whitelisted in `next.config.ts` (Tina assets, Cloudinary, CloudFront, River)
- **TypeScript Strict Mode**: Disabled - be mindful of null/undefined handling

## External Dependencies

**Content Delivery:**

- **TinaCMS Cloud**: Optional (can run local mode)
  - Environment variables: `NEXT_PUBLIC_TINA_CLIENT_ID`, `TINA_TOKEN`, `NEXT_PUBLIC_TINA_BRANCH`
- **RSS Feeds**: External podcast episode sources
- **Image CDNs**: Cloudinary, CloudFront

**Deployment:**

- **Vercel**: Primary deployment platform
  - Project: `solana-com-media`
  - Build command includes Turbo filtering for monorepo

**Key Configuration Files:**

- `next.config.ts` - Next.js configuration
- `tina/config.tsx` - CMS configuration
- `lib/config.ts` - Site metadata and settings
- `middleware.ts` - Request routing logic
