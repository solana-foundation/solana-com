## 1. Asset Export & Setup

- [ ] 1.1 Export Hong Kong skyline SVG from Figma node `7408:7141`
- [ ] 1.2 Export wave lines (Footer Element) SVG from Figma node `7408:14239`
- [ ] 1.3 Export dots pattern SVG from Figma node `7408:7179`
- [ ] 1.4 Export pills-left decoration SVG from Figma node `7408:14243`
- [ ] 1.5 Export pills-right decoration SVG from Figma node `7408:14246`
- [ ] 1.6 Export Accelerate logo SVG from nav component
- [ ] 1.7 Export speaker images (Lily Liu, Chris Chung, Shina Foo, Shawn Chain) as PNG
- [ ] 1.8 Export Sunrise sponsor logo from node `7408:14251`
- [ ] 1.9 Export Gold sponsor logos (DoubleZero, Playsolana, Bridge, Libeara) from nodes `7408:14266`
- [ ] 1.10 Export additional sponsor logos (Ant, Dabba, Solflare) from nodes `7408:14309`
- [ ] 1.11 Export pattern background SVG from node `7408:14249`
- [ ] 1.12 Export HK characters background element from node `7408:14555`
- [ ] 1.13 Optimize all SVGs with SVGO

## 2. Design Tokens & Configuration

- [ ] 2.1 Update `tailwind.config.js` with Figma color palette (G1, G2, G3, Grey scales)
- [ ] 2.2 Add custom font configuration for Space Grotesk (load via `next/font/google` and configure in Tailwind with `font-family: "Space Grotesk"`)
- [ ] 2.3 Add custom font configuration for ABC Diatype (or fallback)
- [ ] 2.4 Update `globals.css` with @font-face declarations
- [ ] 2.5 Add typography utility classes matching Figma tokens (hero, h1, h2, h3, h4, p, button)

## 3. Hero Section Implementation

