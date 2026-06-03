# Accelerate App Agent Guide

Use this app for the Accelerate event microsite.

## Identity

- Workspace: `apps/accelerate`
- Package: `solana-com-accelerate`
- Default dev port: `3004`
- Public route ownership: proxied behind `/accelerate`

## First Files To Open

1. `package.json`
2. `next.config.ts`
3. `src/app/`
4. `src/components/`
5. `public/images/` and shared sponsor data if logos are involved

## Key Facts

- Next.js App Router app with MDX support
- Uses asset prefix `/accelerate-assets`
- Shared navigation behavior depends on `NEXT_PUBLIC_APP_NAME="accelerate"`
- Sponsor logos may come from `packages/ecosystem-data`
- Route rewrites map `/accelerate/*` into the app

## Commands

```bash
pnpm --filter solana-com-accelerate dev
pnpm --filter solana-com-accelerate build
pnpm --filter solana-com-accelerate lint
pnpm --filter solana-com-accelerate check-types
```

## Gotchas

- Asset-path issues often involve both image usage and `/accelerate-assets`
  rewrites
