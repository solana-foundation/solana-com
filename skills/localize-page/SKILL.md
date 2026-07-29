---
name: localize-page
description:
  Convert or refactor Solana.com monorepo pages and their directly owned
  components to the repository's shared i18n system. Use when asked to
  internationalize, localize, remove hard-coded user-facing copy from, add
  translations to, or audit a page or route in apps/web, apps/docs, apps/media,
  apps/templates, apps/accelerate, or apps/breakpoint, including localized
  metadata, route links, JSON catalogs, docs MDX, and Lingo.dev source setup.
---

# Localize Page

Make the requested page locale-ready while preserving its design, behavior, data
flow, and app ownership. Produce the implementation, not only a list of strings,
unless the user explicitly asks for an audit.

Read [references/repo-i18n-patterns.md](references/repo-i18n-patterns.md) before
editing. Treat the checked-out repository as the final authority when it has
evolved beyond the reference.

## Follow the workflow

### 1. Resolve the owning surface

Start from the repository root.

1. Read the root `AGENTS.md`, the owning app's `AGENTS.md`, its `package.json`,
   and `next.config.ts`.
2. Inspect the target route, its directly owned components, the app's i18n
   request file and locale layout, and one nearby localized route.
3. Inspect `packages/i18n/src/config.ts`, `packages/i18n/src/messages.ts`,
   `.lingo/config.json`, and the relevant English source catalog or docs
   content.
4. Check the worktree status and preserve unrelated user changes.
5. If the user supplied a public URL rather than a file, resolve it with the
   route map in the root `AGENTS.md` and the app's rewrites.

Do not change providers, locale middleware, shared package contracts, asset
prefixes, or rewrites for a page-only task unless the existing route cannot
otherwise use the shared setup.

### 2. Choose the source of truth

Use the narrowest source already owned by the app:

| Target        | English source                                                             |
| ------------- | -------------------------------------------------------------------------- |
| Web UI        | `packages/i18n/messages/web/en/common.json`                                |
| Docs React UI | Web catalog inherited by the docs app                                      |
| Docs prose    | The matching English MDX or `meta.json` covered by `.lingo/config.json`    |
| Media UI      | Media catalog; reuse inherited web keys only when semantically shared      |
| Templates UI  | Templates catalog; reuse inherited web keys only when semantically shared  |
| Accelerate UI | Accelerate catalog; reuse inherited web keys only when semantically shared |
| Breakpoint UI | `packages/i18n/messages/breakpoint/en/breakpoint.json`                     |

Do not create a docs JSON catalog: `docs` intentionally inherits `web`.
Breakpoint has runtime i18n but is not currently an automated Lingo source. Keep
that limitation visible in the handoff rather than silently expanding
translation scope.

### 3. Inventory all user-facing copy

Cover the route and its directly owned components. Extract:

- headings, paragraphs, labels, buttons, links, captions, badges, and tooltips
- form labels, placeholders, validation, loading, empty, success, and error text
- meaningful image alt text, `aria-label` text, screen-reader text, and titles
- page metadata, social image alt text, structured data, and breadcrumb names
- client-side notices, modal copy, filter names, and generated count labels

Keep decorative empty alt text, URLs, IDs, code tokens, analytics values,
machine-readable constants, and external data out of catalogs. Do not translate
brand or technical terms by hard-coding target-language values; let the
configured Lingo engine's glossary and instructions handle them.

### 4. Design stable messages

- Add English source keys only. Never hand-translate every target catalog during
  ordinary page work.
- Create one semantic route-level namespace when a suitable namespace does not
  exist. Follow nearby casing and nesting.
- Name keys by purpose, not by copying the English sentence.
- Nest related `metadata`, `actions`, `form`, `errors`, `aria`, and content
  groups.
- Use ICU variables such as `{count}` and `{name}` instead of concatenating
  translated fragments.
- Use `t.rich` when markup or links belong inside a sentence. Do not split a
  grammatical sentence across JSX nodes or keys.
- Keep arrays and identifiers in typed code when they control behavior; map
  stable IDs to translated leaf keys at render time.
- Reuse an inherited key only when its meaning and context truly match. Do not
  duplicate a web namespace into a child app catalog.

### 5. Wire the page without widening client boundaries

Prefer the shared exports for new code:

- server components and metadata: `getTranslations` from
  `@workspace/i18n/server`
- client components: `useTranslations`, `useLocale`, or the provider from
  `@workspace/i18n/client`
- locale-aware internal navigation: `Link`, `redirect`, `usePathname`, or
  `useRouter` from `@workspace/i18n/routing`

Use a direct `next-intl` import only for an API the shared package does not
export or when a narrow adjacent convention makes changing it safer. Avoid
unrelated import churn.

Keep server pages as server components. Translate there with `getTranslations`,
or translate inside an existing client child with `useTranslations`; do not add
`"use client"` to an entire page merely to access messages.

For `generateMetadata`, await `params`, pass `locale` explicitly to
`getTranslations`, and preserve the owning app's canonical/alternate helper.
Localize structured data wherever its human-readable fields mirror page copy.

### 6. Handle docs and Lingo correctly

For docs prose already represented by MDX, edit the English MDX instead of
moving it into a JSON catalog. Preserve frontmatter and component structure.
Only the frontmatter fields and component props listed in `.lingo/config.json`
are translated automatically. Never put backticks in docs frontmatter.

Treat `.lingo/config.json` as the repository's source/target scope and engine
authority. Treat `.lingo/lock.json` as generated state; never edit it manually.
Do not run Lingo, use `--force`, change engine settings, or mutate target locale
files unless the user explicitly requests translation output or configuration
changes. Routine source work is picked up by the main-branch localization
workflow.

If Lingo configuration or platform behavior must change, consult the current
official pages linked in the reference before editing.

### 7. Validate proportionally

1. Re-scan the affected JSX/TSX for remaining hard-coded user-facing copy.
2. Parse every edited JSON source catalog.
3. Run `pnpm i18n:verify-source-locales`.
4. Run `pnpm i18n:audit` when JSON namespaces changed and inspect its report.
5. Run the owning workspace's formatter/lint and type check from its
   `package.json` or `AGENTS.md`; run focused tests when present.
6. For docs content, run the docs frontmatter guard and regenerate Fumadocs
   sources when the app guidance requires it.
7. If the user explicitly requested generated translations, use the repo's
   scoped `pnpm i18n:app <app>` or `pnpm i18n:docs` command and review all
   generated target and lockfile changes.

Do not claim complete localization when a CMS record, fetched API value, or
Lingo-excluded content source remains English. State those boundaries.

## Report the result

Summarize the route and owned components localized, the source namespace or MDX
files changed, metadata and navigation handling, validations run, and any
content outside the automated Lingo scope. Mention that target locales will be
generated by the existing workflow when Lingo was not run.