- [ ] 3.1 Update Hero component dimensions to 1920x932px
- [ ] 3.2 Implement purple gradient glow effect (left side)
- [ ] 3.3 Position HK skyline centered with correct transform
- [ ] 3.4 Add wave lines decoration at y=406px
- [ ] 3.5 Add dots pattern at bottom
- [ ] 3.6 Position pills-left at x=-62, y=186
- [ ] 3.7 Position pills-right at x=1860 (rotated 180deg)
- [ ] 3.8 Update navigation layout with exact spacing (38px gaps)
- [ ] 3.9 Style "Get Tickets" nav button with purple border
- [ ] 3.10 Update hero text: "February 11 / Hong Kong" with green color (#19FB9B)
- [ ] 3.11 Update hero title to Space Grotesk Light 84px with `font-family: "Space Grotesk"`
- [ ] 3.12 Implement gradient CTA button (purple to green, 480x66px)
- [ ] 3.13 Add grid icon (4 squares) to CTA button

## 4. Event Details Section

- [ ] 4.1 Update section heading to "Event details" with h1 styling
- [ ] 4.2 Implement 2-column grid layout (800px + 600px)
- [ ] 4.3 Style detail rows with 360px label offset
- [ ] 4.4 Update Date row: "February 11, 2026"
- [ ] 4.5 Update Venue row with multi-line address
- [ ] 4.6 Update Time row: "9:00 AM GMT+8"
- [ ] 4.7 Update Tickets row: "Starting at $99"
- [ ] 4.8 Style map placeholder (600x732px) with "EMBEDDED MAP" text

## 5. Tickets Section

- [ ] 5.1 Update section heading styling
- [ ] 5.2 Implement 2-column grid for ticket cards (520px width each)
- [ ] 5.3 Create General Admission card ($99, "Full conference access")
- [ ] 5.4 Create Student card ($25, "Full conference access")
- [ ] 5.5 Add "Are you a Student?" label with "APPLY FOR DISCOUNT" link
- [ ] 5.6 Style ticket icons (rightmost position)
- [ ] 5.7 Remove VIP tier from current implementation

## 6. Speakers Section

- [ ] 6.1 Set section background to black
- [ ] 6.2 Update heading with arrow icon aligned right
- [ ] 6.3 Implement 4-column grid (380px cards, 40px gap)
- [ ] 6.4 Style speaker cards (380x626px total, 400px image height)
- [ ] 6.5 Apply grayscale filter to speaker images
- [ ] 6.6 Update name typography (uppercase, multi-line, 136px height area)
- [ ] 6.7 Style company name and title rows
- [ ] 6.8 Position X (Twitter) icon at bottom-right of info area
- [ ] 6.9 Add speaker data for all 4 speakers

## 7. Sponsors Section

- [ ] 7.1 Set section background to white
- [ ] 7.2 Add "TITLE SPONSORS" tier label (centered, uppercase)
- [ ] 7.3 Display Sunrise logo (400x168px container)
- [ ] 7.4 Add "GOLD SPONSORS" tier label
- [ ] 7.5 Display Gold sponsor logos in row (1400px width, 320px per logo)
- [ ] 7.6 Add additional sponsor tier with 3 logos
- [ ] 7.7 Add third sponsor row matching Figma layout
- [ ] 7.8 Remove "Become a Sponsor" CTA if not in Figma

## 8. FAQ Section

- [ ] 8.1 Update section background to white
- [ ] 8.2 Style section heading
- [ ] 8.3 Update FAQ items to match Figma content:
  - "What's included in the ticket?"
  - "Does my Consensus ticket also give me access to Accelerate?"
  - "Is there a dress code?"
  - "Can I get a ticket to everything?"
  - "Can I get a refund?"
  - "Where should I stay?"
  - "Is there parking available?"
  - "Accessibility information"
  - "Age restrictions"
  - "Recording/Photography policy"
  - "Contact information"
- [ ] 8.4 Style expanded answer area with full width (800px)
- [ ] 8.5 Style expand/collapse icons (arrow rotation)

## 9. Getting There Section

- [ ] 9.1 Set section background to black
- [ ] 9.2 Update heading typography
- [ ] 9.3 Style "Nearest Airport" row with 2-column layout
- [ ] 9.4 Style "Accommodations" row with hotel name and details link

## 10. Footer CTA Section

- [ ] 10.1 Set section background to black
- [ ] 10.2 Add "Don't miss" subtitle (white/60 opacity)
- [ ] 10.3 Style "SOLANA ACCELERATE" heading (gradient text)
- [ ] 10.4 Add "Limited tickets available" button with arrow
- [ ] 10.5 Add Hong Kong Chinese characters background ("香港") from node `7408:14555`
- [ ] 10.6 Position background element correctly (1464x823px at bottom)

## 11. Responsive Adaptations

- [ ] 11.1 Test and adjust Hero section for tablet (md) and mobile (sm)
- [ ] 11.2 Test and adjust Event Details for smaller screens
- [ ] 11.3 Stack Tickets cards vertically on mobile
- [ ] 11.4 Reduce Speakers grid to 2-col (md) and 1-col (sm)
- [ ] 11.5 Wrap Sponsor logos on smaller screens
- [ ] 11.6 Ensure FAQ accordion works at all breakpoints
- [ ] 11.7 Stack Getting There rows on mobile

## 12. Quality Assurance

- [ ] 12.1 Run `pnpm lint` and fix any issues
- [ ] 12.2 Run `pnpm check-types` and fix any type errors
- [ ] 12.3 Visual comparison against Figma design at 1920px
- [ ] 12.4 Test all interactive elements (nav links, accordion, buttons)
- [ ] 12.5 Verify all images load correctly
- [ ] 12.6 Test responsive behavior at 768px and 375px
- [ ] 12.7 Run `pnpm build` to verify production build succeeds
