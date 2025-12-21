# Multi-App Architecture

This document explains how the Solana.com monorepo's 4 applications work
together as a unified system.

## Architecture Overview

The Solana.com website is built as a **multi-app monorepo**. Users always access
the site through `solana.com`, but requests are routed to different Next.js
applications based on the URL path.

```
                                    ┌─────────────────────┐
                                    │   solana.com        │
                                    │   (web app)         │
                                    │   Port 3000         │
                                    └──────────┬──────────┘
                                               │
                    ┌──────────────────────────┼──────────────────────────┐
                    │                          │                          │
                    ▼                          ▼                          ▼
         ┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐
         │  templates app   │      │   media app      │      │   docs app       │
         │   Port 3001      │      │   Port 3002      │      │   Port 3003      │
         │                  │      │                  │      │                  │
         │ /developers/     │      │ /news/*          │      │ /docs/*          │
         │   templates/*    │      │ /podcasts/*      │      │ /learn/*         │
         │                  │      │                  │      │ /developers/     │
         │                  │      │                  │      │   cookbook/*     │
         │                  │      │                  │      │   guides/*       │
         └──────────────────┘      └──────────────────┘      └──────────────────┘
```

The **web app** acts as the entry point and uses Next.js rewrites to proxy
requests to the appropriate app based on the URL path. This is a **proxy-only**
architecture—all apps are accessed through `solana.com`, never directly via
subdomains.

## Apps Summary

| App           | Directory        | Routes                                      | Dev Port |
| ------------- | ---------------- | ------------------------------------------- | -------- |
| **web**       | `apps/web`       | Everything else                             | 3000     |
| **templates** | `apps/templates` | `/developers/templates/*`                   | 3001     |
| **media**     | `apps/media`     | `/news/*`, `/podcasts/*`                    | 3002     |
| **docs**      | `apps/docs`      | `/docs/*`, `/learn/*`, some `/developers/*` | 3003     |

## Environment Variables

### `NEXT_PUBLIC_APP_NAME`

Identifies which app is running, enabling the shared header to decide whether
links should use client-side navigation (Next.js Link) or full page loads (`<a>`
tag).

| App       | Value         | Internal Routes (use Next.js Link)                                                     |
| --------- | ------------- | -------------------------------------------------------------------------------------- |
| web       | Not set       | All routes except those handled by other apps                                          |
| docs      | `"docs"`      | `/docs/*`, `/learn/*`, `/developers`, `/developers/cookbook/*`, `/developers/guides/*` |
| media     | `"media"`     | `/news/*`, `/podcasts/*`                                                               |
| templates | `"templates"` | Single-segment paths (when running standalone at root)                                 |

This is set in each app's `next.config.ts`:

```typescript
// apps/docs/next.config.ts
const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_APP_NAME: "docs",
  },
  // ...
};
```

### `NEXT_PUBLIC_USE_BASE_PATH` (Templates only)

Controls whether the templates app uses a basePath. This enables dual deployment
modes:

| Value         | Behavior                                                |
| ------------- | ------------------------------------------------------- |
| `"true"`      | Uses basePath `/developers/templates` (proxy mode)      |
| Not set/other | No basePath, serves at root (standalone subdomain mode) |

## How Rewrites Work

The web app proxies requests to other apps using Next.js rewrites configured in
two files:

### `apps/web/apps-urls.js`

Defines the URLs for each app based on environment:

```javascript
// Docs and Media apps: Production via @vercel/related-projects, dev on localhost
const vercelMediaUrl = withRelatedProject({
  projectName: "solana-com-media",
  defaultHost: "https://solana-com-media.vercel.app",
});
const developmentMediaUrl = "http://localhost:3002";

export const MEDIA_APP_URL =
  process.env.NEXT_PUBLIC_MEDIA_APP_URL ||
  (process.env.NODE_ENV === "production"
    ? vercelMediaUrl
    : developmentMediaUrl);

// Templates app: Always uses Vercel URL (no localhost fallback)
const vercelTemplatesUrl = withRelatedProject({
  projectName: "templates",
  defaultHost: "https://solana-templates.vercel.app",
});

export const TEMPLATES_APP_URL =
  process.env.TEMPLATES_APP_URL || vercelTemplatesUrl;
```

**URL Resolution Order (Docs & Media):**

