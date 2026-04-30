# Media App Agent Guide

Use this app for blog/news, podcasts, Keystatic content editing, and
media-specific APIs.

## Identity

- Workspace: `apps/media`
- Package: `solana-com-media`
- Default dev port: `3002`
- Public route ownership: `/news`, `/podcasts`, `/keystatic`

## First Files To Open

1. `package.json`
2. `next.config.ts`
3. `keystatic.config.tsx`
4. `app/`
5. `content/`

## Key Facts

- Next.js App Router app with `next-intl`
- Keystatic is the CMS and `content/` is the source of truth in local mode
- Uses asset prefix `/media-assets`
- Shared nav/header behavior depends on `NEXT_PUBLIC_APP_NAME="media"`
- Tests exist in `__tests__/` and `e2e/`

## Content Ownership

- `content/posts/*`: article content
- `content/podcasts/*`: podcast show and episode metadata
- `content/authors/*`, `content/categories/*`, `content/tags/*`: taxonomies
- `content/global/*`: site-wide CMS content
- `public/uploads/*`: uploaded media assets

## Commands

```bash
pnpm --filter solana-com-media dev
pnpm --filter solana-com-media build
pnpm --filter solana-com-media lint
pnpm --filter solana-com-media typecheck
pnpm --filter solana-com-media test
pnpm --filter solana-com-media screenshots
```

## Gotchas

- Local editing usually expects `NEXT_PUBLIC_KEYSTATIC_LOCAL=true`
- Asset bugs often come from `/media-assets` rewrites rather than component code
- Content changes can affect runtime readers in `lib/` as well as page output
- If you touch header links or cross-app navigation, inspect
  `packages/ui-chrome/src/url-config.ts`
