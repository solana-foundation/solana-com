---
name: migrate-page
description: Migrate a legacy page from apps/web/src/pages/ (Pages Router) to apps/web/src/app/ (App Router). Use when moving any existing page from the pages directory to the app directory.
argument-hint: [pages-router-file-path]
---

# Migrate Page (Pages Router → App Router)

Migrate a legacy Next.js page from `apps/web/src/pages/[locale]/` to `apps/web/src/app/[locale]/` following the project's established App Router patterns.

## When to Use This Skill

- Migrating any file under `apps/web/src/pages/[locale]/` to the App Router
- The target file or route is provided as: **$ARGUMENTS**
- If no file path or route was provided, ask the user which page to migrate

## Context

This project is mid-migration from Next.js Pages Router to App Router. The root layout at `apps/web/src/app/[locale]/layout.tsx` already provides:
- `<html>`, `<body>`, GTM, `NextIntlClientProvider`, `PostHogProvider`, `ThemeProvider`, `<Header>`, `<Footer>`
- `generateStaticParams` for all locales
- `generateMetadata` for base metadata

Legacy pages use `getStaticProps`/`getStaticPaths`, `useTranslations()`, `HTMLHead`, and a `Layout` component. All of these must be replaced with App Router equivalents.

## Migration Rules

### Step 1 — Identify the source page and understand it

Read the legacy page file completely. Identify:

1. **Route**: derive the App Router directory path (e.g. `pages/[locale]/solutions/defi.tsx` → `app/[locale]/solutions/defi/`)
2. **Data fetching**: what `getStaticProps` does (API calls, message loading, static data)
3. **Client-side features**: `useState`, `useEffect`, `useRef`, event handlers, dynamic imports with `ssr: false`, browser APIs
4. **Translations**: all `t()`, `t.rich()`, `t.raw()` calls
5. **Head/SEO**: `HTMLHead` props (title, description, socialShare)
6. **Layout wrapper**: `Layout` component usage and its props
7. **Imports**: which components, data files, and utilities are used

### Step 2 — Determine the file structure

Based on the analysis, decide on the output structure:

**Option A: Server component only (`page.tsx`)**
Use when the page has NO client-side hooks (`useState`, `useEffect`, `useRef`), no event handlers, no `dynamic()` imports with `ssr: false`, and no browser APIs.

**Option B: Server + Client split (`page.tsx` + `<page-name>.tsx`)**
Use when the page requires any client-side features. This is the common case for most legacy pages.

### Step 3 — Create `page.tsx` (Server Component)

Create `apps/web/src/app/[locale]/<route>/page.tsx`:

```tsx
import { PageNamePage } from "./<page-name>";
import { getIndexMetadata } from "@/app/metadata";
import { getTranslations } from "next-intl/server";

type Props = { params: Promise<{ locale: string }> };

export default async function Page(_props: Props) {
  const t = await getTranslations();

  // Data fetching that was in getStaticProps goes here
  // (API calls, file reads, etc.)

  const translations = {
    // All t() calls extracted here as flat props
    heroTitle: t("namespace.hero.title"),
    // Use t.rich() for rich text with HTML
    // Use t.raw() with type cast for arrays/objects
  };

  return <PageNamePage translations={translations} /* dataProps */ />;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return await getIndexMetadata({
    titleKey: "namespace.meta.title",    // or "namespace.title"
    descriptionKey: "namespace.meta.description", // or "namespace.description"
    path: "/route-path",
    locale,
  });
}
```

#### Key rules for `page.tsx`:

1. **Async server component** — no `"use client"`, no hooks
2. **Use `getTranslations` from `next-intl/server`** — NOT `useTranslations` from `next-intl`
3. **All `t()` calls happen here**, passed to client component via `translations` prop
4. **Data fetching replaces `getStaticProps`** — do it directly in the async component body
5. **`generateMetadata` replaces `HTMLHead`** — use `getIndexMetadata` from `@/app/metadata`
6. **Props type** is always `{ params: Promise<{ locale: string }> }`
7. **No `generateStaticParams`** needed per-page — the root layout handles it
8. **No message loading** needed — the root layout's `NextIntlClientProvider` handles it

### Step 4 — Create client component (`<page-name>.tsx`)

Only if the page needs client-side features. Create `apps/web/src/app/[locale]/<route>/<page-name>.tsx`:

```tsx
"use client";

// Import components, data, etc.

interface PageNamePageProps {
  translations: {
    heroTitle: string;
    // ... typed translation props
  };
  // ... data props from server
}

export function PageNamePage({ translations }: PageNamePageProps) {
  // Client-side hooks and logic here
  return (
    // JSX — no Layout wrapper, no HTMLHead
  );
}
```

#### Key rules for client component:

1. **`"use client"` directive** at the top
2. **Named export** (not default) — matches the import in `page.tsx`
3. **Typed `translations` interface** — all strings are `string`, arrays use proper types
4. **No `useTranslations()`** — all translations come via props
5. **No `Layout` wrapper** — the root layout already provides `<Header>` and `<Footer>`
6. **No `HTMLHead`** — metadata is handled by `generateMetadata` in `page.tsx`

### Step 5 — Handle specific migration patterns

#### 5a. Remove `Layout` wrapper
The legacy `Layout` component (`@/components/solutions/layout`) renders `<Header>` and `<Footer>`. The App Router root layout already provides these. **Remove the `Layout` wrapper entirely.**

If the `Layout` had a `className` prop (e.g. `className="bg-nd-bg"`), apply it to the outermost `<div>` in the client component instead.

