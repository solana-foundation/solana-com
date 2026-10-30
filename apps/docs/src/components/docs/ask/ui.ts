/**
 * Class recipes the Ask AI panel repeats, from the docs chrome
 * (docs-chrome.css, docs.css) re-expressed as Tailwind on `--sol-*` tokens.
 * Display toggles avoid `hidden`/`block`/`sr-only`: docs.css overrides those
 * inside `[data-docs]`, which every panel root carries.
 */
import { useEffect, useState } from "react";

export const focusRing =
  "outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sol-purple)]";

/** The docs' signature label (sidebar sections, "On this page"). */
export const signatureLabel =
  "font-[family-name:var(--sol-font-mono)] text-[11px] font-semibold uppercase leading-4 tracking-[0.1em] text-[var(--sol-dim)]";

export const mono = "font-[family-name:var(--sol-font-mono)]";

/** Screen-reader-only text that survives docs.css (unlike `sr-only`). */
export const visuallyHidden =
  "absolute size-px overflow-hidden whitespace-nowrap [clip-path:inset(50%)]";

/**
 * Hover fill for the panel header's buttons, only where there is a real
 * hover: on touch, a tap on the page header's ✨ would leave it on New chat
 * or Close, which open under the finger.
 */
export const headerHover =
  "[@media(hover:hover)]:hover:bg-[var(--sol-soft)] [@media(hover:hover)]:hover:text-[var(--sol-text)]";

/** 32px header icon button, as the docs header's theme switch. */
export const headerIconButton = `grid size-8 place-items-center rounded-lg text-[var(--sol-muted)] transition-colors duration-150 motion-reduce:transition-none ${headerHover}`;

/**
 * 12px busy ring in the brand gradient, masked to 2px. It spins only when
 * motion is allowed; reduced motion leaves a still ring.
 */
export const spinner =
  "inline-block size-3 shrink-0 rounded-full bg-[image:conic-gradient(#9945ff,#14f195,#9945ff)] [mask:radial-gradient(farthest-side,transparent_calc(100%_-_2px),#000_calc(100%_-_1.5px))] motion-safe:animate-spin";

/**
 * The docs' icon tile (landing cards, page actions): purple glyph on a
 * lilac tile in light, green on near-black in dark. Add a size.
 */
export const iconTile =
  "grid shrink-0 place-items-center rounded-md border border-[var(--sol-icon-line)] bg-[var(--sol-icon-tile)] text-[var(--sol-icon-glyph)]";

/**
 * The panel's accent palette, light and dark, set once on the panel body
 * (ask-panel.client.tsx). Each tone has a text/glyph colour, a soft fill
 * and a line: `var(--tone-blue)`, `var(--tone-blue-soft)`,
 * `var(--tone-blue-line)`. Purple and amber reuse the docs tokens.
 */
export const PALETTE = [
  "[--tone-purple:var(--sol-purple-text)] [--tone-purple-soft:var(--sol-purple-soft)] [--tone-purple-line:var(--sol-purple-line)]",
  "[--tone-green:var(--sol-green-text)] [--tone-green-soft:#e8f8f0] [--tone-green-line:#bde8d2] dark:[--tone-green-soft:rgb(20_241_149/0.1)] dark:[--tone-green-line:rgb(20_241_149/0.32)]",
  "[--tone-blue:#1d4ed8] [--tone-blue-soft:#eef3ff] [--tone-blue-line:#cddcfb] dark:[--tone-blue:#82aaff] dark:[--tone-blue-soft:rgb(130_170_255/0.12)] dark:[--tone-blue-line:rgb(130_170_255/0.34)]",
  "[--tone-amber:var(--sol-amber)] [--tone-amber-soft:var(--sol-amber-soft)] [--tone-amber-line:var(--sol-amber-line)]",
].join(" ");

export type AskTone = "purple" | "green" | "blue" | "amber";

/**
 * Points `--tone`, `--tone-soft` and `--tone-line` at one palette tone, so
 * an element and its children can use `text-[var(--tone)]`,
 * `bg-[var(--tone-soft)]`, `border-[var(--tone-line)]`. Written out in
 * full: Tailwind only sees literal class names.
 */
export const toneScope: Record<AskTone, string> = {
  purple:
    "[--tone:var(--tone-purple)] [--tone-soft:var(--tone-purple-soft)] [--tone-line:var(--tone-purple-line)]",
  green:
    "[--tone:var(--tone-green)] [--tone-soft:var(--tone-green-soft)] [--tone-line:var(--tone-green-line)]",
  blue: "[--tone:var(--tone-blue)] [--tone-soft:var(--tone-blue-soft)] [--tone-line:var(--tone-blue-line)]",
  amber:
    "[--tone:var(--tone-amber)] [--tone-soft:var(--tone-amber-soft)] [--tone-line:var(--tone-amber-line)]",
};

const RTL_LETTER =
  /[\p{Script=Arabic}\p{Script=Hebrew}\p{Script=Syriac}\p{Script=Thaana}\p{Script=Nko}]/u;

/**
 * A text's direction from its first letter, as `dir="auto"` would pick it.
 * Set it as `dir` and `data-dir` where icons must flip with the text, not
 * the page: `rtl:` also matches the page's `dir`, and the build turns
 * `:dir(rtl)` into a language match, so an English answer on an Arabic
 * page would get mirrored arrows.
 */
export function textDirection(text: string): "ltr" | "rtl" {
  const letter = text.match(/\p{L}/u)?.[0];
  return letter && RTL_LETTER.test(letter) ? "rtl" : "ltr";
}

/** Fade and a 4px rise, once, as something new arrives (a turn, a row). */
export const enterUp =
  "animate-in fade-in-0 slide-in-from-bottom-1 duration-300 motion-reduce:animate-none";

/** Copy to the clipboard; `copied` stays true for 1.5s, as on the docs' code blocks. */
export function useCopy(): [boolean, (text: string) => void] {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(timer);
  }, [copied]);
  const copy = (text: string) => {
    void navigator.clipboard?.writeText(text).then(
      () => setCopied(true),
      () => {},
    );
  };
  return [copied, copy];
}
