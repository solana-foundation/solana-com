## Context

`apps/breakpoint` is currently empty apart from OpenSpec configuration, while the existing Breakpoint experience lives in `/Users/karambit/Sites/solana-com-breakpoint` as a standalone Next.js app with Sanity-backed dynamic pages, a large custom component surface, and multi-page event content. The new request is narrower and materially different: create a monorepo-native Breakpoint 2026 app in `apps/breakpoint` as a single-page brochure site with a completely new layout and build, using the legacy project only as reference material for fonts, colors, and texture direction.

The current monorepo conventions favor Next.js 15, TypeScript, App Router, workspace dependencies, and Tailwind-based styling. The monorepo also includes a shared `@workspace/i18n` package that provides locale configuration, routing helpers, middleware wrappers, and message-loading utilities on top of `next-intl`. The 2026 brochure content is already defined in PM copy and only needs to be shaped into a compelling single-page narrative rather than a CMS-driven experience.

## Goals / Non-Goals

**Goals:**
- Scaffold a new Next.js application in `apps/breakpoint` that matches monorepo conventions and can be developed, built, and deployed independently.
- Build a responsive single-page Breakpoint 2026 brochure experience with section navigation and a strong visual identity.
- Use Breakpoint brand references from the legacy project for typography, palette, and textures without reproducing legacy layouts or page-builder sections.
- Structure the provided copy into clear editorial sections that support promotion and conversion.
- Include the existing Breakpoint sizzle video in a v1 media section without inheriting the old page layout around it.
- Implement localization from the shared workspace i18n package from the start.
- Keep the initial build simple enough to implement quickly and iterate on inside the monorepo.

**Non-Goals:**
- Port the Sanity integration, page-builder architecture, or full component inventory from the legacy Breakpoint app.
- Recreate all historical Breakpoint subpages, schedules, speakers, sponsor directories, or live event tooling.
- Finalize production CTA destinations in v1; a placeholder CTA is acceptable until links are approved.
- Introduce a new CMS, API integration, or dynamic event data source in the first implementation pass.
- Solve final deployment routing between `solana.com` and the dedicated Breakpoint app beyond documenting any required follow-up configuration.

## Decisions

### 1. Build a standalone app-router Next.js app in `apps/breakpoint`

The new app should follow the monorepo pattern used by `apps/accelerate` and `apps/docs`: dedicated `package.json`, Next.js 15, React 19, TypeScript, and Tailwind styling. This keeps the build aligned with workspace tooling and avoids importing the legacy project's separate dependency stack, Sanity runtime, Prisma, or Storybook setup.

Alternative considered: fork or partially transplant `/Users/karambit/Sites/solana-com-breakpoint`.
Reason rejected: that codebase is optimized for a CMS-driven multi-page event site and would pull in substantial complexity that does not match the 2026 brochure scope.

### 2. Use an app-owned shell and new section components instead of legacy component reuse

The request explicitly requires a completely new design and build. Implementation should therefore define a small set of new sections in `apps/breakpoint` that own the page structure, section spacing, navigation behavior, and responsive composition. Shared monorepo utilities can be used where they are low-level and non-opinionated, but the homepage shell should not inherit the legacy Breakpoint page-builder or `ui-chrome` patterns if they constrain the visual direction.

Alternative considered: copy legacy sections such as `Hero`, `CardSection`, `WhyAttend`, `GlobalNav`, or `Footer`.
Reason rejected: even selective reuse would bias the outcome toward the old information architecture and make the "new design" requirement harder to enforce.

### 3. Treat legacy Breakpoint assets as references, then copy only approved design inputs into the new app

The legacy repo exposes concrete brand tokens that are worth preserving: `ABCDiatype`, `FH Lecturis`, and `Macan Mono`, plus the core palette built around `#11081b`, `#ab66fd`, `#e7d2f9`, `#c9ff7c`, `#14f195`, and `#59b8fe`. The new app should define its own local design tokens and CSS variables using those references, and it should copy any approved textures or assets into `apps/breakpoint` so the app does not depend on files outside the workspace at runtime.

Alternative considered: import styles or assets directly from `/Users/karambit/Sites/solana-com-breakpoint`.
Reason rejected: cross-repo runtime coupling is brittle and makes the new app non-portable.

