# Site metrics refresh and registry (ECO-927)

Owner: Ecosystem Engineering (registry, loader, and page wiring). Data and
editorial sign-off contacts, approved values, and the release deadline are not
yet assigned; see [Open decisions](#open-decisions-and-blockers).

Audited: 2026-10-30. Every figure below was checked against its named source on
that date. Supplied figures in the ticket were treated as audit targets, not
approved values.

## Registry and loader

`apps/web/src/data/metrics/registry.json` is the single map of site metrics.
Each entry has a stable dotted key and records:

| Field                   | Meaning                                                                                       |
| ----------------------- | --------------------------------------------------------------------------------------------- |
| `unit`                  | `usd`, `count`, or `ms`; drives locale-aware formatting                                       |
| `definition`            | What the number measures, including exclusions                                                |
| `period`                | `point` (a level on a date) or `trailing` N days                                              |
| `source`                | Reader-facing source name and HTTPS link                                                      |
| `owner`                 | Maintenance owner                                                                             |
| `live` (optional)       | `data-api` window spec, or an `rwa-xyz` field; absent for curated snapshots                   |
| `snapshot`              | Dated value: published as-is for snapshot metrics, and the explicit fallback for live metrics |
| `verifiedAt`/`reviewBy` | Last verification and the next review deadline                                                |

Pages read the registry only through `getDisplayMetrics(keys)`
(`apps/web/src/lib/metrics/present.ts`), which calls `loadMetrics` (`loader.ts`)
and returns serializable display values with a localized source and period
caption. The loader contract is the registry shape plus a resolved
`{ value, asOf, status }`, so the JSON file can later be replaced by an endpoint
returning the same structure without changing page components.

- **Calculations match /data.** `data-api` metrics use the same payload and
  cache as `/api/databricks/data` (`lib/databricks/metrics-data.ts`). A day's
  value is the median across providers; a day counts once at least half of the
  metric's providers have reported; flows sum, unique counts average, and levels
  take the latest day — the same rollups as the dashboard's period views.
- **Complete windows only.** A trailing window is the N calendar days ending on
  the latest complete day, and every day must be present. A gap or a shorter
  history falls back to the dated snapshot instead of publishing a total over
  fewer or older days. Annual figures use 52 weeks (364 days) because the /data
  payload holds 364 complete days.
- **Refresh.** data-api payloads are cached for 5 minutes server-side and the
  upstream pipeline publishes every 12 hours. RWA.xyz totals are cached for 1
  hour. Pages revalidate every 60 seconds.
- **Statuses.** `live` (fresh), `stale` (live, but the window ends more than 3
  days ago), `fallback` (source failed or returned nothing; the dated snapshot
  is shown), `snapshot` (curated, no live source). Every rendered metric shows
  its source and date, so a fallback or stale value is never presented as
  current without its date.
- **Validation.** `pnpm --filter solana-com validate:content` checks every
  registry entry for definition, HTTPS source, period, owner, numeric dated
  snapshot, verification date, and an unexpired `reviewBy`, and that trailing
  periods match their live windows. Unit tests cover the window math, loader
  fallback and stale handling, and that each data-api metric exists in /data.

## Published metrics by page

| Page                                            | Key                                   | Source / period             | Value at audit | Previously on site                     |
| ----------------------------------------------- | ------------------------------------- | --------------------------- | -------------- | -------------------------------------- |
| Home                                            | `network.daily-active-signers`        | Solana Data, 30-day average | 2.9M           | 50M "monthly active addresses"         |
| Home, Enterprise                                | `network.successful-transactions-30d` | Solana Data, 30 days        | 3.32B          | 3.5B "monthly transactions"            |
| Home, DeFi                                      | `defi.dex-volume-12m`                 | Solana Data, 52 weeks       | $1.54T         | $3.3T "trading volume"; DeFi $2T       |
| Home                                            | `apps.revenue-12m`                    | Solana Data, 52 weeks       | $1.46B         | $3.4B "app revenue"                    |
| Stablecoins, Institutional payments             | `stablecoins.circulating-supply`      | Solana Data, latest day     | $15B           | $10B                                   |
| Stablecoins, Institutional payments             | `stablecoins.transfer-volume-30d`     | Solana Data, 30 days        | $392B          | $200B "monthly"                        |
| Stablecoins, Institutional payments, Enterprise | `network.average-fee-30d`             | Solana Data, 30 days        | $0.0048        | $0.0013 "median fee"; $0.00025         |
| Enterprise                                      | `network.slot-time`                   | /200ms, SIMD-0525           | 200ms          | 400ms "block time"                     |
| Real-world assets                               | `rwa.distributed-value`               | RWA.xyz, live               | $5.31B         | $13B live (see below); $3.4B fallback  |
| Real-world assets                               | `rwa.asset-count`                     | RWA.xyz, live               | 3,499          | 3,499 live; 692 fallback               |
| Real-world assets                               | `rwa.holders`                         | RWA.xyz, live               | 850K           | $2B "24h volume" live; $205M fallback  |
| DeFi                                            | `defi.tvl`                            | DefiLlama snapshot          | $5.38B         | $10B                                   |
| DeFi                                            | `defi.lending-deposits`               | Solana Data, latest day     | $4.55B         | $3B "lending TVL"                      |
| DeFi                                            | `defi.perps-volume-30d`               | Solana Data, 30 days        | $31.7B         | 8.5B "quarterly transactions"          |
| DeFi                                            | `defi.protocol-tvl.*`                 | DefiLlama snapshots         | see registry   | Jupiter $2T volume, Kamino $2.8B, etc. |
| Validators                                      | `network.validator-count`             | Mainnet RPC live; fallback  | 665            | Live RPC, no fallback                  |
| Validators                                      | `network.nakamoto-coefficient`        | Mainnet RPC live; fallback  | 18             | Live RPC, spinner on failure           |

Notes on changed measures:

- **Monthly active addresses (50M)** could not be verified; /data has no monthly
  unique-address measure. The homepage now shows average daily active signers,
  labelled as such, rather than an unsupported monthly figure.
- **Trading volume ($3.3T)** matched all-time cumulative DEX volume, which /data
  cannot reproduce (it holds one year). It is replaced by trailing 52-week DEX
  volume, the same key and period as the DeFi page.
- **App revenue ($3.4B)** matched trailing app _fees_ on DefiLlama; app revenue
  is about $1.3–1.5B. The /data revenue measure is used.
- **RWA value** was overstated in production: tokens without a market value fell
  back to `total_asset_value_dollar`, which describes the underlying asset (e.g.
  a whole share class), adding about $8B. The page now uses circulating
  (distributed) asset value, which matches RWA.xyz's published figure.
- **RWA 24h volume** summed `daily_transfer_volume_dollar` to about $2B/day,
  inconsistent with RWA.xyz's ~$11.8B 30-day volume. It is replaced by holders.
- **Drift** was removed from the DeFi project cards. Its trading TVL is under
  $1M after the April 2026 exploit, and the "$4B weekly perps volume" claim is
  unsupported. Editorial should confirm the removal.

## Terminology and transaction-cost standard

- **Slot time** (block production interval): 200ms, live since SIMD-0525
  completed at epoch 1053. Never call this finality.
- **Finality** (block cannot be reverted): Alpenglow has been live on mainnet
  since epoch 1064 (October 21, 2026). Use "sub-second finality" or "a design
  target of about 150ms"; do not present 150ms as a measured median.
- **Fees**: the published measure is the 30-day average fee per non-vote
  transaction, including priority fees and excluding Jito tips
  (`network.average-fee-30d`). Static copy uses "under a cent" / "<$0.01", which
  that measure supports. The protocol base fee is 5,000 lamports (0.000005 SOL)
  per signature.
- The "$0.00012–$0.18" range in the ticket did not appear on the site. $0.00012
  is the compressed-NFT mint cost on `/solutions/gaming-and-entertainment`, a
  distinct measure that is left as labelled. No $0.18 or $0.013 claim exists.

Prose claims using these standards are registered in
`apps/web/content-audit/claims.json`.

## /data validation

`dashboard-constants.ts` exposes eight tabs: overview, network, stablecoins,
defi, lending, perps, rpc, and senders (perps was added after the ticket was
written). All eight rendered KPIs and charts in production on 2026-10-30. The
homepage, stablecoin, and DeFi figures use the same data-api series and provider
medians as the overview, stablecoins, and defi tabs. One deliberate difference:
dashboard KPIs show the newest day any provider has reported, while the registry
waits until half of a metric's providers have reported that day, so a registry
figure can trail the dashboard by a day (e.g. $15.0B vs $15.2B circulating
supply). Both show their dates.

## /epoch1000

Disposition: historical archive (ECO-785 retained the URL with an archive
notice, `noindex, follow`, and no sitemap entry). The page body no longer polls
mainnet: the odometer and timeline are fixed at the epoch 1,000 milestone with
past-tense, translatable copy. The wallet checker and shared cards still work.

## Open decisions and blockers

- **Owners and sign-off.** Every registry entry lists Ecosystem Engineering as
  maintenance owner. Data and editorial sign-off contacts, approved values, and
  the pre-Breakpoint deadline are unassigned.
- **Live data-api verification.** Local development has no `DATA_API_*`
  credentials, so live data-api values were verified by recomputing the
  production `/api/databricks/data` payload (generated 2026-10-30 01:16 UTC)
  with the loader's method; the preview deployment exercises the live path.
- **Drift removal** and the homepage subtitle rewrite need editorial approval.

## Remaining metrics and migration gaps

Not yet on the registry (follow-up; full-site migration does not block this
refresh):

- `/solutions/financial-institutions` project stats (sourced and dated through
  `claims.json`; Morgan Stanley's figure may move to the Q2 2026 filing).
- Homepage project cards (Western Union, Visa, Franklin Templeton, R3, Bullish)
  have no sources.
- `/solutions/tokenization`, `/solutions/depin`, `/solutions/btcfi`,
  `/solutions/gaming-and-entertainment`, `/solutions/actions` hero and card
  stats.
- `/privacy` at-a-glance stats (static; fee, slot time, and finality now follow
  the standard above; the RWA growth figure is stale).
- `/possible` hardcoded KPIs (11.5M accounts, 21.9M NFTs, $0.00025) in a CSS
  Module component; migrating it requires moving its styles to Tailwind.
- `/x402` "500K+ weekly transactions" and `/developers/dao` dated 2022 stats.
- `/research` evidence snapshot (250 ms slot target is labelled as a published
  snapshot).
- `/alpenglow` still describes Alpenglow as upcoming.
