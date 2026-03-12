## ADDED Requirements

### Requirement: Hero Section Display

The landing page SHALL display a hero section with event branding, location,
title, and primary call-to-action.

#### Scenario: Hero section renders correctly

- **WHEN** the page loads
- **THEN** the hero section displays:
  - Accelerate logo in navigation (197x100px)
  - Navigation links: Speakers, Sponsors, FAQ, Get Tickets
  - Date and location text ("February 11 / Hong Kong") in green (#19FB9B)
  - Main title "Solana Accelerate APAC" in light gray (#D2D2D2), Space Grotesk
    Light 84px with `font-family: "Space Grotesk"`
  - Gradient CTA button "Get Tickets" (purple-to-green gradient, 480x66px)
  - Hong Kong skyline background image (centered)
  - Decorative elements: purple glow, wave lines, dots pattern, pills

#### Scenario: Hero section is responsive

- **WHEN** viewport width is less than 1024px
- **THEN** the hero section adapts with smaller typography and stacked mobile
  navigation

---

### Requirement: Event Details Section Display

The landing page SHALL display event details including date, venue, time, ticket
pricing, and venue map.

#### Scenario: Event details render correctly

- **WHEN** the user views the Event Details section
- **THEN** the section displays in a 2-column layout:
  - Left column (800px): Date, Venue (with address), Time, Tickets starting
    price
  - Right column (600px): Map placeholder with "EMBEDDED MAP" text
  - Row labels aligned at 360px offset

#### Scenario: Event details show correct information

- **WHEN** the Event Details section is visible
- **THEN** it shows:
  - Date: "February 11, 2026"
  - Venue: "Hong Kong Convention and Exhibition Centre" with address "1號 Expo
    Dr, Wan Chai, Hong Kong"
  - Time: "9:00 AM GMT+8"
  - Tickets: "Starting at $99"

---

### Requirement: Tickets Section Display

The landing page SHALL display available ticket tiers with pricing and purchase
options.

#### Scenario: Ticket tiers render correctly

- **WHEN** the user views the Tickets section
- **THEN** two ticket tiers are displayed in a 2-column grid:
  - General Admission: $99, "Full conference access"
  - Student: $25, "Full conference access" with "APPLY FOR DISCOUNT" link

#### Scenario: Ticket cards include purchase action

- **WHEN** a ticket card is displayed
- **THEN** it includes a ticket icon and clickable area for purchase

---

### Requirement: Speakers Section Display

The landing page SHALL display featured speakers with photos, names, titles, and
social links.

#### Scenario: Speaker grid renders correctly

- **WHEN** the user views the Speakers section
- **THEN** speakers are displayed in a 4-column grid (380px card width, 40px
  gap):
  - Each card shows: grayscale photo (400px height), name (uppercase,
    multi-line), company, title, X (Twitter) link

#### Scenario: Featured speakers are displayed

- **WHEN** the Speakers section loads
- **THEN** it shows the following speakers:
  - Lily Liu, President, Solana Foundation
  - Chris Chung, CEO & Co-Founder, Titan
  - Shina Foo, Head of Growth, Perena
  - Shawn Chain, CEO, Singapore Gulf Bank

---

### Requirement: Sponsors Section Display

The landing page SHALL display sponsor logos organized by sponsorship tier.

#### Scenario: Sponsor tiers render correctly

- **WHEN** the user views the Sponsors section
- **THEN** sponsors are grouped by tier:
  - "TITLE SPONSORS" with Sunrise logo (400px width container)
  - "GOLD SPONSORS" with 4 logos in a row (1400px width, 320px per logo)
  - Additional sponsor rows as defined in design

#### Scenario: Sponsor logos link to websites

- **WHEN** a sponsor logo is clicked
- **THEN** it opens the sponsor's website in a new tab

---

### Requirement: FAQ Section Display

The landing page SHALL display frequently asked questions in an expandable
accordion format.

#### Scenario: FAQ accordion functions correctly

- **WHEN** the user clicks on a FAQ question
- **THEN** the answer expands below the question with smooth animation
- **AND** clicking again collapses the answer

#### Scenario: FAQ content matches design

- **WHEN** the FAQ section loads
- **THEN** it includes questions about:
  - What's included in the ticket
  - Consensus ticket access
  - Dress code
  - Ticket options
  - Refund policy
  - Accommodation recommendations
  - Parking availability
  - Accessibility information
  - Age restrictions
  - Recording/Photography policy
  - Contact information

---

### Requirement: Getting There Section Display

The landing page SHALL display travel information including airport and
accommodation details.

#### Scenario: Travel info renders correctly

- **WHEN** the user views the Getting There section
- **THEN** it displays:
  - "Nearest Airport": Hong Kong International Airport (HKG)
  - "Accommodations": Grand Hyatt Hong Kong with discounted rates link

---

### Requirement: Footer CTA Section Display

The landing page SHALL display a final call-to-action encouraging ticket
purchase.

#### Scenario: Footer CTA renders correctly

- **WHEN** the user scrolls to the footer CTA section
- **THEN** it displays:
  - "Don't miss" subtitle
  - "SOLANA ACCELERATE" heading with gradient text
  - "Limited tickets available" button
  - Hong Kong Chinese characters ("香港") as subtle background

---

### Requirement: Design Token Consistency

The landing page SHALL use consistent design tokens from the Figma design
system.

#### Scenario: Typography matches design

- **WHEN** any text is rendered
- **THEN** it uses the correct font family and weight:
  - Headlines: Space Grotesk (Light 300, Regular 400, SemiBold 600) with
    `font-family: "Space Grotesk"`
  - Body text: ABC Diatype (Light 300, Regular 400)
- **AND** all hero titles, headings (h1, h2), buttons, and navigation text MUST
  explicitly use `font-family: "Space Grotesk"`

#### Scenario: Colors match design

- **WHEN** any colored element is rendered
- **THEN** it uses the correct color tokens:
  - Purple (G1): #9945FF
  - Green (G3): #19FB9B
  - Blue (G2): #2A88DE
  - Grays: #B3B2BC, #838191, #3B3B40, #D2D2D2, #3D3D3D

---

### Requirement: Responsive Layout

The landing page SHALL adapt layout for different screen sizes while maintaining
design integrity.

#### Scenario: Desktop layout (1920px)

- **WHEN** viewport width is 1920px or greater
- **THEN** all sections display at full Figma-specified dimensions

#### Scenario: Tablet layout (768px-1023px)

- **WHEN** viewport width is between 768px and 1023px
- **THEN** multi-column layouts reduce to fewer columns with proportional
  spacing

#### Scenario: Mobile layout (below 768px)

- **WHEN** viewport width is below 768px
- **THEN** layouts become single-column and navigation collapses to mobile menu

---

### Requirement: Asset Integration

The landing page SHALL use properly exported and optimized assets from the Figma
design.

#### Scenario: Vector assets are SVG

- **WHEN** decorative vector graphics are loaded
- **THEN** they are in optimized SVG format for crisp rendering at all sizes

#### Scenario: Speaker images are optimized

- **WHEN** speaker headshots are loaded
- **THEN** they are PNG format, minimum 400x400px, displayed with grayscale
  filter

#### Scenario: Sponsor logos maintain quality

- **WHEN** sponsor logos are loaded
- **THEN** they are SVG format (preferred) or high-resolution PNG, displayed at
  tier-appropriate sizes
