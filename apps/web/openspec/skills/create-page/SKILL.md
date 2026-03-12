---
name: create-page
description: Scaffold a new page in apps/web/src/app following the project's established pattern. Use when creating any new page or route under the web app.
argument-hint: [/route-path]
---

# Create Page

Scaffold a new page in `apps/web/src/app/` following the project's established pattern. All pages are created under the `[locale]` dynamic segment at `apps/web/src/app/[locale]/`.

## When to Use This Skill

- Any time a new page or route is being created in `apps/web/src/app/`
- Adding a landing page, event page, or any new section to solana.com
- Duplicating a page structure for a new campaign or feature

## Instructions

Create a new page at route: **$ARGUMENTS**

If no route was provided, ask the user for the desired route path (e.g. `/hackathon`, `/universities/spring-2026`).

### Step 1 — Determine naming conventions

Parse the route to derive:
- **Directory path**: under `apps/web/src/app/[locale]/` (e.g. `/universities/spring-2026` → `universities/spring-2026/`)
- **Translation namespace**: dot-separated key (e.g. `universities.spring2026`)
- **Component name**: PascalCase (e.g. `Spring2026Page`)
- **File name**: kebab-case (e.g. `spring-2026.tsx`)

### Step 2 — Ask the user what sections the page needs

Unless already specified, ask what content sections are needed (hero, timeline, CTA, cards, etc.).

### Step 3 — Create the server component (`page.tsx`)

This is the **required** entry point for every page.

Rules:
- Async server component — no `"use client"`
- All `t()` calls happen here, NOT in client components
- Use `t()` for strings, `t.raw()` with type cast for arrays/objects
- Export `generateMetadata` using `getIndexMetadata` from `@/app/metadata`
- Props type is `{ params: Promise<{ locale: string }> }`
- If the page is simple (no client-only hooks or components), render JSX directly in this file
- If a separate client component is needed, pass a single `translations` object as its only prop

### Step 4 (optional) — Create a client component (`<page-name>.tsx`)

Only create a separate client component when the page requires client-only features such as `useState`, `useEffect`, `useRef`, event handlers, browser APIs, or third-party client-only components.

Rules:
- `"use client"` directive at top
- Named export (not default) matching the import in `page.tsx`
- Define a `*PageProps` interface with a typed `translations` object
- Use existing shared components from `@/components/` where applicable

### Step 5 — Add translation keys

Add English keys to `apps/web/public/locales/en/common.json`:
- Namespace matches the route (e.g. `privacyhack`, `universities`)
- Nested pages use dot-separated keys (e.g. `universities.hackathon.*`)
- Root-level `title` and `description` are used by `generateMetadata`
- Arrays are stored as JSON arrays and accessed via `t.raw()`
- Only edit the `en` locale — other locales are handled by the i18n pipeline

### Step 6 — Verify

Check for TypeScript issues to confirm the page builds without errors.

### Guardrails

- Follow exact patterns from existing pages (`privacyhack/`, `universities/`, `universities/hackathon-fall-2025/`)
- Keep the scaffold minimal with placeholder translations — do not invent content
- `page.tsx` and translation keys are always required
- A separate client component is only needed when client-only hooks or components are used — do not create one unnecessarily

## Examples

### Simple page — server component only (`page.tsx`)

When no client-only features are needed, everything lives in `page.tsx`:

```tsx
import { getTranslations } from "next-intl/server";
import { getIndexMetadata } from "@/app/metadata";

type Props = { params: Promise<{ locale: string }> };

export default async function Page(_props: Props) {
  const t = await getTranslations();

  return (
    <div className="overflow-hidden">
      <h1>{t("pageName.hero.title")}</h1>
      <p>{t("pageName.hero.subtitle")}</p>
    </div>
  );
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return await getIndexMetadata({
    titleKey: "pageName.title",
    descriptionKey: "pageName.description",
    path: "/page-name",
    locale,
  });
}
```

### Page with client component — `page.tsx` + `<page-name>.tsx`

When client-only hooks/components are required, split into two files:

**`page.tsx`** (server component — handles i18n):

```tsx
import { PageNamePage } from "./page-name";
import { getTranslations } from "next-intl/server";
import { getIndexMetadata } from "@/app/metadata";

type Props = { params: Promise<{ locale: string }> };

export default async function Page(_props: Props) {
  const t = await getTranslations();

  const translations = {
    heroTitle: t("pageName.hero.title"),
    heroSubtitle: t("pageName.hero.subtitle"),
    // ... all translation keys passed as props
  };

  return <PageNamePage translations={translations} />;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return await getIndexMetadata({
    titleKey: "pageName.title",
    descriptionKey: "pageName.description",
    path: "/page-name",
    locale,
  });
}
```

**`<page-name>.tsx`** (client component — uses hooks/browser APIs):

```tsx
"use client";

import React from "react";

interface PageNamePageProps {
  translations: {
    heroTitle: string;
    heroSubtitle: string;
    // ... typed translation props
  };
}

export function PageNamePage({ translations }: PageNamePageProps) {
  return (
    <div className="overflow-hidden">
      {/* Sections using translations.* */}
    </div>
  );
}
```

### Translation keys (`apps/web/public/locales/en/common.json`)

```json
"pageName": {
  "title": "Page Title | Solana",
  "description": "Meta description for SEO",
  "hero": {
    "title": "...",
    "subtitle": "..."
  }
}
```
