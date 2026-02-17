# Solana.com - Main Website

The primary Solana Foundation website serving landing pages, ecosystem
information, events, developer resources, and marketing content.

## Tech Stack

- **Framework**: Next.js 15 (App Router) with TypeScript
- **Styling**: Tailwind CSS, SCSS, styled-components, Bootstrap 5
- **Animation**: Framer Motion, GSAP
- **CMS**: Builder.io for dynamic content and redirects
- **UI**: Radix UI primitives, React Bootstrap, Lucide icons
- **i18n**: next-intl (20 locales)
- **Analytics**: PostHog, Sentry
- **Testing**: Jest + React Testing Library, Playwright (E2E)

## Getting Started

```bash
# From monorepo root
pnpm install
pnpm dev --filter solana-com

# Or from this directory
pnpm dev
```

The app runs on [http://localhost:3000](http://localhost:3000).

### Environment Variables

Copy `.env.example` to `.env.local` and fill in the required values:

```bash
cp .env.example .env.local
```

Key variables:

| Variable                                       | Description                |
| ---------------------------------------------- | -------------------------- |
| `NEXT_PUBLIC_BUILDER_API_KEY`                  | Builder.io CMS API key     |
| `YOUTUBE_API_KEY` / `YOUTUBE_CHANNEL_ID`       | YouTube video integration  |
| `SIMPLECAST_API_KEY` / `SIMPLECAST_PODCAST_ID` | Podcast feed               |
| `LUMA_PRIVATE_API_KEY`                         | Events calendar            |
| `RIVER_KEY`                                    | Newsletter integration     |
| `INKEEP_API_KEY`                               | AI chat assistant          |
| `NEXT_PUBLIC_POSTHOG_KEY`                      | Analytics                  |
| `SENTRY_AUTH_TOKEN`                            | Error tracking source maps |

## Project Structure

```
apps/web/
├── src/
│   ├── app/[locale]/        # Locale-based App Router routes
│   ├── components/          # Page-specific React components
│   ├── component-library/   # Reusable design system components
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility libraries (events, podcast, youtube, etc.)
│   ├── utils/               # Helper functions
│   ├── constants/           # App constants
│   ├── data/                # Static data files
│   ├── i18n/                # i18n configuration
│   ├── scss/                # SCSS stylesheets
│   ├── fonts/               # Custom fonts
│   ├── types/               # TypeScript type definitions
│   └── __tests__/           # Jest tests
├── assets/                  # Static assets organized by section
├── builder/                 # Builder.io integration
├── content/guides/          # MDX guide content
├── e2e/                     # Playwright E2E tests
├── public/                  # Public static files
└── scripts/                 # Build and utility scripts
```

## Routes

All routes are under the `[locale]` dynamic segment for i18n support. Key
sections:

| Route         | Description                 |
| ------------- | --------------------------- |
| `/`           | Homepage                    |
| `/ai`         | AI on Solana                |
| `/breakpoint` | Breakpoint conference       |
| `/branding`   | Brand assets and guidelines |
| `/community`  | Community resources         |
| `/developers` | Developer resources         |
| `/ecosystem`  | Ecosystem directory         |
| `/events`     | Events calendar             |
| `/hackathon`  | Hackathon pages             |
| `/news`       | News aggregation            |
| `/newsletter` | Newsletter signup           |
| `/solutions`  | Solutions by use case       |
| `/staking`    | Staking information         |
| `/validators` | Validator resources         |
| `/wallets`    | Wallet ecosystem            |

## Scripts

```bash
pnpm dev                      # Start development server
pnpm build                    # Production build (8GB memory allocated)
pnpm start                    # Start production server
pnpm test                     # Run Jest tests
pnpm test:e2e                 # Run Playwright E2E tests
pnpm test:e2e:report          # View E2E test report
pnpm lint                     # Run ESLint
pnpm lint:fix                 # Auto-fix lint issues
pnpm i18n:lingo               # Run i18n translation sync
```

## SVG Handling

- `*.inline.svg` — Imported as React components via `@svgr/webpack`
- `*.svg` — Imported as static assets

## Workspace Dependencies

This app imports from shared monorepo packages:

- `@solana-com/ui-chrome` — Header, Footer, ThemeProvider, InkeepChatButton
- `@workspace/ui` — Shared UI components (Button, Dialog, Accordion, etc.)
- `@workspace/i18n` — i18n configuration and utilities

## Build Notes

- Memory allocation set to 8192MB for production builds
- Sentry source maps are uploaded in production only
- Sitemap is generated via `next-sitemap` in the postbuild step
- Bundle analysis available with `ANALYZE=true pnpm build`
