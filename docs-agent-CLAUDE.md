# solana-docs-agent

Public AI docs assistant for solana.com. A single Claude-powered agent answers
Solana developer questions for anonymous website visitors, grounded in the
solana.com docs corpus with citations, and exposes a plain search endpoint over
the same index. This service replaces Inkeep (both its AI chat and the site
search behind it).

## Origin & related repos

- **This repo is a trimmed fork of `solana-foundation/internal-ai-agent`** (kept
  as the `upstream` git remote). The harness — run loop, transports, tool
  dispatch, schema, skills, evals — is intentionally identical to upstream. When
  adding features, prefer upstream's existing pattern over inventing a new one;
  consistency with `internal-ai-agent` is a product requirement. Cherry-pick
  harness fixes from `upstream` when useful.
- **`solana-foundation/solana-com`** is the docs corpus source (read-only input
  to ingestion) and hosts the site widget that calls this service. Never modify
  it from here.
- If `SOLANA_DOCS_AGENT_CONTEXT.md` is present, the initial buildout is still in
  progress — that file is the build brief, and some components described below
  may not exist yet.

## Non-negotiable invariants

1. **Exactly one agent.** The `Employee` model exists because the whole harness
   is threaded through it — do not refactor it out, and do not build UI or
   endpoints that create more agents. The single "Solana Docs Agent" row is
   created by the deploy seeder; its configuration lives in the repo (`soul/`,
   `skills/`, seeder), never in an admin panel.
2. **Read-only tools only.** No write-capable tools, no integrations, no OAuth
   flows, no Slack/Telegram/webhook transports — ever. This deployment must hold
   zero internal credentials.
3. **Every public route keeps the safety stack**: proxy-secret check → per-IP +
   per-session throttles → message/conversation caps → `BudgetGuard`
   (token-spend ceilings + `ASK_KILL_SWITCH`). Never ship an endpoint that
   bypasses it.
4. **No PII, no accounts.** Anonymous session tokens only; conversations are
   pruned on the retention schedule. Never log secrets; `.env.example` documents
   every key the app reads (keep it in sync), Doppler holds real values.
5. **The system prompt must stay byte-stable per deploy** (prompt caching is the
   main cost lever). Dynamic context goes in messages, never interpolated into
   the system prompt or tool definitions.

## Tech stack

Laravel 11 · PHP 8.2 · MySQL · database queue · `anthropic-ai/sdk` (PHP) ·
OpenAI embeddings (docs index only) · Doppler secrets · Laravel Cloud · Pint ·
PHPUnit 11

## Architecture

Request lifecycle:

```
widget (solana.com, via Vercel rewrite w/ X-Ask-Proxy-Secret)
  → POST /api/ask/chat  (middleware: proxy secret → throttles → caps → BudgetGuard)
  → AgentService::performRun()
      persist user message → load history (+summary) → build system prompt
      (soul + skills + tool guidance) → ClaudeService → tool loop
      (search_docs / read_doc / server-side web_search+web_fetch)
      → persist assistant message, tool traffic, agent_run (tokens, timing)
  → SSE stream to client (status / delta / done events; poll fallback: 202 + run_id)
```

Key concepts (inherited from upstream — see `docs/how-this-app-works.md` if
retained):

| Concept                                 | Meaning                                                                                        |
| --------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `conversations` / `messages`            | Full transcript; message roles `user` / `assistant` / `tool_call` / `tool_result`              |
| `agent_runs`                            | One row per execution: status, final response, errors, token usage, timing                     |
| `soul/*.md`                             | Always-injected agent identity/guardrails — editing these changes production behavior          |
| `skills/<slug>/{config.json,prompt.md}` | Repo-as-source-of-truth topic packs, semantically retrieved; deployed via `skills:deploy`      |
| `doc_pages` / `doc_chunks`              | The docs index (chunks + embeddings) powering `search_docs`, `read_doc`, and `/api/ask/search` |
| Eval suites                             | Golden Q→A groundedness/citation/refusal cases, run via artisan and the admin dashboard        |

The admin console is **observability only** (runs, transcripts, token usage,
evals, feedback) — never add management surfaces to it.

## Development

