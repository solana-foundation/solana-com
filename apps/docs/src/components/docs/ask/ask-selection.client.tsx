"use client";

import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type SyntheticEvent,
} from "react";
import { cn } from "./cn";
import { DOCS_ASK_SELECTION_ATTR } from "@/lib/docs/ask-ai";
import { toQuote } from "@/lib/docs/ask/quote";
import { askStore, type AskQuote } from "@/lib/docs/ask/store";
import { useAskSelector } from "@/lib/docs/ask/use-ask";
import { focusRing } from "./ui";

/** A touch or keyboard selection shows the pill once it holds this still. */
const SETTLE_MS = 400;
/** Space between the selection and the pill. */
const GAP = 8;
/** Below a touch selection: room for the OS's selection handles. */
const TOUCH_GAP = 28;
/** The pill stays this far inside the viewport (and off the docked panel). */
const EDGE = 8;

/** Inside the content, but not text to ask about. */
const EXCLUDED =
  "nav, input, textarea, select, [contenteditable]:not([contenteditable='false']), [role='menu'], [data-ask-panel]";

/**
 * The UI around a code block that a drag over it can catch (a runnable
 * example's Run bar, the next step's number, a block's header, tabs).
 */
const CHROME =
  "button, summary, [role='button'], [role='tab'], [aria-hidden='true'], .sol-run, [data-component-part='step-number'], [data-component-part='code-block-header']";

type Anchors = Pick<
  Selection,
  "anchorNode" | "anchorOffset" | "focusNode" | "focusOffset"
>;

type Picked = {
  /** The article content root the selection lies in. */
  root: Element;
  range: Range;
  quote: AskQuote;
  anchors: Anchors;
  /** Placed under the selection, clear of the OS's selection menu. */
  touch: boolean;
};

function elementOf(node: Node | null): Element | null {
  return node instanceof Element ? node : (node?.parentElement ?? null);
}

function anchorsOf(selection: Selection): Anchors {
  const { anchorNode, anchorOffset, focusNode, focusOffset } = selection;
  return { anchorNode, anchorOffset, focusNode, focusOffset };
}

function sameAnchors(a: Anchors | null | undefined, b: Anchors): boolean {
  return (
    !!a &&
    a.anchorNode === b.anchorNode &&
    a.anchorOffset === b.anchorOffset &&
    a.focusNode === b.focusNode &&
    a.focusOffset === b.focusOffset
  );
}

/**
 * The range without the next block's start: a triple-click (and some drags)
 * end there, though nothing in that block is selected.
 */
function withoutTrailingBlock(range: Range): Range {
  if (range.endOffset !== 0 || range.endContainer === range.startContainer)
    return range;
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  walker.currentNode = range.endContainer;
  for (let node = walker.previousNode(); node; node = walker.previousNode()) {
    if (!range.intersectsNode(node)) break;
    if (!node.textContent?.trim()) continue;
    const trimmed = range.cloneRange();
    trimmed.setEnd(node, node.textContent.length);
    return trimmed;
  }
  return range;
}

/** The part of `node` that `range` covers. */
function selectedPart(range: Range, node: Text): string {
  const start = node === range.startContainer ? range.startOffset : 0;
  const end = node === range.endContainer ? range.endOffset : node.length;
  return node.data.slice(start, end);
}

/**
 * UI, or text that can't be selected or isn't shown (another tab's code,
 * a closed Run output): it has no boxes.
 */
function isChrome(node: Text): boolean {
  const element = node.parentElement;
  if (!element || element.closest(CHROME)) return true;
  if (getComputedStyle(element).userSelect === "none") return true;
  const boxes = document.createRange();
  boxes.selectNodeContents(node);
  return boxes.getClientRects?.().length === 0;
}

/**
 * The range as code when it is one code block's text plus only UI or
 * whitespace past the block's edge: readers overshoot the bottom of the
 * code they drag over, onto the Run bar under a runnable example or the
 * next step's number. Any other text beyond the block leaves it as is.
 */
