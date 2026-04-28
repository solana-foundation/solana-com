# Breakpoint App Agent Guide

Use this guide after the root `AGENTS.md` when working in `apps/breakpoint`.
Breakpoint is a Solana event microsite with its own visual system, route prefix,
asset prefix, local fonts, and app shell. Treat those as product structure, not
as incidental implementation details.

## Read First

- `package.json`
- `next.config.ts`
- `tailwind.config.ts`
- `src/app/globals.css`
- `src/config.ts`
- `src/app/layout.tsx`
- `src/app/[locale]/layout.tsx`
- `src/app/DefaultLocaleShell.tsx`
- `src/components/PageShell.tsx`
- `src/components/Navigation.tsx`

## Figma MCP Workflow

When using Figma MCP output, treat generated code as design reference only.
Adapt spacing, layout, and visual intent into the existing Breakpoint app
structure instead of replacing core files with generated custom scaffolding.

- Reuse existing components before creating new primitives.
- Prefer editing section/page components under `src/components/sections` and
  `src/components/pages`.
- Keep route files in `src/app` thin; avoid moving page composition, shell
  behavior, metadata, or i18n wiring into generated components.
- Do not replace `PageShell`, `Navigation`, `MenuOverlay`, `Footer`,
  `DefaultLocaleShell`, app layouts, middleware, or config unless the user
  explicitly asks for structural changes.
- Do not paste large generated CSS blocks when existing Tailwind tokens, CSS
  variables, or component classes can express the design.
- If a Figma design introduces a variant of an existing pattern, extend the
  existing component API narrowly rather than creating a parallel component.

## App Structure Guardrails

- Preserve the `NEXT_PUBLIC_APP_NAME: "breakpoint"` behavior in
  `next.config.ts`.
- Preserve the `/breakpoint` route rewrites and `/breakpoint-assets` asset
  prefix behavior.
- Preserve localized routes under `src/app/[locale]` and shared i18n setup in
  `src/i18n`.
- Keep event/site constants in `src/config.ts`.
- Keep editable page and event copy in `src/content` where that pattern already
  exists.
- Use assets from `public/assets`, `public/img`, `public/live`, and
  `public/fonts` before adding new assets.
- Do not change shared package contracts in `packages/*` for a Breakpoint-only
  design edit unless the user explicitly asks for a shared-system change.

## Design System

Use the Breakpoint Tailwind theme and CSS variables before inventing new design
tokens.

- Colors are defined in `tailwind.config.ts` and mirrored as CSS variables in
  `src/app/globals.css`.
- Prefer semantic tokens like `background-primary`, `background-secondary`,
  `text-primary`, `text-secondary`, `stroke-primary`, `stroke-card`, and
  `button-fill`.
- Brand colors include `core-purple`, `core-green`, `core-blue`, `core-yellow`,
  and `core-pink`.
- Preserve the dark event-site visual language unless the task is explicitly a
  redesign.
- Use the configured screens, container sizing, spacing scale, and typography
  scale from `tailwind.config.ts`.
- Avoid one-off arbitrary values when an existing token or local pattern fits.
  Arbitrary values are acceptable for tight Figma matching inside a specific
  section, but should not become a new parallel system.

## Fonts

Use local Breakpoint fonts from `public/fonts`. Do not add external font
providers or new font stacks.

Available font assets:

- `public/fonts/bp26-extended/BP26-Extended.woff2`
- `public/fonts/abc-favorit/ABCFavorit-Regular.woff2`
- `public/fonts/abc-favorit/ABCFavorit-Bold.woff2`
- `public/fonts/abc-favorit-mono/ABCFavoritMono-Regular.woff2`
- `public/fonts/abc-favorit-mono/ABCFavoritMono-Bold.woff2`

These are loaded through `next/font/local` and exposed as CSS variables:

- `--font-bp26`
- `--font-abc-favorit`
- `--font-abc-favorit-mono`

Use the Tailwind font utilities already wired in `tailwind.config.ts`:

- `font-bp26` or `font-display` for BP26 display type
- `font-sans` or `font-abc-favorit` for body copy and most headings
- `font-mono` or `font-abc-favorit-mono` for eyebrow text, metadata, buttons,
  and navigation-style text

Preserve the font loading setup in the app shells and layouts. Do not remove the
font variables from rendered page roots.

## Component Patterns

- `src/components/Button.tsx` owns primary button behavior and visual variants.
- `src/components/Card.tsx` owns card-like repeated content.
- `src/components/SectionHeadline.tsx` and `src/components/SubpageHero.tsx`
  provide reusable heading patterns.
- `src/components/ImageTreatment.tsx`, `GlitchOverlay.tsx`, `TextScramble.tsx`,
  `WordReveal.tsx`, and `Marquee.tsx` carry Breakpoint-specific visual effects.
- `src/components/sections` contains homepage sections.
- `src/components/pages` contains subpage-specific page sections.

Before adding a new component, check whether one of these can be reused or
narrowly extended.

## Validation

Prefer targeted validation from the repo root:

```bash
pnpm --filter solana-com-breakpoint lint
pnpm --filter solana-com-breakpoint check-types
pnpm --filter solana-com-breakpoint test
pnpm --filter solana-com-breakpoint dev
```

For visual design changes, run the app locally on port `3005` and inspect the
affected `/breakpoint` route at desktop and mobile widths.
