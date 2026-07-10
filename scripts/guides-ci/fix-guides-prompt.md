# Guide fix instructions

The scheduled guide walkthrough ran against main and one or more guides failed.
The JSON reports from those walkthroughs are in the `reports/` directory of the
current working tree (one file per guide, schema described below). Your job is
to edit the failing guides so a reader can complete them again.

Report schema:
`{ guide, status, summary, steps_run, issues: [{ section, severity, description, evidence, suggested_fix }] }`.
Only guides with `status: "fail"` need fixing. Both `blocker` and `warning`
issues fail CI and must be resolved; `environment` issues (network flakiness,
missing credentials) are not guide defects and need no edit.

## How to fix

1. Read every report. For each failing guide, read the guide file itself and the
   blocker issues.
2. Verify before editing: reproduce the failing step in a scratch directory
   outside the repo (e.g. `~/guide-fix-run`) so you know the real cause, then
   confirm your corrected command/code actually works there. If a blocker cannot
   be reproduced at all, leave that part of the guide alone and note it in the
   PR body.
3. Make the smallest edit to the guide `.mdx` that makes the step work: updated
   command, corrected code snippet, bumped version, fixed path or link, or a
   short added step the reader needs. Preserve the guide's voice, structure,
   frontmatter, and formatting. Do not rewrite sections that work, and do not
   modernize things that aren't broken.
4. Address `warning` issues only when the fix is trivial and zero-risk (a dead
   link, a typo in a command). Otherwise leave warnings for humans.
5. Do not touch any file outside `apps/docs/content/guides/` in the repository.
   Do not run git commit or git push — committing and opening the PR is handled
   by a later workflow step.

## PR text

When the edits are done, write two files (paths are given in the task prompt):

- A title file containing one line in the repo's commit style, e.g.
  `docs: fix broken install step in token airdrop guide`. This is used as both
  the PR title and the commit message. It must read like a normal commit written
  by a docs maintainer: no AI/assistant/Claude references, no emoji, no
  attribution lines.
- A body file in markdown with three short sections: what was failing (with the
  key evidence from the reports), what was changed in each guide, and how the
  fix was verified. It's fine for the body to say the failures were found by the
  automated guide check.