function withinCodeBlock(range: Range): Range {
  const pre =
    elementOf(range.startContainer)?.closest("pre") ??
    elementOf(range.endContainer)?.closest("pre");
  if (
    !pre ||
    (pre.contains(range.startContainer) && pre.contains(range.endContainer))
  )
    return range;
  const walker = document.createTreeWalker(
    range.commonAncestorContainer,
    NodeFilter.SHOW_TEXT,
  );
  walker.currentNode = range.startContainer;
  let node =
    range.startContainer instanceof Text
      ? range.startContainer
      : walker.nextNode();
  for (; node; node = walker.nextNode()) {
    if (range.comparePoint(node, 0) > 0) break;
    if (!(node instanceof Text) || pre.contains(node)) continue;
    if (!range.intersectsNode(node)) continue;
    if (selectedPart(range, node).trim() && !isChrome(node)) return range;
  }
  const code = document.createRange();
  code.selectNodeContents(pre);
  if (pre.contains(range.startContainer))
    code.setStart(range.startContainer, range.startOffset);
  else code.setEnd(range.endContainer, range.endOffset);
  return code;
}

/**
 * The page's selection, if it lies within one article content root
 * (DOCS_ASK_SELECTION_ATTR), outside its nav and fields, and has something
 * to ask about. Inside one code block it is code, with the block's language.
 */
function readSelection(
  selection: Selection | null,
): Omit<Picked, "touch"> | null {
  if (!selection || selection.isCollapsed || selection.rangeCount === 0)
    return null;
  const range = withinCodeBlock(withoutTrailingBlock(selection.getRangeAt(0)));
  const common = elementOf(range.commonAncestorContainer);
  const root = common?.closest(`[${DOCS_ASK_SELECTION_ATTR}]`);
  if (!common || !root) return null;
  // Text selected in a field (the landing's calculator) reads as the
  // page's selection in some browsers.
  const active = document.activeElement;
  if (
    active instanceof HTMLElement &&
    root.contains(active) &&
    (active.isContentEditable || active.matches("input, textarea, select"))
  )
    return null;
  if (
    elementOf(range.startContainer)?.closest(EXCLUDED) ||
    elementOf(range.endContainer)?.closest(EXCLUDED)
  )
    return null;
  const pre = common.closest("pre");
  const language =
    pre?.closest("[data-language]")?.getAttribute("data-language") ?? "";
  // Code as it is in the block (without any UI past its edge); prose as
  // the reader sees it selected (rendered, with its paragraph breaks).
  const text = pre ? range.toString() : selection.toString();
  const quote: AskQuote = pre
    ? { text, code: true, ...(language ? { language } : {}) }
    : { text };
  if (!toQuote(quote)) return null;
  return { root, range, quote, anchors: anchorsOf(selection) };
}

/** The docs header's bottom edge: the pill doesn't go under it. */
function headerBottom(): number {
  const header = document.querySelector(".dh");
  return header ? Math.max(0, header.getBoundingClientRect().bottom) : 0;
}

/** Where the pill may go across: the viewport, less a docked panel. */
function horizontalBounds(): [number, number] {
  let min = EDGE;
  let max = (document.documentElement.clientWidth || window.innerWidth) - EDGE;
  const panel = document.querySelector("aside[data-ask-panel]");
  if (panel) {
    const rect = panel.getBoundingClientRect();
    // Docked at the inline end: the right in LTR, the left in RTL.
    if (rect.left > window.innerWidth / 2)
      max = Math.min(max, rect.left - EDGE);
    else min = Math.max(min, rect.right + EDGE);
  }
  return [min, max];
}

/**
 * Places the pill by the selection: centred above its first line, or below
 * its last one on touch or when the docs header leaves no room above. On
 * touch it goes above when there is no room below, rather than on the
 * selection and its handles. Hidden (not removed) while the selection is
 * out of view.
 */
