# Production Quality Gates

Apply every relevant gate before handoff. Treat a beautiful screenshot with
broken semantics, slow loading, or incomplete states as unfinished.

For a formal UI review, retrieve the latest Vercel Web Interface Guidelines at
`https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md`
when network access is available. Apply compatible current rules in addition to
this offline baseline. Let repository conventions and explicit user requirements
override generic stylistic advice, never accessibility or safety.

## Brand and concept

- [ ] Reinspect the current homepage, tokenization page, target route, global
      tokens, and shared primitives.
- [ ] State a clear audience, page job, thesis, primary action, and signature.
- [ ] Use Diatype, DSemi, semantic colors, shared framing, and the selected
      rhythm unless an approved exception is documented.
- [ ] Keep one declared accent strategy, one radius rule, and one surface
      grammar.
- [ ] Avoid a layout that could be moved unchanged to an unrelated crypto page.
- [ ] Use real approved copy, logos, partners, metrics, dates, and testimonials.
- [ ] Make every visual decoration support subject, hierarchy, state, or mood.

## Semantics and accessibility

- [ ] Use one `h1`, hierarchical headings, landmarks, and a usable skip path to
      main content through the app shell.
- [ ] Use links for navigation and buttons for actions. Do not attach click
      behavior to non-interactive elements.
- [ ] Give icon-only controls accessible names and decorative icons
      `aria-hidden="true"`.
- [ ] Give form controls visible labels or accessible names, meaningful `name`,
      correct `type`, `inputMode`, and appropriate `autoComplete`.
- [ ] Keep labels and controls in one practical hit target. Never block paste.
- [ ] Expose async status through visible text and an appropriate live region.
- [ ] Keep visible `:focus-visible` states. Never remove outlines without a
      clear replacement.
- [ ] Verify keyboard order, modal focus management, Escape behavior, and focus
      return.
- [ ] Preserve browser zoom and use comfortable touch targets.
- [ ] Meet WCAG AA contrast, including hover, focus, disabled, selection, text
      over media, and ghost actions.

## Responsive layout and content

- [ ] Render at narrow mobile, tablet, laptop, 1440px, and a wider viewport.
- [ ] Transform composition at breakpoints; do not merely shrink type.
- [ ] Prevent horizontal overflow and account for full-bleed media and safe
      areas.
- [ ] Use grid or flex layout before JavaScript measurements.
- [ ] Let flex children shrink with `min-width: 0` where needed.
- [ ] Handle short, average, long, translated, and missing content without
      clipping or overlapping.
- [ ] Keep desktop CTA labels on one line and make mobile wrapping intentional.
- [ ] Balance or pretty-wrap display headings without forcing fragile manual
      breaks across locales.
- [ ] Keep anchored headings visible below sticky chrome with scroll margin.

## Interaction and state

- [ ] Implement hover, active, focus, disabled, loading, empty, error, success,
      and retry behavior relevant to each control or data surface.
- [ ] Increase rather than reduce visual clarity on hover, active, and focus.
- [ ] Keep destructive actions confirmable or recoverable.
- [ ] Reflect meaningful filters, tabs, pagination, and expanded state in the
      URL when deep linking benefits the visitor.
- [ ] Keep animations interruptible and responsive to input.
- [ ] Honor `prefers-reduced-motion`; provide a quiet but complete experience.
- [ ] Animate transform and opacity when possible and never use
      `transition: all`.
- [ ] Justify perpetual animation and stop it when offscreen when practical.
- [ ] Keep motion, pointer tracking, and scroll progress out of React render
      state when a motion value or browser primitive is appropriate.

## Images, fonts, and performance

- [ ] Give images dimensions or stable aspect ratios to prevent layout shift.
- [ ] Prioritize only critical above-fold media and lazy-load below-fold media.
- [ ] Supply correct responsive `sizes`, useful alt text, and empty alt text for
      decoration.
- [ ] Preserve font preloading/display behavior and avoid new remote font
      dependencies.
- [ ] Supply static fallbacks for animated backgrounds, canvas, and video.
- [ ] Avoid layout reads during render and batch DOM reads and writes.
- [ ] Virtualize or progressively reveal genuinely large collections.
- [ ] Keep client components, animation libraries, and media payloads scoped to
      the experience that needs them.
- [ ] Check for avoidable cumulative layout shift, sluggish interaction, and
      oversized above-fold assets.

## Locale, hydration, and copy

- [ ] Put user-facing copy in the English source catalog and use ICU variables
      or rich messages instead of concatenated fragments.
- [ ] Format locale-sensitive dates, times, numbers, and currency with `Intl` or
      repository helpers.
- [ ] Keep brand names, code tokens, and identifiers stable where translation
      would corrupt them.
- [ ] Avoid server/client time, random, or browser-state mismatches.
- [ ] Use `suppressHydrationWarning` only for an unavoidable, understood case.
- [ ] Use active voice, sentence case consistent with nearby pages, and specific
      action labels.
- [ ] Make errors identify what happened and the next useful action.
- [ ] Re-read every visible string and remove vague claims, filler, invented
      facts, and inconsistent terminology.

## Repository verification

Run the narrowest useful commands from the repository root:

```bash
pnpm --filter solana-com lint
pnpm --filter solana-com check-types
pnpm --filter solana-com test
```

Add focused tests or browser checks for new behavior. Use a production build
when the change affects routing, rendering boundaries, metadata, image handling,
or build-time behavior. Do not claim a check passed when it did not run.

## Review output

For audit-only work, group actionable findings by file:

```text
path/to/file.tsx:42 - high - action is a div with no keyboard semantics - use a button
path/to/file.tsx:88 - medium - accent diverges from the page palette - use the selected semantic accent
```

Order findings by user impact. Skip generic praise and low-value preference
comments. State `No material findings` when the inspected scope passes.
