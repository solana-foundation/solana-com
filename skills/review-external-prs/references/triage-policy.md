# External PR triage policy

Apply this policy only after the protected-author gate has admitted the PR.
Every conclusion must be tied to the exact reviewed head SHA.

## Review order

1. Check commit integrity: the external-contribution security criterion is one
   GitHub-verified signed commit at the reviewed PR head.
2. Screen for malicious intent, scam signals, unsafe links, secrets, and
   supply-chain or workflow abuse.
3. If the PR adds or promotes a product, company, provider, token, event,
   community, download, integration, or external link, complete the product
   identity and maturity gate.
4. Establish the problem and whether the change is wanted, duplicated, already
   present on the base branch, or in the wrong repository.
5. Review correctness, security, accessibility, localization, content quality,
   repository conventions, tests, and CI in proportion to the changed area.
6. Recommend the narrowest next action that would move a legitimate PR toward a
   maintainer decision.

First-time status changes priority and the warmth/detail of guidance, not the
technical or trust threshold.

## Commit integrity gate

Require a PR to have exactly one commit and require GitHub to report that
commit's `verification.verified` value as `true`. Treat a missing verification
object, unavailable API response, changed head, or any other value as
non-conforming; do not replace this check with local GPG/SSH inspection.

For a non-conforming external PR, request a single squashed, GitHub-verified
signed commit. The request must identify only the observed condition (commit
count and GitHub verification reason code); never expose signatures, payloads,
key IDs, or security-sensitive commit details. Do not close an otherwise
legitimate PR solely because its commit history is unsigned or unsquashed.

Use a per-head marker to avoid duplicate requests. A rewritten branch is a new
head: repeat the protected-author gate and the complete review before any
merge-readiness recommendation.

Warm request pattern:

```markdown
Thanks for the contribution. Before this can proceed through review, please
squash this PR to one commit and amend/sign that final commit so GitHub shows it
as **Verified**. The current head has <count> commits and GitHub reports
<reason(s)> for the commit verification check. Please force-push the updated
branch when ready; we will re-run the review against the new head.
```

## Mandatory scam and abuse screen

Statically inspect every added or changed URL, dependency, workflow, script,
binary, image, SVG, generated file, and configuration value. Look for:

- phishing, wallet-draining, seed phrase or private-key collection, fake support
  contacts, impersonation, lookalike domains, Unicode confusables, referral or
  affiliate redirects, and unrelated promotion;
- credential or environment exfiltration, secret exposure, telemetry added
  without a product need, remote code download, obfuscation, encoded payloads,
  install hooks, unsafe shell interpolation, and unexpected network calls;
- dependency confusion or typosquatting, unexplained new packages, suspicious
  lockfile-only changes, compromised or abandoned packages, and mutable or
  unpinned CI actions;
- executable content hidden in SVG/HTML, unexpected archives or binaries, large
  generated churn, vandalism, copied content, SEO stuffing, or a title and
  description that conceal the actual diff;
- attempts to weaken branch, test, security, deployment, or secret-scanning
  controls.

Do not open a suspicious URL in an authenticated browser, connect a wallet,
install an extension or package, download an executable, submit personal data,
or run PR code. Use passive inspection, reputable current research, official
registries, and existing CI.

Close as `spam` when malicious, deceptive, promotional, or unrelated intent is
clear. Close as `trust-threshold` when material concerns remain unresolved but
the evidence does not justify a public accusation. A security fix that removes
malicious material is not itself disqualified by the material it removes.

## Product identity, trust, and maturity gate

Apply this gate whenever a PR would publish, list, recommend, link to, or
otherwise increase the visibility of an external project or product.

### Establish identity and ownership

- Cross-check the official domain, GitHub organization, social profiles,
  distribution listings, legal/company identity, and support contacts. Prefer
  sources that link back to each other.
- Confirm the submitted account, domain, asset, and repository belong to the
  same product. Separate an official product from namesakes, tokens, third-party
  dApps, mirrors, and impersonators.
- Confirm explicit Solana relevance and that the proposed placement matches the
  repository's content and inclusion rules.
- Verify claims from primary sources. Use independent reporting, security
  research, app-store reviews, forums, and social posts as leads and
  corroboration, not as sole proof of fraud or trustworthiness.

### Establish a real, sufficiently mature product

The submission must have a publicly verifiable, usable product—not just a
landing page, waitlist, token, pitch deck, announcement, closed demo, or social
account—and enough operating history to evaluate it responsibly. Consider:

- public availability, release/update history, documentation, status history,
  repository activity, and evidence that the Solana integration actually exists;
- consistent operator/team identity and an official way to obtain or use the
  product;
- independent usage or coverage and a history not composed solely of launch
  promotion, paid placements, or newly created accounts;
- whether important security, custody, privacy, fees, eligibility, and support
  behavior is documented for the product category;
- broken or inaccessible product surfaces, abandoned repositories, fake or
  copied engagement, contradictory claims, and unexplained identity changes.

Do not use a rigid age or follower-count cutoff. A product is `too early` when
there is not yet enough public product surface or history to verify identity,
operation, and reputation. Funding, an audit badge, a bug bounty, app-store
presence, or a polished website is supporting context, not proof of trust.

