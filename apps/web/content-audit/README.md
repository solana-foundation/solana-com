# Audited page content

`pnpm --filter solana-com validate:content` checks link fields in the DeFi,
PYUSD, and financial institutions page data. A `button` or `callToAction` object
must have a nonempty `url`. A card without either object is intentionally
nonlinked; an optional card-level `url` should be omitted, never set to `""`.
Internal links must resolve to a route, content page, or known rewrite in this
monorepo. External URLs are checked for syntax, not live HTTP availability.

For a published numerical claim whose value can change, add an entry to
`claims.json` with the English message path, exact claim text, content owner,
primary source URL, date the source measures or supports the claim (`asOf`), and
next review deadline (`reviewBy`). The validator fails when a claim is missing
from its message, its metadata is incomplete, or its review deadline has passed.
Remove or rewrite a claim if it cannot be sourced. Localized messages should be
reviewed with the English source during the same update.

The old DeFi stat strip, a stale Mango card, and financial institutions project
totals are no longer rendered because their figures lacked reliable, current
sources. The DeFi RPC copy now describes the planning task without a speculative
user count. The remaining audited claims are listed in `claims.json`.
