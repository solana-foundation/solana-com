# `solana-lib` migration inventory (ECO-814)

This starting inventory was taken before the migration on 2026-10-10. The
published `@solana-foundation/solana-lib` 2.41.0 source under
`apps/web/node_modules` was used to check component behavior. Final verification
and organization consumer status are separate from this map.

## Dependency and route coverage

- At the start, `apps/web` and `apps/docs` both declared
  `@solana-foundation/solana-lib: ^2.40.3`; the lockfile resolved 2.41.0.
- At the start, both apps imported `dist/styles.css` from `src/scss/index.scss`,
  loaded by their locale layouts. Docs had no component import from the package.
- Web had 37 importing files: 12 solutions routes, 16 developer routes, seven
  other routes, and two shared components. Every one of the 35 route modules was
  referenced by its sibling `page.tsx`.
- The shared newsletter is reached through `ModalLauncher`; `RampsLayout` is
  reached from `/solanaramp`.
- Existing `@workspace/ui` exports Button, Input, Accordion, and Dialog. The
  current Button lacks the library's URL, label, icon, and hierarchy API; Input
  lacks label, helper text, and error presentation; Accordion is a lower-level
  Radix API. Reuse these where the consumer API fits, and add focused
  composition adapters for the legacy call shapes.

| Owner                | Importing modules                                                                                                                                                                                                                                                                                               |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ECO-818 solutions    | `solutions-index`, `actions`, `artists-creators`, `commerce-tooling`, `digital-assets`, `financial-infrastructure`, `games-tooling`, `gaming-and-entertainment`, `payments-tooling`, `request-for-startups`, `solana-permissioned-environments`, `token-extensions` under `apps/web/src/app/[locale]/solutions` |
| ECO-819 developers   | `dao`, `gaming`, `nfts`, `payments`; `migrate-to-solana` index and `accounts`, `client-differences`, `complete-guide`, `consensus`, `eip2612`, `erc20`, `erc4337`, `erc4626`, `erc3643`, `erc721`, `smart-contracts` under `apps/web/src/app/[locale]/developers`                                               |
| ECO-820 other/shared | `2024outlook`, `art-basel`, `community/report-2024-newsletter-sign-up`, `privacy-policy`, `rpc`, `staking`, `tos`; `components/newsletter/artistsAndCreators/index.tsx` and `components/ramps/RampsLayout.tsx`                                                                                                  |

## Export and prop map

Counts are importing files, not render instances. Props are the union of
explicit JSX attributes at web call sites; nested data shapes need the
corresponding upstream source checked during implementation. Route content,
copy, URLs, images, and translation data stay in the web app.

