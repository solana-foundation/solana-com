/**
 * Entrance motion for a visual that arrives with a streaming answer: the
 * frame fades and rises 4px, node cards and steps follow one after another,
 * and the step rail draws downward. Only once: a visual restored from
 * storage, or re-mounted by a layout change, appears as it is. Everything
 * is `motion-safe`.
 */
import { createContext, useContext, type CSSProperties } from "react";

/** True while the visual's first appearance should animate. */
export const EnterContext = createContext(false);

export function useEnter() {
  return useContext(EnterContext);
}

/*
 * `animate-in` sets its own 150ms duration after arbitrary properties in the
 * stylesheet, hence the important one.
 */

/** The frame: fade and a 4px rise. */
export const enterFrame =
  "motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-1 ![animation-duration:300ms]";

/** An item in the sequence; its delay comes from `staggerStyle`. */
export const enterItem =
  "motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-1 [animation-delay:var(--enter-delay)] ![animation-duration:300ms] [animation-fill-mode:backwards]";

const STAGGER_MS = 50;
const STAGGER_CAP_MS = 350;

/** Item `index` of the sequence (cards, then steps) starts 50ms after the last. */
export function staggerStyle(index: number) {
  const delay = Math.min(100 + index * STAGGER_MS, STAGGER_CAP_MS);
  return { "--enter-delay": `${delay}ms` } as CSSProperties;
}

/** The whole rail draws in this long, one segment after another. */
export const RAIL_DRAW_MS = 500;
