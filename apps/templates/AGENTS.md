# Templates App Agent Guide

Use this app for the templates showcase surfaced under `/developers/templates`.

## Identity

- Workspace: `apps/templates`
- Package: `solana-templates`
- Default dev port: `3001`
- Public route ownership: proxied into `/developers/templates`

## First Files To Open

1. `package.json`
2. `next.config.ts`
3. `src/app/`
4. `src/components/`
5. `README.md`

## Key Facts

- Next.js App Router app with `next-intl`
- Uses asset prefix `/templates-assets`
- Fetches template metadata from GitHub
- Shared nav/header behavior depends on `NEXT_PUBLIC_APP_NAME="templates"`
- Uses `nuqs` for URL-driven filter/search state

## Commands

```bash
pnpm --filter solana-templates dev
pnpm --filter solana-templates build
pnpm --filter solana-templates lint
pnpm --filter solana-templates check-types
```

## Gotchas

- The app is deployed separately but consumed through main-site rewrites, so
  changes to route ownership may span both `apps/templates` and `apps/web`
- External image handling is intentionally narrow and configured in
  `next.config.ts`
- If a navigation fix crosses app boundaries, inspect `packages/ui-chrome`
