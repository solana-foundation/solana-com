/**
 * Type roles for the Here For (/mutuals) surfaces. Every text element picks
 * one role so each kind of element keeps its own size and weight everywhere.
 *
 * Each surface leads the eye in the same order: a heading or handle in large
 * regular sans, numbers in BP26 display, the people you act on in bold sans,
 * supporting copy in regular secondary sans, then mono for structure (labels,
 * controls, tags, captions). Bold sans marks the people; bold mono marks what
 * you press.
 *
 * Roles set family, weight and leading explicitly because the global button
 * reset would otherwise make anything inside a <button> bold mono at 0.9.
 *
 * Mono ladder: eyebrow 16 → label 12 → control 12 bold → tag 11 bold →
 * caption 11.
 */
export const hereForType = {
  /** Page and section eyebrows above headings. */
  eyebrow: "type-eyebrow",
  /** Headers inside panels and rails, form labels and status lines. */
  label:
    "font-mono text-button-small font-normal uppercase leading-snug tracking-[0.08em]",
  /** Row toggles and compact buttons. */
  control: "type-button-small",
  /** Chips, badges and reason tags. */
  tag: "type-caption",
  /** Captions, legends, hints, units and pagination meta. */
  caption:
    "font-mono text-3xs font-normal uppercase leading-snug tracking-[0.08em]",

  /** Hero and panel lead copy. */
  lead: "type-p-large",
  /** Standard body copy and section intros. */
  body: "type-paragraph",
  /** Hints, empty states and reasons under a name. */
  small:
    "font-sans text-2xs font-normal leading-snug normal-case tracking-normal",

  /** The person a row is about: result rows and your picks. */
  title: "type-p-large-bold normal-case",
  /** A person to act on in a card or chip-sized row. */
  name: "font-sans text-lg font-bold leading-snug normal-case tracking-normal",
  /** A person listed for reference, such as someone's 3. */
  item: "font-sans text-lg font-normal leading-snug normal-case tracking-normal",
  /** A handle in a dense chip or search result. */
  nameCompact:
    "font-sans text-2xs font-normal leading-none normal-case tracking-normal",
  /** Text the reader types or has entered. */
  input: "font-sans text-lg font-normal",

  /** Headline numbers: a person's stats. */
  statLarge: "font-display text-4xl leading-none",
  /** Inline numbers: map totals and scores. */
  stat: "font-display text-2xl leading-none",
  /** Codes the reader copies. */
  code: "font-mono text-2xl font-bold tracking-[0.08em]",
} as const;
