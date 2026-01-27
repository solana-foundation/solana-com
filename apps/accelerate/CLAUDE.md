<!-- OPENSPEC:START -->

# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `@/openspec/AGENTS.md` when the request:

- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big
  performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/openspec/AGENTS.md` to learn:

- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.

<!-- OPENSPEC:END -->

# Solana Accelerate - Event Landing Pages

> See root `/CLAUDE.md` for monorepo-wide configuration and shared tooling.

## Overview

Landing pages for Solana Accelerate events, starting with the Hong Kong APAC
event. Built with Next.js 15, MDX, and Tailwind CSS for easy content management
and responsive design.

**Package name**: `solana-accelerate` **Default port**: 3004

## Tech Stack

- **Framework**: Next.js 15 (App Router) with MDX support
- **Styling**: Tailwind CSS 3.4, SCSS
- **Animation**: Framer Motion
- **i18n**: next-intl (English only for now)
- **UI Components**: @workspace/ui, @solana-com/ui-chrome
- **Icons**: Lucide React

## Project Structure

```
apps/accelerate/
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Root layout with Header/Footer
│   │   ├── page.tsx           # Hong Kong event page
│   │   └── globals.css        # Global styles and CSS variables
│   ├── components/            # React components
│   │   ├── Hero.tsx           # Hero section with animated gradient
│   │   ├── EventDetails.tsx   # Date, venue, time info
│   │   ├── Tickets.tsx        # Ticket tiers
│   │   ├── Speakers.tsx       # Speaker grid
│   │   ├── Sponsors.tsx       # Sponsor logos by tier
│   │   ├── FAQ.tsx            # Accordion FAQ
│   │   ├── GettingThere.tsx   # Travel & accommodation info
│   │   └── FooterCTA.tsx      # Final call-to-action
│   ├── i18n/                  # i18n configuration
│   └── scss/                  # SCSS stylesheets
├── public/
│   ├── images/
│   │   ├── accelerate-logo.svg
│   │   ├── speakers/          # Speaker headshots
│   │   └── sponsors/          # Sponsor logos
│   └── locales/en/            # English translations
├── next.config.ts             # Next.js + MDX config
├── tailwind.config.js         # Tailwind configuration
└── package.json
```

## Local Development

```bash
# From monorepo root
pnpm dev --filter solana-accelerate

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

1. Create a new page in `src/app/[location]/page.tsx`
2. Update event data in the components or create location-specific content
3. Add location-specific images to `public/images/`

## Image Requirements

### Speakers

- Format: JPG or PNG
- Size: 400x400px minimum
- Location: `public/images/speakers/`

### Sponsors

- Format: SVG preferred
- Size: Optimized for 120px width
- Location: `public/images/sponsors/`

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