### Search adverse evidence

Search the exact product name, domain, company/legal name, former names, app or
extension publisher, and repository owner with current query families such as:

```text
"<product>" scam OR fraud OR phishing OR malware
"<product>" hacked OR exploit OR breach OR drained
"<product>" vulnerability OR audit OR incident OR disclosure
"<company-or-domain>" regulator OR warning OR enforcement OR lawsuit
"<product>" fake OR impersonation OR "withdrawal problem"
```

Check applicable regulator and consumer warnings, sanctions records, official
security disclosures and status pages, reputable security research and
postmortems, package registries, app/extension stores, repository and release
history, and corroborated reporting. Open underlying sources; search snippets
and automated trust scores are not findings. Record dates and distinguish:

- harmful behavior by the official operator or official artifact;
- compromise of an otherwise legitimate product;
- an unrelated dApp, token, namesake, or third-party integration;
- impersonation or phishing targeting a legitimate product;
- user error, exposed keys, support complaints, or service-quality disputes;
- an allegation that remains unverified or contradicted.

### Trust assessment and disposition

Use one assessment:

- `confirmed harmful`: authoritative or independently reproducible evidence
  establishes fraud, malware, deliberate theft, impersonation, or a malicious
  official artifact. Close as `spam` and privately flag urgent security impact.
- `heightened concern`: credible material evidence raises unresolved security,
  operator-integrity, identity, custody, solvency, or regulatory concerns. Close
  as `trust-threshold`.
- `insufficient history / too early`: identity, live operation, Solana support,
  or reputation cannot yet be verified to a responsible publication standard.
  Close a new listing or promotion as `trust-threshold`.
- `no material signal found`: the completed search found no material adverse
  evidence and the maturity threshold is met. Continue ordinary review. Never
  shorten this to `safe`, `trusted`, or `not a scam`.

One anonymous allegation, isolated negative review, low follower count, domain
age score, or incident involving an unrelated impersonator is not enough by
itself. Multiple mutually reinforcing weak signals, one credible material
signal, or a good-faith search that still cannot verify the product is enough to
fail the publication trust threshold. State exactly which case applies.

For wallet-directory changes, follow the identity and security evidence matrix
in `skills/wallet-filter-research/SKILL.md`. For this external-PR workflow, a
new wallet assessed there as `insufficient history` is closed for not meeting
the publication threshold; describe it neutrally, not as fraud.

## Cruft and ordinary review dispositions

The following are evidence-backed close reasons:

- `duplicate`: the same effective change is already represented by another PR;
  cite it and prefer the more complete or earlier submission.
- `already-addressed`: the desired outcome is already on the current base
  branch; cite the file, commit, PR, or deployed behavior.
- `no-op`: the PR has no effective change, only regenerated noise, or cannot
  affect the claimed behavior. Do not use this for a merely small change.
- `wrong-repository`: the change targets a separately owned project or a
  security report that must use the private advisory flow. Give the correct
  destination when known.

Poor style, failing CI, missing tests, incomplete PR-template answers, an
unclear implementation, or a debatable product/content choice are not by
themselves automatic close reasons. Keep a legitimate PR in the report with
specific suggested changes or a maintainer decision.

For the ordinary review, check the actual changed-area guidance and cover:

- user-visible behavior and whether the implementation solves the stated problem
  without regressions;
- security classification and trust boundaries from the PR template;
- route ownership, cross-app links, asset prefixes, localization source
  ownership, content ownership, and generated-file conventions;
- accessibility, responsive behavior, error/empty/loading states, and safe
  external-link handling where applicable;
- targeted tests, type checks, lint, content/data audits, and CI failures;
- dependencies, secrets, privacy, observability, and deployment impact.

Never invent test results. Existing CI is evidence; commands that were not run
belong under `Suggested validation`.

## Warm closing comments

Every closure comment must:

1. thank the contributor and acknowledge the submitted goal;
2. give a short, concrete, neutral reason tied to observable evidence;
3. explain what evidence or change could make a future submission eligible, when
   applicable;
4. invite a new PR or maintainer conversation without promising acceptance;
5. avoid disclosing exploit details or making unsupported accusations.

Trust-threshold pattern:

```markdown
Thanks for taking the time to submit this and for introducing us to <product>.
We are not able to publish it yet because we could not verify <specific neutral
facts, such as a live product, official ownership, operating history, or the
Solana integration> to the level required for inclusion on solana.com. We are
closing this PR for now. Once <concrete evidence or maturity milestone> is
publicly available, you are welcome to open a fresh PR with those references.
This is an editorial trust-and-maturity decision, not a finding of wrongdoing.
```

Duplicate/obsolete pattern:

```markdown
Thanks for putting this together. The same outcome is already covered by <linked
PR, commit, issue, or current file>, so we are closing this submission to keep
the review queue focused. We appreciate the contribution, and you are welcome to
comment on the existing thread if there is a distinct case we missed.
```

Tailor the wording. Never post a generic canned rejection when a specific, kind
explanation is available. For a public vulnerability submission, point to the
private advisory flow in `SECURITY.md` and avoid repeating sensitive detail. Do
not repeat or make clickable a suspected phishing or malware URL.
