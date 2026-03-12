# Project Context

## Purpose
The solana.com monorepo powers the Solana Foundation website, including the main
marketing site, developer documentation, news/podcasts, and templates
showcase. The goal is a unified, localized public site delivered through a
multi-app Next.js architecture behind `solana.com`.

## Tech Stack
- Node.js 22+ with pnpm 10.15.1 workspaces and Turborepo
- Next.js 15 (App Router) with React 19 and TypeScript 5.8
- Styling: Tailwind CSS, SCSS, styled-components; Radix UI primitives
- i18n: `next-intl` via `@workspace/i18n`
- Content: MDX, Fumadocs (docs), Builder.io (marketing/news), TinaCMS (media)
- Deployment/ops: Vercel, Sentry, PostHog

## Project Conventions

### Code Style
- TypeScript-first, functional React components with hooks
- ESLint + Prettier; Husky pre-commit runs `pnpm format:check` and `pnpm lint`
- Prefer Tailwind utilities; use SCSS for complex layouts
- Use shared workspace packages (`@workspace/*`, `@solana-com/ui-chrome`)
- SVGs: `.inline.svg` for React components, plain `.svg` for assets

### Architecture Patterns
- Multi-app monorepo (`apps/web`, `apps/docs`, `apps/media`, `apps/templates`)
- `apps/web` proxies routes to other apps via Next.js rewrites
- Proxied apps use `assetPrefix` and asset rewrites for static assets
- Locale-first routing (`/[locale]/...`) and shared translations in
  `public/locales/{locale}/common.json`

### Testing Strategy
- Jest + React Testing Library (web app), run via `pnpm test` (Turbo)
- Lint/format are expected before PRs (`pnpm lint`, `pnpm format:check`)

### Git Workflow
- PR-based workflow; include problem description, change summary, and issue
  reference where applicable (see `apps/web/CONTRIBUTING.md`)
- Pre-commit hooks enforce formatting and linting

## Domain Context
- Public content should avoid "official recommendations" and "favorites";
  list multiple options when referencing ecosystem products or services
- Developer docs live in `/content` and use Fumadocs conventions
- News and many landing pages use Builder.io; media app content is in MDX

## Important Constraints
- Proxy-only routing: all apps are served through `solana.com` via rewrites
- Keep web app rewrites and app `assetPrefix` settings in sync
- Base language is English; translations are generated via lingo.dev

## External Dependencies
- Vercel multi-project deployment with related projects
- Builder.io (marketing/news content), TinaCMS (media admin)
- Sentry (error tracking), PostHog (analytics), Inkeep (chat)
- Simplecast + YouTube APIs for podcasts/video integrations
