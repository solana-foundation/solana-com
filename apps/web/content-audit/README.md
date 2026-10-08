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
figure is updated. Localized messages should be reviewed with the English source
during the same update.
