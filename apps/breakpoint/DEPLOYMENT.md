# Breakpoint App Follow-up

- Configure the production router or edge proxy so `/breakpoint` traffic
  resolves to the `apps/breakpoint` deployment.
- Mirror the same rewrite behavior for locale-prefixed routes such as
  `/es/breakpoint` if they are served through the main domain.
- If the app is deployed behind another Solana property, preserve the proxied
  locale cookie behavior already wired in `src/middleware.ts`.
- Replace the placeholder CTA target in
  [common.json](/Users/karambit/Sites/solana-com/apps/breakpoint/public/locales/en/common.json)
  once the launch destination is approved.
