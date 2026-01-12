# Solana Media

Solana Media is a Next.js application for publishing news articles and podcasts about Solana. It uses TinaCMS for content management and is part of the Solana.com monorepo.

## Features

- **News Articles**: Read the latest Solana news and updates at `/news`
- **Podcasts**: Listen to Solana podcasts at `/podcasts`
- **Multi-language Support**: Full i18n support via `@workspace/i18n`
- **Content Management**: TinaCMS-powered content editing at `/admin`
- **Shared UI**: Uses `@solana-com/ui-chrome` for consistent header/footer

## Development

### Prerequisites

- Node.js 22+
- pnpm 10+

### Environment Variables

Create a `.env` file in the root of the media app (see `.env.example` for reference):

```bash
# TinaCMS Cloud (optional - use local mode if not set)
NEXT_PUBLIC_TINA_CLIENT_ID=your_client_id
TINA_TOKEN=your_token
NEXT_PUBLIC_TINA_BRANCH=staging
TINA_SEARCH_INDEXER_TOKEN=your_indexer_token

# Or use local mode (no cloud)
TINA_PUBLIC_IS_LOCAL=true

# Cross-app navigation (IMPORTANT for production deployments)
# Set this to the main site URL so header/footer links navigate correctly
# Production: https://solana.com
# Preview: https://solana-com-git-[branch].vercel.app
# Local dev: http://localhost:3000 (leave unset if web app runs on port 3000)
NEXT_PUBLIC_MAIN_SITE_URL=https://solana.com
```

#### `NEXT_PUBLIC_MAIN_SITE_URL` (Required for Separate Deployments)

When the media app is deployed separately from the main site (e.g., on its own Vercel project), this environment variable **must** be set to ensure header and footer navigation links correctly route to the main site for non-media routes (like `/developers`, `/docs`, `/learn`, etc.).

- **Why it's needed**: The shared `@solana-com/ui-chrome` header/footer components include links to various sections of solana.com. Without this variable, those links will try to route within the media app where those pages don't exist.
- **Local development**: If you're running the web app on port 3000 and media app on port 3001, set this to `http://localhost:3000`
- **Production**: Set to `https://solana.com`
- **Preview deployments**: Set to your preview deployment URL

### Running Locally

From the root of the monorepo:

```bash
# Install dependencies
pnpm install

# Run media app in development mode
pnpm --filter @solana-com-media dev
```

Or from within the media app directory:

```bash
pnpm dev
```

The app will be available at:

- Frontend: http://localhost:3000
- TinaCMS Admin: http://localhost:3000/admin

### Building

```bash
# Build for production
pnpm build

# Build in local mode (no TinaCMS cloud)
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

## Architecture

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS v4
- **Content**: TinaCMS + MDX
- **i18n**: next-intl via `@workspace/i18n`
- **UI Components**: Radix UI + `@solana-com/ui-chrome`
- **Fonts**: ABC Diatype (custom web fonts)

## Scripts

- `pnpm dev` - Start development server with TinaCMS
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm lint:fix` - Fix ESLint errors
- `pnpm format` - Format code with Prettier
- `pnpm clean` - Clean node_modules and generated files
