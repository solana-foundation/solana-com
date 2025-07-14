# i18n

Translations are generated during CI/CD via `.github/workflows/i18n.yml` using [Lingo](https://lingo.dev). Note that `src/app` uses [app-router](https://next-intl.dev/docs/getting-started/app-router/with-i18n-routing) while the rest of the app in `src/pages` uses [pages router](https://next-intl.dev/docs/getting-started/pages-router). Config is customised to this setup where `src/i18n` routes for app-router and pages router uses `getStaticProps`.

## Manual gen i18n

Translations can be manually triggered:

- run `npx lingo.dev@latest login` to login to Lingo
- run `"i18n:lingo": "npx lingo.dev@latest i18n"` in `./package.json`