```bash
composer install
php artisan migrate && php artisan db:seed --class=DocsAgentSeeder
php artisan skills:deploy

# Three long-running processes are required for full behavior:
php artisan serve
php artisan queue:work          # async chat runs never complete without this
php artisan schedule:work       # docs sync + pruning crons

# Smoke tests
php artisan agent:chat          # terminal chat with the seeded agent
php artisan docs:sync           # ingest/refresh the docs index

# Quality
vendor/bin/pint                 # format (CI/pre-commit enforced)
php artisan test                # PHPUnit feature tests
```

Local dev without an API key: `CLAUDE_TRANSPORT=process` uses the Claude CLI
bridge (`scripts/claude-process-bridge.php`). Production always uses
`CLAUDE_TRANSPORT=api`.

## Claude API rules (violations 400 in prod or silently burn money)

- Model: `claude-opus-5` (exact string; config default and env).
- Never send `temperature` / `top_p` / `top_k` — rejected on Opus 5.
- Never send `thinking: {type: "disabled"}`. Thinking is on by default (omit the
  param, or `{type: "adaptive"}`); control latency/cost with
  `output_config: {effort: ...}` instead.
- PHP SDK named args are camelCase (`maxTokens`). Don't guess SDK bindings —
  check the installed SDK source before writing new call shapes.
- Custom tools use `strict: true` schemas (`additionalProperties: false`,
  explicit `required`).
- Server-side web tools: types `web_search_20260209` / `web_fetch_20260209`,
  domain-allowlisted (solana.com, anchor-lang.com, solanakit.com, docs.anza.xyz,
  solana.stackexchange.com, github.com).
- Handle `stop_reason: "refusal"` (HTTP 200) before reading `content` — return
  the friendly fallback message and log `stop_details`.
- Caching: render order is `tools` → `system` → `messages`; keep both tools and
  system deterministic. The integration test asserting
  `usage.cache_read_input_tokens > 0` on repeat requests must stay green.

## Docs ingestion rules

- Ingest **from a clone of the solana-com monorepo**, English trees only:
  `apps/docs/content/{docs/en, cookbook, guides, learn/en, developers-learn/en}`.
- **Resolve `remark-include-code` `file=` directives** against
  `packages/docs-examples/**` during ingestion. Never ingest from the site's
  `.md` HTTP endpoint — it returns _unresolved_ directives, which strips real
  code examples from answers.
- Chunk by heading (~500–1,000 tokens, small overlap); store title, canonical
  URL, section anchor, headings path; upsert keyed by content hash so re-syncs
  are incremental.
- URL mapping follows the fumadocs loaders (English URLs carry no locale
  prefix); `apps/web/public/llms.txt` is a useful cross-check.

## Public API

| Endpoint                          | Purpose                                                                                  |
| --------------------------------- | ---------------------------------------------------------------------------------------- |
| `POST /api/ask/session`           | Issue signed anonymous session token                                                     |
| `POST /api/ask/chat`              | Chat (SSE: `status` / `delta` / `done` / `error`; poll fallback)                         |
| `GET /api/ask/conversations/{id}` | Session-scoped transcript                                                                |
| `POST /api/ask/feedback`          | Thumbs + comment per `run_id`                                                            |
| `GET /api/ask/search?q=`          | Index-backed search for the site's search UI — **no LLM in this path**, keep p95 < 200ms |

## Deployment

Laravel Cloud + Doppler (`dev`/`stg`/`prd`). Deploy pipeline order matters:
`migrate` → `DocsAgentSeeder` → `skills:deploy` (fails the deploy on invalid
skill files). Workers: `queue:work` with `AGENT_RUN_JOB_TIMEOUT_SECONDS`
**strictly less than** `DB_QUEUE_RETRY_AFTER`, plus the scheduler every minute.

## Gotchas

- The `Employee`-based schema looks multi-agent; it isn't. Don't "clean it up"
  and don't extend it — see invariant #1.
- Editing `soul/*.md` or `skills/**` changes production agent behavior on next
  deploy — run the eval suite (`php artisan` eval command + admin dashboard)
  before merging prompt changes.
- A stuck async chat almost always means `queue:work` isn't running.
- Interpolating anything per-request into the system prompt (dates, IDs, flags)
  silently destroys the prompt cache — watch `cache_read_input_tokens` in
  `agent_runs` when touching prompt assembly.
- The search endpoint is on the site's search hot path; never add model calls or
  ingestion work to it.
