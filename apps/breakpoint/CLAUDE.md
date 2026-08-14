# Solana Breakpoint Event Site

Start with [`AGENTS.md`](./AGENTS.md). It is the source of truth for the
Breakpoint app's structure, design-system guardrails, route and asset prefixes,
and targeted validation commands.

## Identity

- Workspace: `apps/breakpoint`
- Package: `solana-com-breakpoint`
- Default dev port: `3005`
- Public route prefix: `/breakpoint`
- Asset prefix: `/breakpoint-assets`
- Cross-app identity: `NEXT_PUBLIC_APP_NAME="breakpoint"`

Keep visual changes aligned with `tailwind.config.ts` and `src/app/globals.css`,
and preserve the proxy behavior defined in `next.config.ts`.
