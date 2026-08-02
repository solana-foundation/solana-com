---
name: buildout
description:
  Authoritative plan and build brief for solana-docs-agent. Use BEFORE any
  buildout work — trimming the internal-ai-agent fork, seeding the single agent,
  docs ingestion/index, the public /api/ask API, soul/skills, evals — and to
  answer plan or scope questions ("what's next", "is X in scope", "which gate
  are we on", acceptance criteria, rollout phases, cost model, open decisions).
  Triggers on - plan, roadmap, gate, trim, fork, buildout, scope, acceptance
  criteria, phases, ingestion, docs index, public API, Inkeep, widget, rollout.
---

# solana-docs-agent buildout

Two reference documents drive all work in this repo. Read the right one before
acting — do not work from memory of them:

| Read                          | When                                                                                                                                                                                                                                                                                                                                                |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `references/build-context.md` | Implementing anything. The executable build brief: repo bootstrap, the full trim map (keep / drop / keep-but-modify), single-agent seeding, tool definitions, docs ingestion rules, the `/api/ask/*` API contract + middleware stack, Claude API requirements, env surface, acceptance gates A–D, human-required items, out-of-scope list.          |
| `references/ai-bot-plan.md`   | The why and the whole-program view: the Inkeep audit (what this service replaces — chat AND site search AND the feedback responder), architecture rationale (separate deployment, fork-and-trim), search-replacement scope, the monorepo/widget workstream (NOT this repo), eval/red-team plan, rollout phases, cost model, and the open decisions. |

## Operating rules

1. **Work the gates in order** (A: fork & trim → B: docs index → C: public API →
   D: quality baseline; build-context.md §13). At the start of buildout work,
   state which gate is active. Never declare a gate done without verifying every
   listed criterion — run the commands (`agent:chat`, `docs:sync`,
   `php artisan test`, `pint --test`, golden-query checks); don't assume.
2. **Scope is the backend service only.** The solana-com monorepo (widget,
   Vercel rewrites, Inkeep removal) is a separate workstream — never modify it
   from here. Never re-add integrations, OAuth, Slack/Telegram/webhook
   transports, write-capable tools, or any multi-agent feature (build-context.md
   §16 + the CLAUDE.md invariants).
3. **Precedence when documents disagree with reality:** current repo code +
   CLAUDE.md invariants → `build-context.md` → `ai-bot-plan.md`. Both references
   are point-in-time snapshots from the planning session (July 2026). If the
   repo has moved past them, follow the repo and flag the drift — do not "fix"
   working code to match a stale document.
4. **Decisions the documents mark for the human stay with the human** — final
   repo/product naming, model default (opus vs sonnet A/B), search-tab scope,
   hosting/Doppler/keys, the proxy secret. Ask; don't guess or default silently.
5. **Cross-cutting question shortcut:** "why does a chat bot need a search
   endpoint?" → ai-bot-plan.md §1/§5 — Inkeep is also the _entire site search_
   for four apps, so `/api/ask/search` (index-backed, no LLM in the path) is a
   launch requirement, not a nice-to-have.
