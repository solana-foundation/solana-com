# solana.com Monorepo

Repository for [https://solana.com](https://solana.com) — a Turborepo-powered
monorepo containing multiple Next.js applications and shared packages.

## Structure

```
solana-com/
├── apps/
│   ├── web/          # Main website (solana.com) - port 3000
│   ├── docs/         # Developer documentation - port 3003
│   ├── media/        # Blog & news (TinaCMS) - port 3002
│   └── templates/    # Code templates showcase - port 3001
├── packages/
│   ├── config-eslint/       # Shared ESLint configs
│   ├── config-typescript/   # Shared TypeScript configs
│   ├── i18n/                # Shared i18n utilities (next-intl)
│   ├── ui/                  # Shared UI components (Radix-based)
│   └── ui-chrome/           # Header, Footer, Theme components
```

The main web app (`apps/web`) uses **Next.js App Router** with all pages under
`src/app/[locale]/`.

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
   pnpm dev --filter solana-com        # Main website
   pnpm dev --filter solana-docs       # Documentation
   pnpm dev --filter solana-com-media  # Blog/Media
   pnpm dev --filter solana-templates  # Templates

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

## Contributing

The solana.com website is managed and maintained by the Solana Foundation. See
[how to contribute](apps/web/CONTRIBUTING.md) and sub-app docs:

- `apps/web/CLAUDE.md` — Main website
- `apps/docs/CLAUDE.md` — Documentation
- `apps/media/CLAUDE.md` — Blog/Media
