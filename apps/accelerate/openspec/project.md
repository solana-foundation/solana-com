# Solana Accelerate Project Overview

Event landing pages for Solana Accelerate events, starting with the Hong Kong
APAC event. Built with Next.js 15, MDX, and Tailwind CSS for easy content
management and responsive design.

## Technology Stack

- **Framework**: Next.js 15.5.9 (App Router) with MDX support
- **Language**: TypeScript 5.8.3 (strict mode)
- **Runtime**: Node.js (≥20.19.0, ESM modules)
- **UI Library**: React 19.1.2
- **Styling**: Tailwind CSS 3.4+ / SCSS
- **Animation**: Framer Motion 12.23.24
- **i18n**: next-intl (English only for now)
- **Icons**: Lucide React
- **Package Manager**: pnpm 10.15.1 (workspace protocol)
- **Build System**: Next.js built-in (part of Turborepo monorepo)

## Project Structure

```
apps/accelerate/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── layout.tsx          # Root layout with Header/Footer
│   │   ├── page.tsx            # Hong Kong event page
│   │   └── globals.css         # Global styles and CSS variables
│   ├── components/             # React components
│   │   ├── Hero.tsx           # Hero section with animated gradient
│   │   ├── EventDetails.tsx   # Date, venue, time info
│   │   ├── Tickets.tsx         # Ticket tiers
│   │   ├── Speakers.tsx        # Speaker grid
│   │   ├── Sponsors.tsx        # Sponsor logos by tier
│   │   ├── FAQ.tsx             # Accordion FAQ
│   │   ├── GettingThere.tsx    # Travel & accommodation info
│   │   ├── FooterCTA.tsx       # Final call-to-action
│   │   └── index.ts            # Component exports
│   ├── i18n/                   # i18n configuration
│   │   └── request.ts          # next-intl request handler
│   └── scss/                   # SCSS stylesheets
│       └── index.scss
├── public/
│   ├── images/                 # Static assets
│   │   ├── accelerate-logo.svg
│   │   ├── speakers/           # Speaker headshots (PNG/SVG)
│   │   └── sponsors/           # Sponsor logos (SVG preferred)
│   └── locales/en/             # English translations
│       └── common.json
├── openspec/                   # OpenSpec specifications
│   ├── AGENTS.md               # AI assistant instructions
│   └── project.md              # This file
├── next.config.ts              # Next.js + MDX config
├── tailwind.config.js          # Tailwind configuration
└── package.json
```

## Project Conventions

### Code Style

- **TypeScript**: Strict mode enabled, use explicit types
- **Components**: Functional components with hooks
- **Client Components**: Use `"use client"` directive for components with
  animations or interactivity
- **Naming**: PascalCase for components, camelCase for functions/variables,
  kebab-case for files
- **Imports**: Use `@/` path alias for src directory imports
- **Formatting**: Prettier (via monorepo root config)
- **Linting**: ESLint with Next.js and TypeScript rules

### Architecture Patterns

- **Component-Based**: Modular React components in `src/components/`
- **Page-Based Routing**: Next.js App Router with `src/app/` directory
- **Client/Server Separation**: Server components by default, client components
  only when needed
- **Workspace Dependencies**: Import shared packages using workspace protocol:
  - `@workspace/ui` - Shared UI components
  - `@solana-com/ui-chrome` - Header, Footer, ThemeProvider
  - `@workspace/i18n` - i18n utilities
- **Styling Approach**:
  - Tailwind utilities for most styling
  - Custom CSS classes for reusable patterns (`.gradient-text`, `.btn-primary`,
    etc.)
  - SCSS for complex stylesheets
- **Animation**: Framer Motion for scroll-triggered animations and transitions
- **Image Handling**:
  - Next.js Image component with proper sizing
  - SVG handling: `.inline.svg` suffix for React components, regular `.svg` for
    assets
  - Webpack configured for SVGR loader

### Design Tokens

Custom Tailwind colors for Accelerate branding:

- `accelerate-purple`: #9945FF
- `accelerate-green`: #14F195
- `accelerate-cyan`: #00D4FF
- `accelerate-dark`: #0D0D0D
- `accelerate-gray`: 100-900 scale

### CSS Utilities

- `.gradient-text` - Gradient text effect
- `.btn-primary` / `.btn-secondary` / `.btn-gradient` - Button styles
- `.section` - Standard section padding
- `.container-accelerate` - Max-width container

### Testing Strategy

- **Current**: Manual testing during development
- **Type Checking**: `pnpm check-types` (TypeScript compiler)
- **Linting**: `pnpm lint` and `pnpm lint:fix`
- **No unit tests**: Add when complexity grows or requirements change

### Git Workflow

- **Monorepo**: Part of solana-com monorepo
- **Branching**: Feature branches (e.g., `feat/accelerate-hk`)
- **Commits**: Conventional commits preferred
- **Package Manager**: pnpm with workspace protocol for dependencies

## Domain Context

### Event Landing Pages

This application creates landing pages for Solana Accelerate events. Each event
page includes:

- Hero section with animated gradient and location-specific imagery
- Event details (date, venue, time)
- Ticket tiers (General, Builder, VIP)
- Speaker showcase with social links
- Sponsor logos organized by tier
- FAQ accordion
- Travel and accommodation information
- Final call-to-action section

### Adding New Events

To add a new event location:

1. Create a new page in `src/app/[location]/page.tsx`
2. Update event data in components or create location-specific content
3. Add location-specific images to `public/images/`

### Image Requirements

- **Speakers**: JPG or PNG, 400x400px minimum, located in
  `public/images/speakers/`
- **Sponsors**: SVG preferred, optimized for 120px width, located in
  `public/images/sponsors/`

## Important Constraints

### Technical Constraints

- **Port**: Application runs on port 3004 (configured in package.json)
- **Monorepo**: Must follow monorepo conventions and use workspace dependencies
- **Next.js**: Must use App Router (not Pages Router)
- **TypeScript**: Strict mode required, no `any` types
- **SVG Handling**: Must use `.inline.svg` suffix for React components, regular
  `.svg` for static assets

### Business Constraints

- **i18n**: Currently English-only, but infrastructure supports multi-language
- **Branding**: Must use Accelerate brand colors and design tokens
- **Responsive**: Must work on mobile, tablet, and desktop
- **Performance**: Images must be optimized, animations should be performant

### Deployment Constraints

- **Environment**: Deployed on Vercel (via monorepo root configuration)
- **Environment Variables**: Uses shared env vars from root turbo.json, no
  app-specific variables required
- **Build**: Must build successfully in monorepo context

## External Dependencies

### Workspace Packages

- `@workspace/ui` - Shared UI components (Button, Dialog, Accordion, etc.)
- `@solana-com/ui-chrome` - Header, Footer, ThemeProvider, InkeepChatButton
- `@workspace/i18n` - i18n configuration and utilities
- `@workspace/config-typescript` - Shared TypeScript configurations
- `@workspace/config-eslint` - ESLint configurations

### External Services

- **Vercel**: Hosting and deployment platform
- **Builder.io**: CMS integration (via shared config, not directly used in this
  app)
- **TinaCMS**: Content management (via shared config, not directly used in this
  app)

### Key NPM Packages

- `next` - Next.js framework (version managed via catalog)
- `react` / `react-dom` - React library (version managed via catalog)
- `next-intl` - Internationalization (version managed via catalog)
- `framer-motion` - Animation library
- `tailwindcss` - CSS framework
- `@mdx-js/react` / `@next/mdx` - MDX support
- `lucide-react` - Icon library
