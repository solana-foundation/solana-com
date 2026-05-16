# Tasks: Migrate Pages Router to App Router

Use the `migrate-page` skill for each migration. Mark each task only after
manual verification in the browser confirms the page works correctly.

## 1. Top-Level Standalone Pages

- [x] 1.1 Migrate `/2023outlook` — `pages/[locale]/2023outlook.js`
- [x] 1.2 Verify `/2023outlook` renders correctly
- [x] 1.3 Migrate `/2024outlook` — `pages/[locale]/2024outlook.tsx`
- [x] 1.4 Verify `/2024outlook` renders correctly
- [x] 1.5 Migrate `/ai` — `pages/[locale]/ai.jsx`
- [x] 1.6 Verify `/ai` renders correctly
- [x] 1.7 Migrate `/art-basel` — `pages/[locale]/art-basel.tsx`
- [x] 1.8 Verify `/art-basel` renders correctly
- [x] 1.9 Migrate `/branding` — `pages/[locale]/branding.js`
- [x] 1.10 Verify `/branding` renders correctly
- [x] 1.11 Migrate `/community` — `pages/[locale]/community.js`
- [x] 1.12 Verify `/community` renders correctly
- [x] 1.13 Migrate `/newsletter` — `pages/[locale]/newsletter.js`
- [x] 1.14 Verify `/newsletter` renders correctly
- [x] 1.15 Migrate `/playgg` — `pages/[locale]/playgg.js`
- [x] 1.16 Verify `/playgg` renders correctly
- [x] 1.17 Migrate `/possible` — `pages/[locale]/possible.js`
- [x] 1.18 Verify `/possible` renders correctly
- [x] 1.19 Migrate `/privacy-policy` — `pages/[locale]/privacy-policy.tsx`
- [x] 1.20 Verify `/privacy-policy` renders correctly
- [x] 1.21 Migrate `/pyusd` — `pages/[locale]/pyusd.tsx`
- [x] 1.22 Verify `/pyusd` renders correctly
- [x] 1.23 Migrate `/research` — `pages/[locale]/research.tsx`
- [x] 1.24 Verify `/research` renders correctly
- [x] 1.25 Migrate `/rpc` — `pages/[locale]/rpc.tsx`
- [x] 1.26 Verify `/rpc` renders correctly
- [x] 1.27 Migrate `/solana-wallets` — `pages/[locale]/solana-wallets.js`
- [x] 1.28 Verify `/solana-wallets` renders correctly
- [x] 1.29 Migrate `/solanaramp` — `pages/[locale]/solanaramp.js`
- [x] 1.30 Verify `/solanaramp` renders correctly
- [x] 1.31 Migrate `/staking` — `pages/[locale]/staking.tsx`
- [x] 1.32 Verify `/staking` renders correctly
- [x] 1.33 Migrate `/tokenized-equities` —
      `pages/[locale]/tokenized-equities.tsx`
- [x] 1.34 Verify `/tokenized-equities` renders correctly
- [x] 1.35 Migrate `/tos` — `pages/[locale]/tos.tsx`
- [x] 1.36 Verify `/tos` renders correctly
- [x] 1.37 Migrate `/validators` — `pages/[locale]/validators.js`
- [x] 1.38 Verify `/validators` renders correctly
- [x] 1.39 Run `pnpm build` — confirm no build errors after Phase 1

## 2. Community Section

- [x] 2.1 Migrate `/community/report-2024-newsletter-sign-up` —
      `pages/[locale]/community/report-2024-newsletter-sign-up.tsx`
- [x] 2.2 Verify `/community/report-2024-newsletter-sign-up` renders correctly

## 3. Events Section

- [x] 3.1 Migrate `/events` (index) — `pages/[locale]/events/index.jsx`
- [x] 3.2 Verify `/events` renders correctly
- [x] 3.3 Migrate `/events/archive` — `pages/[locale]/events/archive.jsx`
- [x] 3.4 Verify `/events/archive` renders correctly
- [x] 3.5 Run `pnpm build` — confirm no build errors after Phase 3

## 4. Hackathon & NFT Showdown

- [x] 4.1 Migrate `/hackathon` — `pages/[locale]/hackathon/index.js`
- [x] 4.2 Verify `/hackathon` renders correctly
- [x] 4.3 Migrate `/nftshowdown` — `pages/[locale]/nftshowdown/index.js`
- [x] 4.4 Verify `/nftshowdown` renders correctly

## 5. Developers Section

