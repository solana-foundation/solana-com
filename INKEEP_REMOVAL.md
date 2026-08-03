# Inkeep Removal Checklist

Status: **Ask Solana always on; Inkeep fully unmounted.** The `AskSolanaButton`
/ `AskSolanaSearchBar` components (packages/ui-chrome/src/ask-solana/) render
unconditionally — there is no feature flag and no Inkeep fallback. The Inkeep
component files still exist as dead code until Phase 2 below. Launching is now
the same thing as deploying, so the agent service must be reachable first (Phase
1).

## Phase 1 — Rollout (per Vercel project: web, docs, media, templates)

- [ ] Deploy `solana-docs-agent` and set `ASK_AGENT_URL=<service origin>` on the
      **web** project (activates the `/api/ask/:path*` proxy rewrite in
      `apps/web/rewrites-redirects.ts`)
- [ ] Verify `/api/ask/search?q=test` and a streamed `/api/ask/chat` work
      through the proxy (SSE must not be buffered by the rewrite — if it is, set
      `NEXT_PUBLIC_ASK_API_URL` to the service origin and enable CORS there
      instead)
- [ ] Share the proxy-secret decision with the agent team: Next.js rewrites
      cannot attach custom request headers, so v1 protection on the service side
      should be Origin/Referer allowlisting + throttles + budget breaker. If a
      true shared-secret header is required, add an edge middleware that
      rewrites `/api/ask/:path*` with an injected header (follow-up).
- [ ] Dogfood on preview deployments (Ask Solana renders unconditionally; docs
      previews need `ANTHROPIC_API_KEY` for the native `/api/ask` routes)
- [ ] Run the Lingo translation pass for the new `askSolana.*` keys in
      `packages/i18n/messages/web/*/common.json` (non-EN locales currently carry
      English values)
- [ ] Ship to production (deploy = launch for all apps at once — there is no
      flag; rollback is a revert), watching PostHog (`docs_ai_chat_opened`,
      `docs_ai_message_sent`, `docs_ai_search`, `docs_ai_feedback`,
      `docs_ai_search_result_clicked`) and agent-side cost/latency dashboards
- [ ] **Export Inkeep query/conversation logs before cancelling anything**

## Phase 2 — Code removal (after the flag has been 100% on and stable)

### packages/ui-chrome

- [ ] Delete `src/inkeep-chat-button.tsx`, `src/inkeep-searchbar.tsx`,
      `src/inkeep-config.ts`
- [ ] Delete `src/assets/long-arrow-up.svg` (Inkeep-only chat-submit icon)
- [ ] Remove the two Inkeep exports from `src/index.ts`
- [x] ~~Delete the `isAskSolanaEnabled()` fallback branches~~ — done; the flag
      and the Inkeep fallbacks in `ask-solana-button.tsx` /
      `ask-solana-searchbar.tsx` are removed
- [ ] Remove `@inkeep/cxkit-react` from `packages/ui-chrome/package.json`
- [ ] Update `packages/ui-chrome/README.md` (Inkeep sections: ~lines 4, 19–20,
      55–63, 101–109, 175–194)

### Dependencies

- [ ] Remove `@inkeep/cxkit-react` from `apps/web/package.json` (never imported
      in web source)
- [ ] Remove `@inkeep/cxkit-react` from `apps/templates/package.json` (never
      imported)
- [ ] `pnpm install` to drop `@inkeep/cxkit-*` transitives from `pnpm-lock.yaml`

### apps/docs feedback responder

- [ ] Replace `src/app/components/inkeep/inkeep-feedback.ts` (server action
      calling Inkeep's QA API + `api.analytics.inkeep.com`) with agent-service
      feedback logging; `docs-page.tsx:13,82` passes it to `<Rate/>`
- [ ] Then remove `ai` and `@ai-sdk/openai` from `apps/docs/package.json` (only
      used by that action)

### Env vars

- [ ] `turbo.json` globalEnv: remove `INKEEP_API_KEY`,
      `NEXT_PUBLIC_INKEEP_API_KEY`
- [ ] `.env.example` files: remove Inkeep entries from apps/web, apps/docs,
      apps/media, apps/templates
- [ ] Vercel project env: remove both keys from all four projects

### Docs & tests

- [ ] `/CLAUDE.md` (lines ~78, 102), `/AGENTS.md` (~line 16),
      `apps/web/CLAUDE.md` (~line 83), `apps/templates/CLAUDE.md` (~line 95):
      remove Inkeep references
- [x] `apps/web/src/__tests__/i18n/next-intl.test.tsx` renders `Header` —
      verified passing with the Inkeep fallback gone (Header now renders
      AskSolana components)
- [ ] Decide fate of legacy `commands.askAI` / `commands.searchOrAskAI` i18n
      keys (still used by the AskSolana entry buttons — keep)

### Contract

- [ ] Confirm the Inkeep log export completed, then cancel the Inkeep
      subscription

## Reference — what was added (this change)

- `packages/ui-chrome/src/ask-solana/` — config (API base), store, api (SSE
  client + session + search + feedback), analytics bridge, markdown renderer,
  chat view, search view, modal host, `AskSolanaButton`, `AskSolanaSearchBar` (+
  `react-markdown`/`remark-gfm` deps)
- Mount swaps: `packages/ui-chrome/src/header.tsx`,
  `apps/web/src/app/[locale]/layout.tsx`, 8 docs layouts/pages,
  `apps/docs/src/app/components/docs-hero.tsx`
- `/api/ask/:path*` rewrite in `apps/web/rewrites-redirects.ts` (gated on
  `ASK_AGENT_URL`)
- PostHog bridges in both `PostHogProvider.tsx` files (web + docs)
- `askSolana.*` i18n keys in all 19 `packages/i18n/messages/web/*/common.json`
- Env plumbing: `turbo.json` globalEnv + 4 `.env.example` files
