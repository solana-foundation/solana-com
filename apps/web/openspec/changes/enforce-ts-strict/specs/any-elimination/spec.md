## ADDED Requirements

### Requirement: No Explicit any in App Source

All explicit `any` type annotations in `apps/web/src/` SHALL be replaced with
precise types or, where a third-party shape is unknown, a documented stub
interface.

#### Scenario: solana-lib attribute props typed

- **WHEN** an accelerate component receives `attributes` from `@solana-foundation/solana-lib`
- **THEN** the prop is typed as `SolanaLibAttributes` (defined in `src/types/solana-lib.ts`) instead of `any`

#### Scenario: react-slick arrow callback typed

- **WHEN** `CustomPrevArrow` / `CustomNextArrow` are declared
- **THEN** props use `CustomArrowProps` imported from `react-slick`

#### Scenario: catch block error typed

- **WHEN** an error is caught in a try/catch block
- **THEN** the binding is `unknown` and narrowed with `instanceof Error` before `.message` is accessed

### Requirement: Domain Interfaces for API Response Data

Page-level data from external APIs SHALL be typed with named interfaces rather
than `any[]`.

#### Scenario: events page data typed

- **WHEN** `events.tsx` declares its props
- **THEN** `events`, `communityEvents`, `featuredEvent`, `usEvents` use a `CalendarEvent` interface

#### Scenario: community page data typed

- **WHEN** `community.tsx` declares its props
- **THEN** `posts`, `youtubeVideos`, and social data use `CommunityPost` / `YoutubeVideo` interfaces
