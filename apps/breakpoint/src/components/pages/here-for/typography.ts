/**
 * Type roles for the Here For (/mutuals) surfaces. Every text element picks
 * one role so each kind of element keeps its own size and weight everywhere.
 *
 * Weight carries meaning: bold is reserved for things you press (controls,
 * tags); headings, names and copy stay regular and lean on size and colour.
 * Roles set weight and leading explicitly because the global button reset
 * would otherwise make anything inside a <button> bold mono at 0.9 leading.
 *
 * Mono ladder: eyebrow 16 → label 12 → control 12 bold → tag 11 bold →
 * caption 11.
 */
export const hereForType = {
  /** Page and section eyebrows above headings. */
  eyebrow: "type-eyebrow",
  /** Headers inside panels and rails, form labels, stats and status lines. */
  label:
    "font-mono text-button-small font-normal uppercase leading-snug tracking-[0.08em]",
  /** Row toggles and compact buttons. */
  control: "type-button-small",
  /** Chips, badges and reason tags. */
  tag: "type-caption",
  /** Captions, legends, hints, counts and pagination meta. */
  caption:
    "font-mono text-3xs font-normal uppercase leading-snug tracking-[0.08em]",

  /** Hero and panel lead copy. */
  lead: "type-p-large",
  /** Standard body copy and section intros. */
  body: "type-paragraph",
  /** Hints, empty states and post previews. */
  small:
    "font-sans text-2xs font-normal leading-snug normal-case tracking-normal",

  /** A handle given emphasis in a card or result row. */
  name: "font-sans text-lg font-normal leading-snug normal-case tracking-normal",
  /** A handle in a dense list row or chip. */
  nameCompact:
    "font-sans text-2xs font-normal leading-none normal-case tracking-normal",
  /** Text the reader types or has entered. */
  input: "font-sans text-lg font-normal",
  /** Large numbers: stats and scores. */
  stat: "font-display text-2xl leading-none",
  /** Codes the reader copies. */
  code: "font-mono text-2xl font-bold tracking-[0.08em]",
} as const;
