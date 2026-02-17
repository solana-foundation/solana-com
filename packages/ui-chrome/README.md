# @solana-com/ui-chrome

Shared UI chrome for the Solana.com monorepo: Header, Footer, ThemeProvider,
site-wide alerts, Inkeep search/chat, Link with cross-app navigation, and
supporting components.

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
  InkeepChatButton,
  InkeepSearchBar,
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

### InkeepChatButton

Floating or inline button that opens the Inkeep AI search + chat modal. Requires
`NEXT_PUBLIC_INKEEP_API_KEY`. Supports `variant`: `"fixed"` (default) or
`"inline"`.

### InkeepSearchBar

Search bar that opens the same Inkeep modal. Used in docs hero and elsewhere.
Optional `expanded` prop for always-expanded styling.

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

- **shouldUseNextLink(href)** – Returns whether `href` should use Next.js
  `Link` (client navigation) or a plain `<a>` (full page load). All apps are
  served under solana.com via rewrites; this keeps cross-app navigation as full
  loads and in-app as client nav. Depends on `NEXT_PUBLIC_APP_NAME` in
  non-web apps.

## Inkeep (AI search & chat)

Inkeep is wired in `src/inkeep-config.ts` and used by `InkeepChatButton` and
`InkeepSearchBar`. The modal is themed for Solana (dark/light) and uses
`@inkeep/cxkit-react`.

- **Env**: Set `NEXT_PUBLIC_INKEEP_API_KEY` in apps that use Inkeep (e.g. web,
  docs).
- **Components**: Use `InkeepChatButton` and/or `InkeepSearchBar`; no extra
  setup in app code beyond env and layout placement.

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

| Option          | Type                  | Description                                                                 |
| --------------- | --------------------- | --------------------------------------------------------------------------- |
| `enabled`       | `boolean`             | Set to `true` to display the alert site-wide                                |
| `text`          | `string`              | Main announcement message                                                   |
| `cta.label`     | `string`              | Call-to-action button text                                                  |
| `cta.url`       | `string`              | URL the CTA links to (pages matching this URL do not show the alert)       |
| `color`         | `"green" \| "purple"` | Theme: green = Solana gradient, purple = alt gradient                       |
| `excludedPaths` | `string[]`            | Extra paths where the alert is hidden                                       |

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
  InkeepChatButton,
} from "@solana-com/ui-chrome";

export default function RootLayout({ children }) {
  return (
    <ThemeProvider>
      <SitewideTopAlert />
      <Header />
      {children}
      <Footer />
      <InkeepChatButton />
    </ThemeProvider>
  );
}
```

## Dependencies

- **Peer**: `@workspace/i18n`, `next`, `next-intl`, `react`, `react-dom`
- **Inkeep**: `@inkeep/cxkit-react`; set `NEXT_PUBLIC_INKEEP_API_KEY` where used
