# i18n

Translations are generated during CI/CD via `.github/workflows/i18n.yml` using
[Lingo](https://lingo.dev). Note that `src/app` uses
[app-router](https://next-intl.dev/docs/getting-started/app-router/with-i18n-routing).
Config is customised to this setup where `src/i18n` routes for app-router.
Shared UI catalogs now live in `packages/i18n/messages/web`.

## Manual gen i18n

Translations can be manually triggered:

- run `npx --yes @lingo.dev/cli@latest login` to log in to Lingo
- run `pnpm i18n:lingo` from `apps/web` to sync the web UI catalog
- or run `pnpm i18n:ui` from repo root to sync every shared UI catalog

### Run Lingo for a specific source file or path

From repo root:

**Web UI catalog** (locale files like
`packages/i18n/messages/web/[locale]/common.json`):

```bash
npx --yes @lingo.dev/cli@latest push 'packages/i18n/messages/web/en/*.json' --wait
```

The current CLI scopes by source file pattern, not JSON key. A normal push only
translates changed source keys. Add `--force --yes` to retranslate every key in
the matching file.

The current CLI does not support the `public/llms-*.txt` filename layout, so
those files are not part of the automated Lingo workflow.

### Remove keys with no content (after Lingo adds nulls)

If Lingo writes nulls or empty structure into locale files, remove those keys
entirely so next-intl can fall back to the next locale (e.g. English):

```bash
node scripts/remove-empty-translations.mjs
```

This removes any key that has no content: `null`, empty string, or recursively
empty objects/arrays. Optional: `--fallback-from-en` fills null/empty with the
English source instead of removing the key.
