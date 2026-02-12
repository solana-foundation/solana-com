## 1. Asset Export & Setup

- [x] 1.1 Export Hong Kong skyline SVG from Figma node `7408:7141`
- [x] 1.2 Export wave lines (Footer Element) SVG from Figma node `7408:14239`
- [x] 1.3 Export dots pattern SVG from Figma node `7408:7179`
- [x] 1.4 Export pills-left decoration SVG from Figma node `7408:14243`
- [x] 1.5 Export pills-right decoration SVG from Figma node `7408:14246`
- [x] 1.6 Export Accelerate logo SVG from nav component
- [x] 1.7 Export speaker images (Lily Liu, Chris Chung, Shina Foo, Shawn Chain)
      as PNG
- [x] 1.8 Export Sunrise sponsor logo from node `7408:14251`
- [x] 1.9 Export Gold sponsor logos (DoubleZero, Playsolana, Bridge, Libeara)
      from nodes `7408:14266`
- [x] 1.10 Export additional sponsor logos (Ant, Dabba, Solflare) from nodes
      `7408:14309`
- [x] 1.11 Export pattern background SVG from node `7408:14249`
- [x] 1.12 Export HK characters background element from node `7408:14555`
- [x] 1.13 Optimize all SVGs with SVGO

## 2. Design Tokens & Configuration

- [x] 2.1 Update `tailwind.config.js` with Figma color palette (G1, G2, G3, Grey
      scales)
- [x] 2.2 Add custom font configuration for Space Grotesk (load via
      `next/font/google` and configure in Tailwind with
      `font-family: "Space Grotesk"`)
- [x] 2.3 Add custom font configuration for ABC Diatype (or fallback)
- [x] 2.4 Update `globals.css` with @font-face declarations
- [x] 2.5 Add typography utility classes matching Figma tokens (hero, h1, h2,
      h3, h4, p, button)

## 3. Hero Section Implementation

