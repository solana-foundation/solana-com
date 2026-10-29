/**
 * Type roles for the Here For (/mutuals) surfaces. Every text element picks
 * one role so each kind of element keeps its own size and weight everywhere.
 *
 * Mono ladder: eyebrow 16 → label 14 bold → field 12 → control 12 bold →
 * tag 11 bold → caption 11.
 */
export const hereForType = {
  /** Page and section eyebrows above headings. */
  eyebrow: "type-eyebrow",
  /** Headers inside panels, rails and dialogs. */
  label: "font-mono text-2xs font-bold uppercase tracking-[0.08em]",
  /** Form field labels, stats and status lines. */
  field: "font-mono text-button-small uppercase tracking-[0.08em]",
  /** Row toggles and compact buttons. */
  control: "font-mono text-button-small font-bold uppercase tracking-[0.08em]",
  /** Chips, badges and reason tags. */
  tag: "font-mono text-3xs font-bold uppercase tracking-[0.06em]",
  /** Captions, legends, hints and pagination meta. */
  caption: "font-mono text-3xs uppercase tracking-[0.08em]",
  /** Inline numeric counts beside names. */
  count: "font-mono text-3xs",

  /** Hero and panel lead copy. */
  lead: "text-p-large",
  /** Section intros that step up on desktop. */
  intro: "text-paragraph antialiased md:text-lg",
  /** Standard body copy. */
  body: "text-paragraph",
  /** Hints, empty states and post previews. */
  small: "text-2xs",

  /** A handle given emphasis in a card or result row. */
  name: "text-md font-bold",
  /** A handle in a dense list row or chip. */
  nameCompact: "font-sans text-2xs normal-case tracking-normal",
  /** Text the reader types or has entered. */
  input: "text-lg",
  /** Large numbers: stats and scores. */
  stat: "font-display text-2xl leading-none",
  /** Codes the reader copies. */
  code: "font-mono text-2xl font-bold tracking-[0.08em]",
} as const;
