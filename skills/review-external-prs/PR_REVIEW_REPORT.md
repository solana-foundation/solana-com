# External PR Review Report

- Repository: `solana-foundation/solana-com`
- Generated: `2026-09-01T21:18:27Z`
- Scope: Open PRs from known non-protected authors
- Mutation mode: authorized auto-close

## Outcome

- External PRs inspected: 42
- Closed: 12
- Closures awaiting authorization: 0
- Remaining: 30
- Remaining first-time contributors: 24

## Closures made

| PR                                                                 | Author status            | Disposition         | Decisive evidence                                                                                                                                               | GitHub state |
| ------------------------------------------------------------------ | ------------------------ | ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| [#1631](https://github.com/solana-foundation/solana-com/pull/1631) | `FIRST_TIME_CONTRIBUTOR` | `trust-threshold`   | [Operator material](https://algovoi.co.uk/agent-payment-rail.html) was self-published; independent operating history was insufficient.                          | closed       |
| [#1683](https://github.com/solana-foundation/solana-com/pull/1683) | `FIRST_TIME_CONTRIBUTOR` | `trust-threshold`   | [Public material](https://svsprotocol.com/) describes a devnet demonstration and pending upstream integrations, not a mature community skill.                   | closed       |
| [#1691](https://github.com/solana-foundation/solana-com/pull/1691) | `CONTRIBUTOR`            | `duplicate`         | Superseded by the current-path correction in #1919.                                                                                                             | closed       |
| [#1692](https://github.com/solana-foundation/solana-com/pull/1692) | `CONTRIBUTOR`            | `duplicate`         | Superseded by the focused deployment-recovery documentation in #1920.                                                                                           | closed       |
| [#1697](https://github.com/solana-foundation/solana-com/pull/1697) | `FIRST_TIME_CONTRIBUTOR` | `trust-threshold`   | Benchmark inclusion was supported only by [operator material](https://openchainbench.com/); independent maturity evidence was insufficient.                     | closed       |
| [#1785](https://github.com/solana-foundation/solana-com/pull/1785) | `FIRST_TIME_CONTRIBUTOR` | `trust-threshold`   | Newly proposed financial skill did not meet the required independent maturity threshold.                                                                        | closed       |
| [#1793](https://github.com/solana-foundation/solana-com/pull/1793) | `FIRST_TIME_CONTRIBUTOR` | `already-addressed` | The live wallet registry already contains a verified Vultisig record.                                                                                           | closed       |
| [#1824](https://github.com/solana-foundation/solana-com/pull/1824) | `FIRST_TIME_CONTRIBUTOR` | `trust-threshold`   | The [proposed project](https://opencovenant.org/) described a devnet-only skill and lacked independent adoption evidence.                                       | closed       |
| [#1877](https://github.com/solana-foundation/solana-com/pull/1877) | `FIRST_TIME_CONTRIBUTOR` | `trust-threshold`   | New x402 merchant listing had [self-published claims](https://bykaranteli.com/about) only and did not meet inclusion maturity requirements.                     | closed       |
| [#1886](https://github.com/solana-foundation/solana-com/pull/1886) | `FIRST_TIME_CONTRIBUTOR` | `trust-threshold`   | [Hackage](https://hackage.haskell.org/package/solana-haskell-sdk) showed a newly published package with minimal observable adoption.                            | closed       |
| [#1912](https://github.com/solana-foundation/solana-com/pull/1912) | `FIRST_TIME_CONTRIBUTOR` | `duplicate`         | #1918 is the focused live-source fix and avoids editing the stale Builder export.                                                                               | closed       |
| [#1946](https://github.com/solana-foundation/solana-com/pull/1946) | `FIRST_TIME_CONTRIBUTOR` | `trust-threshold`   | The [new payments service](https://rendben.com/) had only recent operator-controlled evidence; financial-product inclusion needs a higher verification history. | closed       |

## Remaining external PRs

All remaining heads were refreshed at report generation and were unchanged from
their reviewed heads. `BLOCKED` below means maintainer review is required, not a
failed check.

### [#2007 — Add local docs install-command workflow](https://github.com/solana-foundation/solana-com/pull/2007)

- Author: `@datasalaryman` (`CONTRIBUTOR`); head:
  `f63a6e6af78cbf630cae3810f42b55d4e818aa8a`.
- Area and intent: `.github/workflows` and docs installation commands; adds
  local CI execution.
- State: mergeable / `BLOCKED`; guide jobs for `/docs/intro/installation` and
  `/dependencies` fail.
- Trust screen: no material signal found; workflow changes remain a high-impact
  review surface.
- Review: inspect every workflow permission, action pin, and command before
  merge; current failures must be fixed by the contributor.
- Suggested action: request a security/CI maintainer review and repair the two
  failing guide jobs.
- Suggested validation: inspect `permissions`, action revisions, and run the
  affected docs checks.

### [#1968 — Validate and encode podcast episode API parameters](https://github.com/solana-foundation/solana-com/pull/1968)

- Author: `@byt61` (`FIRST_TIME_CONTRIBUTOR`); head:
  `ec1d2abe791ce67122fb151ce8ad6de66128e0c0`.
- Area and intent: `apps/web` public podcast API input validation and upstream
  URL construction.
- State: mergeable / `BLOCKED`; existing checks are green.
- Trust screen: no material signal found.
- Review: the `URLSearchParams` approach and boundary tests are sound; the patch
  also carries all unrelated sitemap changes from #1965.
- Suggested action: ask the contributor to rebase and remove the unrelated
  sitemap payload before focused security review.
- Suggested validation: `pnpm --filter solana-com test` and adversarial
  query-string cases.

### [#1969 — Validate media podcast pagination](https://github.com/solana-foundation/solana-com/pull/1969)

- Author: `@byt61` (`FIRST_TIME_CONTRIBUTOR`); head:
  `4c1478a3155ce5879f45ef4c26cf92d292bf1b84`.
- Area and intent: `apps/media` pagination bounds for a public endpoint.
- State: mergeable / `BLOCKED`; existing checks are green.
- Trust screen: no material signal found.
- Review: parsing and regression tests address `NaN`, negative offsets, and
  oversized limits; the patch includes unrelated sitemap work from #1965.
- Suggested action: request a clean rebase without the unrelated sitemap files.
- Suggested validation: `pnpm --filter solana-com-media test` plus limit/offset
  boundary cases.

### [#1844 — Add cross-network swap cookbook](https://github.com/solana-foundation/solana-com/pull/1844)

- Author: `@hazy2go` (`FIRST_TIME_CONTRIBUTOR`); head:
  `067917be3d699d3ababa6fdd8ea94a52375835c3`.
- Area and intent: new cross-network swap cookbook that uses SODAX.
- State: mergeable / `BLOCKED`; existing checks are green.
- Trust screen: no material signal found; the linked provider has public
  deployment material, but this is financial cross-network instructional
  content.
- Review: static scan found local signing-key examples only, not executable
  bootstrap code. Validate every SDK call and cross-network risk disclosure.
- Suggested action: route to Docs and DeFi/security maintainers for a policy and
  technical review.
- Suggested validation: render docs and independently verify every code sample
  against the current SDK.

### [#1845 — Add cross-network money-market cookbook](https://github.com/solana-foundation/solana-com/pull/1845)

- Author: `@hazy2go` (`FIRST_TIME_CONTRIBUTOR`); head:
  `0c35defe973aae4f8cac59fff54368935818a8a4`.
- Area and intent: new SODAX-based cross-network lending cookbook.
- State: mergeable / `BLOCKED`; existing checks are green.
- Trust screen: no material signal found; financial and cross-network
  instructions require specialist review.
- Review: ensure the tutorial clearly distinguishes supported mainnet behavior
  from illustrative code and covers failed/partial execution.
- Suggested action: route to Docs and DeFi/security maintainers.
- Suggested validation: render docs and verify calls against the current SDK and
  supported networks.

### [#1957 — Large i18n and Lingo configuration update](https://github.com/solana-foundation/solana-com/pull/1957)

- Author: `@amannn` (`FIRST_TIME_CONTRIBUTOR`); head:
  `1e40a6da4ee15c5acf944e07e4c53011a6be3a0e`.
- Area and intent: broad translation/configuration updates.
- State: conflicting / `DIRTY`; review required.
- Trust screen: no material signal found.
- Review: the 1,300-addition / 4,795-deletion scope is too broad for cursory
  review and is no longer mergeable.
- Suggested action: ask for a conflict-resolved, split PR with generated
  translations separated from config changes.
- Suggested validation: targeted i18n lint, type checks, and locale-route smoke
  tests.

### [#1510 — Media news-category route changes](https://github.com/solana-foundation/solana-com/pull/1510)

- Author: `@datasalaryman` (`CONTRIBUTOR`); head:
  `cbe9890d21ed2ca55fa514878f62d2c091c6ec44`.
- Area and intent: media news category routing.
- State: conflicting / `DIRTY`; checks are green.
- Trust screen: no material signal found.
- Review: prior automated review identified a canonical URL/slug mismatch,
  static-parameter 404 risk, and repeated data fetching.
- Suggested action: request rebase plus fixes before human review.
- Suggested validation: media route tests and manual category/canonical URL
  checks.

### [#1791 — Token Program vs Token-2022 guide](https://github.com/solana-foundation/solana-com/pull/1791)

- Author: `@NikkiAung` (`FIRST_TIME_CONTRIBUTOR`); head:
  `a4482fd79c2d0153ece79bfdbceab068d22a1c09`.
- Area and intent: substantial Token Program documentation guide.
- State: conflicting / `DIRTY`; review required.
- Trust screen: no material signal found.
- Review: useful educational scope, but it must be rebased and checked for
  terminology/current protocol behavior.
- Suggested action: Docs maintainer review after conflict resolution.
- Suggested validation: docs render, link check, and technical fact review.

### [#1706 — Add Spectrum Nodes RPC listing](https://github.com/solana-foundation/solana-com/pull/1706)

- Author: `@DamienMLT` (`FIRST_TIME_CONTRIBUTOR`); head:
  `bdeb742fb3af3a4d0f3040e215f4c2d3e5686f07`.
- Area and intent: RPC infrastructure listing.
- State: mergeable / `BLOCKED`; existing checks are green.
- Trust screen: public operational material and independent performance coverage
  exist, but maintainers should apply the provider criteria before inclusion.
- Review: content-only change; confirm provider capability, support, and
  operational fit against Foundation onboarding criteria.
- Suggested action: provider-directory owner decision.
- Suggested validation: verify endpoint behavior, plan details, and
  provider-policy requirements.

### [#1934 — Add Uniblock RPC listing](https://github.com/solana-foundation/solana-com/pull/1934)

- Author: `@hkhiem8` (`FIRST_TIME_CONTRIBUTOR`); head:
  `ed2e63deb454a740953d133b02a70236629bb68f`.
- Area and intent: RPC infrastructure listing.
- State: mergeable / `BLOCKED`; existing checks are green.
- Trust screen: provider documentation and third-party performance coverage
  exist; no material signal found.
- Review: determine whether an aggregation-layer provider belongs in this
  listing and verify claims/limits.
- Suggested action: provider-directory owner decision.
- Suggested validation: compare to RPC criteria and test Solana endpoints.

### [#1918 — Fix live PYUSD resource links](https://github.com/solana-foundation/solana-com/pull/1918)

- Author: `@rohan911438` (`FIRST_TIME_CONTRIBUTOR`); head:
  `f1441ad5a5fa210b74885ca4368fbe1ba1ffe6f3`.
- Area and intent: `apps/web/src/data/pyusd.ts` CTA fixes.
- State: mergeable / `BLOCKED`; existing checks are green.
- Trust screen: not applicable.
- Review: focused live-source change; preferable to the closed variant because
  it avoids a stale Builder export.
- Suggested action: ready for web maintainer review.
- Suggested validation: `pnpm --filter solana-com check-types` and browser CTA
  checks.

### [#1919 — Correct Token ACL wallet wording](https://github.com/solana-foundation/solana-com/pull/1919)

- Author: `@rohan911438` (`FIRST_TIME_CONTRIBUTOR`); head:
  `30ff5c0c17f9bb272b8c4079ee7b4f0be48fa0ca`.
- Area and intent: current Token ACL documentation source.
- State: mergeable / `BLOCKED`; existing checks are green.
- Trust screen: not applicable.
- Review: fixes the right current path and scopes auto-detection to SDK/app
  behavior; confirm the Phantom statement with Docs/DevRel.
- Suggested action: ready for technical docs review.
- Suggested validation: render the page and validate wording with token ACL
  maintainers.

### [#1920 — Document failed program-deploy recovery](https://github.com/solana-foundation/solana-com/pull/1920)

- Author: `@rohan911438` (`FIRST_TIME_CONTRIBUTOR`); head:
  `db6a0340faa00bb01e6b60dbf93efc7513461509`.
- Area and intent: program deployment recovery and loader-v4 docs.
- State: mergeable / `BLOCKED`; existing checks are green.
- Trust screen: not applicable.
- Review: useful current-source update; CLI syntax and loader-v4 claims require
  a release/docs maintainer check.
- Suggested action: technical docs review.
- Suggested validation: execute non-destructive CLI help/examples in a
  disposable environment.

### [#1907 — UI chrome accessibility adjustment](https://github.com/solana-foundation/solana-com/pull/1907)

- Author: `@byt61` (`FIRST_TIME_CONTRIBUTOR`); head:
  `d75720d1cecdbcf0f6c0ebb21b3027a36a5d4265`.
- Area and intent: UI chrome accessibility attributes.
- State: mergeable / `BLOCKED`; existing checks are green.
- Trust screen: not applicable.
- Review: compact, low-risk UI change; assess semantics and
  keyboard/screen-reader behavior.
- Suggested action: ready for UI maintainer review.
- Suggested validation: targeted package lint/tests and manual accessibility
  pass.

### [#1913 — Media YouTube ID parsing](https://github.com/solana-foundation/solana-com/pull/1913)

- Author: `@byt61` (`FIRST_TIME_CONTRIBUTOR`); head:
  `2deb3d42da1ac79ffc130248ca8b55dd0eeccb03`.
- Area and intent: media URL parsing.
- State: mergeable / `BLOCKED`; existing checks are green.
- Trust screen: not applicable.
- Review: test parsing against standard, short, embed, playlist, malformed, and
  non-YouTube URLs.
- Suggested action: media maintainer review.
- Suggested validation: targeted media tests plus URL fixtures.

### [#1914 — Ecosystem assets/audit update](https://github.com/solana-foundation/solana-com/pull/1914)

- Author: `@byt61` (`FIRST_TIME_CONTRIBUTOR`); head:
  `3e012620e598e29a71b326c8993968b8c8c4adae`.
- Area and intent: ecosystem metadata/assets.
- State: mergeable / `BLOCKED`; existing checks are green.
- Trust screen: no material signal found.
- Review: registry and asset changes need data-owner verification, including
  provenance and current entity claims.
- Suggested action: ecosystem-data maintainer review.
- Suggested validation: data validation and asset provenance check.

### [#1915 — Template replacement pattern](https://github.com/solana-foundation/solana-com/pull/1915)

- Author: `@byt61` (`FIRST_TIME_CONTRIBUTOR`); head:
  `ffc3bdba715e5c4423f7d204553228d2acbd4a07`.
- Area and intent: templates behavior.
- State: mergeable / `BLOCKED`; existing checks are green.
- Trust screen: not applicable.
- Review: confirm replacement behavior does not unintentionally alter
  user-provided template content.
- Suggested action: templates maintainer review.
- Suggested validation: add/execute cases for repeated, missing, and escaped
  replacement tokens.

### [#1916 — i18n alternate-locale prefix](https://github.com/solana-foundation/solana-com/pull/1916)

- Author: `@byt61` (`FIRST_TIME_CONTRIBUTOR`); head:
  `1f6e35cb8be7e10ac12cdfa78070dff1db360679`.
- Area and intent: locale alternate-link paths.
- State: mergeable / `BLOCKED`; existing checks are green.
- Trust screen: not applicable.
- Review: verify default and non-default locale canonical/alternate URLs across
  apps.
- Suggested action: i18n maintainer review.
- Suggested validation: locale routing tests and rendered
  `<link rel="alternate">` inspection.

### [#1921 — Remove skipped i18n test](https://github.com/solana-foundation/solana-com/pull/1921)

- Author: `@rohan911438` (`FIRST_TIME_CONTRIBUTOR`); head:
  `a52df8831b3774df52dea99e0d99b75bd146580d`.
- Area and intent: i18n test cleanup.
- State: mergeable / `BLOCKED`; existing checks are green.
- Trust screen: not applicable.
- Review: removing a skipped test needs an explanation of whether coverage moved
  or the case is obsolete.
- Suggested action: request rationale or a replacement active test.
- Suggested validation: targeted i18n test suite.

### [#1929 — Resources link correction](https://github.com/solana-foundation/solana-com/pull/1929)

- Author: `@rajanpanth` (`FIRST_TIME_CONTRIBUTOR`); head:
  `ab019d8cfbfe80371eebc380ade3e4fa44bea22d`.
- Area and intent: resource links.
- State: mergeable / `BLOCKED`; existing checks are green.
- Trust screen: not applicable.
- Review: compact link-only edit; verify destination ownership and avoid
  duplicating existing navigation.
- Suggested action: ready for Docs/web content review.
- Suggested validation: link checker and manual route check.

### [#1965 — Sitemap tests and Windows docs mapping](https://github.com/solana-foundation/solana-com/pull/1965)

- Author: `@byt61` (`FIRST_TIME_CONTRIBUTOR`); head:
  `acec48c3dd0990d10820ad9a6bede50c744069ed`.
- Area and intent: sitemap test coverage and docs route mapping.
- State: mergeable / `BLOCKED`; existing checks are green.
- Trust screen: not applicable.
- Review: this is the shared unrelated payload embedded in #1967–#1969; evaluate
  it independently before merging descendants/rebases.
- Suggested action: sitemap maintainer review.
- Suggested validation: `pnpm --filter <sitemap-workspace> test` and
  route-generation snapshots.

### [#1967 — String utility fix](https://github.com/solana-foundation/solana-com/pull/1967)

- Author: `@byt61` (`FIRST_TIME_CONTRIBUTOR`); head:
  `6715efe62e9eccfc7942df6e6b1d5eec72214880`.
- Area and intent: duplicated docs/web string utility behavior.
- State: mergeable / `BLOCKED`; existing checks are green.
- Trust screen: not applicable.
- Review: sensible regression coverage, but the PR carries every #1965 sitemap
  change.
- Suggested action: rebase after #1965 is decided and submit the string fix
  without unrelated files.
- Suggested validation: docs and web utility test suites.

### [#1678 — Template Bun command](https://github.com/solana-foundation/solana-com/pull/1678)

- Author: `@Samisha68` (`FIRST_TIME_CONTRIBUTOR`); head:
  `e96f78d78ae5394a3ac40aba4b02c3dba9d48513`.
- Area and intent: template install command.
- State: mergeable / `BLOCKED`; existing checks are green.
- Trust screen: not applicable.
- Review: two-line change; verify it matches the template's package manager
  support and generated instructions.
- Suggested action: ready for templates review.
- Suggested validation: scaffold the template and run its documented install
  command.

### [#1591 — x402 documentation comments](https://github.com/solana-foundation/solana-com/pull/1591)

- Author: `@PrajwalGraj` (`FIRST_TIME_CONTRIBUTOR`); head:
  `b18b52666e04cf2ab12e3632b30d69f01ccf10f8`.
- Area and intent: x402 documentation comments.
- State: mergeable / `BLOCKED`; existing checks are green.
- Trust screen: not applicable.
- Review: compact explanatory correction with no code impact.
- Suggested action: ready for Docs maintainer review.
- Suggested validation: docs render.

### [#1837 — Redirect former tokens URL](https://github.com/solana-foundation/solana-com/pull/1837)

- Author: `@NikkiAung` (`FIRST_TIME_CONTRIBUTOR`); head:
  `a780c6690e068f1bcccd48bc119480277ecb6576`.
- Area and intent: redirect an old docs URL.
- State: mergeable / `BLOCKED`; existing checks are green.
- Trust screen: not applicable.
- Review: confirm destination, locale behavior, and no redirect cycle.
- Suggested action: ready for Docs review.
- Suggested validation: HTTP redirect test for all locales.

### [#1838 — Redirect former programs root](https://github.com/solana-foundation/solana-com/pull/1838)

- Author: `@NikkiAung` (`FIRST_TIME_CONTRIBUTOR`); head:
  `2791efc2c2f75ac98755c187fc1a63dc821c44d5`.
- Area and intent: docs root redirect.
- State: mergeable / `BLOCKED`; existing checks are green.
- Trust screen: not applicable.
- Review: confirm the target preserves intended navigation and does not overlap
  #1837.
- Suggested action: ready for Docs review.
- Suggested validation: HTTP redirect and sitemap checks.

### [#1951 — Correct generated llms links](https://github.com/solana-foundation/solana-com/pull/1951)

- Author: `@github-actions` (`CONTRIBUTOR`); head:
  `37f97808df94d7efd3489e78ba9b39cc0ef3c5c9`.
- Area and intent: generated `llms*.txt` link update.
- State: mergeable / `BLOCKED`; existing checks are green.
- Trust screen: not applicable.
- Review: the link correction is valid, but confirm the generator/source of
  truth is updated so regeneration does not revert it.
- Suggested action: find and patch the generator, then regenerate artifacts.
- Suggested validation: generator task plus a diff check of both outputs.

### [#1917 — Docs published-source update](https://github.com/solana-foundation/solana-com/pull/1917)

- Author: `@solana-docs-checker` (`NONE`); head:
  `eef939116cec827602061757d7b9ae5f89dabe3a`.
- Area and intent: automated docs source update.
- State: mergeable / `BLOCKED`; format and docs lint are failing.
- Trust screen: not applicable.
- Review: automated source update must be reformatted and pass docs lint before
  merge.
- Suggested action: repair the bot output and rerun its workflow.
- Suggested validation: `pnpm --filter solana-docs lint` and formatting check.

### [#2010 — Published changelog content](https://github.com/solana-foundation/solana-com/pull/2010)

- Author: `@solana-media-content-bot` (`CONTRIBUTOR`); head:
  `734f8ff7878e576f85e912bc5f0d45636f937fea`.
- Area and intent: media changelog content publication.
- State: mergeable / `UNSTABLE`; approved; existing checks are green.
- Trust screen: not applicable.
- Review: publication-style content change; no material signal found.
- Suggested action: resolve the transient merge-state/check condition, then
  merge through normal media editorial flow.
- Suggested validation: preview the published content and recheck unstable
  status.

### [#2020 — RPC caption and locale updates](https://github.com/solana-foundation/solana-com/pull/2020)

- Author: `@McSim85` (`CONTRIBUTOR`); head:
  `c24fe038fbeae574a6b798e20d6e81285257fecd`.
- Area and intent: RPC caption selection and translations.
- State: mergeable / `BLOCKED`; existing checks are green.
- Trust screen: not applicable.
- Review: validate the selected timeframe/caption semantics and ensure locale
  changes are machine-generated or editorially reviewed.
- Suggested action: web/i18n maintainer review.
- Suggested validation: render the RPC surface in affected locales.

## Limitations

- External PR code was never checked out or executed; review used static diffs,
  GitHub metadata, existing CI, and public product evidence.
- Product closures are maturity/verification decisions, not allegations of
  fraud.
- The report intentionally excludes protected-author PRs and does not disclose
  protected identities or counts.
