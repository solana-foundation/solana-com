# Solana.com Monorepo

This is the official Solana Foundation website monorepo, containing multiple
Next.js applications and shared packages deployed on Vercel.

## Monorepo Structure

```
solana-com/
├── apps/
│   ├── web/          # Main website (solana.com) - port 3000
│   ├── docs/         # Developer documentation - port 3003
│   ├── media/        # Blog & news (TinaCMS) - port 3002
│   └── templates/    # Code templates showcase - port 3001
├── packages/
│   ├── config-eslint/       # Shared ESLint configurations
│   ├── config-typescript/   # Shared TypeScript configurations
│   ├── i18n/                # Shared i18n utilities (next-intl)
│   ├── ui/                  # Shared UI components (Radix-based)
│   └── ui-chrome/           # Shared Header, Footer, Theme components
└── turbo/
    └── generators/          # Turborepo generators for scaffolding
```

## Tech Stack

- **Runtime**: Node.js with pnpm 10.15.1 (workspace protocol)
- **Framework**: Next.js 15.5.9 with App Router
- **Language**: TypeScript 5.8.3
- **UI Library**: React 19.1.2
- **Styling**: Tailwind CSS 3.4+ / SCSS / styled-components
- **i18n**: next-intl (20 supported languages)
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
pnpm dev --filter solana-com        # Main website
pnpm dev --filter solana-docs       # Documentation
pnpm dev --filter solana-com-media  # Blog/Media
pnpm dev --filter solana-templates  # Templates

# Build all apps
pnpm build

# Run tests
pnpm test

# Linting
pnpm lint

# Format code
pnpm format:all
pnpm format:check

# Clean build artifacts
pnpm clean
```

## Workspace Dependencies

Apps import shared packages using workspace protocol:

- `@workspace/i18n` - i18n configuration and utilities
- `@workspace/ui` - Shared UI components (Button, Dialog, Accordion, etc.)
- `@solana-com/ui-chrome` - Header, Footer, ThemeProvider, InkeepChatButton
- `@workspace/config-eslint` - ESLint configurations
- `@workspace/config-typescript` - TypeScript configurations

## Internationalization

Supported locales (configured in `packages/i18n/src/config.ts`):

- English (en) - default
- Arabic (ar), Chinese (zh), Dutch (nl), Finnish (fi), French (fr)
- German (de), Greek (el), Hindi (hi), Indonesian (id), Italian (it)
- Japanese (ja), Korean (ko), Polish (pl), Portuguese (pt), Russian (ru)
- Spanish (es), Turkish (tr), Ukrainian (uk), Vietnamese (vi)

All apps use `[locale]` dynamic routing pattern.

## Environment Variables

Key environment variables (defined in `turbo.json`):

- `NEXT_PUBLIC_BUILDER_API_KEY` - Builder.io CMS
- `NEXT_PUBLIC_TINA_CLIENT_ID` / `TINA_TOKEN` - TinaCMS for media app
- `SENTRY_AUTH_TOKEN` - Error tracking
- `SIMPLECAST_API_KEY` / `SIMPLECAST_PODCAST_ID` - Podcast integration
- `YOUTUBE_API_KEY` / `YOUTUBE_CHANNEL_ID` - YouTube integration
- `INKEEP_API_KEY` - AI chat assistant

## Git Hooks (Husky)

Pre-commit hook runs:

1. `pnpm format:check` - Prettier formatting check
2. `pnpm lint` - ESLint across all workspaces

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

- `apps/web/CLAUDE.md` - Main website
- `apps/docs/CLAUDE.md` - Documentation site
- `apps/media/CLAUDE.md` - Blog/Media site
- `apps/templates/CLAUDE.md` - Templates showcase
