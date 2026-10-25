# Docs App Agent Guide

Use this app for the /developers landing, developer docs, cookbook, learning
content, and docs-specific UI.

## Identity

- Workspace: `apps/docs`
- Package: `solana-docs`
- Default dev port: `3003`
- Public route ownership: `/developers`, `/developers/docs`,
  `/developers/cookbook`, `/learn`, plus redirects for the old `/docs`,
  `/developers/guides` and `/developers/bootcamp` URLs

## First Files To Open

1. `package.json`
2. `next.config.ts`
3. `source.config.ts`
4. `src/app/(docs)/[locale]/` (landing, docs, cookbook, learn articles) and
   `src/app/[locale]/` (the /learn landing)
5. `src/lib/docs/` and `src/components/docs/`
6. `content/`

## Key Facts

- Next.js App Router app with `next-intl`
- Fumadocs (`fumadocs-core`, `fumadocs-mdx`) loads the MDX; the docs chrome
  (header, sidebar, table of contents, footer) is this app's own code
- MDX sources live in `content/`; `src/lib/docs/source.ts` maps them to URLs
- Navigation for every locale comes from `content/navigation/en.json`
- Generated Fumadocs artifacts live in `.source/` after `postinstall`
- Uses asset prefix `/docs-assets`
- Shared header/footer and cross-app link behavior come from
  `@solana-com/ui-chrome`

## Content Ownership

- `content/docs/<locale>/*`: developer docs, served from `/developers/docs`
  (English in `en`, translations in their locale)
- `content/cookbook/*`: recipe-style content (English only)
- `content/learn/<locale>/*`: general learning content
- `content/snippets/*`, `content/styles/*`, `content/navigation/*`,
  `content/docs.json`: shared MDX snippets, docs stylesheets, navigation and
  site config
- `packages/docs-examples/*`: runnable code embedded in docs pages
- `src/components/docs/*`: docs-only React UI

## Commands

```bash
pnpm --filter solana-docs dev
pnpm --filter solana-docs build
pnpm --filter solana-docs lint
pnpm --filter solana-docs check-types
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
- Moved docs routes need a redirect in `redirects.ts`; it adds the `.md` and
  locale variants
