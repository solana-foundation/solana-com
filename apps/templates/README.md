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

This app is designed to be deployed separately from the main solana.com website.
The main site will rewrite `/templates` routes to this app's deployment URL via
Next.js rewrites configuration.

To enable the rewrite in production, set the `TEMPLATES_APP_URL` environment
variable in the main web app's deployment.

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
