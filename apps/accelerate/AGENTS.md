<!-- OPENSPEC:START -->

# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `@/openspec/AGENTS.md` when the request:

- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big
  performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/openspec/AGENTS.md` to learn:

- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.

<!-- OPENSPEC:END -->

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
- Large feature work should follow the app's OpenSpec flow above