1. Environment variable override (e.g., `NEXT_PUBLIC_MEDIA_APP_URL`)
2. Production: Auto-detected via `@vercel/related-projects`
3. Development: Localhost with app-specific port

**URL Resolution Order (Templates):**

1. Environment variable override (`TEMPLATES_APP_URL`)
2. Always uses Vercel deployment URL (no localhost fallback)

> **Note:** The templates app doesn't have a localhost fallback because it's
> typically accessed directly during development rather than through the web
> app's proxy.

### `apps/web/rewrites-redirects.mjs`

Configures which routes are proxied to which app:

```javascript
import { MEDIA_APP_URL, DOCS_APP_URL } from "./apps-urls";

export default {
  rewrites: {
    beforeFiles: [
      // Docs app routes
      { source: "/docs", destination: `${DOCS_APP_URL}/docs` },
      { source: "/docs/:path*", destination: `${DOCS_APP_URL}/docs/:path*` },
      { source: "/learn", destination: `${DOCS_APP_URL}/learn` },
      { source: "/learn/:path*", destination: `${DOCS_APP_URL}/learn/:path*` },
      // ... more routes

      // Media app routes
      { source: "/news", destination: `${MEDIA_APP_URL}/news` },
      { source: "/news/:path*", destination: `${MEDIA_APP_URL}/news/:path*` },
      // ... more routes
    ],
  },
};
```

### Request Flow

```
User visits: solana.com/docs/intro

1. Request hits web app (solana.com)
2. Next.js matches rewrite rule: /docs/:path* → DOCS_APP_URL/docs/:path*
3. Request proxied to docs app
4. Docs app renders page, returns HTML
5. HTML references assets at /docs-assets/_next/...
6. Browser requests /docs-assets/_next/css/...
7. Web app rewrites to DOCS_APP_URL/docs-assets/_next/css/...
8. CSS served from docs app
```

## How Asset Prefixes Work

When apps are accessed through the web app's proxy, their static assets (CSS,
JS) need special handling. Without this, asset requests like `/_next/static/...`
would go to the web app instead of the originating app.

### The Problem

```
Without asset prefix:
1. User visits solana.com/docs (proxied to docs app)
2. HTML includes: <link href="/_next/static/css/main.css">
3. Browser requests: solana.com/_next/static/css/main.css
4. Web app serves ITS css (wrong!) or 404
```

### The Solution

Each proxied app uses an `assetPrefix` to namespace its assets:

**Docs app** (`apps/docs/next.config.ts`):

```typescript
const nextConfig: NextConfig = {
  assetPrefix: "/docs-assets",
  // ...
};
```

**Media app** (`apps/media/next.config.ts`):

```typescript
const nextConfig: NextConfig = {
  assetPrefix: "/media-assets",
  // ...
};
```

**Templates app** uses a conditional `basePath` to support two deployment modes:

```typescript
// apps/templates/next.config.ts
const basePath =
  process.env.NEXT_PUBLIC_USE_BASE_PATH === "true"
    ? "/developers/templates"
    : "";

const nextConfig: NextConfig = {
  // Use basePath only when env var is set (for proxy integration)
  // Without env var, templates serves at root for standalone subdomain
  ...(basePath && { basePath }),
  // ...
};
```

This allows the templates app to work in two modes:

- **Proxy mode**: When `NEXT_PUBLIC_USE_BASE_PATH=true`, uses basePath
  `/developers/templates` and is accessed via `solana.com/developers/templates`
- **Standalone mode**: Without the env var, serves at root and can be deployed
  to its own subdomain (e.g., `templates.solana.com`)

### Asset Rewrites

Each app also needs internal rewrites to handle its prefixed assets:

```typescript
// apps/docs/next.config.ts
async rewrites() {
  return {
    beforeFiles: [
      {
        source: "/docs-assets/_next/:path+",
        destination: "/_next/:path+",
      },
    ],
  };
}
```

And the web app needs rewrites to proxy these asset requests:

```javascript
// apps/web/rewrites-redirects.mjs
{
  source: "/docs-assets/:path+",
  destination: `${DOCS_APP_URL}/docs-assets/:path+`,
},
{
  source: "/media-assets/:path+",
  destination: `${MEDIA_APP_URL}/media-assets/:path+`,
},
```

## Header Link Routing

