# @solana-com/fab-menu

A floating action button (FAB) that opens the Solana "Get Started" menu.
Designed for use on Solana.com subdomains and external sites.

~7KB gzipped. Bundles Preact internally — no framework required on the host
page.

## Quick start

### Vanilla JS / Web Component

```js
import "@solana-com/fab-menu/web-component";

// Drop into the page — that's it
const fab = document.createElement("solana-fab-menu");
document.body.appendChild(fab);
```

Or configure via attributes:

```html
<solana-fab-menu
  position="bottom-left"
  api-url="https://solana.com/api/fab-menu"
></solana-fab-menu>
```

Or configure via JS:

```js
const fab = document.querySelector("solana-fab-menu");
fab.configure({
  position: "bottom-right",
  apiUrl: "https://solana.com/api/fab-menu",
  zIndex: 999999,
  onLinkClick: (href, tabId) => console.log("clicked", href, tabId),
});
```

### React

```tsx
import { SolanaFabMenu } from "@solana-com/fab-menu/react";

function App() {
  return (
    <SolanaFabMenu
      position="bottom-right"
      apiUrl="https://solana.com/api/fab-menu"
      onOpen={() => console.log("opened")}
      onClose={() => console.log("closed")}
    />
  );
}
```

### Monorepo

Add the dependency in your app's `package.json`:

```json
{
  "@solana-com/fab-menu": "workspace:*"
}
```

Then import using either the React or web component path above.

## Configuration

All properties are optional.

| Property      | Type                                                                                                       | Default                             | Description                               |
| ------------- | ---------------------------------------------------------------------------------------------------------- | ----------------------------------- | ----------------------------------------- |
| `position`    | `"bottom-right"` \| `"bottom-left"` \| `"top-right"` \| `"top-left"` \| `{ top?, bottom?, left?, right? }` | `"bottom-right"`                    | Screen position of the FAB                |
| `apiUrl`      | `string`                                                                                                   | `"https://solana.com/api/fab-menu"` | Endpoint to fetch menu data               |
| `zIndex`      | `number`                                                                                                   | `999999`                            | Z-index for the FAB and overlay           |
| `theme`       | `object`                                                                                                   | Solana dark theme                   | CSS custom property overrides (see below) |
| `onOpen`      | `() => void`                                                                                               | —                                   | Fires when the menu opens                 |
| `onClose`     | `() => void`                                                                                               | —                                   | Fires when the menu closes                |
| `onLinkClick` | `(href, tabId) => void`                                                                                    | —                                   | Fires when a menu link is clicked         |

### Theme overrides

Pass a `theme` object to customize colors. Values map to `--sfab-*` CSS custom
properties.

```js
fab.configure({
  theme: {
    cta: "#FFFFFF",
    bg: "#000000",
    primary: "#FFFFFF",
    inverse: "#000000",
    highEmText: "#FFFFFF",
    midEmText: "#ABABBA",
    borderLight: "#ECE4FD1F",
    borderProminent: "#ECE4FD33",
    borderHovered: "#ECE4FD52",
  },
});
```

Or override via CSS on the host page:

```css
.sfab-root {
  --sfab-cta: #9945ff;
  --sfab-primary: #14f195;
}
```

### Fonts

The menu uses the Diatype font with system sans-serif fallback. To load Diatype
on your subdomain, add the appropriate `@font-face` declarations or `<link>`
tag. The menu works fine with system fonts if Diatype isn't available.

## API route

The package fetches menu data from an API endpoint. The default endpoint is
served from the main Solana.com web app at `/api/fab-menu`.

Query parameters:

| Param    | Default | Description                         |
| -------- | ------- | ----------------------------------- |
| `locale` | `en`    | Language code for translated labels |

Example: `https://solana.com/api/fab-menu?locale=es`

The endpoint returns:

```json
{
  "title": "Get Started",
  "tabs": [
    { "id": "institution", "title": "Institution", "icon": "bank" },
    { "id": "user", "title": "User", "icon": "avatar" },
    { "id": "developer", "title": "Developer", "icon": "code" }
  ],
  "links": {
    "institution": [
      { "title": "Tokenize an asset", "href": "/solutions/tokenization" }
    ]
  }
}
```

If the API is unreachable, the FAB falls back to hardcoded English defaults.

## Development

From the monorepo root:

```bash
# Install dependencies
pnpm install

# Build the package
pnpm --filter @solana-com/fab-menu build

# Watch mode (rebuilds on file changes)
pnpm --filter @solana-com/fab-menu dev

# Type check
pnpm --filter @solana-com/fab-menu check-types

# Lint
pnpm --filter @solana-com/fab-menu lint
```

### Testing locally

1. Start the web app dev server (serves the `/api/fab-menu` endpoint):

```bash
pnpm dev --filter solana-com
```

2. In another terminal, build the FAB package in watch mode:

```bash
pnpm --filter @solana-com/fab-menu dev
```

3. Create a test HTML file anywhere:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>FAB Test</title>
  </head>
  <body>
    <h1>FAB Menu Test</h1>
    <script type="module">
      import "/path/to/packages/fab-menu/dist/web-component.js";
    </script>
    <solana-fab-menu
      position="bottom-right"
      api-url="http://localhost:3000/api/fab-menu"
    ></solana-fab-menu>
  </body>
</html>
```

4. Serve it with any static server (`npx serve .`) and verify:
   - FAB renders in the configured corner
   - Clicking the FAB opens the menu panel
   - Tabs switch and show the correct links
   - Escape key and overlay click close the panel
   - Links open in new tabs

### Testing the React wrapper

```tsx
import { SolanaFabMenu } from "@solana-com/fab-menu/react";

export default function TestPage() {
  return (
    <div>
      <h1>React FAB Test</h1>
      <SolanaFabMenu
        position="bottom-right"
        apiUrl="http://localhost:3000/api/fab-menu"
        onOpen={() => console.log("opened")}
        onClose={() => console.log("closed")}
        onLinkClick={(href, tab) => console.log("click", href, tab)}
      />
    </div>
  );
}
```

## Publishing

The package is configured with `"private": false` and `"files": ["dist"]`. To
publish:

```bash
pnpm --filter @solana-com/fab-menu build
cd packages/fab-menu
npm publish --access public
```

## Exports

| Path                                 | Description                                                                                    |
| ------------------------------------ | ---------------------------------------------------------------------------------------------- |
| `@solana-com/fab-menu`               | Core exports: `FabApp`, `FabButton`, `GetStartedPanel`, `fetchMenuData`, `injectStyles`, types |
| `@solana-com/fab-menu/react`         | `SolanaFabMenu` React component                                                                |
| `@solana-com/fab-menu/web-component` | Self-registering `<solana-fab-menu>` custom element                                            |

## Architecture

- **Preact** (~3KB) renders the UI inside a standard DOM tree
- **CSS scoping** via `sfab-` class prefix on all styles — no Shadow DOM
- **Styles injected** into `<head>` as a `<style data-sfab>` tag on first mount
- **Dialog behavior** is a lightweight custom implementation (~85 lines)
  replacing Radix: focus trap, Escape key, overlay click, scroll lock
- **Menu data** fetched from API with 5s timeout, cached for session, falls back
  to bundled defaults
