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

This app is deployed separately and accessed via the main site's rewrites at
`/developers/templates/*`.

The main site (`apps/web`) proxies requests to this app's Vercel deployment via
Next.js rewrites. Users always access the templates through `solana.com`.

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

## Header Navigation

The shared header uses `NEXT_PUBLIC_APP_NAME` (set to `"templates"` in
`next.config.ts`) to determine link behavior:

- Links to template routes use Next.js Link (client navigation)
- Links to other routes (e.g., `/docs`, `/validators`) use `<a>` tags (full page
  load back through the proxy)

See `packages/ui-chrome/src/url-config.ts` for the routing logic.
