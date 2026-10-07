# Solana.com URL and search baseline (2026-10-08)

## Inventory

- `url-audit-2026-10-08.csv` has 18,798 rows: 18,692 URLs from the live public
  sitemap, 51 distinct paths in two sampled production 404 log windows, and 55
  known `solana.com` subdomains.
- `known-subdomains-2026-10-08.csv` combines domain assignments from all 132
  projects visible in the Solana Foundation Vercel team (29 hosts), hostnames
  referenced by this repository (24 additional hosts), and two redirect
  destinations. The `source` column identifies the evidence for each host.
- `owner` for sitemap URLs is inferred from route prefixes in the monorepo.
  `migration_candidacy=review` marks main web routes for later review; it is not
  a migration decision. `observed_status=not_checked` means no per-URL HTTP
  probe was run.
- The 404 counts come from two 50-event Vercel CLI samples on 2026-10-07 UTC.
  They are sample frequencies, not seven-day totals. `planned` means this branch
  adds a redirect; `asset_added` means this branch restores a static asset.
  Other candidates need individual review before redirecting.
- Subdomain coverage is exhaustive for Vercel project domain assignments visible
  to this account, but it is **not** an authoritative Cloudflare DNS zone
  export. Hosts outside Vercel and repository references may be absent. Some
  historical references no longer resolve. The DNS owner should reconcile this
  file with a zone export before treating it as a complete domain register.

Regenerate the URL audit from source snapshots with:

```bash
node scripts/seo/build-url-audit.mjs \
  --sitemap <downloaded-solana.com-sitemap.xml> \
  --logs <vercel-404-sample.jsonl> \
  --hosts docs/analytics/known-subdomains-2026-10-08.csv \
  --output docs/analytics/url-audit-2026-10-08.csv
```

Omit `--logs` to generate an audit using only the public sitemap and host
inventory. Preserve the source date and log sampling window when publishing a
new snapshot.

## Analytics and search interpretation

The GA4 engagement dashboard for property `341980704` uses a rolling 28-day
window, standard GA4 active users, sessions, views, and engagement rate, with
daily, acquisition-channel, and landing-page views. The baseline showed a large
`(not set)` landing-page bucket and substantially more sessions than page views.
Google's [GA4 guidance](https://support.google.com/analytics/answer/13504892)
says `(not set)` can occur when a session has no `page_view`; investigate event
and tag setup before using landing-page sessions as a migration success measure.
Do not change the shared consent or tagging setup based on aggregate numbers
alone. Use Tag Assistant and a consented test journey across each app to isolate
the cause first.

Search Console's Page indexing report contains both expected exclusions and
issues. Following
[Google's indexing guidance](https://support.google.com/webmasters/answer/7440203),
prioritize server and redirect errors, unintended 404s, and wrong canonicals on
intended indexable pages. Redirects, deliberately excluded URLs, and canonical
alternatives are not automatically defects. The private Search Console export
and issue-level triage are linked from ECO-519.

The redirect-error examples included three old developer-guide paths that
returned a 307 to the same URL. This branch maps the token, actions, and
security-practices guides to live topic pages. Recheck these paths after
deployment and then request Search Console validation; the report will not
change immediately.

The 404 examples also included localized versions of moved payment docs. The
docs app now applies each moved-route redirect to locale-prefixed paths and
their `.md` variants, using the same destination locale. The two sampled 5xx
URLs currently reach valid pages; monitor them rather than redirecting again.

The existing [Google News sitemap](https://solana.com/news/sitemap-news.xml) is
served by `apps/media`, is listed in `robots.txt`, and is submitted in Search
Console. It puts `<news:news>` metadata only on articles published in the last
48 hours, consistent with
[Google's News sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/news-sitemap).
The older plain URL entries keep the XML nonempty when there are few recent
articles. The alias `/news/google-news.xml` reaches the same handler.
