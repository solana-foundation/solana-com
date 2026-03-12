## Why

Breakpoint currently exists outside this workspace as a separate Next.js project with its own component library, CMS wiring, and multi-page event experience. The monorepo needs a first-class `apps/breakpoint` app for Breakpoint 2026 so the team can ship a focused, high-quality brochure site with a net-new layout and section composition while still drawing from the established Breakpoint visual language for fonts, palette, and texture direction.

## What Changes

- Scaffold a new Next.js application in `apps/breakpoint` that participates in the monorepo workspace and follows the current Solana app conventions.
- Build a single-page Breakpoint 2026 marketing experience with anchored sections instead of separate brochure subpages.
- Create a new 2026 page design and component composition rather than porting the legacy Breakpoint layouts or CMS-rendered blocks directly.
- Use the existing `solana-com-breakpoint` project only as visual reference material for typography, colors, and textures.
- Restructure the supplied event copy into clear brochure sections such as hero, event overview, audience/program, venue and timing, London rationale, and primary calls to action.
- Include the existing Breakpoint sizzle video from the current Breakpoint site as part of the v1 brochure experience.
- Ship the app with localization support wired through the shared `@workspace/i18n` package, using a placeholder primary CTA until production destinations are finalized.
- Define a narrow reuse boundary for legacy materials, limited to approved visual tokens, textures, and content references rather than direct component migration.

## Capabilities

### New Capabilities
- `breakpoint-26-brochure-page`: Deliver a responsive localized single-page Breakpoint 2026 app with anchored navigation, a new visual composition informed by Breakpoint brand references, the existing sizzle video, and editorial sections that present event information and calls to action clearly.

### Modified Capabilities
- None.

## Impact

- Affected code: new `apps/breakpoint` Next.js app, shared workspace configuration, and any imported font, color, or texture assets approved from the existing Breakpoint codebase.
- Affected systems: monorepo app registry, shared localization package integration, package dependencies, and any local routing or deployment configuration needed to serve the dedicated Breakpoint app.
- Source material: visual references from `/Users/karambit/Sites/solana-com-breakpoint` plus current public Breakpoint marketing content.