The shared header (`@solana-com/ui-chrome`) needs to know whether to use Next.js
`<Link>` (for client-side navigation) or `<a>` tags (for full page loads to
trigger the proxy).

### How It Works

Since all apps are served behind `solana.com` via rewrites (proxy-only mode),
**all links stay as relative paths**. The only decision is whether to use
client-side navigation or trigger a full page load.

The logic is in `packages/ui-chrome/src/url-config.ts`:

```typescript
const APP_INTERNAL_ROUTES: Record<string, RegExp> = {
  docs: /^\/(?:docs|learn)(?:\/|$)|^\/developers(?:$|\/(?:cookbook|guides)(?:\/|$))/,
  media: /^\/(?:news|podcasts)(?:\/|$)/,
  templates: /^\/[^/]+$/,
};

export function shouldUseNextLink(href: string): boolean {
  // On web app: use Link for routes NOT handled by other apps
  // On other apps: use Link only for routes internal to that app
}
```

### Behavior by App

| App       | Click on `/docs/intro`             | Click on `/validators`             |
| --------- | ---------------------------------- | ---------------------------------- |
| **web**   | `<a>` tag (full page load → proxy) | Next.js Link (client navigation)   |
| **docs**  | Next.js Link (client navigation)   | `<a>` tag (full page load → proxy) |
| **media** | `<a>` tag (full page load → proxy) | `<a>` tag (full page load → proxy) |

**Why this matters:**

- **Next.js Link**: Fast client-side navigation, works within the same app
- **`<a>` tag**: Full page load, triggers the web app's rewrites to proxy to the
  correct app

## Local Development

### Running All Apps

From the monorepo root, run all apps in parallel:

```bash
pnpm dev
```

This uses Turbo to start all apps simultaneously:

- Web app on http://localhost:3000
- Templates app on http://localhost:3001
- Media app on http://localhost:3002
- Docs app on http://localhost:3003

### Testing Rewrites Locally

Access via the web app to test rewrites work:

- http://localhost:3000/docs → proxied to docs app
- http://localhost:3000/news → proxied to media app

Or access apps directly:

- http://localhost:3001 → templates app directly (serves at root without
  basePath)
- http://localhost:3002/news → media app directly
- http://localhost:3003/docs → docs app directly

> **Note:** The templates app serves at root (`/`) during local development by
> default. To test proxy integration locally, set
> `NEXT_PUBLIC_USE_BASE_PATH=true` which enables the `/developers/templates`
> basePath. The web app's rewrite for templates points to the Vercel deployment
> URL by default, not localhost.

### Environment Setup for Local Dev

No `.env` files needed for local development! Just run `pnpm dev` and everything
works.

## Internationalization (i18n)

All apps use `next-intl` via the shared `@workspace/i18n` package. Translation
files are stored as `common.json` in each app's `public/locales/{locale}/`
directory.

### How Translations Are Loaded

| App       | Sources                                   |
| --------- | ----------------------------------------- |
| web       | Own `public/locales/{locale}/common.json` |
| docs      | Web app's locales + own locales (merged)  |
| media     | Own `public/locales/{locale}/common.json` |
| templates | Web app's locales + own locales (merged)  |

The **docs** and **templates** apps import translations from both the web app
and their own locales, merging them (app-specific translations take precedence):

```typescript
// apps/docs/src/i18n/request.ts (templates uses the same pattern)
const [webMessages, docsMessages] = await Promise.all([
  loadMessages(
    (loc) => import(`../../../../apps/web/public/locales/${loc}/common.json`),
    locale,
  ),
  loadMessages((loc) => import(`@@/public/locales/${loc}/common.json`), locale),
]);

// Merge translations, with app-specific taking precedence
const messages = { ...webMessages, ...docsMessages };
```

This allows these apps to use all the shared header/footer translations from the
web app while adding their own app-specific translations.

The **media** app only loads its own translations since it has a complete set of
translations for its needs.

### Translation Files Location

The primary source of translations is `apps/web/public/locales/`:

```
apps/web/public/locales/
├── en/common.json    # English (default)
├── es/common.json    # Spanish
├── zh/common.json    # Chinese
├── ... (20+ locales)
```

## Sitemap Generation

The web app generates the sitemap for the entire site using `next-sitemap`. It
aggregates URLs from all apps.

### Configuration

