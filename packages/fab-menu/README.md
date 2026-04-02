# @solana-com/fab-menu

A React floating action button menu for Solana properties and external sites.

## Install

```json
{
  "dependencies": {
    "@solana-com/fab-menu": "workspace:*"
  }
}
```

For consumers outside this monorepo, install `@solana-com/fab-menu` alongside
`react` and `react-dom`.

This package is published to GitHub Packages and requires registry configuration
plus an auth token:

```ini
@solana-com:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

Then install with:

```bash
pnpm add @solana-com/fab-menu
```

## Usage

```tsx
import { SolanaFabMenu } from "@solana-com/fab-menu";

export function App() {
  return (
    <SolanaFabMenu
      position="bottom-right"
      apiUrl="https://solana.com/api/fab-menu"
      logoVariant="color"
      onOpen={() => console.log("opened")}
      onClose={() => console.log("closed")}
      onLinkClick={(href, tabId) => console.log("clicked", href, tabId)}
    />
  );
}
```

The component injects its own styles on first render.

## Prototype

A static kitchen-sink prototype is available at:

- `packages/fab-menu/prototype/index.html`

To preview the GitHub version in a browser, use:

- `https://htmlpreview.github.io/?https://github.com/solana-foundation/solana-com/blob/main/packages/fab-menu/prototype/index.html`

It mirrors the current package defaults and includes:

- all three FAB button variants: `dark-mono`, `light-mono`, and `color`
- desktop panel preview
- mobile sheet preview

Open it directly in a browser, or serve it from the repo root with a simple
static server, for example:

```bash
pnpm dlx serve packages/fab-menu/prototype
```

## Configuration

All props are optional.

| Prop          | Type                                                                                                       | Default                             | Description                              |
| ------------- | ---------------------------------------------------------------------------------------------------------- | ----------------------------------- | ---------------------------------------- |
| `position`    | `"bottom-right"` \| `"bottom-left"` \| `"top-right"` \| `"top-left"` \| `{ top?, bottom?, left?, right? }` | `"bottom-right"`                    | Screen position of the FAB               |
| `apiUrl`      | `string`                                                                                                   | `"https://solana.com/api/fab-menu"` | Endpoint to fetch menu data              |
| `zIndex`      | `number`                                                                                                   | `999999`                            | Z-index for the FAB and overlay          |
| `logoVariant` | `"dark-mono"` \| `"light-mono"` \| `"color"`                                                               | `"dark-mono"`                       | Solana logo treatment for the FAB button |
| `theme`       | `object`                                                                                                   | Solana dark theme                   | CSS custom property overrides            |
| `onOpen`      | `() => void`                                                                                               | —                                   | Fires when the menu opens                |
| `onClose`     | `() => void`                                                                                               | —                                   | Fires when the menu closes               |
| `onLinkClick` | `(href, tabId) => void`                                                                                    | —                                   | Fires when a menu link is clicked        |

## Theme overrides

```tsx
<SolanaFabMenu
  theme={{
    cta: "#FFFFFF",
    bg: "#000000",
    primary: "#FFFFFF",
    inverse: "#000000",
    highEmText: "#FFFFFF",
    midEmText: "#ABABBA",
    borderLight: "#ECE4FD1F",
    borderProminent: "#ECE4FD33",
    borderHovered: "#ECE4FD52",
  }}
/>
```

You can also override the generated CSS custom properties from the host page:

```css
.sfab-root {
  --sfab-cta: #9945ff;
  --sfab-primary: #14f195;
}
```

## Data source

The component fetches menu data from `apiUrl`, defaulting to
`https://solana.com/api/fab-menu`. If the request fails, it falls back to
hardcoded English defaults bundled in the package.

## Development

From the monorepo root:

```bash
pnpm --filter @solana-com/fab-menu build
pnpm --filter @solana-com/fab-menu dev
pnpm --filter @solana-com/fab-menu check-types
pnpm --filter @solana-com/fab-menu lint
```

## Publishing

This package publishes to GitHub Packages through
[`../../.github/workflows/publish-fab-menu.yml`](../../.github/workflows/publish-fab-menu.yml).

The release version comes from [`package.json`](./package.json). The workflow
enforces that the git tag matches that version exactly.

Release flow from the repo root:

```bash
pnpm --filter @solana-com/fab-menu build
git tag -a fab-menu-v$(node -p "require('./packages/fab-menu/package.json').version") -m "Publish fab-menu"
git push origin refs/tags/fab-menu-v$(node -p "require('./packages/fab-menu/package.json').version")
```

Before pushing the tag:

- bump the version in `packages/fab-menu/package.json`
- make sure the package builds cleanly
- verify the tag does not already exist on `origin`

The publish workflow currently runs on:

- `push` tags matching `fab-menu-v*`
- `workflow_dispatch`

Example: if the package version is `0.1.1`, the release tag must be
`fab-menu-v0.1.1`.

Consumer examples in this repo:

- `apps/accelerate/src/components/FabMenu.tsx`
- `apps/breakpoint/src/components/FabMenu.tsx`
