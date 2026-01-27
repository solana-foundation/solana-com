# i18n

Translations are generated during CI/CD via `.github/workflows/i18n.yml` using
[Lingo](https://lingo.dev). The app uses next-intl with JSON message files in
`public/locales/[locale]/common.json`.

## Manual gen i18n

Translations can be manually triggered:

- run `npx lingo.dev@latest login` to login to Lingo
- run `pnpm i18n:lingo` (or `npx lingo.dev@latest i18n` from `apps/accelerate`)