| Export             | Files | Call-site props                                                                                                                                                  | Replacement owner and behavior                                                                   |
| ------------------ | ----: | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `Hero`             |    31 | `body`, `buttons`, `centered`, `eyebrow`, `headingAs`, `headline`, `image`, `newsLetter`                                                                         | ECO-816: semantic hero, responsive image, heading levels, rich body, CTA links                   |
| `Heading`          |    29 | `body`, `buttons`, `eyebrow`, `headline`, `variant`                                                                                                              | ECO-816: text/layout primitive with centered and floating button variants                        |
| `Section`          |    21 | `className`                                                                                                                                                      | ECO-816: container widths, responsive padding, polymorphic element                               |
| `Stats`            |     7 | `buttons`, `contained`, `headingAs`, `headline`, `stats`                                                                                                         | ECO-816: stat cards; preserve static and dynamic values                                          |
| `Trustbar`         |     4 | `eyebrow`, `logos`, `variant`                                                                                                                                    | ECO-816: logo grid/strip, linked logos and small-screen layout                                   |
| `Quote`            |     1 | `author`, `eyebrow`, `quote`                                                                                                                                     | ECO-816: quote and attribution                                                                   |
| `RichTextQuote`    |     1 | `author`, `quote`                                                                                                                                                | ECO-816: rich quote and attribution                                                              |
| `CodeBlock`        |     6 | `code`, `language`                                                                                                                                               | ECO-816: readable narrow-screen code and keyboard-accessible copy action                         |
| `YoutubeVideo`     |     3 | `url`                                                                                                                                                            | ECO-816: responsive player with an accessible title                                              |
| `Button`           |     2 | `className`, `disabled`, `endIcon`, `hierarchy`, `iconSize`, `label`, `onClick`, `size`, `type`, `url`                                                           | ECO-816/820: use existing Button where possible; add a link/CTA adapter for library-only props   |
| `Input`            |     1 | `className`, `error`, `helperText`, `label`, `name`, `onChange`, `placeholder`, `size`                                                                           | ECO-816/820: compose existing Input with label, help, and error semantics                        |
| `Accordion`        |     3 | `accordions`, `eyebrow`, `headline`                                                                                                                              | ECO-817: compose Radix Accordion, preserving hash deep links and focus behavior                  |
| `CardDeck`         |    26 | `cards`, `featured`, `numCols`                                                                                                                                   | ECO-817: standard, image, gradient, CTA, blog, and tall cards; featured desktop/mobile placement |
| `ConversionPanel`  |    16 | `body`, `buttons`, `desktopBackground`, `desktopImage`, `heading`, `listItems`, `logos`, `mobileBackground`, `mobileImage`, `newsLetter`, `showLogos`, `variant` | ECO-817: centered, inline-centered, and offset layouts with media and CTAs                       |
| `FeatureHighlight` |     7 | `body`, `buttons`, `cards`, `desktopBackground`, `dynamicDataFootnote`, `eyebrow`, `headingAs`, `headline`, `valueOf`                                            | ECO-817: reusable card grid; verify dynamic stat source and footnote                             |
| `Switchback`       |     9 | `assetSide`, `body`, `buttons`, `emailError`, `eyebrow`, `formId`, `headline`, `image`, `newsLetter`, `placeholder`, `submitError`, `successMessage`             | ECO-817: responsive media order and newsletter branch                                            |
| `SwitchbackChain`  |    10 | `hideBackground`, `switchbacks`                                                                                                                                  | ECO-817: alternating switchbacks and shared responsive background                                |
| `ContentEditor`    |     8 | `callToAction`, `tocHeadline`                                                                                                                                    | ECO-817: guide body, responsive table of contents, generated heading anchors                     |
| `HtmlParser`       |    14 | `rawHtml`                                                                                                                                                        | ECO-817: trusted CMS HTML parsing, heading anchors, links, tables and mobile overflow            |
| `Slider`           |     2 | `cards`                                                                                                                                                          | ECO-817: keyboard-operable carousel, visible focus and card links                                |
| `CommunityGallery` |     1 | `cards`, `square`                                                                                                                                                | ECO-817: image/stat card gallery and small-screen layout                                         |

## Parity risks and verification

- Upstream `Hero`, `Heading`, `Section`, and most compositions use
  package-specific `tw-` utilities and theme classes. Removing its stylesheet
  before replacing those styles would break both affected routes and unrelated
  web/docs styles. ECO-821 should remove it after route imports are gone and
  inspect the remaining selectors in `apps/web/src/scss/_solana.scss`.
- Upstream `Accordion` changes the URL hash and scrolls to an initial hashed
  item, but uses a clickable `div`. The replacement should keep deep links and
  use accessible buttons/Radix disclosure semantics.
- Upstream `HtmlParser` rewrites anchors and heading IDs. `ContentEditor`
  discovers headings for the table of contents. The replacements must agree on
  ID generation and retain tables, code blocks, and links without horizontal
  page overflow.
- Upstream `CodeBlock` uses Prism and a clipboard action. `Slider` uses a
  carousel; `CommunityGallery` uses a marquee. These need keyboard,
  reduced-motion, and narrow-screen checks.