See `apps/web/next-sitemap.config.js`:

```javascript
module.exports = {
  siteUrl: "https://solana.com/",
  additionalPaths: async () => {
    // Fetch URLs from various sources
    const builderUrls = await getAllUrls(); // Builder.io pages
    const mediaPostUrls = getMediaPostUrls(); // /news/* posts
    const mediaPodcastUrls = getMediaPodcastUrls(); // /podcasts/*
    const templateUrls = [...]; // /templates/*

    return [...builderUrls, ...mediaPostUrls, ...mediaPodcastUrls, ...templateUrls];
  },
};
```

### URL Sources

| Source       | Description                     |
| ------------ | ------------------------------- |
| Builder.io   | Landing pages, solution pages   |
| Media posts  | News articles from media app    |
| Podcasts     | Podcast episodes from media app |
| Templates    | Templates fetched from GitHub   |
| Static pages | Auto-discovered by next-sitemap |

The sitemap is generated during the web app build and outputs to
`apps/web/public/sitemap.xml`.

## Adding a New App

Checklist for adding a 5th app to the system:

### 1. Create the App

```bash
# Create new Next.js app in apps/
mkdir apps/newapp
cd apps/newapp
# Set up Next.js with workspace dependencies
```

### 2. Configure `next.config.ts`

```typescript
const nextConfig: NextConfig = {
  assetPrefix: "/newapp-assets", // Unique prefix
  env: {
    NEXT_PUBLIC_APP_NAME: "newapp", // Unique identifier
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/newapp-assets/_next/:path+",
          destination: "/_next/:path+",
        },
      ],
    };
  },
};
```

### 3. Add URL Configuration

In `apps/web/apps-urls.js`:

```javascript
const vercelNewappUrl = withRelatedProject({
  projectName: "solana-com-newapp",
  defaultHost: "https://solana-com-newapp.vercel.app",
});
const developmentNewappUrl = "http://localhost:3004";

export const NEWAPP_APP_URL =
  process.env.NEXT_PUBLIC_NEWAPP_APP_URL ||
  (process.env.NODE_ENV === "production"
    ? vercelNewappUrl
    : developmentNewappUrl);
```

### 4. Add Rewrites

In `apps/web/rewrites-redirects.mjs`:

```javascript
import { NEWAPP_APP_URL } from "./apps-urls";

// Add to beforeFiles array:
{
  source: "/newapp-assets/:path+",
  destination: `${NEWAPP_APP_URL}/newapp-assets/:path+`,
  locale: false,
},
{
  source: "/newroute",
  destination: `${NEWAPP_APP_URL}/newroute`,
  locale: false,
},
{
  source: "/newroute/:path*",
  destination: `${NEWAPP_APP_URL}/newroute/:path*`,
  locale: false,
},
```

### 5. Add Internal Routes Pattern

In `packages/ui-chrome/src/url-config.ts`:

```typescript
const APP_INTERNAL_ROUTES: Record<string, RegExp> = {
  // ... existing apps
  newapp: /^\/newroute(?:\/|$)/,
};
```

### 6. Update `turbo.json`

Add any new environment variables to `globalEnv`:

```json
{
  "globalEnv": [
    "NEWAPP_APP_URL"
    // ... existing vars
  ]
}
```

> **Tip:** If your app needs to support standalone deployment (like templates),
> add a `NEXT_PUBLIC_USE_BASE_PATH` check to conditionally enable basePath.

### 7. Deploy to Vercel

1. Create new Vercel project for the app
2. Configure build settings for monorepo
3. Link as related project in the web app's Vercel settings

## Related Files

| File                                   | Purpose                           |
| -------------------------------------- | --------------------------------- |
| `apps/web/apps-urls.js`                | App URL configuration             |
| `apps/web/rewrites-redirects.mjs`      | Rewrite rules                     |
| `apps/web/next-sitemap.config.js`      | Sitemap generation                |
| `packages/ui-chrome/src/url-config.ts` | Header link routing logic         |
| `packages/ui-chrome/src/link.tsx`      | Shared Link component             |
| `packages/i18n/`                       | Shared i18n utilities             |
| `apps/web/public/locales/`             | Primary translation files         |
| `turbo.json`                           | Environment variable passthrough  |
| `apps/templates/next.config.ts`        | Templates dual-mode configuration |
