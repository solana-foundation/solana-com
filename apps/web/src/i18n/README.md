# i18n

Translations are generated during CI/CD via `.github/workflows/i18n.yml` using
[Lingo](https://lingo.dev). Note that `src/app` uses
[app-router](https://next-intl.dev/docs/getting-started/app-router/with-i18n-routing).
Config is customised to this setup where `src/i18n` routes for app-router.
Shared UI catalogs now live in `packages/i18n/messages/web`.

## Manual gen i18n

Translations can be manually triggered:

- run `npx lingo.dev@latest login` to login to Lingo
- run `pnpm i18n:lingo` from `apps/web` to sync the web UI catalog
- or run `pnpm i18n:ui` from repo root to sync every shared UI catalog

### Run Lingo for a specific path (e.g. developers/evm-to-svm)

From repo root:

**Web UI catalog** (locale files like
`packages/i18n/messages/web/[locale]/common.json`) — update all keys whose path
starts with a given prefix (use dot-separated key prefix; Lingo matches
recursively):

```bash
pnpm --dir packages/i18n exec npx lingo.dev@latest run --bucket json --file "messages/web/" --key "developers-evm-to-svm"
```

This updates all keys starting with `developers-evm-to-svm` (landing page and
sub-pages: accounts, client-differences, complete-guide, consensus, eip2612,
erc20, erc3643, erc4337, erc4626, erc721, smart-contracts). Add `--force` to
re-translate even if the lockfile considers them unchanged.

**Nav only** (e.g. just the “EVM to SVM” label in the developers nav):

```bash
pnpm --dir packages/i18n exec npx lingo.dev@latest run --bucket json --file "messages/web/" --key "nav.developers.tutorials.evm-to-svm"
```

**TXT bucket** (llms-\*.txt files) — after adding a new section to
`llms-en.txt`:

```bash
pnpm i18n:lingo:llms
# or
npx lingo.dev@latest run --bucket txt --file "llms-"
```

Use `--key "<prefix>"` with any dot-separated key prefix to limit which keys are
processed; omit `--key` to process the whole bucket.

### Remove keys with no content (after Lingo adds nulls)

If Lingo writes nulls or empty structure into locale files, remove those keys
entirely so next-intl can fall back to the next locale (e.g. English):

```bash
node scripts/remove-empty-translations.mjs
```

This removes any key that has no content: `null`, empty string, or recursively
empty objects/arrays. Optional: `--fallback-from-en` fills null/empty with the
English source instead of removing the key.