- [x] 5.1 Migrate `/developers/dao` — `pages/[locale]/developers/dao.tsx`
- [x] 5.2 Verify `/developers/dao` renders correctly
- [x] 5.3 Migrate `/developers/defi` — `pages/[locale]/developers/defi.tsx`
- [x] 5.4 Verify `/developers/defi` renders correctly
- [x] 5.5 Migrate `/developers/gaming` — `pages/[locale]/developers/gaming.tsx`
- [x] 5.6 Verify `/developers/gaming` renders correctly
- [x] 5.7 Migrate `/developers/nfts` — `pages/[locale]/developers/nfts.tsx`
- [x] 5.8 Verify `/developers/nfts` renders correctly
- [x] 5.9 Migrate `/developers/payments` —
      `pages/[locale]/developers/payments.tsx`
- [x] 5.10 Verify `/developers/payments` renders correctly
- [x] 5.11 Migrate `/developers/evm-to-svm` (index) —
      `pages/[locale]/developers/evm-to-svm/index.tsx`
- [x] 5.12 Verify `/developers/evm-to-svm` renders correctly
- [x] 5.13 Migrate `/developers/evm-to-svm/accounts` —
      `pages/[locale]/developers/evm-to-svm/accounts.tsx`
- [x] 5.14 Verify `/developers/evm-to-svm/accounts` renders correctly
- [x] 5.15 Migrate `/developers/evm-to-svm/client-differences` —
      `pages/[locale]/developers/evm-to-svm/client-differences.tsx`
- [x] 5.16 Verify `/developers/evm-to-svm/client-differences` renders correctly
- [x] 5.17 Migrate `/developers/evm-to-svm/complete-guide` —
      `pages/[locale]/developers/evm-to-svm/complete-guide.tsx`
- [x] 5.18 Verify `/developers/evm-to-svm/complete-guide` renders correctly
- [x] 5.19 Migrate `/developers/evm-to-svm/consensus` —
      `pages/[locale]/developers/evm-to-svm/consensus.tsx`
- [x] 5.20 Verify `/developers/evm-to-svm/consensus` renders correctly
- [x] 5.21 Migrate `/developers/evm-to-svm/eip2612` —
      `pages/[locale]/developers/evm-to-svm/eip2612.tsx`
- [x] 5.22 Verify `/developers/evm-to-svm/eip2612` renders correctly
- [x] 5.23 Migrate `/developers/evm-to-svm/erc20` —
      `pages/[locale]/developers/evm-to-svm/erc20.tsx`
- [x] 5.24 Verify `/developers/evm-to-svm/erc20` renders correctly
- [x] 5.25 Migrate `/developers/evm-to-svm/erc3643` —
      `pages/[locale]/developers/evm-to-svm/erc3643.tsx`
- [x] 5.26 Verify `/developers/evm-to-svm/erc3643` renders correctly
- [x] 5.27 Migrate `/developers/evm-to-svm/erc4337` —
      `pages/[locale]/developers/evm-to-svm/erc4337.tsx`
- [x] 5.28 Verify `/developers/evm-to-svm/erc4337` renders correctly
- [x] 5.29 Migrate `/developers/evm-to-svm/erc4626` —
      `pages/[locale]/developers/evm-to-svm/erc4626.tsx`
- [x] 5.30 Verify `/developers/evm-to-svm/erc4626` renders correctly
- [x] 5.31 Migrate `/developers/evm-to-svm/erc721` —
      `pages/[locale]/developers/evm-to-svm/erc721.tsx`
- [x] 5.32 Verify `/developers/evm-to-svm/erc721` renders correctly
- [x] 5.33 Migrate `/developers/evm-to-svm/smart-contracts` —
      `pages/[locale]/developers/evm-to-svm/smart-contracts.tsx`
- [x] 5.34 Verify `/developers/evm-to-svm/smart-contracts` renders correctly
- [x] 5.35 Run `pnpm build` — confirm no build errors after Phase 5

## 6. Solutions Section

- [x] 6.1 Migrate `/solutions` (index) — `pages/[locale]/solutions/index.tsx`
- [x] 6.2 Verify `/solutions` renders correctly
- [x] 6.3 Migrate `/solutions/actions` — `pages/[locale]/solutions/actions.tsx`
- [x] 6.4 Verify `/solutions/actions` renders correctly
- [x] 6.5 Migrate `/solutions/ai` — `pages/[locale]/solutions/ai.tsx`
- [x] 6.6 Verify `/solutions/ai` renders correctly
- [x] 6.7 Migrate `/solutions/artists-creators` —
      `pages/[locale]/solutions/artists-creators.tsx`
- [x] 6.8 Verify `/solutions/artists-creators` renders correctly
- [x] 6.9 Migrate `/solutions/btcfi` — `pages/[locale]/solutions/btcfi.tsx`
- [x] 6.10 Verify `/solutions/btcfi` renders correctly
- [x] 6.11 Migrate `/solutions/commerce-tooling` —
      `pages/[locale]/solutions/commerce-tooling.tsx`
- [x] 6.12 Verify `/solutions/commerce-tooling` renders correctly
- [x] 6.13 Migrate `/solutions/consumer` —
      `pages/[locale]/solutions/consumer.tsx`
