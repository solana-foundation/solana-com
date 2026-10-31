# Audited page content

`pnpm --filter solana-com validate:content` checks links in the DeFi, PYUSD, and
financial institutions page data. Internal links must resolve to a route,
content page, or known rewrite in this monorepo. External URLs are checked for
syntax; the editorial review verifies that sources support their claims.

For a published number that can change, add an entry to `claims.json` with the
English message path, exact claim text, content owner, source URL, date the
source measures or supports the claim (`asOf`), and next review deadline
(`reviewBy`). The validator fails when required metadata is missing, the claim
does not appear in the English message, or the review deadline has passed.

Financial institution project stats also carry a `statSource` link in their
project data so readers can inspect the evidence beside each figure. Keep the
display value, English message, source link, and claim record in sync when a
figure is updated; the validator checks that they match. Localized messages
should be reviewed with the English source during the same update.

## Site metrics registry

Published figures that pages render as stats live in
`src/data/metrics/registry.json` and reach components only through
`getDisplayMetrics` (`src/lib/metrics/present.ts`). Each entry records a stable
key, definition, unit, period, reader-facing source, owner, dated snapshot,
verification date, and review deadline. Live entries name a data-api window or
an RWA.xyz field; the snapshot is their explicit fallback, and every rendered
figure shows its source and date. Reuse an existing key wherever a page shows
the same measure for the same period, so one update reaches every page.

The validator fails when an entry lacks provenance, its snapshot or review date
is invalid, or a trailing period does not match its live window. See
`docs/analytics/site-metrics-eco-927.md` for the audit, terminology standard,
and remaining migration gaps.
