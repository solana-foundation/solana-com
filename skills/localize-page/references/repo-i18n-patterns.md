# Solana.com page i18n patterns

Use this reference for repository-specific decisions. Verify paths against the
checkout before editing because the monorepo continues to evolve.

## Contents

- [Architecture](#architecture)
- [App and source matrix](#app-and-source-matrix)
- [Core `@workspace/i18n` drop-ins](#core-workspacei18n-drop-ins)
- [Server and client component patterns](#server-component-pattern)
- [Links and navigation](#links-and-navigation)
- [Metadata and structured data](#metadata-and-structured-data)
- [Message construction](#message-construction)
- [Docs content rules](#docs-content-rules)
- [Lingo.dev integration](#lingodev-integration)
- [Validation](#validation)

## Architecture

- `packages/i18n/src/config.ts` owns supported locales and the English default.
- `packages/i18n/src/messages.ts` owns app catalog loaders, English fallback,
  deep merging, and app inheritance.
- App request files connect `next-intl` to the appropriate `AppId`.
- Locale layouts load merged messages and provide `NextIntlClientProvider`.
- `@workspace/i18n/server`, `client`, and `routing` expose the preferred shared
  APIs for new code.
- `localePrefix: "as-needed"` means English has no URL prefix while other
  locales do.
- Most apps statically generate English and serve other locales dynamically.
- Child app catalogs inherit the web catalog. A child catalog should contain
  only app-specific messages.

The current inheritance graph in `packages/i18n/src/messages.ts` is:

```text
web
├── docs
├── accelerate
├── media
├── breakpoint
└── templates
```

## App and source matrix

| App          | Workspace               | UI source                                                  | Automated Lingo scope                  | Scoped command             |
| ------------ | ----------------------- | ---------------------------------------------------------- | -------------------------------------- | -------------------------- |
| Web          | `solana-com`            | `packages/i18n/messages/web/en/common.json`                | Web English JSON                       | `pnpm i18n:app web`        |
| Docs UI      | `solana-docs`           | Inherited web English JSON                                 | Run as web UI, not docs content        | `pnpm i18n:app web`        |
| Docs content | `solana-docs`           | English MDX and `meta.json` listed in `.lingo/config.json` | Configured docs and learn patterns     | `pnpm i18n:docs`           |
| Media        | `solana-com-media`      | `packages/i18n/messages/media/en/common.json`              | Media English JSON                     | `pnpm i18n:app media`      |
| Templates    | `solana-templates`      | `packages/i18n/messages/templates/en/common.json`          | Templates English JSON                 | `pnpm i18n:app templates`  |
| Accelerate   | `solana-com-accelerate` | `packages/i18n/messages/accelerate/en/common.json`         | Accelerate English JSON                | `pnpm i18n:app accelerate` |
| Breakpoint   | `solana-com-breakpoint` | `packages/i18n/messages/breakpoint/en/breakpoint.json`     | Not configured; the command is a no-op | `pnpm i18n:app breakpoint` |

The docs app has no local JSON loader. Its React UI namespaces, including shared
learn/developer UI, currently come from the web catalog. Do not add
`messages/docs` without an explicit architecture change.

The templates app currently renders with English as its layout locale even
though translated target catalogs exist. Localize source copy consistently, but
do not redesign templates routing during a page-only task.

## Core `@workspace/i18n` drop-ins

The package exposes each source module through `@workspace/i18n/<module>`.
Prefer these shared contracts over reimplementing `next-intl` setup or importing
framework navigation directly.

| Module       | Public API to prefer                                                                                                              | Use it for                                                                   |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `client`     | `NextIntlClientProvider`, `useLocale`, `useMessages`, `useTranslations`                                                           | Client components and locale providers                                       |
| `server`     | `getRequestConfig`, `getTranslations`                                                                                             | Server components, metadata, and request configuration internals             |
| `routing`    | `routing`, `Link`, `redirect`, `usePathname`, `useRouter`, `getAlternates`, `withLocales`, `slugWithLocales`, `pathsWithLocales`  | Locale-aware same-app navigation, canonical alternates, and static params    |
| `request`    | `createAppRequestConfig`, `loadAppRequestMessages`                                                                                | Standard app request files and typed full-message loading                    |
| `messages`   | `resolveLocale`, `deepMergeMessages`, `loadAppMessages`, `loadMergedMessages`, `getEnglishFallbackMessages`, `getMessageFallback` | Layouts, route handlers, social images, and app catalog inheritance/fallback |
| `config`     | `locales`, `languages`, `defaultLocale`, `namespaces`, `staticLocales`                                                            | Canonical locale data and language labels                                    |
| `pathname`   | `getLocaleFromPathname`, `getPathnameWithoutLocale`                                                                               | Parsing raw URL strings and middleware paths                                 |
| `plugin`     | `createNextIntlPlugin`                                                                                                            | Wiring an app request file into `next.config.ts`                             |
| `middleware` | `createMiddleware`, `routing`, `routingWithoutDetection`, `SHARED_LOCALE_COOKIE`, cookie, pathname, and proxy-origin helpers      | Locale routing across the multi-app deployment                               |
| `use-router` | compatibility `useRouter` and locale-free `usePathname`                                                                           | Existing shared code that must span Pages Router and App Router              |

`@workspace/i18n/alternates` and `@workspace/i18n/load-messages` are lower-level
entry points. Prefer `getAlternates` from `routing` and the app-aware
`request`/`messages` loaders unless the existing code genuinely needs those
primitives.

Use `@workspace/i18n/use-router` only for the existing mixed-router
compatibility case. New App Router components should normally use
`useRouter`/`usePathname` from `@workspace/i18n/routing`.

If the shared package does not export a needed API, such as `useFormatter`,
importing that API directly from `next-intl` is valid. Keep the exception
narrow; do not bypass the shared routing, message-loading, or request contracts.

Use `loadMergedMessages` instead of importing locale JSON directly when code
needs a complete catalog. It applies app inheritance and English fallback.
Ordinary components should still use `getTranslations` or `useTranslations`
rather than loading entire catalogs.

For standard request setup, prefer:

```ts
import { createAppRequestConfig } from "@workspace/i18n/request";

export default createAppRequestConfig("breakpoint");
```

Use a custom request callback only when the owning app has a verified
requirement not covered by the shared factory.

For app configuration, prefer:

```ts
import { createNextIntlPlugin } from "@workspace/i18n/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");
```

For the main web app, use middleware `routing` with locale detection. For
separately deployed apps reached through web rewrites, use
`routingWithoutDetection` and preserve proxied locale-cookie behavior by
following the adjacent middleware pattern. Do not change this distinction in a
page-only task.

## Server component pattern

Pass the route locale explicitly when available, especially for metadata and
static rendering:

```tsx
import { getTranslations } from "@workspace/i18n/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Page({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "routeName" });

  return <h1>{t("hero.title")}</h1>;
}
```

Passing a namespace to `getTranslations` is supported, but the object form makes
locale ownership explicit and is preferable when `params.locale` is already
present.

## Client component pattern

Do not turn the route into a client component just to translate a client-owned
section:

```tsx
"use client";

import { useTranslations } from "@workspace/i18n/client";

export function SearchForm() {
  const t = useTranslations("routeName.form");

  return (
    <label>
      {t("label")}
      <input placeholder={t("placeholder")} />
    </label>
  );
}
```

If a server component already owns the copy and a client child is presentation
only, passing translated string props is also valid. Match the narrower local
pattern.

## Links and navigation

### Same-app routes

Use the shared locale-aware link for routes owned by the current deployed app:

```tsx
import { Link } from "@workspace/i18n/routing";

<Link href="/data">{t("actions.exploreData")}</Link>;
```

The configured `Link` adds or changes the locale prefix according to
`localePrefix: "as-needed"`. Its `usePathname` returns a pathname without the
locale prefix, and its `useRouter` provides locale-aware client navigation. Do
not manually build `/${locale}/...` hrefs.

### Sibling-app routes

Routes can share the public `solana.com` origin while being owned by different
Next.js deployments. A client-side Next navigation to a sibling route asks the
wrong app router to resolve it. Use a full document navigation:

```tsx
<a href="/docs">{t("actions.readDocs")}</a>
```

Keep the href relative to the public origin. Do not link to the deployment hosts
from `apps/web/apps-urls.ts`. Do not manually prefix the locale: the shared
`SOLANA_LOCALE` cookie and destination middleware restore the preferred locale
on the full request.

Determine ownership from:

1. `apps/web/rewrites-redirects.ts`
2. `packages/ui-chrome/src/url-config.ts`
3. the target app's `next.config.ts`

The ordering matters for overlapping paths such as `/developers/templates`
versus broader docs-owned `/developers` routes.

### Reusable links

When a shared component accepts arbitrary internal or external targets, use the
cross-app-aware chrome link:

```tsx
import { Link } from "@solana-com/ui-chrome/link";

<Link href={href}>{label}</Link>;
```

It calls `shouldUseNextLink` from `@solana-com/ui-chrome/url-config`. On the web
app, routes owned by sibling apps become anchors; on a non-web app, only routes
owned by that app use client navigation. Non-web apps declare ownership with
`NEXT_PUBLIC_APP_NAME` in `next.config.ts`.

The chrome link is a client component. Do not turn a server-rendered page into a
client component solely to use it. When a server component has a known target,
render the same-app i18n `Link` or cross-app anchor directly.

If an app-owned component cannot use the chrome link but still accepts variable
targets, call `shouldUseNextLink` and render either `@workspace/i18n/routing`'s
`Link` or an anchor. Do not use `next/link` for the localized branch.

### External and special links

Use normal anchors for:

- `https://`, `http://`, and protocol-relative URLs
- `mailto:` and `tel:`
- downloads
- hash-only navigation when no established local component requires otherwise

Preserve appropriate `target`, `rel`, download, and accessibility behavior.
Translate the visible label and accessible name, not the href.

## Metadata and structured data

Localize metadata from the same route namespace and keep each app's URL helper:

```tsx
import type { Metadata } from "next";
import { getAlternates } from "@workspace/i18n/routing";
import { getTranslations } from "@workspace/i18n/server";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "routeName.metadata",
  });

  return {
    title: t("title"),
    description: t("description"),
    alternates: getAlternates("/route-name", locale),
  };
}
```

Web and docs commonly use `getAlternates`. Accelerate and Breakpoint have
microsite-aware metadata helpers that preserve their public route prefix; use
those helpers instead of substituting the generic one. Media also has its own
metadata and content model. Preserve the adjacent app pattern.

Human-readable JSON-LD fields should use localized strings and the route locale.
Keep schema URLs, identifiers, dates, and numeric values machine-readable.

## Message construction

Prefer a semantic namespace:

```json
{
  "routeName": {
    "metadata": {
      "title": "Page title",
      "description": "Page description"
    },
    "hero": {
      "title": "Build with Solana",
      "description": "Tools for {audience}"
    },
    "actions": {
      "getStarted": "Get started"
    },
    "aria": {
      "openMenu": "Open navigation menu"
    }
  }
}
```

Use interpolation:

```tsx
t("results", { count: results.length });
```

Use rich messages when tags must stay inside a grammatical unit:

```json
{
  "terms": "Read the <link>terms of service</link>."
}
```

```tsx
t.rich("terms", {
  link: (chunks) => <Link href="/tos">{chunks}</Link>,
});
```

Do not build sentences with multiple translated fragments. Word order,
pluralization, punctuation, and markup placement differ across locales.

## Docs content rules

The current `.lingo/config.json` translates:

- `apps/docs/content/docs/en/**/*.mdx`, excluding RPC content
- `apps/docs/content/learn/en/*.mdx`
- `apps/docs/content/docs/en/**/meta.json`, excluding RPC metadata

The config lists the frontmatter fields and MDX component props Lingo may
translate. Content outside those patterns is not automatically localized. Check
the configuration before promising coverage for cookbook, guides, nested learn
files, RPC docs, or newly introduced content trees.

Keep code samples, imports, component names, URLs, and technical identifiers
stable. Preserve frontmatter syntax, and do not use backticks in frontmatter;
`scripts/i18n/verify-docs-frontmatter.mjs` enforces this.

## Lingo.dev integration

The repository uses the current `@lingo.dev/cli` with:

- `.lingo/config.json` for organization, engine, locales, and source patterns
- `.lingo/lock.json` for tracked localization state
- `scripts/i18n/run.mjs` for repo-scoped commands
- `.github/workflows/i18n.yml` to run incremental localization after changes
  reach `main` and open an i18n pull request

Normal `lingo push` runs are incremental. The repo uses `--wait` explicitly so
the command returns after translated files have been written. Do not use
`--force` for routine source changes: it retranslates and overwrites all target
keys in scope.

Every CLI request is routed through the engine in `.lingo/config.json`. Engine
brand voice, instructions, and glossary rules apply automatically. Keep product
terminology policy in the engine rather than duplicating per-language rules in
page code.

Before changing Lingo configuration or behavior, consult the current official
documentation:

- [Localization platform](https://lingo.dev/en/docs/platform)
- [Localization engines](https://lingo.dev/en/docs/platform/engines)
- [Instructions](https://lingo.dev/en/docs/platform/instructions)
- [Glossaries](https://lingo.dev/en/docs/platform/glossaries)
- [Current CLI overview](https://lingo.dev/en/docs/cli)
- [Continuous localization](https://lingo.dev/en/docs/workflows)

Never commit API keys. Local commands authenticate through `LINGO_API_KEY` or a
Lingo login session.

## Validation

Start with source-only checks:

```bash
node -e 'JSON.parse(require("fs").readFileSync(process.argv[1], "utf8"))' \
  packages/i18n/messages/<app>/en/common.json
pnpm i18n:verify-source-locales
pnpm i18n:audit
```

Use the owning workspace's actual scripts. Common targeted checks are:

```bash
pnpm --filter solana-com lint
pnpm --filter solana-com test
pnpm --filter solana-docs lint
pnpm --filter solana-docs postinstall
pnpm --filter solana-com-media lint
pnpm --filter solana-com-media typecheck
pnpm --filter solana-com-media test
pnpm --filter solana-templates lint
pnpm --filter solana-templates check-types
pnpm --filter solana-com-accelerate lint
pnpm --filter solana-com-accelerate check-types
pnpm --filter solana-com-breakpoint lint
pnpm --filter solana-com-breakpoint check-types
pnpm --filter solana-com-breakpoint test
```

Run only commands that exist in the current workspace. Prefer focused tests and
targeted checks before root-wide Turborepo tasks.
