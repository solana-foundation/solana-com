# Solana.com Monorepo

This is the official Solana Foundation website monorepo, containing multiple
Next.js applications and shared packages deployed on Vercel.

## Monorepo Structure

```
solana-com/
├── apps/
│   ├── accelerate/   # Solana Accelerate conference - port 3004
│   ├── web/          # Main website (solana.com) - port 3000
│   ├── docs/         # Developer documentation - port 3003
│   ├── media/        # Blog & news (Keystatic) - port 3002
│   ├── templates/    # Code templates showcase - port 3001
│   └── breakpoint/   # Breakpoint event microsite - port 3005
├── packages/
│   ├── config-eslint/       # Shared ESLint configurations
│   ├── config-typescript/   # Shared TypeScript configurations
│   ├── docs-examples/       # Tested cookbook source snippets
│   ├── ecosystem-data/      # Shared company and logo registry
│   ├── fab-menu/            # Reusable Solana property menu
│   ├── i18n/                # Shared i18n utilities (next-intl)
│   ├── sentry/              # Shared Sentry helpers
│   ├── sitemap/             # Shared sitemap generation helpers
│   ├── ui/                  # Shared UI components (Radix-based)
│   └── ui-chrome/           # Shared Header, Footer, Theme components
└── turbo/
    └── generators/          # Turborepo generators for scaffolding
```

## Tech Stack

- **Runtime**: Node.js 24 with pnpm 11.13.1 (workspace protocol)
- **Framework**: Next.js 15.5.21 with App Router
- **Language**: TypeScript 5.8.3
- **UI Library**: React 19.2.6
- **Styling**: Tailwind CSS 3.4+ / SCSS
- **i18n**: next-intl (19 supported languages)
- **Build System**: Turborepo for monorepo orchestration
- **Deployment**: Vercel (multi-project setup with rewrites)
- **Error Tracking**: Sentry
- **Analytics**: PostHog

## Development Commands

```bash
# Install dependencies
pnpm install

# Development (all apps)
pnpm dev

# Development (specific app)
pnpm dev --filter solana-com              # Main website
pnpm dev --filter solana-docs             # Documentation
pnpm dev --filter solana-com-media        # Blog/Media
pnpm dev --filter solana-templates        # Templates
pnpm dev --filter solana-com-accelerate   # Accelerate conference
pnpm dev --filter solana-com-breakpoint   # Breakpoint conference

# Build all apps
pnpm build

# Run tests
pnpm test

# Linting
pnpm lint

# Type checking
pnpm check-types

# Clean build artifacts
pnpm clean
```

## Workspace Dependencies

Apps use shared packages through the workspace or, for docs examples, by reading
their source files during the build:

- `@workspace/i18n` - i18n configuration and utilities
- `@workspace/ui` - Shared UI components (Button, Dialog, Accordion, etc.)
- `@solana-com/ui-chrome` - Header, Footer, ThemeProvider, InkeepChatButton
- `@workspace/ecosystem-data` - Canonical company metadata and logos
- `@workspace/sentry` - Shared Sentry configuration helpers
- `@workspace/docs-examples` - Tested code embedded in cookbook pages
- `@workspace/config-eslint` - ESLint configurations
- `@workspace/config-typescript` - TypeScript configurations

## Internationalization

Supported locales (configured in `packages/i18n/src/config.ts`):

- English (en) - default
- Arabic (ar), Chinese (zh), Dutch (nl), Finnish (fi), French (fr)
- German (de), Greek (el), Indonesian (id), Italian (it)
- Japanese (ja), Korean (ko), Polish (pl), Portuguese (pt), Russian (ru)
- Spanish (es), Turkish (tr), Ukrainian (uk), Vietnamese (vi)

Most apps use a `[locale]` dynamic routing pattern. The templates app keeps its
public `/developers/templates` routes unprefixed and uses `next-intl` without a
locale path segment.

## Environment Variables

Key environment variables (defined in `turbo.json`):

- `KEYSTATIC_GITHUB_CLIENT_ID` / `KEYSTATIC_GITHUB_CLIENT_SECRET` /
  `KEYSTATIC_SECRET` - Keystatic for media app
- `SENTRY_AUTH_TOKEN` - Error tracking
- `SIMPLECAST_API_KEY` / `SIMPLECAST_PODCAST_ID` - Podcast integration
- `YOUTUBE_API_KEY` / `YOUTUBE_CHANNEL_ID` - YouTube integration
- `INKEEP_API_KEY` - AI chat assistant

## Git Hooks (Husky)

The pre-commit hook runs `lint-staged`, which applies ESLint and Prettier to
staged files and checks staged media images. It also runs `gitleaks` when that
binary is installed; CI performs the authoritative secrets scan.

## Code Conventions

- Use TypeScript strict mode
- Prefer functional React components with hooks
- Use Radix UI primitives for accessible components
- CSS: Prefer Tailwind utilities, use SCSS for complex styles
- Import shared components from workspace packages, not relative paths
- SVG handling: Use `.inline.svg` suffix for React components, regular `.svg`
  for assets

## PR Guidelines

PRs should include:

1. Problem description
2. Summary of changes
3. Reference to related issues (`Fixes #...`)

## Sub-app Documentation

Each app has its own CLAUDE.md with app-specific details:

- `apps/accelerate/CLAUDE.md` - Accelerate conference site
- `apps/web/CLAUDE.md` - Main website
- `apps/docs/CLAUDE.md` - Documentation site
- `apps/media/CLAUDE.md` - Blog/Media site
- `apps/templates/CLAUDE.md` - Templates showcase
- `apps/breakpoint/CLAUDE.md` - Breakpoint event site
