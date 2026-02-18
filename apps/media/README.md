# Solana Media

Solana Media is a Next.js application for publishing news articles and podcasts about Solana. It uses Keystatic for content management and is part of the Solana.com monorepo.

## Features

- **News Articles**: Read the latest Solana news and updates at `/news`
- **Podcasts**: Listen to Solana podcasts at `/podcasts`
- **Multi-language Support**: Full i18n support via `@workspace/i18n`
- **Content Management**: Keystatic-powered content editing at `/keystatic`
- **Shared UI**: Uses `@solana-com/ui-chrome` for consistent header/footer

## Development

### Prerequisites

- Node.js 22+
- pnpm 10+

### Environment Variables

Create a `.env` file in the root of the media app (see `.env.example` for reference):

```bash
# Keystatic local mode (uses filesystem storage, no GitHub auth needed)
KEYSTATIC_LOCAL=true

# Or use GitHub mode (production)
KEYSTATIC_GITHUB_CLIENT_ID=your_client_id
KEYSTATIC_GITHUB_CLIENT_SECRET=your_client_secret
KEYSTATIC_SECRET=your_random_secret
```

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

- Frontend: http://localhost:3002
- Keystatic Admin: http://localhost:3002/keystatic

### Building

```bash
# Build for production
pnpm build
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
- `/keystatic` - Keystatic admin panel (no locale prefix)

## Architecture

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS v4
- **Content**: Keystatic + MDX
- **i18n**: next-intl via `@workspace/i18n`
- **UI Components**: Radix UI + `@solana-com/ui-chrome`
- **Fonts**: ABC Diatype (custom web fonts)

## Header Navigation

The shared header uses `NEXT_PUBLIC_APP_NAME` (set to `"media"` in
`next.config.ts`) to determine link behavior:

- Links to `/news/*` and `/podcasts/*` use Next.js Link (client navigation)
- Links to other routes (e.g., `/docs`, `/validators`) use `<a>` tags (full page
  load back through the proxy)

See `packages/ui-chrome/src/url-config.ts` for the routing logic.

## Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm lint:fix` - Fix ESLint errors
- `pnpm format` - Format code with Prettier
- `pnpm clean` - Clean node_modules and generated files
