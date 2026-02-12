## Context

Implementing pixel-perfect UI from Figma design `7408:64` (Accelerate HK
Desktop) for the Solana Accelerate Hong Kong event landing page. The design is
1920px wide and 8703px tall, containing multiple sections that need precise
visual matching.

**Stakeholders**: Marketing team (design approval), Engineering (implementation)

**Constraints**:

- Must use existing monorepo architecture and workspace packages
- Must maintain responsive behavior while matching desktop design
- All images must be exported from Figma (no stock images)

## Goals / Non-Goals

### Goals

- Achieve pixel-perfect match with Figma design on desktop (1920px)
- Export all required assets from Figma as SVG/PNG
- Implement responsive adaptations for mobile/tablet
- Use Figma design tokens consistently throughout

### Non-Goals

- Mobile-specific design variations (adapt desktop design responsively)
- Interactive map implementation (placeholder only)
- Ticket purchase functionality (links only)

## Decisions

### Typography System

**Decision**: Use Figma-specified fonts with Tailwind custom configuration

**Font Family Requirement**: All components MUST use
`font-family: "Space Grotesk"` for headlines, hero text, buttons, and navigation
elements as specified below.

| Token        | Font          | Weight         | Size | Line Height |
| ------------ | ------------- | -------------- | ---- | ----------- |
| `hero`       | Space Grotesk | 300 (Light)    | 84px | 1           |
| `h1`         | Space Grotesk | 300 (Light)    | 68px | 1           |
| `h2`         | Space Grotesk | 400 (Regular)  | 32px | 1.1         |
| `h3`         | ABC Diatype   | 300 (Light)    | 24px | 1.2         |
| `h4`         | ABC Diatype   | 400 (Regular)  | 20px | 1.4         |
| `p`          | ABC Diatype   | 300 (Light)    | 20px | 1.4         |
| `button`     | Space Grotesk | 600 (SemiBold) | 16px | 1           |
| `button-big` | Space Grotesk | 600 (SemiBold) | 18px | 1           |

**Implementation Note**: Space Grotesk must be loaded via Next.js font
optimization (`next/font/google`) and configured in Tailwind config as a custom
font family. All hero titles, headings (h1, h2), buttons, and navigation text
must explicitly use `font-family: "Space Grotesk"`.

**Alternatives considered**: System fonts (rejected - design specifies custom
fonts)

### Color System

**Decision**: Extend Tailwind config with Figma color variables

```js
colors: {
  accelerate: {
    purple: '#9945FF',  // G1 - Primary brand
    green: '#19FB9B',   // G3 - Accent
    blue: '#2A88DE',    // G2 - Secondary
    black: '#000000',
    white: '#FFFFFF',
    gray: {
      light: '#D2D2D2',   // Light Grey
      dark: '#3D3D3D',    // Dark Grey
      100: '#B3B2BC',     // Grey 01
      200: '#838191',     // Grey 02
      300: '#3B3B40',     // Grey 03
    }
  }
}
```

### Asset Export Strategy

**Decision**: Export from Figma using node IDs, save to `public/images/`

| Asset Type                                       | Format                      | Location                   |
| ------------------------------------------------ | --------------------------- | -------------------------- |
| Decorative vectors (skyline, waves, dots, pills) | SVG                         | `/public/images/`          |
| Speaker headshots                                | PNG (400x400 min)           | `/public/images/speakers/` |
| Sponsor logos                                    | SVG preferred, PNG fallback | `/public/images/sponsors/` |
| Accelerate logo                                  | SVG                         | `/public/images/`          |

**Process**:

1. Use Figma MCP `get_design_context` with `forceCode: true` for individual
   nodes
2. Extract SVG code from response for vector assets
3. Download raster images via Figma export API
4. Optimize SVGs with SVGO before committing

### Component Layout Approach

**Decision**: Use CSS Grid and Flexbox with pixel-exact measurements

- Hero: `h-[932px]` with absolute positioned decorative elements
- Event Details: `grid grid-cols-[800px_600px]` at desktop
- Tickets: `grid grid-cols-2` with 520px card width
- Speakers: `grid grid-cols-4` with 380px card width, 40px gap
- Sponsors: Flexbox centered with tier-specific gaps

**Alternatives considered**:

- CSS-in-JS (rejected - Tailwind already in use)
- Design system components only (rejected - need pixel precision)

### Responsive Strategy

**Decision**: Desktop-first with breakpoint adaptations using standard Tailwind
breakpoints (matching `apps/web`)

| Breakpoint          | Behavior                                              |
| ------------------- | ----------------------------------------------------- |
| `lg` (1024px+)      | Full Figma layout                                     |
| `md` (768px-1023px) | 2-column grids become 1-column, reduced spacing       |
| `sm` (640px-767px)  | Single column, stacked layout, smaller typography     |
| Default (<640px)    | Mobile layout, further reduced spacing and typography |

Key responsive adaptations:

- Hero text scales down proportionally
- Ticket cards stack vertically
- Speaker grid becomes 2-column then 1-column
- Sponsor logos wrap and resize

## Risks / Trade-offs

| Risk                                       | Mitigation                                                      |
| ------------------------------------------ | --------------------------------------------------------------- |
| ABC Diatype font not freely available      | Use closest Google Font fallback (Inter) or load via @font-face |
| Large SVG assets impact performance        | Optimize with SVGO, use `loading="lazy"` for below-fold images  |
| Responsive adaptations diverge from design | Document breakpoint behaviors, get stakeholder sign-off         |
| Speaker/sponsor images change              | Implement data-driven components for easy content updates       |

## Migration Plan

1. Export and commit all assets first
2. Update Tailwind config with design tokens
3. Update components one section at a time (Hero → Footer)
4. Test each section before proceeding
5. Final QA pass comparing against Figma

**Rollback**: Git revert to previous component versions if needed

## Open Questions

1. **Font licensing**: ✅ **Resolved** - ABC Diatype fonts are available in the
   monorepo and will be consolidated into a shared `@workspace/fonts` package
   for reuse across apps.
2. **Map integration**: ✅ **Resolved** - Keep placeholder image only (no
   interactive map implementation).
3. **Ticket links**: ✅ **Resolved** - Use `https://luma.com/sol-accelerate-hk`
   for ticket purchase buttons. Implement popup modal functionality so users
   stay on site when clicking ticket links.
4. **Sponsor URLs**: ✅ **Resolved** - Use placeholders for sponsor website URLs
   until final list is provided.
