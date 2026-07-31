---
name: design-solana-page
description:
  Design, implement, redesign, or review production-grade Solana.com marketing
  and solution pages in apps/web using the homepage and tokenization page as
  brand precedents. Use when creating a route or section, translating a brief or
  visual reference into frontend code, improving an existing page, or auditing
  brand alignment, responsive behavior, accessibility, motion, and UI quality.
  Preserve the Solana design foundations while allowing subject-specific art
  direction, composition, interaction, and functionality.
---

# Design Solana Page

Create an evolution of the Solana visual language, not a clone of an existing
page and not a generic dark-technology template. Produce working, integrated
code unless the user explicitly asks for concepts or an audit only.

Use this as a runtime-neutral Agent Skills procedure. Do not depend on a
particular agent product, proprietary tool name, or invocation syntax. Use the
host agent's equivalent file-reading, search, editing, shell, browser, and
screenshot capabilities. If the host does not discover skills automatically,
load this file and its linked references directly.

## Load the right references

- Read [references/brand-system.md](references/brand-system.md) before making
  visual decisions or editing UI. Treat the checked-out repository as final
  authority when it differs from the snapshot.
- Read [references/design-workflow.md](references/design-workflow.md) before
  creating, substantially redesigning, or art-directing a page.
- Read [references/quality-gates.md](references/quality-gates.md) before review,
  visual QA, or handoff.
- Read [references/sources.md](references/sources.md) only when maintaining this
  skill or tracing its external design guidance.

## Follow the workflow

### 1. Resolve the page and its job

Start from the repository root.

1. Read the root `AGENTS.md`, `apps/web/AGENTS.md`, `apps/web/package.json`, and
   `apps/web/next.config.ts`.
2. Resolve the route, audience, single primary job, required content, required
   functionality, and success action. Ask one concise question only when
   plausible answers would lead to materially different pages.
3. Inspect the target route, its nearest current peer, shared components, data
   sources, message catalogs, and route metadata.
4. Check the worktree and preserve unrelated user changes.
5. Confirm whether the request is a new page, a targeted evolution, or an
   explicit overhaul. Preserve working identity and behavior unless the user
   authorizes replacement.

### 2. Recalibrate against current precedent

Inspect the current homepage and `/solutions/tokenization` implementation every
time. Do not rely on remembered screenshots or copy this skill's token snapshot
blindly. Also inspect rendered pages at representative viewport sizes when the
environment supports it.

Extract the current:

- typography roles and shared type classes
- semantic colors, surface hierarchy, borders, and selected accent
- container, gutters, breakpoints, vertical rhythm, and radius rules
- hero logic, proof patterns, section transitions, and CTA hierarchy
- motion technology, static fallbacks, responsive transformations, and states

Use the design grammar and quality bar. Do not repeat the same section order,
hero geometry, decorative assets, or animation concept by default.

### 3. Set a design read

Before implementation, establish:

- page kind and audience
- the page's one-sentence thesis and primary action
- design variance, motion intensity, and visual density
- one signature element rooted in the subject matter
- the fixed brand foundation and the creative choices for this page

Keep this reasoning internal unless surfacing it helps the user evaluate a
meaningful tradeoff. Use the calibration method in the design workflow. Revise
any choice that could be pasted unchanged into an unrelated crypto page.

### 4. Lock the foundation and free the concept

Hold these foundations stable for core `apps/web` pages:

- Diatype for display/body and DSemi for technical or data utility roles
- the semantic `nd-*` dark palette, accessible contrast, and a coherent
  subject-specific accent strategy
- the shared 1440px framing, responsive gutters, type scale, section rhythm,
  surface rules, and CTA hierarchy
- shared chrome, locale routing, message catalogs, metadata, and cross-app link
  behavior

Vary these deliberately:

- hero composition and signature interaction
- accent selection within or derived from the brand palette
- editorial structure, grid, media direction, information density, and pacing
- useful animation, data visualization, progressive disclosure, and page
  functionality

Deviate from a foundation only for an explicit campaign, microsite, or approved
brand extension. Scope the exception locally and document why it serves the
brief.

### 5. Design content and structure together

- Build with real approved content and data. Never invent partners, metrics,
  testimonials, dates, or product claims.
- Make the hero a thesis, not a stack of generic badges, stats, and buttons.
- Use structural devices only when they convey real hierarchy, sequence, state,
  or comparison.
- Use cards only when a bounded surface communicates grouping or interaction.
  Prefer typography, spacing, dividers, grids, and media when elevation adds no
  meaning.
- Spend visual boldness on one signature idea. Keep surrounding elements
  disciplined enough for it to land.
- Write plain, specific, active copy. Keep action labels consistent with the
  outcome they trigger.

### 6. Implement repository-first

- Reuse current components, utilities, icons, tokens, and dependencies before
  adding abstractions or packages.
- Check `package.json` before importing any third-party library. Do not install
  or replace a design system for a page-scoped task without explicit need.
- Keep static layout and data work server-side. Isolate state, browser APIs,
  motion, and modal behavior in the smallest practical client components.
- Use semantic elements and correct link/button behavior. Preserve keyboard,
  focus, touch, loading, empty, error, success, and reduced-motion states.
- Add English source messages through the repository i18n system rather than
  hard-coding user-facing copy. Use the `localize-page` skill when the task also
  calls for full localization work.
- Use the shared chrome and URL helpers. Inspect route ownership and rewrites
  before changing navigation behavior.
- Build responsive behavior intentionally; do not treat mobile as a compressed
  desktop layout.

### 7. Critique, render, and verify

Perform two critiques:

1. Before coding, remove choices that feel generic, decorative, or unrelated to
   the subject.
2. After rendering, remove one unnecessary accessory and fix the largest issue
   in hierarchy, rhythm, contrast, or interaction before polishing details.

Render narrow mobile, tablet, laptop, and wide desktop views. Exercise actual
interactions and non-happy states. Apply every relevant quality gate, then run
the narrowest useful workspace lint, type, and test commands. Report any checks
that could not run.

## Handle review-only requests

Do not edit files when the user asks only for an audit or review. Inspect the
rendered result and implementation, then report high-signal findings grouped by
file in `path:line - severity - issue - suggested fix` form. Prioritize broken
behavior, accessibility, brand divergence, and responsive failures over taste
nits. State when no material findings remain.
