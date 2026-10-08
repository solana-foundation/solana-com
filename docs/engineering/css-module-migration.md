# CSS Module migration inventory

Inventory date: 2026-10-09. This checkout had 6 `.module.css` and 71
`.module.scss` files before ECO-782. The older issue audit counted 76 SCSS
files; use the repository inventory below for this branch.

## CSS modules

| Route or component                                                                                                                                        | Owner                                                 | Status                                                                                                                                                                                                                                    |
| --------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `apps/web/src/app/components/docs-code-snippet.module.css` — code snippets on Cosmos migration pages                                                      | Ecosystem Engineering, web developer routes           | Migrated to Tailwind utilities in ECO-782. Desktop and mobile code token rendering checked on `/developers/migrate-to-solana/cosmos/app-chain`.                                                                                           |
| `apps/web/src/app/[locale]/scholars/scholars.module.css` — `/scholars`                                                                                    | Ecosystem Engineering, web marketing routes           | Migrated to Tailwind utilities in ECO-782. Desktop and mobile layout checked at 1440px and 390px, including no horizontal overflow.                                                                                                       |
| `apps/web/src/components/payment-channels/payment-channels.module.css` — payment channels landing page and globe                                          | Ecosystem Engineering, web payment channels route     | Blocked on campaign desktop/mobile visual baseline and route-owner review of its canvas, font, and responsive sections. [ECO-806](https://linear.app/solana-fndn/issue/ECO-806/migrate-payment-channels-css-module-with-visual-baseline). |
| `apps/media/app/[locale]/news/solana-summer-school-2026/summer-school.module.css` — Summer School article                                                 | Ecosystem Engineering, media news route               | Blocked on article desktop/mobile visual baseline and route-owner review of its collages and carousel. [ECO-807](https://linear.app/solana-fndn/issue/ECO-807/migrate-summer-school-article-css-module-with-visual-baseline).             |
| `apps/web/src/app/[locale]/developers/migrate-to-solana/cosmos/app-chain/developers-chain-migration-cosmos-app-chain.module.css` — Cosmos app-chain guide | Ecosystem Engineering, web developer migration routes | Blocked on paired guide desktop/mobile visual baseline and route-owner review of article, navigation, and code styles. [ECO-808](https://linear.app/solana-fndn/issue/ECO-808/migrate-cosmos-app-chain-and-cosmwasm-css-modules).         |
| `apps/web/src/app/[locale]/developers/migrate-to-solana/cosmos/cosmwasm/developers-chain-migration-cosmos-cosmwasm.module.css` — CosmWasm guide           | Ecosystem Engineering, web developer migration routes | Same paired guide blocker and follow-up: [ECO-808](https://linear.app/solana-fndn/issue/ECO-808/migrate-cosmos-app-chain-and-cosmwasm-css-modules).                                                                                       |

The CI gate `pnpm check:css-modules` rejects added or renamed `.module.css` and
`.module.scss` files in `apps/` and `packages/`. Existing modules may remain
until their route-owned migration; styling changes to those surfaces must
migrate the module rather than extend it.

## Remaining SCSS modules

| Route or component batch                                                  | Files | Suggested order                                                                          |
| ------------------------------------------------------------------------- | ----: | ---------------------------------------------------------------------------------------- |
| Web `/wallets`: `app/[locale]/wallets/WalletDirectory.module.scss`        |     1 | 1 — three changes since July 2026; active directory surface.                             |
| Web `/solutions`: `components/solutions/**`                               |     3 | 2 — route-owned landing sections, including DePIN.                                       |
| Web developer entry components: `components/developers/sections/**`       |     3 | 3 — migrate together with the matching docs developer components where the UI is shared. |
| Web `/ramps`: `components/ramps/**`                                       |     6 | 4 — search and filter interactions need desktop/mobile QA.                               |
| Docs developer hub, content, and sections: `src/components/developers/**` |    20 | 5 — split by hero, resources, courses, documents, then content sections.                 |
| Shared cookie, email, and Markdown components in web and docs             |    12 | 6 — coordinate both app owners; test consumers of each shared component.                 |
| Web `/ai`: `components/ai/**`                                             |     4 | 7 — migrate as one route batch.                                                          |
| Web `/possible`: `components/possible/**`                                 |    11 | 8 — migrate by page section.                                                             |
| Web `/playgg`: `components/playgg/**`                                     |     4 | 9 — campaign batch.                                                                      |
| Web `/ecdr`: `components/ecdr/**`                                         |     3 | 10 — campaign batch.                                                                     |
| Web `/nft-showdown`: `components/nft-showdown/**`                         |     4 | 11 — campaign batch.                                                                     |

Total: 71 SCSS modules (48 web, 23 docs). Priority uses route ownership and the
recent file history in this checkout; it is a migration order, not a claim that
every older campaign is currently live. For each batch, capture desktop and
mobile reference screenshots before editing, migrate its TSX consumers to
Tailwind utilities, remove the module, run the owning app's lint and typecheck,
and compare the rendered route at the same viewport widths. Keep interactive
states and reduced-motion behavior in the comparison.