function place(pill: HTMLElement, picked: Picked) {
  const rects = Array.from(picked.range.getClientRects()).filter(
    (rect) => rect.width > 0 && rect.height > 0,
  );
  const first = rects[0];
  const last = rects.at(-1);
  const top = headerBottom();
  const height = window.innerHeight;
  const offscreen =
    !first || !last || last.bottom <= top || first.top >= height;
  pill.toggleAttribute("data-offscreen", offscreen);
  if (offscreen) return;
  const w = pill.offsetWidth;
  const h = pill.offsetHeight;
  const above = first.top - GAP - h;
  const under = last.bottom + (picked.touch ? TOUCH_GAP : GAP);
  const fitsAbove = above >= top + EDGE;
  const fitsUnder = under + h <= height - EDGE;
  const below = picked.touch ? fitsUnder || !fitsAbove : !fitsAbove;
  const line = below ? last : first;
  const y = below ? under : above;
  const [min, max] = horizontalBounds();
  const x = line.left + line.width / 2 - w / 2;
  pill.style.setProperty(
    "--ask-sel-x",
    `${Math.round(Math.max(min, Math.min(x, max - w)))}px`,
  );
  pill.style.setProperty(
    "--ask-sel-y",
    `${Math.round(Math.max(EDGE, Math.min(y, height - EDGE - h)))}px`,
  );
}

/** Keeps the page's selection: the click must not clear it first. */
const keepSelection = (event: SyntheticEvent) => event.preventDefault();

/**
 * "Ask AI about this ✨": a small purple pill by text selected in a page's
 * article content. Mouse selections show it once the button is released,
 * touch and keyboard ones once they have held still for SETTLE_MS (under
 * the selection on touch, clear of the OS menu). It follows the selection
 * as the page scrolls, never takes focus, and goes with the selection, on
 * Esc (the selection stays), on navigation and in full screen. A click
 * reads the selection (never the clipboard) and opens Ask AI with it as a
 * quote in the composer, which takes focus; nothing is sent.
 */
