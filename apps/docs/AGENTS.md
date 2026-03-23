# Docs App Agent Guide

Use this app for developer docs, cookbook, guides, and docs-specific UI.

## Identity

- Workspace: `apps/docs`
- Package: `solana-docs`
- Default dev port: `3003`
- Public route ownership: `/docs`, `/developers/cookbook`,
  `/developers/guides`

## First Files To Open

1. `package.json`
2. `next.config.ts`
3. `source.config.ts`
4. `src/app/[locale]/`
5. `content/`

## Key Facts

- Next.js App Router app with `next-intl`
- Fumadocs powers most content loading and navigation
- MDX sources live in `content/`
- Generated Fumadocs artifacts live in `.source/` after `postinstall`
- Uses asset prefix `/docs-assets`
- Shared header/footer and cross-app link behavior come from
  `@solana-com/ui-chrome`

## Content Ownership

- `content/docs/*`: core docs by locale
- `content/cookbook/*`: recipe-style content
- `content/guides/*`: long-form developer guides
- `src/components/*`: docs-only React UI

## Commands

```bash
pnpm --filter solana-docs dev
pnpm --filter solana-docs build
pnpm --filter solana-docs lint
pnpm --filter solana-docs postinstall
```

Run `postinstall` if content or MDX wiring changed and generated sources look
stale.

## Gotchas

- This app is deployed behind `/docs-assets`, so asset-path bugs often involve
  both `next.config.ts` and the consuming component
- If a change touches shared navigation or locale switching, inspect
  `packages/ui-chrome` and `packages/i18n` too
- Content-heavy changes may require checking both MDX sources and the Fumadocs
  source config
