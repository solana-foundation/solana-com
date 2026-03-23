# solana.com Monorepo

Repository for [https://solana.com](https://solana.com) — a Turborepo-powered
monorepo containing multiple Next.js applications and shared packages.

For a short agent-oriented entry point, start with [`AGENTS.md`](./AGENTS.md).

## Structure

```
solana-com/
├── apps/
│   ├── web/          # Main website (solana.com) - port 3000
│   ├── docs/         # Developer documentation - port 3003
│   ├── media/        # Blog & news (Keystatic) - port 3002
│   ├── templates/    # Code templates showcase - port 3001
│   ├── accelerate/   # Event microsite - port 3004
│   └── breakpoint/   # Event microsite - port 3005
├── packages/
│   ├── config-eslint/       # Shared ESLint configs
│   ├── config-typescript/   # Shared TypeScript configs
│   ├── i18n/                # Shared i18n utilities (next-intl)
│   ├── ui/                  # Shared UI components (Radix-based)
│   ├── ui-chrome/           # Header, Footer, Theme components
│   ├── ecosystem-data/      # Shared company and logo registry
│   └── sentry/              # Shared Sentry helpers
```

The main web app (`apps/web`) uses **Next.js App Router** with all pages under
`src/app/[locale]/`.

## Workspace Guide

| Workspace | Package name | Port | Notes |
| --- | --- | --- | --- |
| `apps/web` | `solana-com` | `3000` | Main site and shared user-facing entry point |
| `apps/docs` | `solana-docs` | `3003` | Fumadocs-based developer docs |
| `apps/media` | `solana-com-media` | `3002` | Keystatic-backed news and podcasts |
| `apps/templates` | `solana-templates` | `3001` | Templates showcase, proxied behind `solana.com` |
| `apps/accelerate` | `solana-com-accelerate` | `3004` | Event app with `/accelerate` rewrites |
| `apps/breakpoint` | `solana-com-breakpoint` | `3005` | Event app with `/breakpoint` rewrites |

Shared packages worth checking early:

- `packages/ui-chrome` for shared header/footer and cross-app link behavior
- `packages/i18n` for locale config and message loading
- `packages/ecosystem-data` for canonical company data and logos

## Setup

1. Clone the repo:

   ```bash
   git clone https://github.com/solana-foundation/solana-com.git
   ```

2. Install dependencies (pnpm required):

   ```bash
   pnpm install
   ```

3. Run development:

   ```bash
   # All apps (via Turbo)
   pnpm dev

   # Specific app
   pnpm dev --filter solana-com                # Main website
   pnpm dev --filter solana-docs               # Documentation
   pnpm dev --filter solana-com-media          # Blog/Media
   pnpm dev --filter solana-templates          # Templates
   pnpm dev --filter solana-com-accelerate     # Accelerate
   pnpm dev --filter solana-com-breakpoint     # Breakpoint

   # Or from app directory
   cd apps/web && pnpm dev
   ```

## Commands

| Command           | Description               |
| ----------------- | ------------------------- |
| `pnpm build`      | Build all apps            |
| `pnpm test`       | Run tests                 |
| `pnpm lint`       | Lint all workspaces       |
| `pnpm format:all` | Format code with Prettier |

Targeted validation is usually faster:

```bash
pnpm --filter solana-com lint
pnpm --filter solana-docs build
pnpm --filter solana-com-media test
pnpm --filter solana-templates check-types
```

Periodic agent-context audit:

```bash
node skills/refresh-agent-context/scripts/workspace_inventory.mjs
```

## Architecture Notes

- Root scripts use `turbo run ...` and task defaults live in [`turbo.json`](./turbo.json)
- Non-web apps set `NEXT_PUBLIC_APP_NAME` in `next.config.ts`; shared nav logic
  in `packages/ui-chrome` uses that to decide cross-app navigation behavior
- Several apps use `assetPrefix` plus rewrites because they are deployed
  separately behind `solana.com`
- Shared env pass-through is also declared in `turbo.json`

## Contributing

The solana.com website is managed and maintained by the Solana Foundation. See
[how to contribute](apps/web/CONTRIBUTING.md) and workspace docs:

- [`AGENTS.md`](./AGENTS.md) — Repo-level fast context for coding agents
- [`apps/web/AGENTS.md`](./apps/web/AGENTS.md) — Main website
- [`apps/docs/AGENTS.md`](./apps/docs/AGENTS.md) — Documentation
- [`apps/media/AGENTS.md`](./apps/media/AGENTS.md) — Blog/Media
- [`apps/templates/AGENTS.md`](./apps/templates/AGENTS.md) — Templates
- [`apps/accelerate/AGENTS.md`](./apps/accelerate/AGENTS.md) — Accelerate
- [`apps/breakpoint/AGENTS.md`](./apps/breakpoint/AGENTS.md) — Breakpoint
