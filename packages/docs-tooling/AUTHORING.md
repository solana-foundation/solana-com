# Authoring and tooling guide: Solana developer docs

The content in `apps/docs/content` is rendered by `apps/docs` with Fumadocs and
served at `/developers/docs`, `/developers/cookbook`, and `/learn/<article>`.
This package (`packages/docs-tooling`) holds the generators and checks for that
content; keep agent and contributor notes out of the content folder.

## Where things live

| Path                                        | What                                                                                                                  |
| ------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `apps/docs/content/docs/en/**`              | English docs, served at `/developers/docs/**` (`index.mdx` = folder URL).                                             |
| `apps/docs/content/docs/<loc>/**`           | Translations from Lingo, served at `/<loc>/developers/docs/**`. A page without a translation falls back to English.   |
| `apps/docs/content/learn/<lang>/*.mdx`      | Learn articles, `/learn/<slug>`. The `/learn` landing is a React page in `apps/docs`.                                 |
| `apps/docs/content/cookbook/**`             | Cookbook (English only), `/developers/cookbook/**`.                                                                   |
| `apps/docs/content/navigation/en.json`      | The sidebar and tab navigation (edit by hand).                                                                        |
| `apps/docs/content/docs.json`               | Site config read by the docs app: name, footer, `search.prompt`, `seo.metatags`, `markdown.instructions`, 404.        |
| `apps/docs/content/snippets/**`             | MDX snippets that pages import as `/snippets/...`. `examples`, `concepts`, `paths`, and `rpc/surfpool` are generated. |
| `apps/docs/content/{concepts,paths}/`       | Concept and path sources (`*.en.json`) for `gen:concepts` and `gen:paths`; `addresses.json` feeds `gen:addresses`.    |
| `apps/docs/content/styles/*.css`            | Docs styles (theme, no-JS fallbacks, demos, and so on), imported by the docs app.                                     |
| `apps/docs/public/docs-assets/**`           | Images, video, and diagrams served at `/docs-assets/**`.                                                              |
| `apps/docs/public/docs-assets/scripts/*.js` | Page scripts (`rpc-try-it.js`, `run-examples.js`, `playground.js`, `video-chapters.js`, `agent-banner.js`).           |
| `apps/docs/src/fonts/`                      | Brand fonts (`fonts.css`).                                                                                            |
| `packages/docs-examples/`                   | Tested code examples; `blocks.json` files declare the slices pages show.                                              |
| `packages/docs-tooling/data/surfpool/`      | Surfpool JSON schemas for `gen:surfpool`.                                                                             |

Rules for `apps/docs/content`:

- Never add `.md` notes (README, CLAUDE.md, AGENTS.md) to the content folder.
  Put them in `packages/docs-tooling`.
- Folder paths are public URLs. Moving or deleting a page changes its URL and
  needs a redirect in `apps/docs/redirects.ts` (page and `.md` twin). Point
  redirects at the final page (no chains).
- Merging a duplicate page into another: move its unique content first, delete
  the English file and its locale copies, add the redirect, repoint any redirect
  that targeted the removed page, update `navigation/en.json` and inbound links,
  then run `generate` and `verify`.
- English content is not formatted by oxfmt (`.oxfmtrc.json` ignores it, because
  reformatting changes the rendered page). Keep the existing style.
- Translations come from Lingo, never from agents.

## Commands

```bash
pnpm --filter @workspace/docs-tooling verify          # every repo-side check
pnpm --filter @workspace/docs-tooling generate        # every generator, in order
pnpm --filter @workspace/docs-tooling generate:check  # every generator --check
pnpm --filter @workspace/docs-tooling test            # vitest
pnpm --filter @workspace/docs-tooling check-types
pnpm --filter @workspace/docs-tooling cli <command>   # see below
```

CLI commands (`src/cli.ts`). Unknown options are rejected before anything runs.

| Command                               | Purpose                                          |
| ------------------------------------- | ------------------------------------------------ |
| `verify [--skip-generators] [--json]` | All repo-side checks (see "Generate and verify") |
| `nav verify`                          | Navigation coverage (`src/nav/`)                 |
| `examples [--check]`                  | Build runnable example snippets                  |

Package scripts (`pnpm --filter @workspace/docs-tooling <script>`):

