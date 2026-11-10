# Site metrics refresh and registry (ECO-927)

Owner: Ecosystem Engineering (registry, loader, and page wiring). Data and
editorial sign-off contacts, approved values, and the release deadline are not
yet assigned; see [Open decisions](#open-decisions-and-blockers).

Audited: 2026-10-30. Every figure below was checked against its named source on
that date. Supplied figures in the ticket were treated as audit targets, not
approved values.

## Registry and loader

`apps/web/src/data/metrics/` is the single map of site metrics: one JSON file
per key prefix, with a README for maintainers. Each entry has a stable dotted
key and records:

| Field                   | Meaning                                                                                       |
| ----------------------- | --------------------------------------------------------------------------------------------- |
| `unit`                  | `usd`, `count`, or `ms`; drives locale-aware formatting                                       |
| `definition`            | What the number measures, including exclusions                                                |
| `period`                | `point` (a level on a date) or `trailing` N days                                              |
| `source`                | Reader-facing source name and HTTPS link                                                      |
| `owner`                 | Maintenance owner                                                                             |
| `live` (optional)       | `data-api` window, `rwa-xyz` field, `defillama` query, or `solana-rpc` query                  |
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
- **Refresh.** One server-side stream resolves every live entry in a single pass
  (each source called once) and is cached for one hour; pages and `/api/metrics`
  read it. The data-api payload is shared with the /data dashboard cache, and
  its pipeline publishes every 12 hours. Real-time counters use
  `/api/metrics/network`, which reads RPC at most every 30 seconds for all
  visitors.
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

| Page                                            | Key                                   | Source / period             | Value at audit | Previously on site                    |
| ----------------------------------------------- | ------------------------------------- | --------------------------- | -------------- | ------------------------------------- |
| Home                                            | `network.daily-active-signers`        | Solana Data, 30-day average | 2.9M           | 50M "monthly active addresses"        |
| Home, Enterprise                                | `network.successful-transactions-30d` | Solana Data, 30 days        | 3.3B           | 3.5B "monthly transactions"           |
| DeFi                                            | `network.successful-transactions-90d` | Solana Data, 90 days        | 9.4B           | 8.5B "quarterly transactions"         |
| Home, DeFi                                      | `defi.dex-volume-12m`                 | Solana Data, 52 weeks       | $1.5T          | $3.3T "trading volume"; DeFi $2T      |
| Home                                            | `apps.revenue-12m`                    | Solana Data, 52 weeks       | $1.5B          | $3.4B "app revenue"                   |
| Stablecoins, Institutional payments             | `stablecoins.circulating-supply`      | Solana Data, latest day     | $15B           | $10B                                  |
| Stablecoins, Institutional payments             | `stablecoins.transfer-volume-30d`     | Solana Data, 30 days        | $392B          | $200B "monthly"                       |
| Stablecoins, Institutional payments, Enterprise | `network.average-fee-30d`             | Solana Data, 30 days        | $0.005         | $0.0013 "median fee"; $0.00025        |
| Enterprise                                      | `network.slot-time`                   | /200ms, SIMD-0525           | 200ms          | 400ms "block time"                    |
| Real-world assets                               | `rwa.distributed-value`               | RWA.xyz, live               | $5.3B          | $13B live (see below); $3.4B fallback |
| Real-world assets                               | `rwa.asset-count`                     | RWA.xyz, live               | 3,499          | 3,499 live; 692 fallback              |
| Real-world assets                               | `rwa.holders`                         | RWA.xyz, live               | 850K           | $2B "24h volume" live; $205M fallback |
| DeFi                                            | `defi.tvl`                            | DefiLlama, live             | $5.4B          | $10B                                  |
| DeFi                                            | `defi.lending-deposits`               | Solana Data, latest day     | $4.6B          | $3B "lending TVL"                     |
| DeFi                                            | `defi.protocol-volume.jupiter`        | DefiLlama, live             | $1.3T          | $2T "lifetime volume"                 |
| DeFi                                            | `defi.protocol-tvl.*`                 | DefiLlama, live             | see registry   | Kamino $2.8B, Raydium $2.3B, etc.     |
| Validators                                      | `network.validator-count`             | Mainnet RPC live; fallback  | 665            | Live RPC, no fallback                 |
| Validators                                      | `network.nakamoto-coefficient`        | Mainnet RPC, live           | 17             | Live RPC, spinner on failure          |

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
- **Jupiter lifetime volume** ($2T) is now the DefiLlama all-time aggregator
  volume ($1.3T). The card keeps its original "Lifetime volume" measure; Raydium
  keeps "Liquidity pools" (its pool TVL).
- **Drift** is removed from the site (DeFi cards, BTCfi logos, /possible
  ecosystem grid, video caption, and partner descriptions). It is no longer an
  active project. Only the /200ms validator map keeps a validator operator named
  "Drift", which is its onchain identity.
- **Lending** is labelled "Lending deposits": the measure is total deposits, not
  deposits net of borrows (TVL).

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
`apps/web/src/data/metrics/claims/prose.json`.

## /data validation

`dashboard-constants.ts` exposes eight tabs: overview, network, stablecoins,
defi, lending, perps, rpc, and senders (perps was added after the ticket was
written). All eight rendered KPIs and charts in production on 2026-10-30. The
homepage, stablecoin, and DeFi figures use the same data-api series and provider
medians as the overview, stablecoins, and defi tabs. One deliberate difference:
dashboard KPIs show the newest day any provider has reported, while the registry
waits until half of a metric's providers have reported that day, so a registry
figure can trail the dashboard by a day (e.g. $15B vs $15.2B circulating
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
- **Live data-api verification.** Done: every data-api metric resolved `live` on
  the PR preview deployment.
- The homepage subtitle rewrite needs editorial approval.

## Full-site migration

Every published stat on apps/web landing and solution pages now renders from
`apps/web/src/data/metrics/` (98 entries). Values are live where a provider
exists (data-api, RWA.xyz, DefiLlama, Solana RPC, x402scan, Solana Climate
Dashboard), dated snapshots where a citable source exists, and
`"verification": "unverified"` entries with a maintainer note otherwise.
Unverified entries keep their published value and show no source; they are the
data team's review queue
(`grep -l unverified apps/web/src/data/metrics/*.json`).

Figures replaced because a current sourced value for the same measure exists
include x402's Solana share (76%/70% → about 21%/22%), x402 weekly transactions
(500K+ → removed from metadata), BTC on Solana (6,500+ → 5,754), BUIDL on Solana
($550M → $865M), Bullish daily volume ($2.5B → $1.37B), R3 ($10B → $17B), Morgan
Stanley IM AUM ($1.9T → $2.0T), State Street AUC/A ($50T+ → $59T), Boba Guys
users (23,000 → 15,000 in the first 80 days), the research slot target (250ms →
200ms), and the Learn page's "over 1,000 validators" (now "hundreds of
validators").

Not migrated:

- `/solutions/artists-creators` stats are inline HTML in one message, and its
  "6000M+ NFTs minted" conflicts with `nfts.total-minted` (110M+). Pick the
  reconciled value, then split the HTML into registry stats.
- Learn `what-is-solana.mdx` in ar, el, fi, pl, ru, tr, uk still says "over
  1,000 validators"; grammar made an automatic swap unsafe.
- `/upgrades/alpenglow` visuals, `/solanaramp` prose, Learn staking APY, and the
  archived outlook pages keep their figures; prose numbers are tracked in
  `claims/prose.json`.
