# Solana Templates App

Standalone Next.js application for the Solana developer templates showcase.

## Development

Start the development server:

```bash
pnpm --filter solana-templates dev
```

The app runs on port 3001 by default.

## Build

Build for production:

```bash
pnpm --filter solana-templates build
```

## Type Checking

Check TypeScript types:

```bash
pnpm --filter solana-templates check-types
```

## Deployment

This app is deployed at
**[templates.solana.com](https://templates.solana.com)**.

The app is designed to be deployed separately from the main solana.com website.
The main site rewrites `/templates` routes to this app's deployment URL via
Next.js rewrites configuration.

To enable the rewrite in production, set the `TEMPLATES_APP_URL` environment
variable in the main web app's deployment.

### Environment Variables

#### `NEXT_PUBLIC_MAIN_SITE_URL`

This environment variable should be set when deploying the templates app to a
subdomain. It enables header links to navigate back to the main solana.com site.

- **Production**: `https://solana.com`
- **Preview/Staging**: Your preview URL (e.g., `https://preview.solana.com`)
- **Local Development**: `http://localhost:3000` (if main site runs on
  port 3000)
- **Main Site**: Leave empty or unset

See `.env.example` for more details.

## Architecture

- Built with Next.js 15, React 19, and Tailwind CSS
- Uses shared packages from workspace:
  - `@solana-com/ui-chrome` - Header and footer components
  - `@workspace/ui` - UI components
  - `@workspace/i18n` - Internationalization utilities
- Fetches template data from GitHub at build time
- Supports internationalization with next-intl
- Generates OG images dynamically for each template

## Routes

- `/[locale]/` - Template list page
- `/[locale]/[id]/` - Individual template detail page
