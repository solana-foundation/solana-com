# Breakpoint App Deployment Guide

This app is deployed as a separate Vercel project and served on `solana.com`
through rewrites in [`apps/web`](/Users/karambit/Sites/solana-com/apps/web).

## Architecture

```text
User visits: solana.com/breakpoint
  ↓ (rewrite in apps/web)
https://solana-com-breakpoint-2.vercel.app/breakpoint
  ↓
apps/breakpoint handles the request with basePath "/breakpoint"
```

Locale-prefixed traffic follows the same pattern:

```text
solana.com/es/breakpoint
  ↓
https://solana-com-breakpoint-2.vercel.app/breakpoint/es
```

## Vercel Project Setup

In the Breakpoint Vercel project:

- Project: `solana-com-breakpoint-2`
- Root Directory: `apps/breakpoint`
- Framework Preset: `Next.js`
- Install Command: `pnpm install`
- Build Command:
  `cd ../.. && pnpm install && pnpm --filter solana-com-breakpoint build`
- Output Directory: `.next`

The app-level Vercel config lives in
[`apps/breakpoint/vercel.json`](/Users/karambit/Sites/solana-com/apps/breakpoint/vercel.json).

## Web App Cutover

The main site now resolves Breakpoint through
[`apps/web/apps-urls.js`](/Users/karambit/Sites/solana-com/apps/web/apps-urls.js)
and rewrites in
[`apps/web/rewrites-redirects.mjs`](/Users/karambit/Sites/solana-com/apps/web/rewrites-redirects.mjs).

Before production cutover:

1. Add `solana-com-breakpoint-2` as a related project in the main web Vercel
   project if you want `@vercel/related-projects` to auto-discover the URL.
2. If you are not using related projects yet, set
   `NEXT_PUBLIC_BREAKPOINT_APP_URL=https://solana-com-breakpoint-2.vercel.app`
   in the web app Vercel project.
3. Deploy the web app so the new rewrite target goes live.

## Verification

Check both the direct deployment and the proxied route:

- `https://solana-com-breakpoint-2.vercel.app/breakpoint`
- `https://solana-com-breakpoint-2.vercel.app/breakpoint/en`
- `https://solana.com/breakpoint`
- `https://solana.com/en/breakpoint`

Confirm:

- static assets load from `/breakpoint/_next/*`
- `live` CSS loads from `/breakpoint/live/*`
- locale-prefixed routes render the expected content
- metadata resolves against `https://solana.com/breakpoint`

## Notes

- The app preserves proxied locale cookie behavior via
  [`src/middleware.ts`](/Users/karambit/Sites/solana-com/apps/breakpoint/src/middleware.ts).
- Replace the placeholder CTA target in
  [`common.json`](/Users/karambit/Sites/solana-com/apps/breakpoint/public/locales/en/common.json)
  once the launch destination is approved.
