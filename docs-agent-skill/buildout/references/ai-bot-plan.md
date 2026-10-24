# Solana.com Docs AI Agent — Implementation Plan

**Goal:** Replace Inkeep on solana.com with a Solana-Foundation-owned AI agent
whose harness and framework mirror `solana-foundation/internal-ai-agent` — but
running exactly **one** agent, with no multi-employee machinery to manage.

---

## 1. What Inkeep actually provides today (audit result)

Inkeep is bigger than "docs chat." Full removal means replacing three surfaces:

| Surface                                          | Where                                                                                                        | Details                                                                                                                                                                                                                                                     |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **AI chat** ("Ask AI")                           | web sitewide, 8 docs section layouts, mobile header                                                          | `InkeepChatButton` in `packages/ui-chrome/src/inkeep-chat-button.tsx`; floating button in `apps/web/src/app/[locale]/layout.tsx:67` and docs layouts (`docs/(main)`, `rpc`, `payments`, `tools`, `cookbook`, `guides`, `bootcamp`)                          |
| **Site search** (Cmd-K + header bar + docs hero) | **web, docs, media, templates** — all 4 apps via shared `Header` (`packages/ui-chrome/src/header.tsx:62–63`) | Federated tabs: Solana Docs, Anchor Docs, Kit Docs, Anza Docs, Stack Exchange, GitHub. **There is no fallback search** — fumadocs' built-in search is disabled (`apps/docs/src/app/components/docs-layout.tsx:37`), and no Algolia/pagefind exists anywhere |
| **Docs page-feedback AI responder**              | docs pages (`Rate` component)                                                                                | Server action `apps/docs/src/app/components/inkeep/inkeep-feedback.ts` calls Inkeep's OpenAI-compatible QA API (`inkeep-qa-sonnet-3-5`) and logs to `api.analytics.inkeep.com`. The `ai` + `@ai-sdk/openai` deps in apps/docs exist only for this           |

Other touchpoints for the removal checklist: `@inkeep/cxkit-react@^0.5.117` in 3
package.jsons (ui-chrome, web, templates),
`INKEEP_API_KEY`/`NEXT_PUBLIC_INKEEP_API_KEY` in `turbo.json` + 4
`.env.example`s + Vercel env, the 826-line
`packages/ui-chrome/src/inkeep-config.ts`, i18n keys `commands.askAI` /
`commands.searchOrAskAI` in 19 locales, `?search=` deep-link behavior, and doc
references in `CLAUDE.md` / `AGENTS.md` / ui-chrome README. Accelerate and
breakpoint apps have no Inkeep.

**Good news for retrieval:** the docs corpus is fully in-repo and AI-ready:

- Canonical content:
  `apps/docs/content/{docs/en, cookbook, guides, learn/en, developers-learn/en}`
  (MDX, English is source of truth; other locales are Lingo machine
  translations). Code snippets resolve from `packages/docs-examples/**` via
  `remark-include-code` `file=` directives.
- A raw markdown API already exists: `GET solana.com/{docs-path}.md` →
  `apps/docs/src/app/api/markdown/[...slug]/route.ts` (English,
  `s-maxage=3600`).
- Curated URL seeds already published: `apps/web/public/llms.txt` (regenerated
  weekly by `llmtxt-generator.py` + GitHub Action) and `llms-full.txt`.
- PostHog instrumentation precedent: `docs_markdown_requested` event.

---

## 2. Architecture overview

Two deliverables:

