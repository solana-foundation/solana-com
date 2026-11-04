/**
 * The visuals' colour accents, from the panel's palette (../ui.ts:
 * `--tone-{purple,green,blue,amber}` with `-soft` and `-line`). AskVisual
 * sets the palette again on its root, same values, so a visual mounted
 * outside the panel keeps its colours. Class strings are literal so
 * Tailwind generates them.
 */
import type {
  AskEffectAction,
  AskNodeTone,
  VisualNode,
  VisualStep,
} from "@/lib/docs/ask/generative-ui/schema";
import { toneScope, type AskTone } from "../ui";

/**
 * Points `--tone` (text, arrows, marks), `--tone-soft` (fills) and
 * `--tone-line` (rings) at a tone for an element and its children; neutral
 * is the docs' greys.
 */
export const TONE_ACCENT: Record<AskNodeTone, string> = {
  ...toneScope,
  neutral:
    "[--tone:var(--sol-muted)] [--tone-soft:var(--sol-soft)] [--tone-line:var(--sol-line-strong)]",
};

/** A small pill in the element's tone: a card's type, a link's kind. */
export const tonePill =
  "inline-flex shrink-0 items-center rounded-full bg-[var(--tone-soft)] px-1.5 text-[11px] font-medium leading-[18px] text-[var(--tone)]";

/** "What changes" marks: + appears, • changes, → links, × closes. */
export const EFFECT_GLYPHS: Record<
  AskEffectAction,
  { glyph: string; className: string }
> = {
  reveal: { glyph: "+", className: "text-[var(--tone-green)]" },
  update: { glyph: "•", className: "text-[var(--tone-blue)]" },
  connect: {
    glyph: "→",
    className:
      "text-[var(--tone-purple)] group-data-[dir=rtl]/visual:-scale-x-100",
  },
  close: { glyph: "×", className: "text-[var(--tone-amber)]" },
};

/**
 * A step's tone: that of the first card it changes (a reveal, update or
 * close; else a card it links), or failing those the first card it lights
 * up. A step and the card it acts on then share a colour, which means the
 * card's kind. Purple without a model, for a card of no known kind, and for
 * a step that touches no card.
 */
export function stepTone(
  step: VisualStep,
  nodes: readonly VisualNode[] | undefined,
): AskTone {
  if (!nodes?.length) return "purple";
  const tones = new Map(nodes.map((node) => [node.id, node.tone]));
  const card = (id?: string) => (id && tones.has(id) ? id : undefined);
  const id =
    step.effects.find(
      (effect) => effect.action !== "connect" && card(effect.nodeId),
    )?.nodeId ??
    step.effects.find((effect) => card(effect.nodeId))?.nodeId ??
    step.touches.find((touched) => card(touched));
  const tone = id ? tones.get(id) : undefined;
  return !tone || tone === "neutral" ? "purple" : tone;
}

function mix(from: string, to: string, weight: number) {
  if (weight <= 0) return from;
  if (weight >= 1) return to;
  return `color-mix(in oklab, ${to} ${Math.round(weight * 100)}%, ${from})`;
}

/** Where item `index` of `count` sits along a rail, 0 to 1. */
function position(index: number, count: number) {
  return count <= 1 ? 0 : index / (count - 1);
}

/**
 * The Solana gradient (purple → green) at a point along the rail, from the
 * theme's tones: raw #14f195 all but disappears on white.
 */
export function railColor(index: number, count: number) {
  return mix("var(--tone-purple)", "var(--tone-green)", position(index, count));
}