- [x] 6.14 Verify `/solutions/consumer` renders correctly
- [x] 6.15 Migrate `/solutions/defi` — `pages/[locale]/solutions/defi.tsx`
- [x] 6.16 Verify `/solutions/defi` renders correctly
- [x] 6.17 Migrate `/solutions/depin` — `pages/[locale]/solutions/depin.tsx`
- [x] 6.18 Verify `/solutions/depin` renders correctly
- [x] 6.19 Migrate `/solutions/desci` — `pages/[locale]/solutions/desci.tsx`
- [x] 6.20 Verify `/solutions/desci` renders correctly
- [x] 6.21 Migrate `/solutions/digital-assets` —
      `pages/[locale]/solutions/digital-assets.tsx`
- [x] 6.22 Verify `/solutions/digital-assets` renders correctly
- [x] 6.23 Migrate `/solutions/enterprise` —
      `pages/[locale]/solutions/enterprise.tsx`
- [x] 6.24 Verify `/solutions/enterprise` renders correctly
- [x] 6.25 Migrate `/solutions/financial-infrastructure` —
      `pages/[locale]/solutions/financial-infrastructure.tsx`
- [x] 6.26 Verify `/solutions/financial-infrastructure` renders correctly
- [x] 6.27 Migrate `/solutions/financial-institutions` —
      `pages/[locale]/solutions/financial-institutions.tsx`
- [x] 6.28 Verify `/solutions/financial-institutions` renders correctly
- [x] 6.29 Migrate `/solutions/games-tooling` —
      `pages/[locale]/solutions/games-tooling.tsx`
- [x] 6.30 Verify `/solutions/games-tooling` renders correctly
- [x] 6.31 Migrate `/solutions/gaming-and-entertainment` —
      `pages/[locale]/solutions/gaming-and-entertainment.tsx`
- [x] 6.32 Verify `/solutions/gaming-and-entertainment` renders correctly
- [x] 6.33 Migrate `/solutions/institutional-payments` —
      `pages/[locale]/solutions/institutional-payments.tsx`
- [x] 6.34 Verify `/solutions/institutional-payments` renders correctly
- [x] 6.35 Migrate `/solutions/payments-tooling` —
      `pages/[locale]/solutions/payments-tooling.tsx`
- [x] 6.36 Verify `/solutions/payments-tooling` renders correctly
- [x] 6.37 Migrate `/solutions/real-world-assets` —
      `pages/[locale]/solutions/real-world-assets.tsx`
- [x] 6.38 Verify `/solutions/real-world-assets` renders correctly
- [x] 6.39 Migrate `/solutions/request-for-startups` —
      `pages/[locale]/solutions/request-for-startups.tsx`
- [x] 6.40 Verify `/solutions/request-for-startups` renders correctly
- [x] 6.41 Migrate `/solutions/solana-permissioned-environments` —
      `pages/[locale]/solutions/solana-permissioned-environments.tsx`
- [x] 6.42 Verify `/solutions/solana-permissioned-environments` renders
      correctly
- [x] 6.43 Migrate `/solutions/stablecoins` —
      `pages/[locale]/solutions/stablecoins.tsx`
- [x] 6.44 Verify `/solutions/stablecoins` renders correctly
- [x] 6.45 Migrate `/solutions/token-extensions` —
      `pages/[locale]/solutions/token-extensions.tsx`
- [x] 6.46 Verify `/solutions/token-extensions` renders correctly
- [x] 6.47 Migrate `/solutions/tokenization` —
      `pages/[locale]/solutions/tokenization.tsx`
- [x] 6.48 Verify `/solutions/tokenization` renders correctly
- [x] 6.49 Run `pnpm build` — confirm no build errors after Phase 6

## 7. Cleanup & 404

- [x] 7.1 Remove `pages/[locale]/404.js` (already handled by
      `app/[locale]/not-found.tsx`)
- [x] 7.2 Verify 404 page still works correctly
- [x] 7.3 Remove all `_m_` backup files from `pages/[locale]/`

## 8. Final Validation

- [x] 8.1 Run `pnpm lint` — no new violations
- [x] 8.2 Run `pnpm build` — successful build
- [x] 8.3 Run `pnpm test` — tests pass (or document pre-existing failures)
- [x] 8.4 Spot-check 5+ migrated pages across different sections in the browser
- [x] 8.5 Verify at least one non-English locale loads correctly

## Dependencies

- Phase 1 pages are independent and can be migrated in any order
- Phases 2–6 can run in parallel (sections are independent)
- Phase 7 cleanup requires all migrations in Phases 1–6 to be verified
- Phase 8 runs last as final gate

## Notes

- Use `migrate-page` skill for each migration task
- Use `create-page` skill when scaffolding is needed for new route patterns
- Each "Verify" task requires manual browser check — do not auto-mark
- If a page migration fails, skip it and note the issue before continuing
