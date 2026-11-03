# Site metrics

Every figure that solana.com shows as a stat is defined here, one JSON file per
key prefix:

| File               | Keys            | Covers                                              |
| ------------------ | --------------- | --------------------------------------------------- |
| `network.json`     | `network.*`     | Activity, transactions, fees, validators, slot time |
| `apps.json`        | `apps.*`        | Application revenue                                 |
| `defi.json`        | `defi.*`        | DEX volume, TVL, lending, and per-protocol figures  |
| `stablecoins.json` | `stablecoins.*` | Stablecoin supply and transfer volume               |
| `rwa.json`         | `rwa.*`         | Tokenized real-world assets                         |

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
