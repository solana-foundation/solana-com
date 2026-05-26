# i18n

Translations are generated during CI/CD via `.github/workflows/i18n.yml` using
[Lingo](https://lingo.dev). The app uses next-intl with shared JSON message
files in `packages/i18n/messages/accelerate/[locale]/common.json`.

## Manual gen i18n

Translations can be manually triggered:

- run `npx lingo.dev@latest login` to login to Lingo
- run `pnpm i18n:lingo` from `apps/accelerate`
- or run `pnpm i18n:app accelerate` from repo root