| Script                                                            | Entry                                          |
| ----------------------------------------------------------------- | ---------------------------------------------- |
| `verify`, `nav:verify`, `examples:build`                          | `src/cli.ts`                                   |
| `gen:surfpool [--check\|--sync --ref main]`                       | `src/generators/surfpool-rpc.ts`               |
| `gen:paths`, `gen:concepts`, `gen:addresses` `[--sync] [--check]` | `src/generators/{paths,concepts,addresses}.ts` |
| `gen:tags [--check]`                                              | `src/generators/tags.ts`                       |
| `generate` / `generate:check`                                     | every generator, in dependency order           |
| `diagrams:mermaid`, `diagrams:themes`, `diagrams:fonts`           | `scripts/` (diagram rendering, see below)      |

## Generate and verify

Order (each step is idempotent; re-run from the top after any change):

1. `generate`: `examples:build`, `gen:surfpool`, `gen:paths`,
   `gen:concepts --sync`, `gen:addresses --sync` (concepts reads the path pages,
   so this order), and `gen:tags` (after any tab-root title or description
   change, or a new hub).
2. `verify` and `generate:check`, then build the docs app
   (`pnpm --filter solana-docs build`), which compiles every English and
   cookbook page (translations compile on their first request).

`verify` checks (exit 1 on any failure): page counts per collection and language
(report), navigation coverage (`nav verify`: every page in `navigation/en.json`
exists, and every English page is listed once), frontmatter (parses; `type` is
one of `conceptual`, `reference`, `tutorial`, or `guide`), assets (every
`/docs-assets/*` reference exists and every `-light` themed image has its dark
twin), RPC "Try it" (below), and every generator `--check`.

The docs app builds `/llms.txt`, `/llms-full.txt` and the per-section
`/developers/docs/<section>/llms.txt` indexes from the content when it builds;
nothing lists the pages in a committed file.

### Links and anchors

- Link docs pages as `/developers/docs/...`, cookbook pages as
  `/developers/cookbook/...`, and learn articles as `/learn/<slug>`. Other
  solana.com pages are linked as `https://solana.com/...`.
- Heading ids come from @sindresorhus/slugify (`actions.json` ->
  `#actions-json`), not github-slugger (`#actionsjson`). Write anchors in that
  form.
- Step titles get ids too. Set `id` on a `<Step>` if inbound anchor links matter
  more than the generated slug.

## Assets

Assets live in `apps/docs/public/docs-assets/` and are served at
`/docs-assets/<same path>`. Content must use `/docs-assets/...` URLs; `verify`
checks that every reference exists and that every `-light` themed variant has
its dark twin.

Diagrams: `scripts/draw-diagrams.mjs`, `scripts/draw-concepts.mjs`, and
`scripts/brand-diagrams.mjs` draw and restyle the SVGs under
`docs-assets/assets/docs`; `scripts/embed-diagram-fonts.py` embeds subset ABC
Diatype faces (from `apps/docs/src/fonts`) so labels render inside `<img>`.

## Site config and theme

