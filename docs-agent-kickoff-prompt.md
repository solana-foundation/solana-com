Build out this repo into the solana-docs-agent service, end to end.

## Load context first, in this order

1. CLAUDE.md is already in context — its invariants are binding for everything
   below.
2. Invoke the `buildout` skill and read BOTH references completely before
   writing any code: `references/build-context.md` (the executable brief:
   bootstrap, trim map, single-agent seeding, tools, ingestion, public API
   contract, Claude API rules, env surface, acceptance gates A–D) and
   `references/ai-bot-plan.md` (the program-level why). The brief is your spec —
   this prompt only adds working agreements on top of it; where they overlap,
   the brief wins.

## Reconcile the repo's starting state before anything else

Assess what's actually here. If the internal-ai-agent codebase has not been
brought in yet (the repo holds only CLAUDE.md and `.claude/` assets), pull it in
per build-context §4 adapted to this already-existing repo: add
`git@github.com:solana-foundation/internal-ai-agent.git` as the `upstream`
remote, fetch, and merge `upstream/main` into this repo's main branch with
`--allow-unrelated-histories`, preserving upstream history for future
cherry-picks. Resolve two conflicts deliberately:

- **This repo's CLAUDE.md wins.** Upstream ships its own CLAUDE.md describing
  the internal multi-employee platform — delete it in the merge; it would
  actively mislead future sessions.
- **`.claude/` merges selectively.** Keep this repo's `.claude/skills/buildout/`
  untouched. From upstream, keep only what still applies after the trim (e.g.
  the code-review Stop hook) and drop employee/integration/workflow skills.

If the code is already merged, skip this and go straight to the active gate.

## Prerequisite check (report gaps immediately, then continue with what's possible)

gh/SSH access to the private upstream repo · PHP 8.2 + Composer · local MySQL
(prod parity — use it if available) · `ANTHROPIC_API_KEY` or an authenticated
`claude` CLI for the `process` transport · `OPENAI_API_KEY` (not needed until
Gate B embeddings). Never commit secrets, and keep `.env.example` in sync with
every key you add or remove.

## How to work

- Work the gates strictly in order — A (fork & trim) → B (docs index) → C
  (public API) → D (quality baseline) — and state the active gate when you start
  it.
- Work on a `buildout` branch and push after every gate (at minimum) so progress
  is reviewable; merging to main is my call.
- Small, reviewable commits: trim/deletion commits separate from feature
  commits. Tag each completed gate (`gate-a`, `gate-b`, …).
- At each gate boundary, update a `PROGRESS.md` gate report mapping every
  acceptance criterion from build-context §13 to concrete evidence — the command
  you ran and what it output. Run the verifications for real
  (`php artisan agent:chat`, `docs:sync`, `php artisan test`,
  `vendor/bin/pint --test`, the golden-query retrieval check). Never mark a
  criterion met that you did not execute; if one is blocked, mark it **BLOCKED —
  needs <thing>** and keep building everything that doesn't depend on it.
- The Gate A streaming spike is timeboxed: investigate PHP SDK streaming against
  the installed SDK source, write the go/no-go note to
  `docs/streaming-spike.md`, and move on — the poll fallback is an acceptable v1
  per the brief.
- Decisions the brief reserves for the human — model A/B, search-tab scope,
  Doppler/hosting wiring, the proxy-secret value, anything requiring an Inkeep
  account — ask; don't guess. Everything else, decide the way the brief and
  upstream patterns point, and record the decision in the gate report.
- Prefer upstream's existing patterns over new inventions; consistency with
  internal-ai-agent is a product requirement. When a document conflicts with
  repo reality, follow the precedence order in the buildout skill and flag the
  drift.

## Definition of done for this engagement

All four gates verified — or explicitly enumerated BLOCKED items with exactly
what you need from me — plus: a green test suite, `README.md` rewritten for this
repo, and a final summary covering what was trimmed, what was added, every
deviation from the brief with its rationale, and the open human items.

Work autonomously through anything you can resolve yourself; stop only for
human-only inputs. Begin with the prerequisite check and the upstream merge.
