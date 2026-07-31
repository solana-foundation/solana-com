# Solana Web Brand System

Use this as a calibrated snapshot, not a substitute for repository inspection.
It was derived from `main` at commit `d7ddd692c3d6c19960b4894cb5234216b9a3b0b5`
on 2026-07-31. Re-read the source files before implementation and let current
code win.

## Source hierarchy

Inspect these sources in order:

1. Target route and its nearest current peer
2. `apps/web/src/app/[locale]/home.tsx` and `apps/web/src/components/index/`
3. `apps/web/src/app/[locale]/solutions/tokenization/` and the imported
   `apps/web/src/components/solutions/*.v2.tsx` modules
4. `apps/web/src/app/globals.css`, `apps/web/tailwind.config.js`,
   `apps/web/src/fonts/fonts.css`, and `apps/web/src/scss/_solana.scss`
5. `apps/web/src/component-library/container.tsx`, shared button components,
   `packages/ui`, and `packages/ui-chrome`
6. `packages/i18n/messages/web/en/common.json` and route metadata helpers

Use semantic classes and shared components when they express the intended
design. Avoid copying long Tailwind strings when a current `nd-*` class already
owns the token.

## Precedent anatomy

### Homepage

Treat the homepage as the broad ecosystem precedent:

- Open with a large left-aligned thesis over an art-directed animated field with
  a static image fallback.
- Establish trust through real logos, network performance, projects, events,
  current news, videos, and community rather than unsupported marketing claims.
- Alternate immersive moments with modular grids, carousels, dividers, and
  quieter proof sections.
- Use strong typographic hierarchy, a white primary CTA, restrained translucent
  surfaces, and subject-specific color moments.
- Keep one coherent black canvas while varying pace and density by section.

### Tokenization

Treat `/solutions/tokenization` as the focused solution-story precedent:

- Use a product-specific accent (`#CA9FF5` in the snapshot) within the common
  dark foundation.
- Turn the hero into a proposition plus useful proof: key statistics and a
  relevant report action occupy the lower frame.
- Move from explanation to ecosystem evidence, implementation products, real
  builders, current news, and adjacent next steps.
- Reuse a consistent immersive section rhythm and max-width frame while changing
  layout modes to avoid repetition.
- Pair animated backgrounds with reliable fallbacks and keep content usable
  without motion.

Neither precedent is a page template. Preserve its grammar: confident type,
credible content, disciplined dark surfaces, purposeful motion, responsive
composition, and a clear action hierarchy.

## Fixed foundation

### Typography

- Use `Diatype` for display and body copy through `font-brand` or inherited body
  styling.
- Use `DSemi` through `font-brand-mono` for data, compact technical labels,
  code-adjacent utility text, and occasional uppercase metadata.
- Use the shipped weights 200, 300, 400, 500, and 700. Keep
  `font-display: swap`.
- Do not introduce a generic web font or a decorative serif into a core page.
  Treat other bundled faces such as Monument as campaign-specific, not default.
- Prefer the shared responsive classes in `globals.css`:

| Role             | Snapshot scale | Typical use                    |
| ---------------- | -------------- | ------------------------------ |
| `nd-heading-2xl` | 40 / 56 / 88px | Primary hero statement         |
| `nd-heading-xl`  | 40 / 48 / 80px | Large editorial statement      |
| `nd-heading-l`   | 32 / 40 / 64px | Main section heading           |
| `nd-heading-m`   | 18 / 32 / 36px | Feature or subsection heading  |
| `nd-body-xl`     | 18 / 24px      | Hero or section lead           |
| `nd-body-l`      | 16 / 18 / 20px | Prominent body copy            |
| `nd-body-m`      | 16 / 18px      | Actions and standard body copy |
| `nd-body-s`      | 14 / 16px      | Supporting labels and metadata |

The classes also encode line-height and tracking. Use their current definitions
instead of treating this table as a parallel token source. Balance or
pretty-wrap large headings and test translated expansion.

### Color

Use the semantic `nd-*` colors from Tailwind before raw values:

