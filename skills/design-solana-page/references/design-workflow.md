# Design and Implementation Workflow

## 1. Infer the brief

Resolve these signals before choosing a layout:

- page kind: solution, developer entry point, launch, event, editorial,
  directory, tool, or campaign
- audience: builder, institution, consumer, creator, ecosystem team, or mixed
- single job: what the visitor should understand or do next
- trust needs: proof, partners, network data, documentation, case studies, or
  risk disclosures
- content reality: approved copy, live data, assets, localization, and empty or
  loading conditions
- reference intent: which characteristics to preserve rather than which pixels
  to imitate

Ask one question only if the missing answer changes the page's design language,
functionality, or content architecture. Otherwise state a reasonable assumption
and proceed.

## 2. Form the design read

Use this compact working note:

```text
Page: <kind> for <audience>
Job: <single primary outcome>
Thesis: <one sentence the hero must establish>
Brand mode: core | campaign extension
Variance / motion / density: <1-10> / <1-10> / <1-10>
Signature: <one subject-derived memorable element>
Foundation: <tokens, components, and precedent being preserved>
Creative range: <composition, accent, interaction, and media choices>
```

Treat the three dials as reasoning aids, not user-facing settings:

- `VARIANCE` controls symmetry, grid disruption, and compositional surprise.
- `MOTION` controls the depth of transitions, scroll choreography, and ambient
  behavior.
- `DENSITY` controls how much information appears per viewport.

Use these starting points, then adapt to the actual brief:

| Page type                      |      Variance |           Motion |       Density |
| ------------------------------ | ------------: | ---------------: | ------------: |
| Focused solution story         |             6 |                5 |             4 |
| Developer landing page         |             5 |                4 |             5 |
| Launch, event, or campaign     |             8 |                7 |             3 |
| Editorial or research feature  |             7 |                4 |             3 |
| Directory, comparison, or tool |             4 |                3 |             7 |
| Targeted evolution             | Match current | Current + 0 or 1 | Match current |

If motion cannot be implemented and verified reliably, lower the motion dial
instead of describing an experience that the code does not deliver.

## 3. Explore before coding

Create two or three materially different composition options in short prose or
small wireframes. Vary the information model, not merely alignment.

For each option, check:

- Does the hero express the subject through content, visual behavior, or useful
  interaction?
- Does the structure reflect how the audience decides or learns?
- Can the same layout be pasted into an unrelated blockchain site unchanged?
- Is the signature grounded in the subject rather than a fashionable effect?
- Does the implementation effort match the value of the idea?

Choose one direction. Define its color role, type roles, layout logic, section
rhythm, surface rule, CTA hierarchy, motion purpose, and signature before
writing UI code.

## 4. Plan the narrative and functions

Sequence sections around user questions. A focused solution page often needs:

1. What is the proposition?
2. Why should the visitor believe it?
3. How does it work or what can they build?
4. Who already uses it?
5. What should they do next?

Change or remove any step that does not serve the actual page. Do not force a
homepage or tokenization-shaped sequence.

Define interactive behavior and all states before implementation:

- default, hover, active, focus, and disabled
- loading, empty, error, success, and partial data
- modal, drawer, carousel, tab, filter, or expanded state
- reduced motion and no-canvas fallback
- long translated text, missing media, and narrow viewport behavior

Make URL-visible state deep-linkable when it changes what the page shows, such
as filters, tabs, and pagination.

## 5. Build in passes

### Pass A: semantic skeleton

- Establish metadata, one `h1`, landmarks, heading hierarchy, content order,
  real links, real buttons, and data ownership.
- Add English source messages and use semantic IDs for repeated content.
- Keep server and client boundaries narrow.

### Pass B: brand foundation

- Apply the shared container, gutters, typography classes, semantic colors,
  section rhythm, radius system, CTA hierarchy, and focus behavior.
- Reuse current component-library pieces where their semantics and visuals fit.
- Keep a declared accent strategy and one surface grammar.

### Pass C: signature and motion

- Implement the one memorable element with a static fallback.
- Add motion only where it communicates hierarchy, feedback, state, scale, or
  narrative sequence.
- Keep animations interruptible and remove listeners or timelines on cleanup.

### Pass D: real-world states

- Connect real assets and data.
- Exercise long strings, no data, failed data, slow media, keyboard navigation,
  touch input, and reduced motion.
- Prevent client-side fallbacks from causing layout jumps or hydration errors.

## 6. Critique twice

Before implementation, replace any default choice that ignores the brief:

- a centered dark hero with an arbitrary purple-blue mesh
- three equal feature cards regardless of content
- glassmorphism on every surface
- decorative numbering that implies no real sequence
- meaningless monospace eyebrows or badges
- generic cube, coin, network-node, or astronaut imagery
- motion added only because a library is available

Purple, gradients, technical labels, cards, and centered heroes are not banned.
Use them when the Solana brand and page content make them the strongest choice,
not as automatic crypto styling.

After rendering, inspect screenshots from the whole page and the first viewport.
Fix the largest issue first:

1. broken behavior or accessibility
2. unclear thesis or action
3. weak hierarchy or responsive composition
4. off-brand type, color, or rhythm
5. inconsistent surfaces and states
6. decorative polish

Remove one accessory that competes with the signature or content.

## 7. Preserve architecture

- Keep route ownership in `apps/web` and inspect rewrites before changing public
  navigation.
- Use `@workspace/i18n`, `@workspace/ui`, and `@solana-com/ui-chrome` according
  to existing patterns.
- Reuse installed animation and component dependencies. Do not add a second
  design system, icon family, or styling architecture for a single page.
- Preserve Server Components where possible. Move only interactive leaves to the
  client.
- Prefer CSS grid and responsive layout primitives over JavaScript measurement.
- Avoid broad shared-component changes unless the new behavior truly belongs to
  every consumer. Validate all consumers when changing shared code.