`apps/docs/content/docs.json` holds the site config (keys listed under "Where
things live"). `apps/docs/content/styles/theme.css` is the brand theme. Fonts
live in `apps/docs/src/fonts` (`fonts.css`): ABC Diatype, ABC Monument Extended,
and ABC Favorit Mono. Stylesheets reference them with relative URLs; never use
root-relative `/fonts/` URLs.

Theme rules:

- **Fonts.** Code uses ABC Favorit Mono. Monument is opt-in through
  `className="solana-display"` for hub and landing headings. Image URLs in CSS
  are absolute (`/docs-assets/...`).
- **Colors.** Light mode links use `#7A2FE0` (6.3:1 on white). Dark mode links
  use `#B78AFF` (8.1:1 on black). The dark page background is `#000`, like
  solana.com.
- **Top bar.** The docs header (logo, tabs, search, theme, and language) is
  shared with the /developers landing and kept to one row at every width. Tabs
  and labels come from `navigation/en.json`, including the divider after tab 4
  (Markets). Links from other solana.com pages into the docs open in a new tab
  (`isDocsHref` in `packages/ui-chrome/src/url-config.ts`).
- **RTL (`ar`).** The docs app sets `<html lang="ar" dir="rtl">`. `theme.css`
  flips the text regions (content, header, sidebar, TOC, pagination) to RTL and
  keeps code LTR.
- **Theme without JS.** A head script sets the theme class and
  `html[data-theme-preference]` before paint. Without JS neither is set; the
  theme must read in that case too.

Consent and analytics: GTM follows the solana.com cookie consent banner
(`CookieConsent`), the same as every other solana.com page, and loads on
production deployments only.

## Reading without JavaScript

Every page must read completely with JavaScript off. The docs app server-renders
inactive Tabs/CodeGroup panels but hides them
(`src/components/docs/docs-components.client.tsx`); `styles/nojs.css` un-hides
and stacks them when `html:not([data-theme-preference])` (the theme head script
sets that attribute; without JS it never appears). Patterns:

| Need                                  | Use                                                                                                                                                                                                                                                                                                                                                              | Never                                                                                         |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Hide-without-JS-only content          | `className="nojs-only"` (`div` or `span`)                                                                                                                                                                                                                                                                                                                        | raw `<noscript>` (stripped)                                                                   |
| Collapsible                           | `<Accordion>` / `<Expandable>` (native `<details>`)                                                                                                                                                                                                                                                                                                              | raw `<details>`, `<abbr>` (stripped)                                                          |
| Tooltip text                          | `<Tooltip tip="T">x</Tooltip><span className="nojs-only"> (T)</span>` (sibling, not child)                                                                                                                                                                                                                                                                       | text only in `tip`                                                                            |
| Mermaid                               | keep the fence and put a `<div className="sol-mermaid" data-fallback="mermaid" data-mermaid="<hash>">` with the pre-rendered light/dark SVGs right after it (copy one from `docs/en/payments/send-payments/verify-address.mdx`; `pnpm --filter @workspace/docs-tooling diagrams:mermaid` draws `<hash>*.svg`, then run `diagrams:fonts`); caption `.sol-caption` | a fence without the figure                                                                    |
| iframe / YouTube                      | `<Frame><iframe/></Frame>` plus a plain link right after (no iframe is in the server HTML; nojs.css hides the empty box)                                                                                                                                                                                                                                         | iframe alone                                                                                  |
| Video chapters / video cards          | chapter links in `<div className="sol-chapters" data-video="<id>">` seek the embedded player in place, cards in `<div className="sol-video-modal">` open a dialog (`video-chapters.js`, `styles/video.css`); both are plain `youtu.be` links without JS                                                                                                          | links that only work with JS                                                                  |
| Embedded YouTube video                | a server-rendered `a.sol-yt` poster (thumbnail and play button; copy one from `docs/en/tokenization/nav-strikes.mdx`) that `video-chapters.js` swaps for the autoplaying player in place; without JS it links to YouTube                                                                                                                                         | a separate "Watch on YouTube" link (the poster is the link)                                   |
| Snippets that must render server-side | default-imported MDX snippet with string props, or page-local `export const`                                                                                                                                                                                                                                                                                     | `/snippets/*.jsx` components or JSX expression children `{"…"}` inside snippets (client-only) |
| Code in several languages             | `<CodeGroup>` (titles = tab labels; without JS panels are numbered `1 · …` to match the tab row)                                                                                                                                                                                                                                                                 |                                                                                               |

`expandable` code blocks: the docs app server-renders every line but collapses a
block longer than eight lines to 190px behind an expand button that needs JS
(`CodeBody` in `src/components/docs/docs-components.tsx`). `nojs.css`
un-collapses them without JS and hides the inert button.

Known limit: stacked CodeGroup panels without JS are labelled `n · <language>`,
so match them to the numbered tab row (`2 · Kit`).

## Component and content notes

- **Frontmatter.** `"og:title"` and `"twitter:title"` set a social title that
  differs from `title`; the docs app builds `<title>` from `og:title` when set,
  else `<title> - Solana Developer Docs` (`src/lib/docs/metadata.ts`).
  `docs/tools/microscope` keeps an external `url` (sidebar link); no other page
  may have `url`.
- **RPC.** API method pages must not use `mode: wide` (RequestExample needs the
  default layout). Nested fields: the first level is `defaultOpen`. Surfpool
  snippets are generated (`gen:surfpool`) from `data/surfpool/*.json`;
  `data/surfpool/upstream.json` is the 3-way merge base for `--sync --ref main`.
- **RPC "Try it".** `/docs-assets/scripts/rpc-try-it.js` (styles
  `styles/rpc-try-it.css`) puts a "Try it" bar under the header of every
  `rpc/http/*` and `rpc/websocket/*Subscribe` page (every locale). It opens a
  dialog that sends the page's example to devnet, testnet, or mainnet-beta
  straight from the browser (POST, or a WebSocket for subscriptions). There is
  no marker: the request is read from the first `<RequestExample>` fence
  (`bash cURL` with `-d '<json>'`, or `json WebSocket`), whose `"method"` must
  match the page slug. `verify` ("RPC Try it", `src/verify/rpc-try-it.ts`) fails
  on an English page that breaks this. Mainnet-beta answers browsers only from
  allowlisted origins (solana.com): on localhost or a Vercel preview it returns
  403, which the dialog explains.
- **Runnable examples.** Write code with `#region` markers in
  `packages/docs-examples`, add the block to that folder's `blocks.json`, record
  with
  `RECORD_OUTPUT=1 pnpm --filter @workspace/docs-examples exec vitest run <dir>`,
  run `pnpm --filter @workspace/docs-tooling examples:build`, then
  `import X from "/snippets/examples/<id>.mdx"` and `<X />`.
- **Open tutorial in Playground.** Only program tutorials (Anchor/Native) get a
  Playground button: the playground's GitHub import only accepts programs
  ("Could not identify framework" on TS/JS/Rust-client/Python), so client
  (TypeScript) tutorials have none until it can import them. A program tutorial
  has exactly one entry point: a block at the top of its intro page. Code blocks
  (cookbook, reference, tutorial steps), demo terminals, the stepper, and step
  pages have no Playground control; do not add one. `gen:paths` writes the block
  as `snippets/paths/<lang>/<key>/playground.mdx` only when the tutorial's
  example folder (the folder the demo outputs live in, else the single
  `packages/docs-examples/paths/*/<key>` folder) is a kind in `PLAYGROUND_KINDS`
  (`src/examples/playground.ts`); import it on the intro page only, right after
  the first paragraph:
  `import Playground from "/snippets/paths/en/<key>/playground.mdx";` and
  `<Playground />`. The wording is shared by every tutorial, in `_ui`
  (`playground`, `playgroundNote`). A single-page tutorial writes the same
  markup by hand (see `programs/build-first-program.mdx`). `playground.js`
  (styles `styles/playground.css`) links the button to
  `https://beta.solpg.io/github.com/<source>/<data-pg-open>`. `source` is the
  one owner/repo/ref value in `playground.js` (`CONFIG.source`,
  `solana-foundation/solana-com/tree/main`). Never prefix `https://`, because
  the playground router then rejects the URL. Linked folders must exist at that
  ref on GitHub. Each import costs one unauthenticated GitHub API call per
  folder (60/hour per reader IP).
- **Terminal panels (job paths).** A recorded output with a `<stem>.run.json`
  next to its `<stem>.output.txt` renders as a terminal panel
  (`src/lib/terminal.ts`, styles `styles/demo.css`, behaviour `run-examples.js`)
  instead of the plain Run block. `run.json`:
  `{ "title"?, "pending"?: "tx"|"http"|"call", "commands": [{ "at": <output line>, "cmd": "await payStore(customer, order)", "prompt"?: "$" }], "badges": [{ "tone": "ok"|"error"|"warn"|"info", "label": "Confirmed" }] }`.
  Commands show the call the page teaches (`payStore(...)`, `fetch(...)` with
  `X-PAYMENT`, a real shell command), never the recording harness's `demo*`
  helpers, which no page shows; badges summarize what the output shows (decoded
  errors such as `Failed: Account is frozen (Custom: 17)`, HTTP status). Never
  edit the output text itself. The whole output is in the server HTML (wrapping,
  full base58 values); with JS the screen starts at the prompt and Run streams
  the lines back in, values shorten to `F6ks…JeUg` (full value in `title`, click
  to copy). Panels show the environment as "Local test network (Surfpool)"; do
  not label them as a replay or a recorded run, and never claim the code runs in
  the reader's browser or on a live network.
- **Agents pages.** `docs/tools/ai` ("Build onchain AI agents", Resources >
  Build apps, and the "Onchain AI agents" card on `docs/tools/index`) is about
  agents that transact (SendAI Agent Kit, Eliza, GOAT, LangChain, onchain agent
  programs), not coding assistants (`intro/coding-with-agents`, "Build with AI
  agents"); the two pages link to each other. The Video tutorials tab lists the
  `video-guides` pages.
- **Cross-tab cards.** A `<Card>` on a Payments, Assets, or Markets page whose
  href is filed under another tab in `navigation/en.json` carries the `arrow`
  prop (a small ↗, server-rendered, light and dark). Update it by hand after
  moving pages between tabs.
- **Program examples in Playground.** `packages/docs-examples/programs/<name>/`
  holds Anchor workspaces whose files a page shows through `blocks.json` (for
  example `programs/build-first-program`, the "Build your first program" page).
  The page's hand-written `.sol-pg-tut` button opens the program crate.
- **Navigation.** Edit `navigation/en.json` by hand. A tab can list `pages`
  directly instead of `groups` (Start here does): its pages render as plain
  sidebar entries with no group header, and a nested group (the Quickstart box)
  renders as a collapsible entry. Pages that should not show in the sidebar (the
  Learn articles, `docs/tags`) sit in `hidden: true` tabs.

## Path and concept components

Generators:
`pnpm --filter @workspace/docs-tooling gen:concepts|gen:paths|gen:addresses [--sync] [--check]`
(`src/generators/*.ts`). Output under
`apps/docs/content/snippets/{concepts,paths}/<lang>/` is generated: never edit
it, and never put hand-written files there (the generator refuses to delete
them, and `--check` fails). `--check` fails on stale, missing or orphaned output
and on pages that `--sync` would change (`--check` runs the page sync in memory,
with or without `--sync`, and never writes).

Sources: `apps/docs/content/concepts/concepts.<lang>.json`,
`apps/docs/content/paths/paths.<lang>.json`, `apps/docs/content/addresses.json`
(plus optional `addresses.<lang>.json` with `_ui.cta` and per-address `label`
overrides). A locale JSON only overrides text: keys, order, hrefs, `first`, demo
components and recorded-output paths always come from English. If the locale
page exists, links point at `/<loc>/…`. Otherwise they point at the English
page. This holds even when a locale has no concepts JSON yet: the chip text is
English, but the link goes to the translated page.

**Rule for anything that must read without JavaScript.** Never use `{…}`
expression children in an MDX snippet, or raw `<nav>`, `<details>`, `<noscript>`
and `<abbr>`: use the patterns below and under "Reading without JavaScript",
which have no-JS styles.

| Want                                     | Write                                                                                                                                                                                                                                                                                                      |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Concept card                             | `import Accounts from "/snippets/concepts/en/account.mdx"` then `<Accounts />`                                                                                                                                                                                                                             |
| "In short" on a concept's canonical page | `## In short`, then `<Short />` from `…/<key>.short.mdx`, then `<UsedIn />` from `…/<key>.used-in.mdx`                                                                                                                                                                                                     |
| Inline concept chip                      | `<span className="sol-chip" data-concept="account">accounts</span>`, then run `gen:concepts --sync`. Sync expands it into a Tooltip plus a `nojs-only` "(Accounts: …)" fallback that contains a real link. `<Tooltip data-concept="account">accounts</Tooltip>` is accepted too.                           |
| Coverage table (How Solana works root)   | `import Coverage from "/snippets/concepts/en/coverage.mdx"`                                                                                                                                                                                                                                                |
| Path stepper                             | `/snippets/paths/en/<path>/stepper-<n>.mdx`: n = 0 on the path intro page, n = step number on step pages                                                                                                                                                                                                   |
| Next-step card                           | `/snippets/paths/en/<path>/next-<n>.mdx`: n = 0 on the intro page, n = step number on step pages. The last step has one only if `after` is set.                                                                                                                                                            |
| Path card (job picker, hubs)             | `/snippets/paths/en/<path>/card.mdx`                                                                                                                                                                                                                                                                       |
| Demo (step 1 pages)                      | `/snippets/paths/en/<path>/demo.mdx`: one server-rendered terminal panel (stage, numbered steps, every step's output with the prompts and badges from its `run.json`). Without JS it reads in full; with JS it runs step by step (Next step / Run all). A demo with a missing output gets no Run controls. |
| Address mention                          | ``<span className="sol-address" data-address="EPjF…Dt1v">`EPjF…Dt1v`</span>``, then run `gen:addresses --sync`. The address must be in `addresses.json`. Never inside code or recorded output. `--report` lists unmarked prose mentions.                                                                   |

Avoid chips and address mentions inside GFM tables: syncing re-pads the whole
table (codec behaviour), so the diff is not local. The generators warn when they
find one.

Backlinks ("You've used this in") and the coverage table are computed from the
English path pages (intro and steps in `paths.en.json`). A page _introduces_ a
concept when it imports `/snippets/concepts/<lang>/<key>.mdx`. It _mentions_ the
concept when it has a `data-concept="<key>"` chip. Re-run `gen:concepts` after
editing a path page.

### Fit check (pattern, no component)

```mdx
<Columns cols={2}>
  <Card title="A good fit if" icon="check" color="#16a34a">
    - …
  </Card>
  <Card title="Not the right fit if" icon="x" color="#dc2626">
    - …
  </Card>
</Columns>
```

Styles: `styles/concepts.css` and `styles/stepper.css` (light and dark through
`html.dark`; tokens `--solui-*`). No-JS fallbacks rely on the `.nojs-only` rules
in `styles/nojs.css`.