- [x] 3.1 Update Hero component dimensions to 1920x932px
- [x] 3.2 Implement purple gradient glow effect (left side)
- [x] 3.3 Position HK skyline centered with correct transform
- [x] 3.4 Add wave lines decoration at y=406px
- [x] 3.5 Add dots pattern at bottom
- [x] 3.6 Position pills-left at x=-62, y=186
- [x] 3.7 Position pills-right at x=1860 (rotated 180deg)
- [x] 3.8 Update navigation layout with exact spacing (38px gaps)
- [x] 3.9 Style "Get Tickets" nav button with purple border
- [x] 3.10 Update hero text: "February 11 / Hong Kong" with green color
      (#19FB9B)
- [x] 3.11 Update hero title to Space Grotesk Light 84px with
      `font-family: "Space Grotesk"`
- [x] 3.12 Implement gradient CTA button (purple to green, 480x66px)
- [x] 3.13 Add grid icon (4 squares) to CTA button

## 4. Event Details Section

- [x] 4.1 Update section heading to "Event details" with h1 styling
- [x] 4.2 Implement 2-column grid layout (800px + 600px)
- [x] 4.3 Style detail rows with 360px label offset
- [x] 4.4 Update Date row: "February 11, 2026"
- [x] 4.5 Update Venue row with multi-line address
- [x] 4.6 Update Time row: "9:00 AM GMT+8"
- [x] 4.7 Update Tickets row: "Starting at $99"
- [x] 4.8 Style map placeholder (600x732px) with "EMBEDDED MAP" text

## 5. Tickets Section

- [x] 5.1 Update section heading styling
- [x] 5.2 Implement 2-column grid for ticket cards (520px width each)
- [x] 5.3 Create General Admission card ($99, "Full conference access")
- [x] 5.4 Create Student card ($25, "Full conference access")
- [x] 5.5 Add "Are you a Student?" label with "APPLY FOR DISCOUNT" link
- [x] 5.6 Style ticket icons (rightmost position)
- [x] 5.7 Remove VIP tier from current implementation

## 6. Speakers Section

- [x] 6.1 Set section background to black
- [x] 6.2 Update heading with arrow icon aligned right
- [x] 6.3 Implement 4-column grid (380px cards, 40px gap)
- [x] 6.4 Style speaker cards (380x626px total, 400px image height)
- [x] 6.5 Apply grayscale filter to speaker images
- [x] 6.6 Update name typography (uppercase, multi-line, 136px height area)
- [x] 6.7 Style company name and title rows
- [x] 6.8 Position X (Twitter) icon at bottom-right of info area
- [x] 6.9 Add speaker data for all 4 speakers

## 7. Sponsors Section

- [x] 7.1 Set section background to white
- [x] 7.2 Add "TITLE SPONSORS" tier label (centered, uppercase)
- [x] 7.3 Display Sunrise logo (400x168px container)
- [x] 7.4 Add "GOLD SPONSORS" tier label
- [x] 7.5 Display Gold sponsor logos in row (1400px width, 320px per logo)
- [x] 7.6 Add additional sponsor tier with 3 logos
- [x] 7.7 Add third sponsor row matching Figma layout
- [x] 7.8 Remove "Become a Sponsor" CTA if not in Figma

## 8. FAQ Section

- [x] 8.1 Update section background to white
- [x] 8.2 Style section heading
- [x] 8.3 Update FAQ items to match Figma content:
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
- [x] 8.4 Style expanded answer area with full width (800px)
- [x] 8.5 Style expand/collapse icons (arrow rotation)

## 9. Getting There Section

- [x] 9.1 Set section background to black
- [x] 9.2 Update heading typography
- [x] 9.3 Style "Nearest Airport" row with 2-column layout
- [x] 9.4 Style "Accommodations" row with hotel name and details link

## 10. Footer CTA Section

- [x] 10.1 Set section background to black
- [x] 10.2 Add "Don't miss" subtitle (white/60 opacity)
- [x] 10.3 Style "SOLANA ACCELERATE" heading (gradient text)
- [x] 10.4 Add "Limited tickets available" button with arrow
- [x] 10.5 Add Hong Kong Chinese characters background ("香港") from node
      `7408:14555`
- [x] 10.6 Position background element correctly (1464x823px at bottom)

## 11. Responsive Adaptations

- [x] 11.1 Test and adjust Hero section for tablet (md) and mobile (sm)
- [x] 11.2 Test and adjust Event Details for smaller screens
- [x] 11.3 Stack Tickets cards vertically on mobile
- [x] 11.4 Reduce Speakers grid to 2-col (md) and 1-col (sm)
- [x] 11.5 Wrap Sponsor logos on smaller screens
- [x] 11.6 Ensure FAQ accordion works at all breakpoints
- [x] 11.7 Stack Getting There rows on mobile

## 12. Quality Assurance

- [x] 12.1 Run `pnpm lint` and fix any issues
- [x] 12.2 Run `pnpm check-types` and fix any type errors
- [x] 12.3 Visual comparison against Figma design at 1920px
- [x] 12.4 Test all interactive elements (nav links, accordion, buttons)
- [x] 12.5 Verify all images load correctly
- [x] 12.6 Test responsive behavior at 768px and 375px
- [x] 12.7 Run `pnpm build` to verify production build succeeds

## 13. Design Review & Polish

- [x] 13.1 Hero: Get tickets button needs correct gradient border
- [x] 13.2 Hero: Get tickets should open popup modal with same functionality as
      `/Users/karambit/Sites/solana-com-breakpoint/components/LumaIframe/index.tsx`
- [x] 13.3 Hero: Fix aspect ratio for `apps/accelerate/public/images/dots.svg` -
      dots aren't round and too stretched
- [x] 13.4 All: Fix all white backgrounds - should only be dark theme
- [x] 13.5 All: Ensure all styles are appropriate for dark theme
- [x] 13.6 Event: EventDetailRow label needs to match design
- [x] 13.7 Tickets: Borders and colors need to match design
- [x] 13.8 Tickets: Solana logo needs to be exported and positioned right on
      desktop only (hide for others)
- [x] 13.9 Speakers: Fix spacing issues
- [x] 13.10 Speakers: Fix layout of text and icon
- [x] 13.11 Sponsors: Update to match design in Figma
- [x] 13.12 FAQ: Accordion buttons need to match design and be exported from
      Figma
- [x] 13.13 FAQ: All font colors and sizes need to match design
- [x] 13.14 Getting there: Labels need to be multicolor as per design
- [x] 13.15 Getting there: Match font colors and styles
- [x] 13.16 CTA: Match font colors and styles
- [x] 13.17 CTA: Fix visibility of
      `apps/accelerate/public/images/hk-characters.png`
- [x] 13.18 Hero: Fix z-index for `apps/accelerate/public/images/dots.svg` -
      needs to be between skyline and swoosh
- [x] 13.19 Event details: EventDetailRow label needs to be gradient and match
      design
- [x] 13.20 Event details: EventDetailRow value is white and subvalue is green
- [x] 13.21 Tickets: Solana logo on RHS needs to be exported and positioned
      right on desktop only (hide for others) - check design in Figma
- [x] 13.22 Tickets: Borders need to be green and purple for different boxes -
      check design in Figma
- [x] 13.23 Tickets: TicketCard title needs to be green and purple respectively
      for different boxes - check design in Figma
- [x] 13.24 Speakers: speakers.map needs overflow and horizontal scroll with
      correct spacing between cards
- [x] 13.25 Speakers: XIcon needs to be right aligned on card bottom right
- [x] 13.26 Sponsors: Logos are missing from
      `apps/accelerate/public/images/sponsors` - check design in Figma
- [x] 13.27 Sponsors: Background image is missing - check design in Figma
- [x] 13.28 Sponsors: Become a sponsor button is missing - check design in Figma
- [x] 13.29 FAQ: `{item.question}` font color should be grey and font weight
      needs to be corrected
- [x] 13.30 FAQ: `{item.question}` on dropdown active needs to be green
- [x] 13.31 FAQ: Icon action button should be exported from Figma and
      implemented in place of inline SVG in FAQAccordionItem
- [x] 13.32 All: Section title colors are grey not white
- [x] 13.33 Getting there: Labels should be gradient color
- [x] 13.34 Getting there: subValue text should always be green including links
- [x] 13.35 FooterCTA: `apps/accelerate/public/images/hk-characters.png` needs
      to be visible and sized correctly behind text
- [x] 13.36 All: Get Tickets button icon needs to be exported and reused in
      Hero, Tickets, and FooterCTA section buttons
