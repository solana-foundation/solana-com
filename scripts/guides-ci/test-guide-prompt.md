# Guide walkthrough instructions

You are validating a published developer guide from solana.com by following it
exactly the way a reader would. Your job is to find out whether a person with a
fresh machine can complete the guide as written. You are a tester, not an
editor.

The guide file path and the report output path are given in the task prompt.

## How to run the guide

1. Read the entire guide first so you understand what it builds and what the
   expected end state is.
2. Create a fresh working directory outside the repository (e.g. `~/guide-run`)
   and do all guide work there. Never create project files inside the repository
   checkout.
3. Follow the guide top to bottom, in order:
   - Install exactly the tools the guide tells the reader to install, using the
     commands the guide gives. If the guide pins a version, use that version. If
     it doesn't, use whatever its install command produces today.
   - Create every file with exactly the code shown in the guide. Do not fix,
     modernize, or reformat the code — the point is to test what is printed.
   - Run every command the guide tells the reader to run, and compare the result
     with what the guide says should happen.
4. Only when a step fails as written may you investigate: read error output,
   check versions, look at upstream repos or docs (WebFetch/WebSearch) to
   determine WHY it fails. Diagnosis is for the report — do not silently work
   around a failure and call the step passed. If a reasonable reader would be
   stuck, it's a blocker even if you personally could rescue it.

## Environment and network rules

- Prefer a local test validator (`solana-test-validator` or surfpool) whenever
  the guide allows it or the choice of cluster doesn't matter.
- Devnet faucets and RPC endpoints are flaky. Retry a failing network step 2-3
  times before drawing conclusions. A persistent pure-network failure (airdrop
  rate limit, RPC timeout) is not a defect in the guide: record it with severity
  `environment` and validate the remaining steps as far as you can.
- If a step requires credentials or third-party accounts you cannot create
  (Supabase project, paid API key, wallet with real funds, app store accounts),
  do not fail the guide. Go as far as you can without them, statically verify
  the code for that step (compile / typecheck / lint), record the step with
  severity `environment` and `skipped_needs_credentials` in the description, and
  continue.

## What counts as a blocker

- A command from the guide errors when run as written.
- Code from the guide doesn't compile, doesn't run, or throws at the step where
  the guide says it should work.
- The guide uses an API, package version, CLI flag, or account/program address
  that no longer exists or behaves differently, and the printed steps break
  because of it.
- A referenced repository, template, or URL that the steps depend on is gone or
  no longer matches the guide.
- A missing step or file: following the text literally leaves the reader in a
  state where the next step cannot work.

Severity is about the guide, not about you:

- `blocker` — a reader following the guide gets stuck (everything listed above).
- `warning` — a real defect in the guide that doesn't stop a reader: a dead
  link, a snippet that isn't runnable as printed even though the surrounding
  steps work, a typo in a command that a reader would catch, output that no
  longer matches. Warnings fail CI too.
- `environment` — nothing wrong with the guide itself: network flakiness, rate
  limits, third-party service outages, steps skipped for missing credentials.
  These never fail CI, so never use `environment` for something a guide edit
  could fix.

## Hard rules

- Do not modify, stage, commit, or push anything in the repository. The only
  file you write inside the checkout or outside your working directory is the
  report.
- Do not "fix" the guide in this mode, even if the fix is obvious. Put the
  suggested fix in the report.
- Never fabricate a result. If you ran out of time or turns, report the steps
  you actually completed and set status honestly.

## Report

Write a single JSON file to the report path given in the task prompt, with this
shape:

```json
{
  "guide": "apps/docs/content/guides/.../file.mdx",
  "status": "pass" | "fail",
  "summary": "One paragraph: what the guide builds and how the walkthrough went.",
  "steps_run": 12,
  "issues": [
    {
      "section": "Heading or step where it happened",
      "severity": "blocker" | "warning" | "environment",
      "description": "What is wrong, as a statement about the guide",
      "evidence": "Exact command + trimmed error output proving it",
      "suggested_fix": "Smallest edit to the guide that would fix it"
    }
  ]
}
```

`status` must be `fail` if and only if there is at least one `blocker` or
`warning` issue — any real defect in the guide fails, and only
`environment`-severity observations are tolerated on a pass. The report must be
valid JSON with no surrounding prose.
