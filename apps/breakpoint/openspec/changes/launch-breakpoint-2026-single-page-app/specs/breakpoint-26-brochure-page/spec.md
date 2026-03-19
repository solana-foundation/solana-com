## ADDED Requirements

### Requirement: Breakpoint app serves a dedicated 2026 brochure page
The system SHALL provide a dedicated Next.js application in `apps/breakpoint` that serves Breakpoint 2026 from the root route as a single-page brochure experience rather than a brochure split across multiple subpages.

#### Scenario: Visitor opens the brochure app
- **WHEN** a visitor loads the root route of the Breakpoint app
- **THEN** the app renders a single-page Breakpoint 2026 experience
- **AND** the page presents event-promotional content without requiring brochure navigation to separate internal pages

### Requirement: Brochure page organizes the approved event story into clear sections
The system SHALL translate the approved Breakpoint 2026 marketing copy into distinct sections that cover the event identity, audience and program, event timing and venue, London rationale, a featured sizzle video, and primary calls to action.

#### Scenario: Visitor scans the page structure
- **WHEN** a visitor scrolls the brochure page
- **THEN** they can identify separate sections for the event headline, event overview, audience or program value, venue and dates, London context, featured video, and calls to action

#### Scenario: Event details are surfaced accurately
- **WHEN** a visitor reads the event logistics section
- **THEN** the page states that Breakpoint 2026 takes place November 15-17 at Olympia London
- **AND** the page frames London as a strategic location for Solana ecosystem growth using the approved marketing narrative

### Requirement: Brochure page includes the existing Breakpoint sizzle video
The system SHALL include the sizzle video currently used by the existing Breakpoint site as part of the v1 brochure experience.

#### Scenario: Visitor reaches the featured video section
- **WHEN** a visitor views the brochure page section dedicated to featured media
- **THEN** the page renders the existing Breakpoint sizzle video from the current Breakpoint site
- **AND** the video presentation matches the new 2026 page design rather than embedding a legacy page layout

### Requirement: Brochure page supports section-based navigation
The system SHALL provide section-based navigation within the single-page experience so visitors can jump directly to major sections without leaving the page.

#### Scenario: Visitor uses page navigation
- **WHEN** a visitor selects a brochure navigation item
- **THEN** the app scrolls them to the corresponding section on the same page
- **AND** the visitor remains within the single-page experience

### Requirement: Brochure page uses a new 2026 composition with Breakpoint brand references
The system SHALL use a newly built layout and section composition for Breakpoint 2026, and it MUST limit legacy references to approved brand ingredients such as fonts, colors, and textures rather than reusing the old site structure wholesale.

#### Scenario: Design review compares legacy and new experiences
- **WHEN** the Breakpoint 2026 brochure page is reviewed against the legacy Breakpoint site
- **THEN** the page reflects the Breakpoint visual identity through approved typography, color, and texture references
- **AND** the page does not depend on direct reproduction of legacy page layouts or CMS-driven page-builder sections

#### Scenario: Hero uses the approved shader treatment
- **WHEN** a visitor lands in the brochure hero
- **THEN** the hero may use a locally implemented shader background derived from the approved `solana-com-breakpoint/lib/water.ts` effect
- **AND** the implementation remains app-owned inside `apps/breakpoint` rather than importing runtime code from the legacy project

### Requirement: Brochure page remains usable across viewport sizes
The system SHALL present the single-page brochure content in a responsive layout that preserves hierarchy, readability, and navigation access on mobile and desktop viewports.

#### Scenario: Visitor opens the page on a small viewport
- **WHEN** a visitor views the brochure page on a mobile-sized screen
- **THEN** section content remains readable without horizontal overflow
- **AND** section navigation and primary calls to action remain accessible

### Requirement: Brochure page supports localization through shared workspace i18n
The system SHALL implement localization for the Breakpoint app using the shared `@workspace/i18n` package so routing, middleware, and message loading align with other apps in the monorepo.

#### Scenario: Visitor opens a localized route
- **WHEN** a visitor loads a supported localized Breakpoint route
- **THEN** the app resolves locale-aware routing through the shared workspace i18n utilities
- **AND** localized brochure messages are loaded through the shared package integration

#### Scenario: Primary CTA is not finalized
- **WHEN** the brochure page renders its main conversion area before the production destination is available
- **THEN** the page shows a clearly labeled placeholder CTA
- **AND** the placeholder remains translatable through the localization system
