# Security Policy

This repository hosts the source for [solana.com](https://solana.com) and its
sibling applications (docs, media, templates, and the Accelerate conference
site). It is operated by the Solana Foundation under the Foundation
[Software Development Lifecycle](https://github.com/solana-foundation/SDLC).

## Reporting a vulnerability

**Do not open a public GitHub issue for security problems.** Public issues
disclose the vulnerability before it can be fixed.

Instead, report privately using GitHub's
[**Report a Vulnerability**](https://github.com/solana-foundation/solana-com/security/advisories/new)
flow. This opens a private advisory visible only to the maintainers.

When reporting, please include:

- A clear description of the issue and its impact.
- Steps to reproduce, or a proof-of-concept.
- The affected URL, page, or component, and the commit or deployment where you
  observed it.

If you have enabled it, please also turn on two-factor authentication on your
GitHub account before filing.

### Scope

In scope for this repository:

- The web applications in `apps/*` and shared packages in `packages/*`.
- Cross-site scripting (XSS), CSRF, content injection, open redirects, and
  similar web vulnerabilities on Foundation-operated `solana.com` properties.
- Exposure of secrets, credentials, or sensitive configuration in source, build
  output, or deployment.
- CI/CD and supply-chain issues (workflow misconfiguration, dependency
  tampering, leaked tokens).

Out of scope here — report through the channels below instead:

- Vulnerabilities in the Solana protocol, validator clients, or on-chain
  programs. These belong to the
  [Solana bug bounty program](https://github.com/solana-labs/solana/security/policy)
  and the relevant client repository (e.g.
  [agave](https://github.com/anza-xyz/agave/security)).
- Issues in third-party dependencies that have an upstream advisory — please
  report upstream as well so the ecosystem benefits.

## Response targets

The Foundation aims to meet the following service levels, per SDLC §10:

- **Acknowledge** a report within 48 hours.
- **Assess severity** within 5 business days.
- **Communicate a resolution timeline** within 10 business days.

We will keep you updated through the advisory thread and credit you in the fix
unless you prefer to remain anonymous.

## Disclosure

We follow coordinated disclosure. Please give us a reasonable window to ship a
fix before any public discussion. We will publish a
[GitHub Security Advisory](https://github.com/solana-foundation/solana-com/security/advisories)
once a fix is released.
