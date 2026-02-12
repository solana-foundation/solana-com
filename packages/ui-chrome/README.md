# @solana-com/ui-chrome

Shared UI chrome components for the Solana.com monorepo, including Header,
Footer, ThemeProvider, and site-wide alerts.

## Installation

This package is included in the monorepo workspace. Apps can import it via:

```ts
import { Header, Footer, ThemeProvider, SitewideTopAlert } from "@solana-com/ui-chrome";
```

## Components

### Header

The main site navigation header.

### Footer

The site footer with links and branding.

### ThemeProvider

Provides dark/light theme context to the application.

### SitewideTopAlert

Displays an announcement banner at the top of all pages across all apps in the
monorepo.

## Site-Wide Alerts

The `SitewideTopAlert` component displays a gradient banner at the top of the
page for important announcements (e.g., conferences, product launches, etc.).

### Enabling an Alert

Edit `packages/ui-chrome/src/sitewide-top-alert-config.ts`:

```ts
export const sitewideTopAlertConfig: SitewideTopAlertConfig = {
  enabled: true, // Set to true to show the alert
  text: "Join us at Breakpoint 2025!",
  cta: {
    label: "Get Tickets",
    url: "/breakpoint",
  },
  color: "green", // or "purple"
  excludedPaths: ["/breakpoint/app"],
};
```

### Configuration Options

| Option          | Type                  | Description                                                                 |
| --------------- | --------------------- | --------------------------------------------------------------------------- |
| `enabled`       | `boolean`             | Set to `true` to display the alert site-wide                                |
| `text`          | `string`              | The main announcement message                                               |
| `cta.label`     | `string`              | Call-to-action button text                                                  |
| `cta.url`       | `string`              | URL the CTA links to (pages matching this URL won't show the alert)         |
| `color`         | `"green" \| "purple"` | Color theme - green uses the Solana gradient, purple uses an alt gradient   |
| `excludedPaths` | `string[]`            | Additional paths where the alert should not appear                          |

### Color Themes

- **green**: Gradient from teal (#00d18c) through green (#14f195) to purple
  (#9945ff) with black text
- **purple**: Gradient from purple (#9945ff) to green (#14f195) with white text

### Behavior

- The alert automatically hides on pages that match the CTA URL (to avoid
  showing "Get Tickets" on the tickets page itself)
- Additional pages can be excluded via the `excludedPaths` array
- The alert animates in with a slide-down effect on page load

### Disabling the Alert

Set `enabled: false` in the config file:

```ts
export const sitewideTopAlertConfig: SitewideTopAlertConfig = {
  enabled: false,
  // ... rest of config
};
```

## Usage in Apps

The alert is already integrated into the root layouts of:

- `apps/web` (main website)
- `apps/docs` (documentation)

It's imported from `@solana-com/ui-chrome` and rendered at the top of the page,
above the Header:

```tsx
import { Header, Footer, ThemeProvider, SitewideTopAlert } from "@solana-com/ui-chrome";

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

<!-- build -->
