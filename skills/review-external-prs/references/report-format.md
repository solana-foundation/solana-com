# PR review report format

Write the current report to `skills/review-external-prs/PR_REVIEW_REPORT.md`.
Replace the previous snapshot after a complete run; do not append a second
current-state report.

Use this shape, omitting empty sections. Never include protected PRs, authors,
or counts.

```markdown
# External PR Review Report

- Repository: `solana-foundation/solana-com`
- Generated: `<UTC ISO-8601>`
- Scope: Open PRs from known non-protected authors
- Mutation mode: `<report-only | authorized auto-close>`

## Outcome

- External PRs inspected: `<n>`
- Closed: `<n>`
- Closures awaiting authorization: `<n>`
- Remaining: `<n>`
- Remaining first-time contributors: `<n>`

## Closures made or staged

| PR          | Author status            | Disposition       | Decisive evidence                                                                                 | GitHub state |
| ----------- | ------------------------ | ----------------- | ------------------------------------------------------------------------------------------------- | ------------ |
| [#123](url) | `FIRST_TIME_CONTRIBUTOR` | `trust-threshold` | Live product and official domain ownership could not be verified; checked `<sources>` on `<date>` | closed       |

## Remaining external PRs

### [#456 — Title](url)

- Author: `@login` (`FIRST_TIME_CONTRIBUTOR`)
- Reviewed head: `<full SHA>` at `<UTC ISO-8601>`
- Area and intent: `<workspace/path and one-sentence goal>`
- State: `<draft/ready; mergeability; review state; CI summary>`
- Commit integrity:
  `<verified single commit | non-conforming: count and GitHub verification reason code(s); request state>`
- Trust screen:
  `<not applicable | no material signal found | factual concern and sources>`
- Review:
  `<what is sound, then concrete correctness/security/content findings with file:line references>`
- Suggested action: `<one primary maintainer or contributor action>`
- Suggested validation: `<commands or manual checks still needed>`

## Private security escalations

- `<Minimal non-exploit detail and the private channel/action required>`

## Limitations

- `<Diff/API limits, inaccessible evidence, checks not run, or other uncertainty>`
```

## Reporting rules

- Sort remaining PRs by suggested urgency, with first-time contributors first
  within the same urgency.
- Distinguish observations, inferences, and unverified claims. Link sources for
  product identity, maturity, and adverse evidence.
- For code findings, identify the relevant file and line whenever possible and
  explain impact, not just preference.
- Use `no material signal found`, never `safe` or `not a scam`.
- Render a suspicious domain as plain code only when it is essential evidence;
  do not create a clickable malicious link. Prefer linking an authoritative
  warning about it.
- Keep exploit details and personal information out of this tracked report.
- If no external PR remains, say so explicitly under `Remaining external PRs`.
- A report-only run lists evidence-backed close candidates as
  `awaiting authorization`; it must not imply that GitHub state changed.
