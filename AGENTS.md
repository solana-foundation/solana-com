# Solana.com Monorepo Agent Guide

Start here before exploring the repo in depth.

## What This Repo Is

This is a `pnpm` workspace + Turborepo monorepo for several separately deployed
Next.js apps that are stitched together behind `solana.com` with rewrites and
asset prefixes.

Most apps are not standalone product islands. They share:

- `@workspace/i18n` for locale config and routing helpers
- `@workspace/ui` for reusable UI primitives
- `@solana-com/ui-chrome` for shared header, footer, cross-app links, alerts,
  and Inkeep integrations
- Turborepo tasks defined in the root `package.json` and `turbo.json`

## Fast Routing Map

Pick the app first. That usually cuts exploration time in half.

| Area                  | Workspace                                   | Local Port | Key Route Prefixes                                                 |
| --------------------- | ------------------------------------------- | ---------- | ------------------------------------------------------------------ |
| Main marketing site   | `apps/web` / `solana-com`                   | `3000`     | `/`, `/solutions`, `/developers`, `/ecosystem`, `/events`, `/news` |
| Developer docs        | `apps/docs` / `solana-docs`                 | `3003`     | `/docs`, `/developers/cookbook`, `/developers/guides`              |
| Media/blog            | `apps/media` / `solana-com-media`           | `3002`     | `/news`, `/podcasts`, `/keystatic`                                 |
| Templates showcase    | `apps/templates` / `solana-templates`       | `3001`     | `/developers/templates` via rewrites                               |
| Accelerate event site | `apps/accelerate` / `solana-com-accelerate` | `3004`     | `/accelerate` via rewrites                                         |
| Breakpoint event site | `apps/breakpoint` / `solana-com-breakpoint` | `3005`     | `/breakpoint` via rewrites                                         |

## Repo Layout

### Apps

- `apps/web`: main `solana.com` app, large surface area, mix of marketing,
  ecosystem, events, news aggregation, and developer entry points
- `apps/docs`: Fumadocs-based developer docs with MDX content under `content/`
- `apps/media`: Keystatic-backed news and podcast site with content in
  `content/`
- `apps/templates`: templates browser that fetches metadata from GitHub
- `apps/accelerate`: event microsite with its own asset prefix and route
  rewrites
- `apps/breakpoint`: event microsite with its own asset prefix and route
  rewrites

### Shared packages

- `packages/i18n`: locale list, routing helpers, shared message loading
- `packages/ui`: reusable UI primitives
- `packages/ui-chrome`: shared nav/footer/theme/cross-app link behavior
- `packages/ecosystem-data`: canonical company and logo registry used by apps
- `packages/sentry`: shared Sentry helpers
- `packages/config-eslint`, `packages/config-typescript`: shared configs

## First Commands To Reach For

From repo root:

```bash
pnpm install
pnpm dev
pnpm dev:web
pnpm dev:media
pnpm dev:acc
pnpm --filter solana-docs dev
pnpm --filter solana-templates dev
pnpm --filter solana-com-breakpoint dev
pnpm lint
pnpm test
pnpm --filter <workspace> lint
pnpm --filter <workspace> check-types
pnpm --filter <workspace> test
```

Periodic agent-doc refresh:

```bash
node skills/refresh-agent-context/scripts/workspace_inventory.mjs
```

Useful filters:

- `solana-com`
- `solana-docs`
- `solana-com-media`
- `solana-templates`
- `solana-com-accelerate`
- `solana-com-breakpoint`

## Turborepo Rules That Matter

- Root scripts call `turbo run ...`
- `build` depends on ancestor `build` tasks and reads `.env*`
- `dev` is uncached and persistent
- `test` has no cached outputs
- Shared env pass-through is declared in [`turbo.json`](./turbo.json)

When a change needs validation, prefer targeted workspace commands before
running the whole repo.

If repo structure changed and the onboarding docs may be stale, use the
`refresh-agent-context` skill in `skills/refresh-agent-context/`.

## Cross-App Behavior

- Non-web apps set `NEXT_PUBLIC_APP_NAME` in `next.config.ts`
- `@solana-com/ui-chrome/url-config` uses that value to decide whether a link
  should use Next client navigation or a full page load across app boundaries
- Several apps use `assetPrefix` plus rewrites so they can live behind
  `solana.com` without breaking static assets

If you touch navigation, shared header/footer behavior, or route ownership,
inspect `packages/ui-chrome` and the target app `next.config.ts` together.

## Content Ownership

- `apps/docs/content`: source of truth for docs, cookbook, and guides
- `apps/media/content`: source of truth for posts, podcasts, authors, tags, and
  global CMS content
- `packages/i18n/messages/*`: shared UI message catalogs by app
- `packages/ecosystem-data`: shared company metadata and logos, not app-specific
  marketing copy

## OpenSpec

Some apps use OpenSpec instructions. If a request is about a proposal, major new
capability, architecture shift, or ambiguous scoped change, read the app-local
`openspec/AGENTS.md` before implementing.

Current app-level OpenSpec entry points:

- `apps/web/openspec/AGENTS.md`
- `apps/accelerate/openspec/AGENTS.md`
- `apps/breakpoint/openspec/`
- `apps/media/openspec/`

## Best Next File

After reading this file:

- open the target app's `AGENTS.md` if it exists
- then open that app's `package.json`
- then inspect `next.config.ts`

That usually gives enough context to make a safe first edit.