- Upstream `Stats` supports dynamic Explorer API values; a static-only
  replacement would silently regress live metrics. The published renderer also
  calls a React hook from a plain function; account for the intended behavior
  without copying that bug.
- Before migration, `apps/docs/tailwind.config.js` did not scan
  `../../packages/ui/src/**/*.{js,ts,jsx,tsx}`. The migration adds this source
  path before removing the package CSS.
- ECO-823 tracks
  [`temp-solana-com-revamp`](https://github.com/solana-foundation/temp-solana-com-revamp/blob/main/package.json),
  a separate private repository that still declares
  `@solana-foundation/solana-lib`. GitHub reports that it is archived as of
  2026-10-10;
  [`solana-com-legacy`](https://github.com/solana-foundation/solana-com-legacy/blob/main/package.json)
  is also archived and still declares the package. GitHub code search for the
  package in the organization returned `solana-com` and `solana-lib` itself.
  These results support removal from this monorepo, but the owning team should
  confirm package retirement separately before deleting the upstream repository
  or package.

## Production visual baseline

The following full-page screenshots were captured from `https://solana.com` on
2026-10-10, with HTTP 200 responses at 1440 × 900 and 390 × 844 viewports. The
compressed files preserve a visual reference for final comparison.

| Route                                 | Desktop                                                                        | Mobile                                                                       |
| ------------------------------------- | ------------------------------------------------------------------------------ | ---------------------------------------------------------------------------- |
| `/solutions/token-extensions`         | [desktop](solana-lib-baseline/solutions_token-extensions_desktop.webp)         | [mobile](solana-lib-baseline/solutions_token-extensions_mobile.webp)         |
| `/developers/migrate-to-solana/erc20` | [desktop](solana-lib-baseline/developers_migrate-to-solana_erc20_desktop.webp) | [mobile](solana-lib-baseline/developers_migrate-to-solana_erc20_mobile.webp) |
| `/tos`                                | [desktop](solana-lib-baseline/tos_desktop.webp)                                | [mobile](solana-lib-baseline/tos_mobile.webp)                                |
| `/solanaramp`                         | [desktop](solana-lib-baseline/solanaramp_desktop.webp)                         | [mobile](solana-lib-baseline/solanaramp_mobile.webp)                         |
| `/docs`                               | [desktop](solana-lib-baseline/docs_desktop.webp)                               | [mobile](solana-lib-baseline/docs_mobile.webp)                               |

For final parity (ECO-822), compare these views with local desktop and mobile
rendering; exercise the accordion, slider, links, newsletter, code copy, table
of contents, and legal prose. Run frozen installation plus UI, web, and docs
lint/typecheck/build checks and the relevant web tests. Record exact results
rather than treating this inventory as verification.

## Local verification

- `pnpm install --frozen-lockfile` passed after package removal.
- UI, web, and docs lint and type checks passed; both web and docs production
  builds passed. The web build generated all 110 static pages and the docs build
  generated all 572 static pages.
- Web Vitest: 56 files and 430 tests passed, including the newsletter states and
  cross-app link regression tests added for this migration.
- Chromium checked desktop (1440 px) and mobile (390 px) versions of token
  extensions, ERC20 guide, terms, ramps, and docs. Each route returned HTTP 200
  with one H1, no page errors, and no document overflow. The terms text matched
  the production text hash. Spanish token extensions, ERC20, and terms routes
  also returned HTTP 200 without page errors; token extensions showed its
  Spanish heading.
- The staking FAQ opens from its hash link and closes by keyboard; the slider
  next control moves the scroll position; the ERC20 table of contents produces
  14 links and code copy writes the block to the clipboard. The newsletter tests
  cover invalid email, success, and a failed request.
- Production measurements informed the final hero style: token extensions at
  1440 px and 390 px uses the same H1 bounding box and font size in local and
  production renders. The screenshots above retain broader visual reference.
