# Change: Implement Pixel-Perfect Figma Design for Accelerate HK

## Why

The current scaffolded components need to be updated to match the official Figma
design (`7408:64`) pixel-perfectly. This ensures visual consistency with the
approved design and provides a polished user experience for the Solana
Accelerate Hong Kong event landing page.

## What Changes

### Hero Section

- Update gradient effects and positioning to match Figma (purple glow, wave
  lines, dots pattern)
- Implement exact Hong Kong skyline positioning (centered, flipped)
- Update pill decorations placement and rotation
- Match typography exactly: Space Grotesk Light 84px for title, 32px for
  date/location
- **Font requirement**: All hero text, headings, buttons, and navigation MUST
  use `font-family: "Space Grotesk"`
- Update CTA button to gradient design with grid icon

### Navigation

- Match nav layout with logo (197x100px) and navigation links
- Implement "Get Tickets" button with purple border and arrow icon
- Exact spacing: 38px gap between nav items

### Event Details Section

- Update layout to match Figma 2-column design (800px details + 600px map)
- Implement exact row styling with 360px label offset
- Add map placeholder with "EMBEDDED MAP" text styling

### Tickets Section

- **BREAKING**: Change from 3 tiers to 2 tiers (General Admission $99, Student
  $25)
- Update ticket card design with title/price row layout
- Add student discount application link
- Remove VIP tier

### Speakers Section

- Update speaker card design with exact dimensions (380x626px)
- Implement name typography: uppercase, multi-line display
- Export and integrate speaker images as grayscale
- Add X (Twitter) icons with proper positioning

### Sponsors Section

- Update sponsor tier layout (Title, Gold, additional tiers)
- Export all sponsor logos as SVG/PNG from Figma
- Match exact grid spacing and logo sizes per tier

### FAQ Section

- Update accordion styling to match Figma
- Align FAQ content with design (specific questions from Figma)
- Match expand/collapse icon styling

### Getting There Section

- Update layout with 2-column format
- Style airport and accommodations rows
- Add proper link styling for hotel details

### Footer CTA Section

- Implement "Don't miss SOLANA ACCELERATE" design
- Add Hong Kong Chinese characters ("香港") background
- Match gradient text effect and button styling

### Asset Exports Required

- Hong Kong skyline SVG
- Wave lines SVG
- Dots pattern SVG
- Pills decorations (left and right) SVG
- All speaker headshots (PNG, grayscale)
- All sponsor logos (SVG preferred)
- Accelerate logo SVG

## Impact

- Affected specs: `landing-page` (new capability)
- Affected code:
  - `src/components/Hero.tsx`
  - `src/components/EventDetails.tsx`
  - `src/components/Tickets.tsx`
  - `src/components/Speakers.tsx`
  - `src/components/Sponsors.tsx`
  - `src/components/FAQ.tsx`
  - `src/components/GettingThere.tsx`
  - `src/components/FooterCTA.tsx`
  - `src/app/globals.css`
  - `tailwind.config.js`
  - `public/images/*` (new assets)
