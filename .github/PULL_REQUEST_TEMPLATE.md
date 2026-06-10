### Problem

<!-- What problem does this solve? Write enough that someone uninvolved can
     understand it six months from now — this feeds the auto-generated change
     log (SDLC §3.5.3). -->

### Summary of Changes

<!-- What changed and why. Call out anything security-relevant explicitly. -->

Fixes #

---

### Change classification (SDLC §2)

<!-- Classify your own change. When in doubt, classify up. The reviewer
     validates this. -->

- [ ] **Critical** — auth, secrets/key handling, fund movement, deploy/CI
      security gates, or anything that changes who can do what
- [ ] **Standard** — production-facing, non-critical (features, API/route
      changes, dependency updates, monitoring/config)
- [ ] **Low** — no security impact (docs, tests, dev tooling, content)

### Security checklist

- [ ] No secrets, tokens, or credentials in source, env files, or CI logs
      (use Doppler / `NEXT_PUBLIC_*` only for values safe to ship to the
      browser).
- [ ] Input from users or external services is validated before use; no
      `dangerouslySetInnerHTML` / unsanitized HTML on untrusted input.
- [ ] New or updated dependencies are justified below, and `pnpm audit`
      passes (no new High/Critical advisories).
- [ ] Errors are handled explicitly — no silent failures on production paths.
- [ ] For **Critical** changes: a trust-boundary / threat-model note is
      included below, and a second reviewer has been requested.

<!-- New dependencies (name + why), or "none":

-->

<!-- Threat-model note for Critical changes (trust boundaries, worst-case
     impact if compromised, external dependency failure modes), or "n/a":

-->
