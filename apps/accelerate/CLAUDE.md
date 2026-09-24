# Solana Accelerate - Event Landing Pages

> See root `/CLAUDE.md` for monorepo-wide configuration and shared tooling.

## Overview

Landing pages and archived content for Solana Accelerate events, including the
Hong Kong and Miami experiences. Built with Next.js 15, MDX, and Tailwind CSS.

**Package name**: `solana-com-accelerate` **Default port**: 3004

## Tech Stack

- **Framework**: Next.js 15 (App Router) with MDX support
- **Styling**: Tailwind CSS 3.4, SCSS
- **Animation**: Motion
- **i18n**: next-intl (English only for now)
- **UI Components**: @workspace/ui, @solana-com/ui-chrome
- **Icons**: Boxicons and shared `ui-chrome` icons

## Project Structure

```
apps/accelerate/
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── page.tsx       # Accelerate event index
│   │   │   ├── hong-kong/     # Hong Kong event and agenda
│   │   │   └── miami/         # Miami event and agenda
│   │   └── globals.css        # Global styles and CSS variables
│   ├── components/            # React components
│   │   └── homepage/          # Shared event-index sections
│   ├── data/                  # Event-specific agenda and sponsor data
│   ├── i18n/                  # i18n configuration
│   └── scss/                  # SCSS stylesheets
├── public/
│   ├── images/
│   │   ├── homepage/          # Event-index artwork and thumbnails
│   │   └── speakers/          # Speaker headshots
│   └── video/                 # Event video assets
├── next.config.ts             # Next.js + MDX config
├── tailwind.config.js         # Tailwind configuration
└── package.json
```

## Local Development

```bash
# From monorepo root
pnpm dev --filter solana-com-accelerate

# Or from this directory
pnpm dev

# Type checking
pnpm check-types

# Lint
pnpm lint
pnpm lint:fix
```

## Key Features

### Event Landing Page

- Hero section with animated gradient lines
- Event details with date, venue, time
- Ticket tiers (General, Builder, VIP)
- Speaker showcase with social links
- Sponsor logos organized by tier
- FAQ accordion
- Getting there with travel info
- Final CTA section

### Design Tokens

Custom Tailwind colors for Accelerate branding:

- `accelerate-purple`: #9945FF
- `accelerate-green`: #14F195
- `accelerate-cyan`: #00D4FF
- `accelerate-dark`: #0D0D0D

### CSS Utilities

- `.gradient-text` - Gradient text effect
- `.btn-primary` / `.btn-secondary` / `.btn-gradient` - Button styles
- `.section` - Standard section padding
- `.container-accelerate` - Max-width container

## Adding New Events

To add a new event location:

1. Create a new page in `src/app/[locale]/[location]/page.tsx`
2. Add location-specific data under `src/data/` when appropriate
3. Add location-specific images to `public/images/`

## Image Requirements

### Speakers

- Format: JPG or PNG
- Size: 400x400px minimum
- Location: `public/images/speakers/`

### Sponsors

- Format: SVG preferred
- Size: Optimized for 120px width
- Location: `packages/ecosystem-data/assets/companies/`

## Environment Variables

Uses shared env vars from root turbo.json. No app-specific variables required.

## Dependencies

Key workspace dependencies:

- `@workspace/ui` - Shared UI components
- `@solana-com/ui-chrome` - Header, Footer, ThemeProvider
- `@workspace/i18n` - i18n utilities

## Conventions

1. **Components**: Client components with "use client" for animations
2. **Styling**: Tailwind utilities + custom CSS classes
3. **Animation**: Framer Motion for scroll-triggered animations
4. **Images**: Next.js Image component with proper sizing
