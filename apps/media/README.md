# Solana Media

Solana Media is a Next.js application for publishing news articles and podcasts about Solana. It uses **self-hosted TinaCMS** for content management and is part of the Solana.com monorepo.

## Features

- **News Articles**: Read the latest Solana news and updates at `/news`
- **Podcasts**: Listen to Solana podcasts at `/podcasts`
- **Multi-language Support**: Full i18n support via `@workspace/i18n`
- **Content Management**: Self-hosted TinaCMS with Google OAuth at `/admin`
- **Shared UI**: Uses `@solana-com/ui-chrome` for consistent header/footer

## Self-Hosted TinaCMS

This app uses a **self-hosted TinaCMS backend** instead of TinaCMS Cloud. This provides:

- **Google OAuth authentication** restricted to @solana.org emails
- **GitHub API** for content persistence (commits directly to the `staging` branch)
- **Upstash Redis** for content indexing and fast GraphQL queries
- **Full control** over the CMS infrastructure

### Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           apps/media                                     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐            │
│  │   /admin     │────▶│  Auth.js v4  │────▶│ Google OAuth │            │
│  │   (TinaCMS)  │     │  (auth.ts)   │     │ (@solana.org)│            │
│  └──────────────┘     └──────────────┘     └──────────────┘            │
│         │                                                                │
│         ▼                                                                │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐            │
│  │ /api/tina/gql│────▶│ Tina Database│────▶│ Upstash Redis│            │
│  │  (GraphQL)   │     │ (database.ts)│     │ (indexing)   │            │
│  └──────────────┘     └──────────────┘     └──────────────┘            │
│         │                                                                │
│         ▼                                                                │
│  ┌──────────────┐     ┌──────────────┐                                  │
│  │ GitHubProvider────▶│ GitHub API   │──▶ staging branch               │
│  │ (mutations)  │     │ (@octokit)   │                                  │
│  └──────────────┘     └──────────────┘                                  │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

## Development

### Prerequisites

- Node.js 22+
- pnpm 10+

### Environment Variables

Create a `.env` file in the root of the media app (see `.env.example` for reference):

```bash
# =============================================
# Authentication (Google OAuth via NextAuth)
# =============================================
AUTH_SECRET=           # Generate with: openssl rand -base64 32
AUTH_GOOGLE_ID=        # Google Cloud Console Client ID
AUTH_GOOGLE_SECRET=    # Google Cloud Console Client Secret
AUTH_WHITELIST=        # Comma-separated emails beyond @solana.org

# =============================================
# Upstash Redis (Content Indexing)
# =============================================
KV_REST_API_URL=       # From Upstash Console
KV_REST_API_TOKEN=     # From Upstash Console

# =============================================
# GitHub API (Content Persistence)
# =============================================
GITHUB_PERSONAL_ACCESS_TOKEN=  # PAT with repo scope
GITHUB_REPO_OWNER=solana-foundation
GITHUB_REPO_NAME=solana-com
GITHUB_BRANCH=staging

# =============================================
# Preview Mode
# =============================================
PREVIEW_SECRET=        # Generate with: openssl rand -base64 32

# =============================================
# Local Development Mode
# =============================================
# Set to true to skip authentication and use filesystem
TINA_PUBLIC_IS_LOCAL=true

# =============================================
# Cross-app Navigation
# =============================================
NEXT_PUBLIC_MAIN_SITE_URL=https://solana.com
```

### Running Locally

From the root of the monorepo:

```bash
# Install dependencies
pnpm install

# Initialize the database (indexes content)
pnpm --filter @solana-com-media db:init

# Run media app in development mode (local mode - no auth)
pnpm --filter @solana-com-media dev
```

Or from within the media app directory:

```bash
pnpm dev
```

The app will be available at:

- Frontend: http://localhost:3002
- TinaCMS Admin: http://localhost:3002/admin

### Building

```bash
# Build for production (includes database warm-up)
pnpm build

# Build in local mode (no cloud dependencies)
pnpm build-local

# Build for public deployment (local mode)
pnpm build-public
```

## Content Structure

Content is stored in the `content/` directory:

- `content/posts/` - News articles (MDX)
- `content/podcasts/` - Podcast metadata (MDX)
- `content/authors/` - Author profiles (Markdown)
- `content/tags/` - Tag definitions (MDX)
- `content/categories/` - Category definitions (MDX)
- `content/global/` - Global site settings (JSON)

Podcast episodes are fetched from RSS feeds configured in podcast metadata.

## Routing

All routes are prefixed with locale:

- `/<locale>/news` - News articles listing
- `/<locale>/news/:slug` - Individual article
- `/<locale>/podcasts` - Podcasts listing
- `/<locale>/podcasts/:podcast` - Podcast show page
- `/<locale>/podcasts/:podcast/episodes/:id` - Individual episode
- `/admin` - TinaCMS admin panel (no locale prefix)
- `/admin/login` - Login page for CMS access

## API Routes

Self-hosted Tina CMS provides these API endpoints:

- `/api/auth/*` - NextAuth authentication endpoints
- `/api/tina/gql` - GraphQL endpoint for CMS queries/mutations
- `/api/tina/webhook` - GitHub webhook for re-indexing
- `/api/draft` - Enable preview/draft mode
- `/api/draft/disable` - Exit preview mode

## Architecture

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS v4
- **Content**: Self-hosted TinaCMS + MDX
- **Authentication**: NextAuth v4 with Google OAuth
- **Database**: Upstash Redis (via upstash-redis-level)
- **Persistence**: GitHub API (@octokit/rest)
- **i18n**: next-intl via `@workspace/i18n`
- **UI Components**: Radix UI + `@solana-com/ui-chrome`
- **Fonts**: ABC Diatype (custom web fonts)

## Scripts

- `pnpm dev` - Start development server with TinaCMS
- `pnpm dev:self-hosted` - Start without TinaCMS CLI (for production testing)
- `pnpm build` - Build for production (includes database warm-up)
- `pnpm db:init` - Index content to database
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm lint:fix` - Fix ESLint errors
- `pnpm format` - Format code with Prettier
- `pnpm clean` - Clean node_modules and generated files

## Preview Mode

Editors can preview unpublished content using draft mode:

1. **From the Admin**: Use `Ctrl+Shift+P` to open preview in a new tab
2. **Via URL**: `/api/draft?slug=/en/news/my-post`
3. **Exit Preview**: Click "Exit Preview" button or visit `/api/draft/disable`

## Security

- All CMS routes (`/admin`, `/api/tina`) require authentication
- Only `@solana.org` email addresses can access the CMS
- Additional emails can be whitelisted via `AUTH_WHITELIST`
- Draft mode uses signed tokens with 1-hour expiration
- GitHub webhook supports signature verification