### 4. Use static curated content for the first version

The initial brochure page should source copy from local data or content modules inside `apps/breakpoint`, including the PM-provided narrative, localized message files, a placeholder CTA label and destination, and the existing Breakpoint sizzle video metadata or embed identifier. This keeps authoring deterministic during the initial build and avoids introducing CMS, API, or synchronization work before the page exists.

Alternative considered: wire the new app to the legacy Sanity dataset or another remote source immediately.
Reason rejected: it adds operational and schema complexity before the content model is even stable.

### 5. Design the page as section-based storytelling with anchored navigation

The single-page brochure should be composed around a small number of high-signal sections:
- Hero and event identity
- Event overview and audience
- Program formats and experience
- Featured sizzle video
- Venue and dates
- Why London
- Primary CTA band

This section model matches the supplied copy, satisfies the single-page requirement, and preserves room for future additions without reintroducing subpage sprawl.

Alternative considered: preserve legacy subpages and collapse them into tabs or accordions.
Reason rejected: tabs and pseudo-subpages preserve old IA complexity rather than simplifying it.

### 6. Implement i18n with the shared workspace package instead of app-local conventions

The new app should use `@workspace/i18n` for locale config, navigation helpers, middleware creation, and message loading so it matches the monorepo's cross-app locale behavior. The app should own its Breakpoint-specific message catalogs locally, but the routing and integration contract should come from the shared package rather than a bespoke setup.

Alternative considered: add a minimal app-local `next-intl` setup just for Breakpoint.
Reason rejected: it would duplicate shared infrastructure and create inconsistent locale behavior across apps.

### 7. Keep implementation static-first, then validate with build and responsive smoke coverage

The implementation should prioritize a page that statically renders cleanly, uses modern responsive layout primitives, and can be validated with lint, type-checking, build verification, and at least a lightweight UI smoke test for key brochure sections and navigation.

Alternative considered: defer verification until visual QA only.
Reason rejected: the app is net-new and needs fast, repeatable checks from the start.

## Risks / Trade-offs

- [Visual drift from established Breakpoint identity] -> Mitigation: lock brand references up front around the legacy fonts, color palette, and approved texture direction, then define local tokens in the new app.
- [Scope creep from the legacy site inventory] -> Mitigation: restrict v1 to brochure sections driven by the supplied narrative and explicitly exclude schedule, speaker, map, and sponsor systems unless later requested.
- [Missing conversion details such as CTA destinations] -> Mitigation: ship a configurable localized placeholder CTA in v1 and keep the destination swappable through content configuration.
- [Localization adds route and message complexity to a new app] -> Mitigation: adopt the existing `@workspace/i18n` package rather than inventing app-specific locale plumbing.
- [The current sizzle video source may be embedded in legacy CMS data rather than code] -> Mitigation: extract the concrete video identifier or file reference during implementation and store it in app-local content configuration.
- [Monorepo integration gaps] -> Mitigation: scaffold the app using the same dependency and script conventions as other apps in this repository and verify it participates cleanly in workspace tooling.
- [Over-designing before content is stable] -> Mitigation: use a static content module that can be edited quickly while the layout evolves.

## Migration Plan

1. Scaffold the new Next.js app in `apps/breakpoint` with workspace-aligned scripts and dependencies.
2. Create app-local fonts, tokens, texture assets, and locale message structure derived from approved legacy references and shared i18n conventions.
3. Implement the single-page shell, section navigation, featured sizzle video section, and editorial sections using the PM copy as the initial content source.
4. Integrate `@workspace/i18n` routing, middleware, and localized message loading.
5. Add responsive and build verification, then validate the app in isolation.
6. If needed, follow up separately on repo-level routing or deployment configuration so `/breakpoint` traffic points to this app.

Rollback strategy:
- Remove the new app from the workspace if implementation is abandoned before deployment.
- If routing changes are later introduced, revert those independently without deleting the app source.

## Open Questions

- What exact video ID, asset URL, or embed source from the current Breakpoint site should be treated as the canonical sizzle video reference in the new app?
- Should the first version include any content blocks beyond the PM narrative and featured video, such as sponsor logos, media proof points, or FAQ content sourced from the current Breakpoint site?
