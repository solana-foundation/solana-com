# Site metrics

Every figure that solana.com shows as a stat is defined here, one JSON file per
key prefix:

| File                | Keys             | Covers                                                                               |
| ------------------- | ---------------- | ------------------------------------------------------------------------------------ |
| `network.json`      | `network.*`      | Activity, transactions, fees, validators, slot time, protocol limits, uptime, energy |
| `apps.json`         | `apps.*`         | Application revenue                                                                  |
| `defi.json`         | `defi.*`         | DEX volume, TVL, lending, and per-protocol figures                                   |
| `stablecoins.json`  | `stablecoins.*`  | Stablecoin supply and transfer volume                                                |
| `rwa.json`          | `rwa.*`          | Tokenized real-world assets                                                          |
| `btcfi.json`        | `btcfi.*`        | BTC on Solana and BTCfi figures                                                      |
| `consumer.json`     | `consumer.*`     | Token launches and consumer app figures                                              |
| `depin.json`        | `depin.*`        | DePIN network and project figures                                                    |
| `desci.json`        | `desci.*`        | DeSci project figures                                                                |
| `gaming.json`       | `gaming.*`       | Games and mint costs                                                                 |
| `institutions.json` | `institutions.*` | Institutional partner figures                                                        |
| `tokenization.json` | `tokenization.*` | Tokenization project figures                                                         |
| `privacy.json`      | `privacy.*`      | Privacy page figures (spot rank, audits, G-SIBs)                                     |
| `x402.json`         | `x402.*`         | x402 activity on Solana (x402scan)                                                   |
| `pyusd.json`        | `pyusd.*`        | PYUSD supply, reserves, and Solana share                                             |
| `nfts.json`         | `nfts.*`         | NFT mints, holders, and mint costs                                                   |
| `dao.json`          | `dao.*`          | DAO counts and treasuries                                                            |
| `research.json`     | `research.*`     | Network Health Report snapshots                                                      |
| `agents.json`       | `agents.*`       | Agent Registry action costs                                                          |

`claims/prose.json` covers numbers written inside sentences (see
[Numbers in prose](#numbers-in-prose)).

Pages never hardcode these numbers. They ask for a key and render the value, its
source link, and its date. One edit here updates every page that uses the key.

## An entry

```json
"defi.tvl": {
  "unit": "usd",
  "definition": "Total value locked in Solana DeFi protocols.",
  "period": { "kind": "point" },
  "source": { "name": "DefiLlama", "url": "https://defillama.com/chain/solana" },
  "owner": "Ecosystem Engineering",
  "live": { "provider": "defillama", "query": "chain-tvl", "slug": "Solana" },
  "snapshot": { "value": 5380000000, "asOf": "2026-10-30" },
  "verifiedAt": "2026-10-30",
  "reviewBy": "2027-01-30"
}
```

| Field        | Meaning                                                                                           |
| ------------ | ------------------------------------------------------------------------------------------------- |
| key          | `<file prefix>.<name>`, dotted kebab-case. Never rename a key a page uses.                        |
| `unit`       | `usd`, `count`, or `ms`. Controls formatting ($1.5T, 2.9M, 200ms).                                |
| `definition` | What is measured, including exclusions. Shown to editors, not readers.                            |
| `period`     | `{ "kind": "point" }` for a level on a date, or `{ "kind": "trailing", "days": N }` for a window. |
| `source`     | The page readers are sent to in the Sources popover.                                              |
| `owner`      | Who keeps the entry correct.                                                                      |
| `live`       | Optional. Where the current value comes from (see below). Without it, the snapshot is published.  |
| `snapshot`   | The last verified value and the date it describes. Also the fallback when a live source fails.    |
| `verifiedAt` | When someone last checked the entry against its source.                                           |
| `reviewBy`   | Deadline for the next check. Validation fails once it passes.                                     |

## One cached data stream

The server resolves every live entry in one pass, calling each upstream source
once, and caches that snapshot for **one hour**. Every page and `/api/metrics`
read the same snapshot, so traffic never reaches upstream APIs. One hour suits
the sources: the /data pipeline publishes every 12 hours, and TVL, RWA totals,
and stake move slowly.

- `GET /api/metrics` returns every entry with its current value, date, status,
  unit, period, and source. Use it to check what the site is showing.
- `GET /api/metrics/network` serves real-time counters (TPS, total transactions,
  validators). It reads mainnet RPC at most once every 30 seconds for all
  visitors; browsers never call RPC directly.
- The /data dashboard shares the same data-api payload cache.

## Making a static figure live

Add a `live` block:

| `provider`   | Spec                                                                                                   |
| ------------ | ------------------------------------------------------------------------------------------------------ |
| `data-api`   | `metrics` (names in /data), `rollup` (`sum`, `avg`, `last`), `days`; optional `multiplyBy`, `divideBy` |
| `rwa-xyz`    | `field`: `distributedValueUSD`, `assetCount`, or `holderCount`                                         |
| `defillama`  | `query`: `chain-tvl` (slug = chain name), `protocol-tvl` (slug = protocol), `aggregator-volume` (slug) |
| `solana-rpc` | `query`: `nakamoto-coefficient`                                                                        |

data-api figures use the same calculation as the /data dashboard: the daily
median across providers, counting a day once at least half of them report.
Trailing windows must be complete; a gap shows the snapshot instead.

If a source fails, the page shows the snapshot with its date until the next
refresh, so keep the snapshot reasonably current. A new provider type needs a
loader in `apps/web/src/lib/metrics/` and a rule in
`scripts/validate-content.mjs`.

## Adding a figure

1. Add the entry to the file for its prefix. A new prefix needs a new file and
   one import line in `apps/web/src/lib/metrics/registry.ts`.
2. Reuse an existing key when a page shows the same measure for the same period.
3. Run `pnpm --filter solana-com validate:content`. It checks every field, the
   file a key lives in, dates, review deadlines, and that live windows match
   their periods.

Statuses shown to QA (`data-metric-status` in the Sources popover): `live`,
`stale` (live, but the data is more than 3 days old), `fallback` (the source
failed; snapshot shown), and `snapshot` (no live source).

## Figures that can't be verified

A figure with no citable source stays on the page as published, marked for
review:

```json
"depin.transactions-30d": {
  "unit": "count",
  "definition": "Monthly transactions by Solana DePIN programs.",
  "period": { "kind": "trailing", "days": 30 },
  "owner": "Ecosystem Engineering",
  "verification": "unverified",
  "note": "No public dated source found; /data has no DePIN breakdown.",
  "display": { "suffix": "+" },
  "snapshot": { "value": 2000000, "asOf": "2026-11-02" },
  "verifiedAt": "2026-11-02",
  "reviewBy": "2027-01-30"
}
```

It has no `source` and is left out of the Sources popover. Replace it with a
sourced entry, or remove it from the page, when the note is resolved.

## Numbers in prose

`claims/prose.json` records numbers inside copy (for example "fees under a
cent") that can't render from a key. Each entry has the English message path,
the exact claim text, an owner, a source URL, the date the source measures
(`asOf`), and a review deadline (`reviewBy`). Validation fails when metadata is
missing, the claim no longer appears in the English message, or the review
deadline has passed. Financial-institutions project stats also carry a
`statSource` link in their page data, and validation checks that it matches the
claim. Review localized messages with the English source during the same update.
