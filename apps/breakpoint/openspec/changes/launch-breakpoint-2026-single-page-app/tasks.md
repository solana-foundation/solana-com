## 1. App Scaffold

- [x] 1.1 Scaffold a new Next.js 15 app in `apps/breakpoint` with
      monorepo-aligned scripts, dependencies, TypeScript, and App Router
      structure
- [x] 1.2 Add the styling and build configuration required for the app to run
      cleanly inside the workspace
- [x] 1.3 Integrate `@workspace/i18n` routing, middleware, and locale-aware app
      structure for the Breakpoint app
- [x] 1.4 Create the base route, metadata, and application shell for a
      standalone Breakpoint 2026 brochure app

## 2. Brand Foundation

- [x] 2.1 Bring approved Breakpoint font assets into the app and register local
      typography tokens for display, body, and mono usage
- [x] 2.2 Define app-local color, spacing, and texture tokens derived from the
      approved Breakpoint brand references, including the water shader treatment
      direction
- [x] 2.3 Implement reusable low-level UI primitives and layout utilities for
      the new 2026 design without porting legacy page sections directly

## 3. Brochure Experience

- [x] 3.1 Create localized content and message files for the Breakpoint 2026
      brochure copy, placeholder CTA text, and any curated supporting content
- [x] 3.2 Extract and configure the existing Breakpoint sizzle video for reuse
      in the new app
- [x] 3.3 Build the single-page section flow covering a shader-backed hero,
      event overview, audience or program value, featured video, venue and
      dates, London rationale, and primary CTA areas
- [x] 3.4 Implement a placeholder primary CTA that is easy to replace once the
      final destination is approved
- [x] 3.5 Implement anchored section navigation that scrolls within the page
      without introducing brochure subpages
- [x] 3.6 Ensure the layout remains responsive and readable across mobile and
      desktop viewport sizes

## 4. Verification and Integration

- [x] 4.1 Add lightweight test or smoke coverage for key brochure rendering,
      locale-aware content loading, and section navigation behavior
- [x] 4.2 Run lint, type-check, and production build verification for
      `apps/breakpoint`
- [x] 4.3 Document any follow-up routing or deployment configuration needed for
      the dedicated Breakpoint app to receive production traffic
