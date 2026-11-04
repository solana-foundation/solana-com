# Security settings that live outside this repository

The code in this repository can only go so far. The controls below are
configured in GitHub, Vercel, Doppler, or at the domain registrar, and cannot be
enforced or verified from a checkout. Each entry names the owning Linear
sub-task under [ECO-953](https://linear.app/solana-fndn/issue/ECO-953) so the
status can be tracked there. Update the status column when a setting is
confirmed.

| Area            | Setting                                                                                                                         | Why it matters                                                                                                                                             | Status                                            | Tracked in |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- | ---------- |
| GitHub          | Branch protection on `main` with "Require review from Code Owners"                                                              | `.github/CODEOWNERS` only auto-requests reviewers until this is on; it covers workflows, the lockfile, the audit ignore list, CI scripts and media content | unverified from repo                              | ECO-973    |
| GitHub          | "Require actions to be pinned to a full-length commit SHA" (Settings → Actions → General)                                       | Every `uses:` in `.github/workflows` is SHA-pinned; this setting stops a future workflow from reintroducing a mutable tag                                  | unverified from repo                              | ECO-959    |
| GitHub          | Tag ruleset protecting `fab-menu-v*`                                                                                            | `publish-fab-menu.yml` publishes only from those tags; without the ruleset any writer can create one                                                       | unverified from repo                              | ECO-960    |
| GitHub          | `fab-menu-publish` environment with required reviewers                                                                          | The publish job runs in this environment; reviewers make a publish a two-person action                                                                     | unverified from repo                              | ECO-960    |
| GitHub          | Dedicated, low-spend `ANTHROPIC_API_KEY` for `guides-ci.yml`                                                                    | The guide walkthrough agent executes guide-authored commands; the key must not be shared with anything else                                                | unverified from repo                              | ECO-958    |
| GitHub          | Dependabot enabled for the repository                                                                                           | `.github/dependabot.yml` is present; Dependabot must be enabled in Settings → Code security for it to open PRs                                             | unverified from repo                              | ECO-959    |
| Vercel          | Deployment Protection (Standard or higher) on preview deployments of all six projects                                           | Media previews render editor MDX before review; sub-app preview hosts otherwise serve pages with no protection                                             | unverified from repo                              | ECO-967    |
| Vercel          | Every secret marked Sensitive; secrets that were non-sensitive before April 2026 rotated                                        | Vercel's April 2026 incident exposed non-sensitive environment variables                                                                                   | unverified from repo                              | ECO-967    |
| Vercel          | Protection Bypass for Automation secrets rotated; CI moved to Trusted Sources (OIDC)                                            | Bypass secrets are long-lived and also bypass the WAF                                                                                                      | unverified from repo                              | ECO-967    |
| Vercel          | Team MFA or passkeys enforced                                                                                                   | Account takeover is the entry point in every recent platform incident                                                                                      | unverified from repo                              | ECO-967    |
| Vercel          | WAF rate-limit rules that code depends on (see below)                                                                           | `@vercel/firewall.checkRateLimit` fails closed in production when a rule id is missing, and open when a rule exists but is too permissive                  | unverified from repo                              | ECO-967    |
| Doppler         | Doppler is the source of truth; the Vercel integration syncs values                                                             | `secrets-rollout.yml` only redeploys; rotation happens in Doppler                                                                                          | documented in `scripts/secrets-rollout/README.md` | ECO-967    |
| Registrar / DNS | Registry lock, DNSSEC with DS at the registry, CAA records, DNS change alerting, hardware-key MFA on registrar and DNS accounts | Registrar and nameserver takeover is the dominant front-end drainer vector (Bonk.fun March 2026, Name.com October 2026)                                    | unverified from repo                              | ECO-968    |

## Vercel WAF rate-limit rule ids referenced in code

Each id must exist as a rate-limit rule in the matching Vercel project. The code
keys every rule on the Vercel-set client IP (`x-real-ip`) unless noted.

| Rule id                           | Project                     | Code                                                  | Notes                                                                                     |
| --------------------------------- | --------------------------- | ----------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `inkeep-chat`                     | solana-com, solana-com-docs | `packages/ui-chrome/src/inkeep-proxy.ts`              | Chat completions and the proof-of-work challenge; also reused by the docs feedback action |
| `inkeep-search`                   | solana-com, solana-com-docs | `packages/ui-chrome/src/inkeep-proxy.ts`              | Search GraphQL                                                                            |
| `inkeep-analytics`                | solana-com, solana-com-docs | `packages/ui-chrome/src/inkeep-proxy.ts`              | Analytics writes                                                                          |
| `university-ambassador-submit`    | solana-com                  | `apps/web/src/app/api/university-ambassador/route.ts` | Form submissions                                                                          |
| `breakpoint-awards-submit-burst`  | solana-com-breakpoint-2     | `apps/breakpoint/src/lib/awards-abuse.ts`             | Nominations and adds                                                                      |
| `breakpoint-awards-submit-hourly` | solana-com-breakpoint-2     | `apps/breakpoint/src/lib/awards-abuse.ts`             | Nominations and adds                                                                      |
| `breakpoint-awards-vote-burst`    | solana-com-breakpoint-2     | `apps/breakpoint/src/lib/awards-abuse.ts`             | Votes; keyed on the ballot id and the client IP                                           |
| `breakpoint-awards-vote-hourly`   | solana-com-breakpoint-2     | `apps/breakpoint/src/lib/awards-abuse.ts`             | Votes                                                                                     |

Recommended additional edge rules (no code dependency): `/api/inkeep/*` global
ceiling, `/_next/image` and `/media-assets/_next/image`, `/api/*/stream`,
`/api/dvp-demo/*`, media `/api/changelog/subscribe`, and the X OAuth callback on
breakpoint. Export the final rule set into this file once configured.