```
                    solana.com (Vercel, this monorepo)
┌───────────────────────────────────────────────────────────────┐
│  packages/ui-chrome: AskSolanaButton / AskSolanaSearchBar      │
│  (drop-in replacements for the two Inkeep components)          │
│        │  same-origin  /api/ask/* (rewrite in apps/web)        │
└────────┼───────────────────────────────────────────────────────┘
         ▼
┌───────────────────────────────────────────────────────────────┐
│  solana-docs-agent  (NEW repo — trimmed fork of                │
│  internal-ai-agent: Laravel 11 + MySQL + queue, Laravel Cloud, │
│  Doppler secrets — identical operational model)                │
│                                                                │
│  AgentService loop ── ClaudeService (claude-opus-5)            │
│       │ tools: search_docs · read_doc · web_search/web_fetch   │
│       │        (domain-locked to solana.com ecosystem)         │
│       ▼                                                        │
│  docs index (chunks + embeddings, synced from this monorepo)   │
│  conversations / messages / agent_runs / evals / admin obs.    │
└───────────────────────────────────────────────────────────────┘
```

**Deliverable A — `solana-docs-agent`:** a separate deployment forked from
`internal-ai-agent`, trimmed to a single seeded agent with a public, anonymous
chat API and a docs retrieval index.

**Deliverable B — monorepo changes:** new chat/search widget in
`packages/ui-chrome`, a Vercel rewrite for same-origin API access,
feedback-responder replacement, then full Inkeep removal.

### Why a separate deployment (not a public transport on internal-ai-agent)

The internal app holds HubSpot service keys, Slack bot tokens, Google OAuth
credentials, employee conversations, and memories. Pointing anonymous internet
traffic into that app/database is an unacceptable blast radius, and public
traffic has a different scaling, abuse, and cost profile. Fork the harness;
share nothing at runtime. Because both repos share the framework, improvements
can be cherry-picked between them.

### Why fork-and-trim (not a rewrite)

The value is the battle-tested core: `AgentService::performRun()` (persist →
context → Claude → tool loop → persist), `ClaudeService` (api/process
transports, prompt caching on system blocks already implemented),
`ToolDispatcher`/`ToolExecutionService` (permissioned + parallel tool calls),
the `conversations`/`messages`/`agent_runs` schema with retention pruning,
`AgentChatThrottle` (already supports IP-keyed limits for unauthenticated
requests), soul runtime, skills-in-repo with `skills:deploy`, the
semantic-search/embedding machinery, and the eval subsystem. Trimming is
deleting; rebuilding is rewriting. A TypeScript port inside the monorepo was
considered and rejected: it forfeits the existing harness,
queue/eval/observability infra, and the operational knowledge the team already
has.

---

## 3. The agent service (fork-and-trim map)

### Keep (the harness)

- `AgentService` core run loop, system-prompt builder, conversation
  summarization
- `ClaudeService` — both transports (`api` for prod; `process` bridge stays
  useful for local dev on Claude Max)
- `ToolDispatcher` + `ToolExecutionService` (parallel tool calls, permission
  checks)
- Schema + retention: `conversations`, `messages`, `agent_runs` (token/timing
  tracking), `agent:prune-history`, `AGENT_*_RETENTION_*` knobs
- `AgentChatThrottle` (`agent-chat:ip:` keying already exists)
- Soul runtime: `soul/IDENTITY.md`, `soul/GUIDE.md`, `soul/MEMORY.md` injected
  every run
- Skills-in-repo: `skills/<slug>/{config.json,prompt.md}`, `skills:deploy`,
  semantic skill retrieval (`AGENT_SKILL_CONTEXT_TOP_K`)
- `EmbeddingService` + semantic-search machinery (repurposed for the docs index)
- Eval subsystem: eval suites, `RunEvalSuiteJob`, admin eval dashboard
- Admin console **trimmed to observability**: runs, transcripts, token usage,
  evals, feedback
- Queue worker + scheduler runtime; Laravel Cloud + Doppler deployment pattern
- Server-side Anthropic tool plumbing (`AGENT_WEB_SEARCH_*`, `AGENT_WEB_FETCH_*`
  with domain allowlists — this already exists in config)

### Drop