| Token                       | Snapshot value | Role                                  |
| --------------------------- | -------------- | ------------------------------------- |
| `nd-bg`, `nd-inverse`       | `#000000`      | Page canvas and inverse surfaces      |
| `nd-high-em-text`, `nd-cta` | `#FFFFFF`      | Primary text and primary CTA          |
| `nd-mid-em-text`            | `#ABABBA`      | Secondary copy                        |
| `nd-mid-em-text-alpha`      | `#FFFFFFA3`    | Translucent secondary copy            |
| `nd-border-light`           | `#ECE4FD1F`    | Dividers and quiet surfaces           |
| `nd-border-prominent`       | `#ECE4FD33`    | Interactive or stronger borders       |
| `nd-border-hovered`         | `#ECE4FD52`    | Hovered boundary                      |
| `nd-highlight-lavendar`     | `#CA9FF5`      | Lavender accent; keep config spelling |
| `nd-highlight-blue`         | `#6693F7`      | Blue accent                           |
| `nd-highlight-gold`         | `#FFC526`      | Gold accent                           |
| `nd-highlight-orange`       | `#F48252`      | Orange accent                         |
| `nd-highlight-green`        | `#55E9AB`      | Green accent                          |
| `nd-highlight-lime`         | `#CFF15E`      | Lime accent                           |

Select one dominant accent family based on the subject. Extend it with tints or
transparent variants. Add supporting highlight colors when they encode real
categories, data, or illustration logic; do not introduce unrelated accents
section by section. Use the multi-stop Solana logo gradient only when the brand
gradient has meaning; a purple-blue glow is not automatically brand aligned
merely because Solana uses purple.

Keep primary text at full white, secondary copy near the shared muted tone, and
boundaries subtle. Verify contrast for every text/surface pair, selection color,
focus state, overlay, and text over media.

### Layout and rhythm

- Frame main content at `max-w-screen-2xl` / 1440px.
- Use shared responsive gutters: 20px mobile, 32px from `md`, and 40px from
  `xl`.
- Treat 768px, 1280px, and the custom 1440px `2xl` breakpoint as deliberate
  composition changes, not only font-size changes.
- Choose a primary vertical rhythm for the page:
  - Use the compact homepage rhythm (`py-10` and its component-specific
    extensions) for denser modular sequences.
  - Use the solution-story rhythm (64 / 112 / 160px) for immersive narrative
    sections.
- Mix rhythms only to create an intentional tempo change. Do not assign random
  padding to every section.
- Let full-bleed backgrounds and media extend beyond the content frame while
  preserving aligned copy and controls.

### Shapes, borders, and surfaces

- Use `rounded-xl` as the common media/card surface, `rounded-2xl` for a major
  grouped container, and full pills for actions.
- Keep a documented radius rule. Do not scatter unrelated corner sizes.
- Prefer thin translucent borders, dividers, negative space, and background
  contrast over heavy shadows.
- Use backdrop blur sparingly where layering is real. Do not glass every card.
- Use cards only for meaningful grouping, navigation, controls, reports, or
  bounded media.

### Actions

- Use a white-on-black or black-on-white pill as the primary CTA, commonly 48px
  tall on larger viewports.
- Use the shared button primitives and their focus behavior.
- Use the inverse circular icon treatment when it strengthens a primary action;
  do not attach it mechanically to every button.
- Use an outlined/translucent secondary action and a text link for tertiary
  navigation.
- Keep labels specific, consistent, and on one line at desktop. Render
  navigation as links and operations as buttons.

### Media, iconography, and motion

- Prefer real brand assets, product visuals, documentary photography, data
  graphics, and subject-derived art direction over generic crypto imagery.
- Use `next/image` with intrinsic dimensions or `fill` plus `sizes`. Prioritize
  critical above-fold media and lazy-load below-fold assets.
- Give informative media useful alt text and decorative media `alt=""`.
- Reuse the existing icon family and `@solana-com/ui-chrome/icons`. Do not mix
  icon styles or hand-draw a new family for one page.
- Animate to explain hierarchy, progress, state, scale, or narrative. Favor one
  orchestrated signature over constant unrelated movement.
- Use `SafeUnicornScene` only when immersive artwork justifies it. Supply a
  stable fallback and keep content independent of the canvas.
- Animate compositor-friendly properties where practical, make motion
  interruptible, and honor reduced-motion preferences.

## Creative range

Keep the following open to the brief:

- asymmetrical, split, editorial, centered manifesto, pinned, or data-led hero
- restrained or cinematic motion
- dense technical proof or spacious brand storytelling
- bespoke interactive explainers, charts, filters, calculators, video, and
  progressive disclosure
- grids, lists, timelines, carousels, comparison structures, or full-bleed media
  when they match the content

Make one design decision that is memorable and defensible in the subject's own
world. Keep every other decision coherent with it and with the fixed foundation.
