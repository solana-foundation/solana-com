# Design: Migrate Builder.io to MDX

## Context

The solana.com web app currently uses Builder.io as a headless CMS for 50+
landing pages across 19 locales. Builder.io provides:

- Visual editor for non-technical content editors
- 32+ registered custom React components
- Localized content fields
- Runtime content fetching via SDK

However, this introduces:

- External API dependency during builds and ISR
- SDK bundle size (~50KB+ gzipped)
- Vendor lock-in for content format
- Complex component registration system

The docs app already demonstrates a successful MDX-based content pattern using
Fumadocs with locale-specific directories.

## Goals / Non-Goals

### Goals

- Eliminate Builder.io SDK runtime dependency from apps/web
- Preserve all existing content as JSON backup
- Convert priority landing pages to MDX with visual parity
- Maintain i18n support with locale fallback
- Enable git-based content versioning

### Non-Goals

- Convert ALL Builder pages to MDX (only 16 priority routes)
- Change visual design or component behavior
- Migrate news/blog content (uses different Builder model)
- Support Builder preview/editing mode after migration

## Decisions

### Decision 1: Content Directory Structure

Use `apps/web/content/landings/` with locale subdirectories, mirroring the docs
app pattern.

```
apps/web/content/landings/
├── en/
│   ├── solutions/
│   │   ├── index.mdx
│   │   ├── token-extensions.mdx
│   │   └── actions.mdx
│   ├── rpc.mdx
│   ├── tos.mdx
│   └── privacy-policy.mdx
├── es/
│   └── solutions/
│       └── token-extensions.mdx
└── meta.json (optional navigation config)
```

**Rationale**: Consistent with `apps/docs/content/docs/` pattern. Enables
familiar tooling and locale organization.

### Decision 2: MDX Frontmatter Schema

Use YAML frontmatter for SEO and page metadata:

```yaml
---
title: Token Extensions
seoTitle: Token Extensions on Solana
seoDescription: Build with programmable token features
seoImage: /src/img/landings/token-extensions-og.png
noIndex: false
---
```

**Rationale**: Standard MDX convention. Maps directly to existing Builder SEO
fields.

### Decision 3: Component Mapping

Map Builder components to React components importable in MDX:

| Builder Component | MDX Component |
| --- | --- |
| Accordion | `<Accordion />` |
| Announcement Bar | `<AnnouncementBar />` |
| Card Deck | `<CardDeck />` |
| Carousel | `<Carousel />` |
| CommunityGallery | `<CommunityGallery />` |
| Content Editor | `<ContentEditor />` |
| Conversion Panel | `<ConversionPanel />` |
| Feature Highlight | `<FeatureHighlight />` |
| Heading | `<Heading />` |
| Hero | `<Hero />` |
| Section Molecule | `<Section />` |
| Newsletter Form | `<NewsletterForm />` |
| Newsletter Multiple Lists Form | `<NewsletterMultipleListsForm />` |
| Slider | `<Slider />` |
| Stats | `<Stats />` |
| Switchback | `<Switchback />` |
| Switchback Chain | `<SwitchbackChain />` |
| Switcher | `<Switcher />` |
| Trustbar | `<Trustbar />` |
| Quote | `<Quote />` |
| Quote Slider | `<QuoteSlider />` |
| Details Hero | `<DetailsHero />` |
| Button | `<Button />` |
| Copy | `<HtmlParser />` |
| Tip | `<Tip />` |
| Youtube | `<YoutubeVideo />` |
| Rich Text Stats | `<RichTextStat />` |
| Rich Text Quote | `<RichTextQuote />` |
| Code Block | `<CodeBlock />` |
| Breakpoint Speakers | `<BreakpointSpeakers />` |
| Breakpoint Title | `<BreakpointTitle />` |
| Breakpoint Hero | `<BreakpointHero />` |
| Breakpoint Card | `<BreakpointCard />` |
| Accelerate Stories | `<AccelerateStories />` |
| Accelerate Accordion | `<AccelerateAccordion />` |
| Accelerate Speakers | `<AccelerateSpeakers />` |
| Accelerate Hero | `<AccelerateHero />` |
| Accelerate Apply Button | `<AccelerateApplyButton />` |
| Accelerate Link Button | `<AccelerateLinkButton />` |
| Info Item | `<AccelerateInfoItem />` |
| Info Section | `<AccelerateInfoSection />` |
| Attendance | `<AccelerateAttendance />` |
| Secondary button | `<AccelerateSecondaryButton />` |
| Event description | `<AccelerateEventDescription />` |
| Pricing | `<AcceleratePricing />` |
| Star Container | `<AccelerateStarContainer />` |

