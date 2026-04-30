# Breakpoint App Agent Guide

Use this app for the Breakpoint event microsite.

## Identity

- Workspace: `apps/breakpoint`
- Package: `solana-com-breakpoint`
- Default dev port: `3005`
- Public route ownership: proxied behind `/breakpoint`

## First Files To Open

1. `package.json`
2. `next.config.ts`
3. `src/app/`
4. `src/content/`
5. `openspec/` when the request is proposal-sized

## Key Facts

- Next.js App Router app with `next-intl`
- Uses asset prefix `/breakpoint-assets`
- Breakpoint routes are rewritten so `/breakpoint/*` maps into this app
- Shared navigation behavior depends on `NEXT_PUBLIC_APP_NAME="breakpoint"`

## Commands

```bash
pnpm --filter solana-com-breakpoint dev
pnpm --filter solana-com-breakpoint build
pnpm --filter solana-com-breakpoint lint
pnpm --filter solana-com-breakpoint check-types
pnpm --filter solana-com-breakpoint test
```

## Gotchas

- Route and asset fixes usually require checking the rewrite rules in
  `next.config.ts`
- This app already has OpenSpec material under `openspec/`; read that first for
  larger feature work