export function AskSelection() {
  const t = useTranslations("docsAsk");
  const fullscreen = useAskSelector((s) => s.open && s.layout === "fullscreen");
  const pathname = usePathname();
  const pill = useRef<HTMLDivElement>(null);
  const picked = useRef<Picked | null>(null);
  /** Increments for each selection shown, so the pill enters again. */
  const [shown, setShown] = useState(0);
  const hideRef = useRef<() => void>(() => undefined);

  useEffect(() => {
    if (fullscreen) return;
    let timer: ReturnType<typeof setTimeout> | null = null;
    let frame = 0;
    let mouseDown = false;
    /**
     * A mouse button was just released: the pill shows on the next task,
     * for the selection as it then stands. Chrome's selectionchange for a
     * double-click's word comes after that.
     */
    let released = false;
    let pointerType = "";
    /**
     * Esc hid the pill for this selection; it shows again once the
     * selection changes or collapses (even if the same text is selected
     * again).
     */
    let dismissed: Anchors | null = null;

    const follow = () => {
      if (!picked.current) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (pill.current && picked.current) place(pill.current, picked.current);
      });
    };
    // The text reflows under the selection (the panel docks or is resized).
    const reflow =
      typeof ResizeObserver === "undefined" ? null : new ResizeObserver(follow);

    const hide = () => {
      cancelAnimationFrame(frame);
      reflow?.disconnect();
      if (!picked.current) return;
      picked.current = null;
      setShown(0);
    };
    hideRef.current = hide;

    const show = () => {
      timer = null;
      released = false;
      const selection = document.getSelection();
      const next = selection ? readSelection(selection) : null;
      if (!next || sameAnchors(dismissed, next.anchors)) return hide();
      dismissed = null;
      const touch =
        pointerType === "touch" ||
        (!pointerType && window.matchMedia?.("(pointer: coarse)").matches);
      const same = sameAnchors(picked.current?.anchors, next.anchors);
      picked.current = { ...next, touch };
      reflow?.disconnect();
      reflow?.observe(next.root);
      // The same selection (a click inside it) stays where it is.
      if (same) follow();
      else setShown((count) => count + 1);
    };

    const later = (ms: number) => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(show, ms);
    };

    const onSelectionChange = () => {
      const selection = document.getSelection();
      if (
        dismissed &&
        (!selection ||
          selection.isCollapsed ||
          !sameAnchors(dismissed, anchorsOf(selection)))
      )
        dismissed = null;
      if (released) return;
      // Chrome repeats the event after a drag ends: nothing moved.
      if (
        selection &&
        sameAnchors(picked.current?.anchors, anchorsOf(selection))
      )
        return;
      hide();
      if (timer) clearTimeout(timer);
      timer = null;
      // A mouse drag shows the pill when the button is released.
      if (!mouseDown) later(SETTLE_MS);
    };
    const onPointerDown = (event: PointerEvent) => {
      if (pill.current?.contains(event.target as Node)) return;
      pointerType = event.pointerType;
      if (event.pointerType !== "touch" && event.button === 0) mouseDown = true;
    };
    const onPointerUp = (event: PointerEvent) => {
      if (!mouseDown || event.pointerType === "touch") return;
      mouseDown = false;
      released = true;
      later(0);
    };
    const onPointerCancel = () => {
      mouseDown = false;
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || !picked.current) return;
      dismissed = picked.current.anchors;
      hide();
    };

    document.addEventListener("selectionchange", onSelectionChange);
    document.addEventListener("pointerdown", onPointerDown, true);
    document.addEventListener("pointerup", onPointerUp, true);
    document.addEventListener("pointercancel", onPointerCancel, true);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("blur", onPointerCancel);
    // Capture: scrolling inside a box (a wide code block) moves it too.
    window.addEventListener("scroll", follow, { capture: true, passive: true });
    window.addEventListener("resize", follow);
    return () => {
      if (timer) clearTimeout(timer);
      hide();
      hideRef.current = () => undefined;
      document.removeEventListener("selectionchange", onSelectionChange);
      document.removeEventListener("pointerdown", onPointerDown, true);
      document.removeEventListener("pointerup", onPointerUp, true);
      document.removeEventListener("pointercancel", onPointerCancel, true);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("blur", onPointerCancel);
      window.removeEventListener("scroll", follow, { capture: true });
      window.removeEventListener("resize", follow);
    };
  }, [fullscreen]);

  // A new page: whatever was selected is gone.
  useEffect(() => {
    hideRef.current();
  }, [pathname]);

  // Placed before it is painted.
  useLayoutEffect(() => {
    if (shown && pill.current && picked.current)
      place(pill.current, picked.current);
  }, [shown]);

  if (!shown || fullscreen) return null;

  const onClick = () => {
    const selection = document.getSelection();
    // The selection as it is now; else as it was shown (a tap may have
    // cleared it). Never the clipboard.
    const quote =
      (selection ? readSelection(selection)?.quote : null) ??
      picked.current?.quote;
    selection?.removeAllRanges();
    hideRef.current();
    if (quote) askStore.open({ selection: quote });
  };

  // Over the docs header (z-40), which it never overlaps, and under the
  // Ask overlay (z-55). The header's open menus share its stacking
  // context, below the pill, so it hides while one is open.
  return (
    <div
      key={shown}
      ref={pill}
      data-dev-landing="docs"
      data-docs=""
      className="fixed left-[var(--ask-sel-x,0px)] top-[var(--ask-sel-y,0px)] z-[45] rounded-full !bg-transparent data-[offscreen]:invisible [body:has(.dh_details[open])_&]:invisible"
    >
      <button
        type="button"
        data-ask-selection-button=""
        onPointerDown={keepSelection}
        onMouseDown={keepSelection}
        onClick={onClick}
        className={cn(
          "inline-flex h-8 items-center gap-1.5 whitespace-nowrap rounded-full bg-[var(--sol-cta)] px-3 text-[13px] font-medium leading-5 text-[var(--sol-cta-text)] shadow-[0_6px_20px_-8px_rgb(153_69_255/0.55),0_1px_2px_rgb(24_24_27/0.12)] transition-colors hover:bg-[var(--sol-cta-hover)] motion-reduce:transition-none",
          "animate-in fade-in-0 slide-in-from-bottom-1 duration-150 motion-reduce:animate-none",
          focusRing,
        )}
      >
        {t("selection.ask")}
        {/* White, like the launcher's. */}
        <span
          aria-hidden="true"
          className="inline-block text-[14px] leading-none brightness-0 invert"
        >
          ✨
        </span>
      </button>
    </div>
  );
}