Components retain the same props interface. Import from
`@solana-foundation/solana-lib` as before.
Components have valid names.

**Rationale**: Minimal code changes. Components already exist; only rendering
context changes.

### Decision 4: Locale Fallback Strategy

1. Try `content/landings/{locale}/{slug}.mdx`
2. Fall back to `content/landings/en/{slug}.mdx`
3. Return 404 if neither exists

**Rationale**: Matches current Builder behavior where English is always
available.

### Decision 5: Asset Storage

Download Builder CDN assets to `apps/web/public/src/img/landings/` with original
filenames plus proper extensions.

Configure `next.config.ts` to optimize these images.

**Rationale**: Eliminates runtime CDN dependency. Enables Next.js image
optimization.

### Decision 6: JSON Export Format

Store raw Builder API responses in `apps/web/builder/` directory:

```
apps/web/builder/
├── section-page/
│   ├── en/
│   │   ├── solutions-token-extensions.json
│   │   └── solutions-actions.json
│   └── es/
│       └── solutions-token-extensions.json
└── assets/
    └── manifest.json (maps CDN URLs to local paths)
```

**Rationale**: Preserves complete Builder data for reference. One-time backup
with no runtime usage.

## Risks / Trade-offs

### Risk: Content Parity

Builder JSON structure is complex with nested blocks. Conversion to MDX may miss
edge cases.

**Mitigation**: Manual visual comparison of each converted page against
production. Automated screenshot diffing if available.

### Risk: Lost Localization

Some locales may have partial translations in Builder that get lost.

**Mitigation**: Export creates file only when locale-specific content exists.
Document which locales exist for each page.

### Risk: Component Props Mismatch

Builder component configs have many conditional fields that may not map cleanly.

**Mitigation**: Start with priority pages that use common component patterns.
Document unsupported props.

### Trade-off: No Visual Editor

Non-technical editors lose drag-and-drop editing.

**Accepted**: These pages change infrequently. MDX is developer-maintainable.
Future: could add Contentlayer or similar if needed.

## Migration Plan

### Phase 1: Export (Non-Breaking)

1. Create `scripts/export-builder.ts`
2. Run export for all routes and locales
3. Download all CDN assets
4. Commit to `builder/` directory as backup

### Phase 2: Convert Priority Pages

1. Create `content/landings/` directory structure
2. Convert 16 priority routes to MDX
3. Create MDX component imports
4. Visual verification of each page

### Phase 3: Route Handler

1. Create new `[...slug].js` that reads MDX
2. Implement locale fallback
3. Wire up SEO metadata from frontmatter
4. Test all routes and locales

### Phase 4: Remove Builder

1. Remove `@builder.io/react` and `@builder.io/sdk` from package.json
2. Delete `src/lib/builder/` directory
3. Delete `src/utils/builderConfigs.js`
4. Delete `src/utils/customComponentGenerator.js`
5. Update `next.config.ts` (remove Builder CSP, cdn.builder.io)
6. Run full build and test

### Rollback

If issues arise post-deployment:

1. Revert package.json changes
2. Restore deleted Builder files from git
3. Route handler change is isolated and revertible

## Open Questions

None - requirements are clear from the user specification.
