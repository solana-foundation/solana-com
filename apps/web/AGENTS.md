# Web App Agent Guide

Use this app for the main `solana.com` experience.

## Identity

- Workspace: `apps/web`
- Package: `solana-com`
- Default dev port: `3000`
- Public route ownership: `/`, `/solutions`, `/ecosystem`, `/events`, selected
  `/developers/*` routes, and other top-level marketing routes

## First Files To Open

1. `package.json`
2. `next.config.ts`
3. `rewrites-redirects.ts`
4. `src/app/[locale]/`
5. `content/` for guide-style content

## Key Facts

- Largest app in the monorepo and the usual integration point for the others
- Next.js App Router with `next-intl`
- Shared navigation and cross-app linking come from `@solana-com/ui-chrome`
- A lot of behavior depends on `rewrites-redirects.ts`
- Vitest is used here for unit tests
- Wallet-directory records are owned by `packages/ecosystem-data`, while this
  app owns their presentation and filtering UI

## Commands

```bash
pnpm --filter solana-com dev
pnpm --filter solana-com build
pnpm --filter solana-com lint
pnpm --filter solana-com check-types
pnpm --filter solana-com test
pnpm --filter solana-com test:e2e
```

## Gotchas

- Route bugs may live in rewrites/redirects rather than the page component
- Changes to shared chrome or locale routing often affect other apps too
- This app owns the proxy layer that surfaces some separately deployed apps
