# Solana.com Navigation Restructure Review

## Review Request

This document is for async sign-off on the proposed Solana.com navigation
structure.

Please review the menu structure and staged migration direction. Leave comments
only where something would materially block delivery or create a user, legal,
SEO, analytics, ownership, or migration risk.

Review deadline: May 15 2026

Required reviewers:

- DevRel
- Product
- Marketing

## Decision Needed

Approve the proposed top-level navigation:

> Use Solana / Developers / Enterprise / Products / Ecosystem

With:

- `Use Solana` as the first primary nav item with a real mega menu.
- `Network`, `Community`, and `Events` grouped under `Ecosystem`.
- `Solutions`, `Learn`, `Network`, and `Community` removed as top-level header
  labels.
- Route migration handled in stages, with old URLs redirected only after
  replacement pages are live.

Approval means agreement on the information architecture direction. It does not
mean final approval of page copy, visual design, SEO titles, redirect maps, CMS
schema, or implementation details.

## How To Review

1. Read `Proposal Summary`.
2. Add comments only on issues that should change the structure or staging.
3. Fill out one `Reviewer Sign-Off` response at the end of the document.

Use `Blocked` only when the proposed structure creates a material issue that
should stop delivery until resolved.

## Proposal Summary

### Header

Primary navigation:

- Use Solana
- Developers
- Enterprise
- Products
- Ecosystem

Persistent utilities:

- Search / Ask AI
- Language selector
- Optional contextual CTA

### Use Solana

Purpose: serve users, wallet users, retail visitors, and crypto-curious
visitors.

Likely menu items:

- Wallets
- Explore Projects
- Learn the Basics
- Safety
- Tokens
- Help / Ask AI

SOL, staking, token purchasing, yield, issuance, and investment-related content
requires legal-approved language before being promoted.

### Developers

Purpose: help builders quickly start, build, debug, and scale on Solana.

Likely menu sections:

- Start Building: Quickstart, Docs, Grants, Support
- Tools: Docs, RPC, Templates, SDKs, Token Extensions, Actions/Blinks, payment
  tooling, game tooling
- Build By Use Case: Tokens, Wallets, Payments, DeFi, Agents

### Enterprise

Purpose: serve institutions, enterprises, and decision makers evaluating Solana.

Likely menu items:

- Payments
- Tokenization
- Stablecoins
- Internet Capital Markets
- Case studies
- Reports
- Network proof
- Contact

### Products

Purpose: represent Foundation/product-team priorities and current/future product
surfaces.

Likely menu sections:

- Platforms & Tools: Solana Developer Platform, Pay.sh, Agents, Data, Tokens.xyz
- Product updates

Open product routing questions:

- Whether x402 should be represented only through Pay.sh.
- Whether `/x402`, `/agent-registry`, `/skills`, and `/solutions/sdp` should
  consolidate under `/products/*`.
- Whether Tokens.xyz should have a Solana.com landing page before linking out.

### Ecosystem

Purpose: act as the umbrella for network, community, events, founders, grants,
jobs, public engagement, and legacy/historical ecosystem material.

Likely menu items:

- Network
- Events
- Community
- Founders
- Grants and Funding
- Hackathons
- Jobs
- Ecosystem Partners (previous event sponsors)
- Legacy and Historical Initiatives

Event treatment:

- `/events` remains canonical.
- Event archive remains discoverable.
- Submit/host event CTAs remain discoverable.
- Breakpoint/event promo banner appears only under `Ecosystem`.
- Events remain first-class even though `Community` is no longer top-level.

### Footer

Use a larger footer with explicit columns:

- Use Solana
- Developers
- Enterprise
- Products
- Ecosystem
- Network, either as its own column or subsection
- Organization
- Public Engagement

## Core Review Questions

1. Is `Use Solana / Developers / Enterprise / Products / Ecosystem` the right
   final top-level structure?
2. Can each major audience find its primary path quickly?
3. Are `Network`, `Community`, and `Events` acceptable under `Ecosystem`?
4. Does `Products` work as a durable bucket for current and upcoming product
   surfaces?
5. Are any high-value routes or audiences made too hard to find?
6. Are there any legal, SEO, ownership, or migration risks that should block
   delivery?

## Reviewer-Specific Prompts

### DevRel

- Are critical developer paths still easy to find?
- Are the proposed developer menu items correct?
- Should hackathons/events also appear under `Developers`, or is `Ecosystem`
  enough?
- Does moving `Network` and `Community` under `Ecosystem` hurt developer
  discoverability?

### Product

- Does `Products` accurately represent current and future product-team work?
- Are the initial product entries right?
- Which product pages need owners before launch?
- Which `/solutions/*` or product-adjacent routes should migrate first?

### Marketing

- Does the structure support launch, event, campaign, and sponsor visibility?
- Is `Ecosystem` strong enough for events and Breakpoint promotion?
- Are footer buckets and dynamic menu cards sufficient for campaign recovery
  paths?
- Are there messaging or audience concerns with `Enterprise` or `Products`?

## Migration QA

The migration should be staged.

Reviewers should validate:

1. Which existing routes must remain canonical.
2. Which `/solutions/*` pages should migrate first.
3. Which routes should not move yet.
4. Which route migrations require legal review.
5. Which route migrations require SEO review.
6. Whether old URLs should redirect only after replacement pages are live.

Recommended staged approach:

1. Approve IA and route principles.
2. Update header/footer grouping.
3. Create new hub pages.
4. Migrate highest-priority `/solutions/*` pages.
5. Consolidate `Use Solana` routes.
6. Consolidate product routes.
7. Add dynamic menu cards.
8. Add redirects and cleanup.

## Async Sign-Off

Decision options:

- Approve
- Approve with changes
- Blocked

Sign-off is complete when:

1. Required reviewers have responded or the review deadline has passed.
2. There are no unresolved `Blocked` responses.
3. Any `Approve with changes` response has a named owner and follow-up path.
4. Legal-sensitive routes are marked approved, omitted, or pending legal review.
5. SEO-sensitive migrations are marked approved, omitted, or pending SEO review.

### Reviewer Sign-Off

Copy this block for each reviewer.

Reviewer:

Team:

Decision: approve / approve with changes / blocked

Must change before delivery:

Should change if easy:

Open question:

Ownership concern:

Legal/compliance concern:

SEO concern:

Route migration concern:

Missing audience or content path:

## Success Criteria

The QA process is successful if:

1. Required reviewers agree the five top-level buckets are directionally
   correct.
2. Any disputed labels are identified clearly.
3. Product ownership boundaries are clarified.
4. DevRel confirms critical developer paths are not buried.
5. Product confirms the `Products` bucket can handle upcoming launches.
6. Events remain visibly supported through `Ecosystem`.
7. Network proof remains discoverable despite leaving the top-level nav.
8. Canonical route decisions are documented.
9. Legal-sensitive areas are flagged for separate review.
10. The team can move into sitemap, content modeling, design, and implementation
    without reopening the entire IA.

## Expected Output

After review, produce a short decision note with:

- Approved top-level nav
- Approved footer buckets
- Approved canonical route principles
- Required changes
- Open legal questions
- Product ownership notes
- DevRel ownership notes
- Event/promo ownership notes
- Delivery risks
- Next implementation phase