- Multi-employee surface: employee CRUD/wizard/SSO,
  Slack/Telegram/HTTP-per-employee auth, onboarding gates. **The `Employee`
  model stays** (it's threaded through AgentService), but exactly one row is
  seeded at deploy ("Solana Docs Agent") and there is no runtime UI to manage
  agents. Agent identity/config lives in the repo: soul files + skills + seeder.
  _This is the "one agent, not countless" answer._
- Transports: Slack (webhooks, campaigns, home tab, delivery), Telegram +
  `danog/madelineproto` dependency, HubSpot workflow webhooks
- All integrations + OAuth controllers (HubSpot, Google, Granola, Ironclad,
  Notion, Linear, Databricks, Vercel, GitHub…), the approval queue, integration
  credentials tables
- Per-user memory: memory extraction, memory embeddings, self-memory, OpenAI
  memory review (anonymous users get per-conversation context + summarization
  only)
- Workflows, agent schedules (keep Laravel's scheduler for ops crons: docs sync,
  pruning)
- ~30 of the 40 tools, including every write-capable tool (`write_file`,
  `delete_file`, memory writes, `create_schedule`, `delegate_to_agent`)

### Add (new for a public docs bot)

**Tools (read-only, `strict: true` JSON schemas):**

| Tool                       | Behavior                                                                                                                                                                                                                                                                                                                              |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `search_docs`              | Hybrid search (BM25/keyword + embedding cosine) over the docs index; returns chunk text + canonical URL + section anchor + doc title                                                                                                                                                                                                  |
| `read_doc`                 | Full markdown of one docs page by slug/URL from the index (byte-bounded)                                                                                                                                                                                                                                                              |
| `web_search` / `web_fetch` | Anthropic server-side tools, **upgraded to `web_search_20260209` / `web_fetch_20260209`** (the fork pins older versions), domain-locked: `solana.com`, `anchor-lang.com`, `solanakit.com`, `docs.anza.xyz`, `solana.stackexchange.com`, `github.com` — covers Inkeep's federated sources and pages not yet indexed; citations enabled |

**Docs ingestion (`docs:sync` artisan command + scheduler):**

- Source: clone/pull this monorepo, walk `apps/docs/content/**` (English
  trees) + resolve `file=` snippet includes from `packages/docs-examples/**`
  ourselves (the `.md` HTTP endpoint returns _unresolved_ directives — ingesting
  from the repo is more faithful). Map slugs → URLs using the fumadocs source
  conventions; use `llms.txt` as a URL cross-check.
- Optionally ingest `anchor-lang.com/docs`, `solanakit.com`, `docs.anza.xyz`
  (crawl) to preserve federated search tabs — see §5 search decision.
- Chunk by heading (~500–1,000 tokens, overlap), embed
  (`EMBEDDING_PROVIDER=openai`, `text-embedding-3-small` — the harness's
  `local_hash` default is not production-grade), store in new `doc_pages` /
  `doc_chunks` (+ embedding) tables mirroring the memory-embedding schema.
- Freshness: every-6-hours cron + manual trigger + (later) a deploy webhook from
  Vercel.

**Public anonymous API (all behind: shared-secret header from the Vercel proxy,
per-IP + per-session throttles, `ASYNC_CHAT_MAX_PENDING_RUNS`-style caps,
message-length caps, budget breaker):**

```
POST /api/ask/session            → { session_token }        (signed, anonymous, TTL)
POST /api/ask/chat               → SSE stream: status events ("Searching docs…"),
                                   text deltas, citations, done { run_id, usage }
                                   (fallback: 202 + run_id, poll — the harness's existing pattern)
GET  /api/ask/conversations/{id} → session-scoped transcript
POST /api/ask/feedback           → { run_id, rating, comment? }
GET  /api/ask/search?q=          → classic search results from the same docs index (see §5)
```

**Streaming:** `ClaudeService` has no streaming today (internal app is
queue+poll). Add an SSE path that streams final-text deltas and emits status
events during tool phases, persisting runs/messages identically at completion.
**Phase-1 spike:** verify `anthropic-ai/sdk` (PHP) streaming + Laravel
`StreamedResponse` + streaming through the Vercel rewrite; fallback is raw SSE
via Guzzle, and the poll pattern ships if streaming slips.

**Model config:** `CLAUDE_MODEL=claude-opus-5` (fork default is legacy
`claude-sonnet-4-20250514`), adaptive thinking (on by default on Opus 5),
`output_config.effort` tuned via evals (`low`/`medium` are strong on Opus 5 and
cut latency — don't disable thinking; that has known tool-call failure modes),
`max_tokens` ~4–8K, `CLAUDE_MAX_TOOL_ITERATIONS` ~6. Verify prompt caching
end-to-end (system blocks already carry `cache_control`; confirm tool
definitions are cached too and watch `cache_read_input_tokens` in run records —
at public volume this is the single biggest cost lever).

**Soul (public adaptation):** reuse the internal soul's entity-boundaries
section (Foundation ≠ Labs ≠ Anza ≠ ecosystem) nearly verbatim; replace internal
hard-stops with public ones — no token price/investment commentary, no
legal/financial advice, no wallet-security exploitation help,
answer-only-from-docs-with-citations, "I don't know → link docs search / Stack
Exchange", respond in the user's language (docs links are English). Skills:
start with 3–5 topic packs (e.g. `rpc-troubleshooting`, `anchor-migration`,
`token-extensions`) using semantic retrieval, seeded from the relevant `sf-*`
skills in the internal repo.

**Cost circuit breaker:** small `BudgetGuard` service summing `agent_runs` token
spend per hour/day against configured ceilings → 503 + alert + kill-switch env
flag. Public LLM endpoints without a breaker are an incident waiting to happen.

---

## 4. Monorepo work (Deliverable B)

### New widget in `packages/ui-chrome`

Build drop-in replacements so the swap is mechanical:

- `AskSolanaButton` — same props as `InkeepChatButton` (`className?`,
  `variant: "fixed" | "inline"`)
- `AskSolanaSearchBar` — same props as `InkeepSearchBar` (`className?`,
  `expanded?`)
- One shared `AskSolanaModal` with **chat and search views**, preserving current
  UX: Cmd/Ctrl-K shortcut, `?search=` deep-link parity, ABC Diatype styling,
  dark/light via `[data-theme]`, mobile behavior
- Chat view: streaming markdown (react-markdown + shiki for code), citation
  chips linking to docs, example questions, thumbs feedback →
  `/api/ask/feedback`, "AI-generated — may contain mistakes" disclaimer
- Search view: instant results from `GET /api/ask/search` with tab filters
- Analytics: PostHog events (`docs_ai_chat_opened`, `docs_ai_message_sent`,
  `docs_ai_feedback`, `docs_ai_search`) following the `docs_markdown_requested`
  pattern
- i18n: new keys in `packages/i18n/messages/web/*/common.json` replacing
  `commands.askAI` / `commands.searchOrAskAI`

Swap points (from the audit): `packages/ui-chrome/src/header.tsx:62–63`,
`apps/web/src/app/[locale]/layout.tsx` (+ 2 legacy layouts), the 8 docs
layouts/pages, `apps/docs/src/app/components/docs-hero.tsx:33`, and the
`apps/web` i18n test that renders `Header`.

### API routing

Add a `beforeFiles` rewrite in `apps/web/rewrites-redirects.ts`:
`/api/ask/:path*` → the agent service URL (mirrors the existing media-app proxy
pattern), so the widget calls same-origin — no CORS, no ad-blocker issues.
Widget reads `NEXT_PUBLIC_ASK_API_URL` (default `/api/ask`) so media/templates
can point at an absolute URL if they serve off-domain. The agent service
verifies a shared proxy-secret header so only site traffic reaches it.

### Feedback responder replacement

Replace `inkeep-feedback.ts`: v1 logs thumbs + comment to the agent service +
PostHog with a static thank-you (drop `ai`/`@ai-sdk/openai` deps). Optional
v1.1: a small agent endpoint generates the personalized "here are related docs"
response using `search_docs`.

### Removal checklist (final phase)

`@inkeep/cxkit-react` from 3 package.jsons; `inkeep-config.ts`,
`inkeep-chat-button.tsx`, `inkeep-searchbar.tsx`, `long-arrow-up.svg`;
`INKEEP_API_KEY` + `NEXT_PUBLIC_INKEEP_API_KEY` from `turbo.json`, 4
`.env.example`s, and Vercel project env; i18n keys in 19 locales; doc references
in `/CLAUDE.md`, `/AGENTS.md`, `apps/web/CLAUDE.md`, `apps/templates/CLAUDE.md`,
ui-chrome README; cancel the Inkeep contract **after** exporting query logs
(§6).

---

## 5. Search replacement (the hidden scope)

Because Inkeep is also the only site search, chat alone can't replace it.
Recommended: **one index, two consumers** — the same `doc_chunks` index powers
both the agent's `search_docs` tool and the `GET /api/ask/search` endpoint
behind the search view.

- **v1 tabs:** All + Solana Docs (in-repo corpus). Optionally ingest
  Anchor/Kit/Anza docs sites to keep those tabs.
- **Dropped vs Inkeep:** live Stack Exchange + GitHub search tabs. The _chat_
  agent still reaches them via domain-locked `web_search`; the search view links
  out instead.
- **Interim fallback (optional):** re-enable fumadocs' built-in Orama search in
  apps/docs (`docs-layout.tsx:37`) as a safety net during transition — zero-cost
  toggle, docs-app-only.

This is a scope decision to confirm: is v1 search "Solana docs only" acceptable,
or must the federated tabs be preserved from day one?

---

## 6. Evals, guardrails, red team

- **Phase 0 action: export Inkeep query/conversation logs now** (before the
  contract ends) — they seed the eval suite and tell us real query distribution.
- Reuse the fork's eval harness (suites, `RunEvalSuiteJob`, admin dashboard):
  ~150–200 golden questions across docs areas; LLM-judge for groundedness,
  citation correctness, and correct refusal/redirect on off-topic asks;
  retrieval micro-evals (recall@k on golden Q→page pairs); run via artisan in CI
  on every prompt/skill/model change.
- Red-team pass: prompt injection via user text (tools are read-only, so blast
  radius is answer quality — still test), token-price/financial-advice bait,
  jailbreaks, non-English abuse, cost-abuse loops (max conversation length +
  summarization already bound this).
- Latency budgets: first token < ~2s, p95 tool-using answer < ~15s. Tune with
  effort levels, caching, and index speed. Load-test (k6) before rollout.
- Ops dashboards: cost/day, cache hit rate, p50/p95 latency, thumbs ratio,
  "couldn't answer" rate, 429/turnstile rates, budget-breaker headroom. Sentry
  for errors.

---

## 7. Phases

| Phase                     | Work                                                                                                                                                                                                                                                                                                                                          | Est.                     |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ |
| **0 — Prep**              | Export Inkeep logs; pick service repo name + domain (e.g. `ask.solana.com`, proxied); new Doppler project (dev/stg/prd); Anthropic org/key + budget alarms                                                                                                                                                                                    | ~1 day + waiting         |
| **1 — Fork & trim**       | Fork `internal-ai-agent` → `solana-docs-agent`; execute the drop list; single-agent seeder; model → `claude-opus-5` + tool-type upgrades; public soul v1; **smoke test:** `agent:chat` answers docs questions using only domain-locked web tools (a working terminal docs bot with zero new infra). Spikes: PHP streaming, Vercel-rewrite SSE | 3–5 days                 |
| **2 — Docs index**        | `docs:sync` ingestion (chunk/embed/store), `search_docs` + `read_doc` tools, `/api/ask/search`, cron + manual trigger, retrieval micro-evals                                                                                                                                                                                                  | 3–5 days                 |
| **3 — Public API**        | Anonymous sessions, SSE chat endpoint (+ poll fallback), throttles, proxy-secret middleware, budget breaker, feedback endpoint, load test                                                                                                                                                                                                     | 3–5 days (parallel w/ 2) |
| **4 — Widget**            | `AskSolana*` components, streaming client, search view, PostHog, i18n, rewrite in apps/web; mount behind a PostHog feature flag alongside Inkeep                                                                                                                                                                                              | 4–6 days                 |
| **5 — Evals & hardening** | Eval suite from Inkeep logs, LLM-judge in CI, red team, latency/cost tuning (effort sweep, cache verification)                                                                                                                                                                                                                                | ~1 week (overlaps)       |
| **6 — Rollout & removal** | Internal dogfood → staged % via flag → 100%; watch dashboards; execute removal checklist; cancel Inkeep                                                                                                                                                                                                                                       | 1–2 weeks calendar       |

Roughly **4–6 engineering weeks** for one engineer; Phases 2/3/4 parallelize
well across two.

---

## 8. Cost model (rough, to validate in dogfood)

Per chat message with warm caches: ~6–10K input tokens (mostly cache reads at
~0.1×) + ~2–4K fresh input + ~400–800 output.

|                | claude-opus-5 ($5/$25 per MTok) | claude-sonnet-5 ($3/$15; intro $2/$10 through 2026-08-31) |
| -------------- | ------------------------------- | --------------------------------------------------------- |
| Per message    | ≈ $0.02–0.06                    | ≈ $0.01–0.03                                              |
| 1,000 msgs/day | ≈ $600–1,800/mo                 | ≈ $250–750/mo                                             |

Plus: server-side web search ~$10 per 1,000 searches (used as fallback only once
the index lands); embeddings for ~6K pages ≈ single-digit dollars one-time +
pennies per sync; Laravel Cloud ~$100–300/mo. Offset: the Inkeep subscription.
Default is **opus-5** for answer quality on a flagship public surface; the eval
suite makes an opus-vs-sonnet A/B cheap to run before rollout — model choice is
a launch decision, not an architecture one.

---

## 9. Risks & open questions

1. **PHP SDK streaming maturity** — spike in Phase 1; poll fallback exists
   either way.
2. **SSE through the Vercel rewrite** — verify no buffering; fallback: point the
   widget at the service domain directly with CORS.
3. **Inkeep log export** — confirm what their dashboard/API lets us take out,
   and do it early.
4. **Search-tab scope** (§5) — Solana-docs-only v1 vs ingesting Anchor/Kit/Anza.
5. **Public cost exposure** — mitigated by throttles + budget breaker + flag
   kill switch; validate real per-message cost in dogfood before % rollout.
6. **Latency vs Inkeep** — Inkeep's search-as-you-type is fast; our search
   endpoint must be index-backed (no LLM in the search path) to match.
7. **Privacy/legal** — anonymous sessions, conversation retention (~30–90 days
   via existing pruning), a line in the privacy policy about AI chat logging,
   visible AI disclaimer.
8. **Ingestion fidelity** — cookbook pages embed code via `file=` directives;
   resolver must pull from `packages/docs-examples` or answers lose the actual
   code.

## 10. Decisions to confirm

1. **Model default:** `claude-opus-5` (recommended) vs `claude-sonnet-5` — or
   A/B via evals before launch.
2. **Search scope v1:** Solana docs only (recommended) vs preserving
   Anchor/Kit/Anza tabs at launch.
3. **Naming:** service repo (`solana-docs-agent`?), public product name ("Ask
   Solana"?), API path.
4. **Feedback responder:** simple logging v1 (recommended) vs keeping an
   AI-generated response.
5. **Hosting:** Laravel Cloud like internal-ai-agent (recommended) vs other
   infra.