#### 5b. Replace `HTMLHead` with `generateMetadata`
Map `HTMLHead` props to `generateMetadata`:
- `title` → `titleKey` in `getIndexMetadata`
- `description` → `descriptionKey` in `getIndexMetadata`
- `socialShare` → add as `openGraph.images` in the metadata return if custom

If the page uses a custom social share image, extend the metadata:
```tsx
export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const base = await getIndexMetadata({
    titleKey: "namespace.meta.title",
    descriptionKey: "namespace.meta.description",
    path: "/route-path",
    locale,
  });
  return {
    ...base,
    openGraph: {
      ...base.openGraph,
      images: ["/src/img/route/og-image.webp"],
    },
  };
}
```

#### 5c. Migrate `getStaticProps` data fetching
- Move API calls directly into the `Page` async function body
- Wrap in try/catch as needed
- Pass fetched data as additional props to the client component
- `revalidate: 60` from `getStaticProps` is not needed — App Router uses different caching strategies. For ISR-equivalent behavior, use route segment config:
  ```tsx
  export const revalidate = 60;
  ```
  Add this export at the top level of `page.tsx` if the page fetched dynamic data in `getStaticProps`.

#### 5d. Replace `useTranslations()` with server translations
- In the legacy page: `const t = useTranslations()` (client-side hook)
- In App Router `page.tsx`: `const t = await getTranslations()` (server-side)
- Extract ALL `t()` calls into the `translations` object in `page.tsx`
- For `t.rich()` calls with JSX formatters:
  - If the formatter is simple (e.g., wrapping in `<span>`), keep it in the client component using the raw translation string
  - Or pre-render to a `ReactNode` in `page.tsx` and type as `React.ReactNode` in the interface

#### 5e. Handle `dynamic()` imports with `ssr: false`
Replace `next/dynamic` with React.lazy + Suspense, or use `"use client"` boundary naturally:
```tsx
// Legacy:
const Component = dynamic(() => import("./Component"), { ssr: false });

// App Router — in the client component:
import dynamic from "next/dynamic";
const Component = dynamic(() => import("./Component"), { ssr: false });
// dynamic() still works in "use client" files
```

#### 5f. Handle `withLocales()` / `getStaticPaths`
**Remove entirely.** The root layout's `generateStaticParams` handles locale generation. No per-page `getStaticPaths` or `generateStaticParams` is needed.

#### 5g. Message loading (`import locales`)
**Remove entirely.** The root layout's `NextIntlClientProvider` already loads and provides messages.

#### 5h. Rich text translations with JSX
For `t.rich()` calls that use JSX formatters, you have two options:

**Option 1 (preferred):** Pass the raw string and handle formatting in the client component using a helper or inline JSX with the translation string.

**Option 2:** Render in `page.tsx` and pass as `React.ReactNode`:
```tsx
// In page.tsx:
const translations = {
  heroTitle: t.rich("index.hero.title", {
    light: (chunks) => <span className="font-light">{chunks}</span>,
  }),
};

// In interface:
interface Props {
  translations: {
    heroTitle: React.ReactNode;
  };
}
```

### Step 6 — Rename the source file
Add the `_m_` prefix to the source file.

### Step 7 — Verify the migration

1. **Check TypeScript**: Run type checking to ensure no errors
2. **Check imports**: Ensure all component imports resolve correctly from the new location
3. **Check route**: Verify the new page will be served at the same URL path
4. **Do NOT delete the legacy file** — the user will handle removal after testing

### Step 8 — Report changes

Summarize:
- Files created (with paths)
- What was migrated from `getStaticProps` → server component
- What was moved to the client component
- Any translation keys that may need updating
- Any components that may need adjustment
- Remind the user to test and then delete the legacy page file

## Checklist

- [ ] `page.tsx` is an async server component (no `"use client"`)
- [ ] `getTranslations` from `next-intl/server` used (not `useTranslations`)
- [ ] All `t()` calls are in `page.tsx`, not in the client component
- [ ] `generateMetadata` replaces `HTMLHead`
- [ ] No `Layout` wrapper (root layout provides Header/Footer)
- [ ] No `getStaticPaths` / `withLocales` / `generateStaticParams`
- [ ] No message loading (`import locales`)
- [ ] Client component has `"use client"` directive (if created)
- [ ] Client component uses named export (not default)
- [ ] `revalidate` export added if page had dynamic data in `getStaticProps`
- [ ] TypeScript types are correct
- [ ] Legacy file is NOT deleted (user will handle after testing)

## Common Pitfalls

1. **Don't use `useTranslations()` in `page.tsx`** — it's a client hook. Use `getTranslations()` from `next-intl/server`.
2. **Don't wrap in `Layout`** — the root layout already has Header/Footer. Duplicating them causes double headers.
3. **Don't add `generateStaticParams`** — the root layout handles all locale params.
4. **Don't forget to type the translations interface** — every string prop should be typed.
5. **Don't use default export for client component** — use named export to match the `page.tsx` import pattern.
6. **Don't leave `HTMLHead` in the client component** — it uses `next/head` which doesn't work in App Router.
7. **Don't import from `next/router`** — use `next/navigation` in App Router. (`useRouter`, `usePathname`, `useSearchParams`)

## Reference: Existing Migrated Pages

Study these for patterns:
- `apps/web/src/app/[locale]/universities/page.tsx` + `universities.tsx`
- `apps/web/src/app/[locale]/x402/page.tsx` + `x402.tsx`
- `apps/web/src/app/[locale]/privacyhack/page.tsx` + `privacyhack.tsx`
