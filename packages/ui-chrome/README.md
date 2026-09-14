# @solana-com/ui-chrome

Shared UI chrome for the Solana.com monorepo: Header, Footer, ThemeProvider,
site-wide alerts, docs search, Link with cross-app navigation, and supporting
components.

## Installation

This package is part of the monorepo workspace. Apps depend on it via the
workspace and import from the main entry or subpaths:

```ts
// Main entry – chrome components and config
import {
  Header,
  Footer,
  ThemeProvider,
  SitewideTopAlert,
  DocsSearchBar,
  NewsletterModal,
  DocsSidebarToggleIcon,
  DOCS_SIDEBAR_TOGGLE_SLOT_ID,
  LanguageSelector,
  sitewideTopAlertConfig,
} from "@solana-com/ui-chrome";
import type { SitewideTopAlertConfig } from "@solana-com/ui-chrome";

// Subpath – Link and InlineLink (cross-app aware)
import { Link, InlineLink } from "@solana-com/ui-chrome/link";

// Subpath – URL routing helper for cross-app links
import { shouldUseNextLink } from "@solana-com/ui-chrome/url-config";
```

## Components

### Header

Main site navigation header.

### Footer

Site footer with links and branding.

### ThemeProvider

Provides dark/light theme context to the app.

### SitewideTopAlert

Announcement banner at the top of the page. Configurable via
`sitewideTopAlertConfig` (see [Site-Wide Alerts](#site-wide-alerts)).

### DocsSearchBar

Search button that opens the docs search modal and displays its `⌘ K` keyboard
shortcut on larger viewports. The optional `expanded` prop adds a visible label
and full-width styling. Opens on `⌘/Ctrl-K` from anywhere, and a `?search=`
query parameter opens it with the query seeded.

### useDocsSearch

The hook behind the bar: debounced, aborts superseded requests, and returns
`{ results, resultsQuery, state }`. `resultsQuery` is the query the current
results actually describe — after a rate-limited request the previous results
stay on screen, so label, announce and report against it rather than against
whatever is currently typed.

### NewsletterModal

Modal for newsletter sign-up (e.g. Iterable). Props: `formId`, `children`
(trigger).

### DocsSidebarToggleIcon / DOCS_SIDEBAR_TOGGLE_SLOT_ID

Icon component and slot ID for the docs sidebar toggle. Used by the docs app to
portal the toggle into the header.

### LanguageSelector

Dropdown for switching locale (uses `@workspace/i18n` and next-intl).

## Subpath exports

### `@solana-com/ui-chrome/link`

- **Link** – Anchor that uses Next.js `Link` for in-app routes and `<a>` for
  cross-app routes (based on `url-config`). Supports `to`/`href`,
  `activeClassName`, `partiallyActive`, `partiallyActiveIgnore`, `scroll`,
  `prefetch`, and standard anchor props.
- **InlineLink** – Simple external-style link (e.g. `target="_blank"`,
  `rel="noopener noreferrer"`). Props: `to`, `children`, plus anchor props.

Apps often re-export these from their own `utils/Link` (e.g. `apps/web`,
`apps/docs`).

### `@solana-com/ui-chrome/url-config`

- **shouldUseNextLink(href)** – Returns whether `href` should use Next.js `Link`
  (client navigation) or a plain `<a>` (full page load). All apps are served
  under solana.com via rewrites; this keeps cross-app navigation as full loads
  and in-app as client nav. Depends on `NEXT_PUBLIC_APP_NAME` in non-web apps.

## Docs search

`DocsSearchBar` calls the origin-relative `/api/ask/search`, which is served by
the proxy Route Handler in `apps/web` (`src/app/api/ask/[...path]/route.ts`).
The browser never talks to the search service directly — it publishes no CORS
headers, and the upstream credential is server-only.

- **Env (web only, both server-only)**: `ASK_API_URL` and `ASK_PROXY_SECRET`.
  Never expose either as `NEXT_PUBLIC_*`. Unset, the proxy fails closed with a
  503 and the bar shows a quiet unavailable state.
- **Env (other consumers)**: behind solana.com the same-origin call resolves on
  its own. An app running on its own origin (local port, per-project preview)
  needs `NEXT_PUBLIC_WEB_APP_URL` so its `next.config.ts` can forward
  `/api/ask/*` to the web app; otherwise search 404s there.
- **Components**: Use `DocsSearchBar`; no extra setup in app code beyond env and
  layout placement.

## Site-Wide Alerts

`SitewideTopAlert` shows a gradient banner at the top of the page for
announcements (e.g. conferences, launches).

### Enabling an alert

Edit `packages/ui-chrome/src/sitewide-top-alert-config.ts`:

```ts
export const sitewideTopAlertConfig: SitewideTopAlertConfig = {
  enabled: true,
  text: "Join us at Breakpoint 2025!",
  cta: {
    label: "Get Tickets",
    url: "/breakpoint",
  },
  color: "green", // or "purple"
  excludedPaths: ["/breakpoint/app"],
};
```

### Configuration options

| Option          | Type                  | Description                                                          |
| --------------- | --------------------- | -------------------------------------------------------------------- |
| `enabled`       | `boolean`             | Set to `true` to display the alert site-wide                         |
| `text`          | `string`              | Main announcement message                                            |
| `cta.label`     | `string`              | Call-to-action button text                                           |
| `cta.url`       | `string`              | URL the CTA links to (pages matching this URL do not show the alert) |
| `color`         | `"green" \| "purple"` | Theme: green = Solana gradient, purple = alt gradient                |
| `excludedPaths` | `string[]`            | Extra paths where the alert is hidden                                |

### Color themes

- **green**: Gradient teal (#00d18c) → green (#14f195) → purple (#9945ff), black
  text.
- **purple**: Gradient purple (#9945ff) → green (#14f195), white text.

### Behavior

- Alert is hidden on the CTA URL and on any `excludedPaths`.
- Slide-down animation on load.

### Disabling the alert

Set `enabled: false` in the config file.

## Usage in apps

The alert is integrated in the root layouts of:

- `apps/web`
- `apps/docs`

Example layout with chrome and alert:

```tsx
import {
  Header,
  Footer,
  ThemeProvider,
  SitewideTopAlert,
} from "@solana-com/ui-chrome";

export default function RootLayout({ children }) {
  return (
    <ThemeProvider>
      <SitewideTopAlert />
      <Header />
      {children}
      <Footer />
    </ThemeProvider>
  );
}
```

## Dependencies

- **Peer**: `@workspace/i18n`, `next`, `next-intl`, `react`, `react-dom`
- **Docs search**: no client SDK; calls `/api/ask/search` on the current origin
