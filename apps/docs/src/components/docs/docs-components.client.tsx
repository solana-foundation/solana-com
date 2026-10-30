"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { CheckIcon, CopyIcon, SparkleIcon } from "./docs-ui-icons";
import { openAskAi } from "@/lib/docs/ask-ai";

/**
 * Interactive pieces of the docs content components (docs-components.tsx):
 * tabs, code groups and the code copy button. Server-rendered with every
 * panel in the markup (inactive ones `hidden`), so the content reads without
 * JavaScript (nojs.css shows all panels then).
 * CodePanelSteps picks the code panel a <Steps codePanel> shows on wide screens.
 */

const STORAGE_PREFIX = "docs-tab:";

/** Tab choice shared by every tab set with the same labels (Kit / web3.js). */
function useSyncedTab(labels: string[]) {
  const key = STORAGE_PREFIX + labels.join("|");
  const [active, setActive] = useState(0);
  useEffect(() => {
    const onSync = (event: Event) => {
      const detail = (event as CustomEvent<{ key: string; label: string }>)
        .detail;
      if (detail.key !== key) return;
      const index = labels.indexOf(detail.label);
      if (index >= 0) setActive(index);
    };
    window.addEventListener("docs-tab-sync", onSync);
    return () => window.removeEventListener("docs-tab-sync", onSync);
  }, [key, labels]);
  const choose = (index: number) => {
    setActive(index);
    window.dispatchEvent(
      new CustomEvent("docs-tab-sync", {
        detail: { key, label: labels[index] },
      }),
    );
  };
  return [active, choose] as const;
}

function slug(label: string) {
  return label
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-|-$/g, "");
}

/** The reader's operating system, as the OS tab labels name them. */
function detectOs(): string | null {
  const nav = navigator as Navigator & {
    userAgentData?: { platform?: string };
  };
  const p = nav.userAgentData?.platform || nav.platform || nav.userAgent || "";
  if (/win/i.test(p)) return "Windows";
  if (/mac|iphone|ipad|ipod/i.test(p)) return "macOS";
  if (/linux|x11|cros|android/i.test(p)) return "Linux";
  return null;
}

/**
 * Arrow keys, Home and End in a tablist (WAI-ARIA tabs): select the next tab
 * in `order` (the tab indexes as shown) and move focus to it. The tabs are
 * the tablist's direct children.
 */
function onTabKeyDown(
  event: KeyboardEvent<HTMLElement>,
  i: number,
  order: number[],
  choose: (index: number) => void,
) {
  const at = order.indexOf(i);
  const count = order.length;
  const to = {
    ArrowRight: (at + 1) % count,
    ArrowLeft: (at - 1 + count) % count,
    Home: 0,
    End: count - 1,
  }[event.key];
  if (to === undefined) return;
  event.preventDefault();
  choose(order[to]);
  const tab = event.currentTarget.parentElement?.children[order[to]];
  (tab as HTMLElement | undefined)?.focus();
}

export function TabsClient({
  labels,
  panels,
}: {
  labels: string[];
  panels: ReactNode[];
}) {
  const [active, choose] = useSyncedTab(labels);
  const base = useId();
  const root = useRef<HTMLDivElement>(null);
  // OS tabs (<div className="sol-os-tabs"> around macOS / Linux / Windows
  // tabs): the reader's OS moves first and is selected. Without JavaScript,
  // or on another OS, the content order stays.
  const [osFirst, setOsFirst] = useState(-1);
  useEffect(() => {
    if (!root.current?.closest(".sol-os-tabs")) return;
    const os = detectOs();
    const index = os ? labels.findIndex((l) => l.trim().startsWith(os)) : -1;
    if (index < 0) return;
    setOsFirst(index);
    choose(index);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const order = labels.map((_, i) => i);
  if (osFirst >= 0) order.unshift(...order.splice(osFirst, 1));
  return (
    <div className="tabs tab-container" ref={root}>
      <ul
        className="not-prose tabs-list"
        role="tablist"
        data-component-part="tabs-list"
      >
        {labels.map((label, i) => (
          <li
            key={i}
            id={slug(label)}
            role="tab"
            aria-selected={i === active}
            aria-controls={`${base}-panel-${i}`}
            className="tabs-tab"
            style={i === osFirst ? { order: -1 } : undefined}
            tabIndex={i === active ? 0 : -1}
            onClick={() => choose(i)}
            onKeyDown={(event) => onTabKeyDown(event, i, order, choose)}
          >
            <div
              data-component-part="tab-button"
              data-active={i === active ? "true" : "false"}
              className="tab-button"
            >
              {label}
            </div>
          </li>
        ))}
      </ul>
      <div>
        {panels.map((panel, i) => (
          <div
            key={i}
            id={`${base}-panel-${i}`}
            role="tabpanel"
            data-component-part="tab-content"
            className={
              i === active ? "prose tab-panel" : "prose tab-panel hidden"
            }
          >
            {panel}
          </div>
        ))}
      </div>
    </div>
  );
}

export function CopyCodeButton({ className }: { className?: string }) {
  const ref = useRef<HTMLButtonElement>(null);
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(t);
  }, [copied]);
  return (
    <div className={`code-block-copy-button ${className ?? ""}`}>
      <button
        ref={ref}
        type="button"
        data-testid="copy-code-button"
        aria-label="Copy the contents from the code block"
        className="code-copy"
        onClick={() => {
          const root =
            ref.current?.closest("[data-code-copy-scope]") ??
            ref.current?.closest(".code-block");
          const panel =
            root?.querySelector('[role="tabpanel"]:not([hidden]) pre') ??
            root?.querySelector("pre");
          const text = panel?.textContent ?? "";
          void navigator.clipboard.writeText(text).then(() => setCopied(true));
        }}
      >
        {copied ? (
          <CheckIcon className="code-copy-icon is-copied" />
        ) : (
          <CopyIcon className="code-copy-icon" />
        )}
      </button>
      <span className="sr-only" role="status">
        {copied ? "Copied" : ""}
      </span>
    </div>
  );
}

/**
 * "See all N lines" under a collapsed (expandable) code block; toggles the
 * block open and to "Collapse".
 */
export function CodeExpandFooter({ count }: { count: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  return (
    <div
      ref={ref}
      data-component-part="code-block-footer"
      className="code-block-footer"
    >
      <button
        type="button"
        data-component-part="code-block-footer-button"
        className="code-block-expand"
        data-lines-count={count}
        aria-expanded={open}
        onClick={() => {
          const block = ref.current?.closest(".code-block, .code-group-panel");
          // A block that opens on its focused (else highlighted) lines keeps
          // them where they are on screen (CodeBody's focus window).
          const win = block?.querySelector(
            ".code-block-root[data-focus-window]",
          );
          const line =
            win?.querySelector(".line-focus") ??
            win?.querySelector(".line-highlight");
          const before = line?.getBoundingClientRect().top;
          if (open) block?.removeAttribute("data-expanded");
          else block?.setAttribute("data-expanded", "");
          if (line && before !== undefined)
            // Instant: globals.css sets smooth scrolling.
            scrollBy({
              top: line.getBoundingClientRect().top - before,
              behavior: "instant",
            });
          setOpen(!open);
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
          className="code-block-expand-icon"
        >
          <path d="M9 9.5C9.27614 9.5 9.5 9.27614 9.5 9C9.5 8.72386 9.27614 8.5 9 8.5C8.72386 8.5 8.5 8.72386 8.5 9C8.5 9.27614 8.72386 9.5 9 9.5Z" />
          <path d="M3.25 9.5C3.52614 9.5 3.75 9.27614 3.75 9C3.75 8.72386 3.52614 8.5 3.25 8.5C2.97386 8.5 2.75 8.72386 2.75 9C2.75 9.27614 2.97386 9.5 3.25 9.5Z" />
          <path d="M14.75 9.5C15.0261 9.5 15.25 9.27614 15.25 9C15.25 8.72386 15.0261 8.5 14.75 8.5C14.4739 8.5 14.25 8.72386 14.25 9C14.25 9.27614 14.4739 9.5 14.75 9.5Z" />
        </svg>
        <span>{open ? "Collapse" : `See all ${count} lines`}</span>
      </button>
    </div>
  );
}

/** "Ask AI about this code" next to Copy: hands the block's code to Ask AI. */
export function AskCodeButton() {
  const ref = useRef<HTMLButtonElement>(null);
  return (
    <div className="code-block-ask-button">
      <button
        ref={ref}
        type="button"
        aria-label="Ask AI about this code"
        className="code-copy"
        onClick={() => {
          const root =
            ref.current?.closest("[data-code-copy-scope]") ??
            ref.current?.closest(".code-block");
          const pre =
            root?.querySelector('[role="tabpanel"]:not([hidden]) pre') ??
            root?.querySelector("pre");
          openAskAi({
            code: pre?.textContent ?? "",
            language: pre?.getAttribute("data-language") ?? undefined,
          });
        }}
      >
        <SparkleIcon className="code-copy-icon" />
      </button>
    </div>
  );
}

/**
 * <CodeGroup>, <RequestExample>, <ResponseExample>: the fences inside as one
 * box with a tab per fence (its title, else its language).
 */
export function CodeGroupClient({
  labels,
  panels,
  variant,
}: {
  labels: string[];
  panels: ReactNode[];
  variant?: "api";
}) {
  const [active, choose] = useSyncedTab(labels);
  const base = useId();
  const order = labels.map((_, i) => i);
  return (
    <div className="code-group" data-variant={variant} data-code-copy-scope="">
      <div
        className="code-group-tab-bar"
        data-component-part="code-group-tab-bar"
      >
        <div className="code-group-tabs" role="tablist">
          {labels.map((label, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              id={`${base}-tab-${i}`}
              aria-selected={i === active}
              aria-controls={`${base}-panel-${i}`}
              data-active={i === active ? "" : undefined}
              className="code-group-tab"
              tabIndex={i === active ? 0 : -1}
              onClick={() => choose(i)}
              onKeyDown={(event) => onTabKeyDown(event, i, order, choose)}
            >
              <div className="code-group-tab-label">{label}</div>
              <div className="code-group-tab-underline" aria-hidden="true" />
            </button>
          ))}
        </div>
        <div className="code-group-actions">
          <CopyCodeButton />
          <AskCodeButton />
        </div>
      </div>
      <div className="code-group-panels">
        {panels.map((panel, i) => (
          <div
            key={i}
            id={`${base}-panel-${i}`}
            role="tabpanel"
            aria-labelledby={`${base}-tab-${i}`}
            hidden={i !== active}
            className="code-group-panel"
          >
            {panel}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * <Steps codePanel>: picks which step's panel shows on wide screens. It only
 * sets attributes on the server-rendered markup (data-active on the step at
 * the reading line, data-shown on the panel it shows, data-in-view on the
 * list and data-code-panel-over on .content-row while its panel would meet
 * "On this page") and scrolls panels to their focused lines. No React state,
 * so the steps never re-render.
 */
export function CodePanelSteps({
  titleSize,
  children,
}: {
  titleSize: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => (ref.current ? attachCodePanel(ref.current) : undefined), []);
  // ms-3.5 repeats docs.css's margin-left (room for the step numbers) on the
  // logical side, so in RTL it stays beside the numbers, not the breakout.
  return (
    <div
      ref={ref}
      role="list"
      data-title-size={titleSize}
      data-code-panel=""
      className="steps code-panel:relative code-panel:-me-[22.25rem] code-panel:ms-3.5 code-panel:pe-[calc(50cqw+2rem)]"
    >
      {children}
    </div>
  );
}

export function attachCodePanel(root: HTMLElement): () => void {
  const steps = [...root.children].filter((el): el is HTMLElement =>
    el.classList.contains("step"),
  );
  const rails = steps.map((s) =>
    s.querySelector<HTMLElement>(
      ":scope > .step-body > .step-content > .step-code",
    ),
  );
  const anyRail = rails.find(Boolean);
  const wide = () =>
    !!anyRail && getComputedStyle(anyRail).position === "absolute";
  let active = 0; // the server marks step 1 active and the first panel shown
  const shownFor = (i: number) => {
    for (let j = i; j >= 0; j--) if (rails[j]) return j;
    return rails.findIndex(Boolean);
  };
  function activate(i: number) {
    if (i < 0 || i === active) return;
    active = i;
    const shown = shownFor(i);
    steps.forEach((s, j) => s.toggleAttribute("data-active", j === i));
    rails.forEach((r, j) => r?.toggleAttribute("data-shown", j === shown));
  }
  // Focused (else highlighted) lines in view: two lines of context above, one
  // if the range is taller than the panel.
  function align(rail: HTMLElement) {
    const box = rail.firstElementChild as HTMLElement;
    const visible = (sel: string) =>
      [...rail.querySelectorAll<HTMLElement>(sel)].filter(
        (l) => l.getClientRects().length,
      );
    const lines = visible(".line-focus").length
      ? visible(".line-focus")
      : visible(".line-highlight");
    if (!lines.length) return;
    const vp = lines[0].closest<HTMLElement>(".code-block-viewport");
    const sc = vp && vp.scrollHeight > vp.clientHeight + 1 ? vp : box;
    const origin = sc.getBoundingClientRect().top - sc.scrollTop;
    const top = lines[0].getBoundingClientRect().top - origin;
    const bottom =
      lines[lines.length - 1].getBoundingClientRect().bottom - origin;
    const lh = lines[0].getBoundingClientRect().height || 24;
    const context = bottom - top + 2 * lh <= sc.clientHeight ? 2 : 1;
    sc.scrollTop = Math.max(
      0,
      Math.min(top - context * lh, sc.scrollHeight - sc.clientHeight),
    );
  }
  const alignAll = () => {
    if (wide()) rails.forEach((r) => r && align(r));
  };
  /** The last step whose top has passed the reading line (40% down). */
  function atLine() {
    const line = innerHeight * 0.4;
    let i = 0;
    steps.forEach((s, j) => {
      if (s.getBoundingClientRect().top <= line) i = j;
    });
    return i;
  }
  function sync() {
    const f = document.activeElement;
    // Keyboard focus in a panel keeps it on screen until focus moves on.
    if (
      f instanceof HTMLElement &&
      root.contains(f) &&
      f.closest(".step-code") &&
      f.matches(":focus-visible")
    )
      return;
    activate(atLine());
  }
  const band = new IntersectionObserver(sync, {
    rootMargin: "-40% 0px -59% 0px",
  });
  steps.forEach((s) => band.observe(s));
  // A one-frame jump (a scrollbar drag) can pass every step at once: sync
  // again when the walkthrough comes on screen (and on the TOC band, below).
  const seen = new IntersectionObserver(sync);
  seen.observe(root);
  // "On this page" gives way while the walkthrough overlaps the band from the
  // panel's top (6.5rem) to 1rem under the TOC list. The row carries the flag
  // for the side column (docs-page.tsx): a `:has()` there would restyle the
  // whole page on every toggle.
  const row = root.closest<HTMLElement>(".content-row");
  const flagRow = () =>
    row?.toggleAttribute(
      "data-code-panel-over",
      !!row.querySelector(".steps[data-in-view]"),
    );
  let view: IntersectionObserver | undefined;
  function watchView() {
    view?.disconnect();
    const rem =
      parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    const toc = document.getElementById("table-of-contents");
    const tocBottom = toc?.getClientRects().length
      ? Math.min(toc.getBoundingClientRect().bottom, innerHeight)
      : innerHeight;
    view = new IntersectionObserver(
      ([e]) => {
        root.toggleAttribute("data-in-view", e.isIntersecting && wide());
        flagRow();
        sync();
      },
      {
        rootMargin: `-${6.5 * rem}px 0px -${Math.max(0, innerHeight - tocBottom - rem)}px 0px`,
      },
    );
    view.observe(root);
  }
  // The reader's place, measured once a frame while scrolling, for a layout
  // switch to keep: the top of the step at the reading line while the line is
  // in this walkthrough, else this walkthrough's end while it is the last one
  // above the line (what follows moves with it).
  let place: { el: HTMLElement; end: boolean; at: number } | undefined;
  let frame = 0;
  function measure() {
    frame = 0;
    place = undefined;
    const line = innerHeight * 0.4;
    const r = root.getBoundingClientRect();
    if (r.top > line) return;
    const all = [
      ...document.querySelectorAll<HTMLElement>(".steps[data-code-panel]"),
    ];
    const next = all[all.indexOf(root) + 1];
    if (next && next.getBoundingClientRect().top <= line) return;
    if (r.bottom <= line) place = { el: root, end: true, at: r.bottom };
    else {
      const step = steps[atLine()];
      place = { el: step, end: false, at: step.getBoundingClientRect().top };
    }
  }
  const onScroll = () => {
    frame ||= requestAnimationFrame(measure);
  };
  // A click or focus inside the panel already on screen changes nothing.
  const onStep = (event: Event) => {
    const target = event.target as HTMLElement;
    if (target.closest(".step-code")?.hasAttribute("data-shown")) return;
    const step = target.closest(".step");
    if (step && step.parentElement === root)
      activate(steps.indexOf(step as HTMLElement));
  };
  const onFocusOut = (event: FocusEvent) => {
    if (!root.contains(event.relatedTarget as Node | null)) sync();
  };
  let raf = 0;
  // A height-only resize changes the panels' height, not the list's.
  const onResize = () => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      alignAll();
      watchView();
    });
  };
  root.addEventListener("click", onStep);
  root.addEventListener("focusin", onStep);
  root.addEventListener("focusout", onFocusOut);
  addEventListener("resize", onResize);
  addEventListener("scroll", onScroll, { passive: true });
  // Root size changes on breakpoint changes and Ask AI docking (no window resize).
  let wasWide = wide();
  const ro = new ResizeObserver(() => {
    const isWide = wide();
    if (isWide !== wasWide && place) {
      // The code moved into or out of the text column, which moves the steps
      // and what follows by up to thousands of pixels (and browsers don't
      // anchor the scroll across it): keep the reader's place on screen, with
      // their step on the reading line if it got shorter.
      const r = place.el.getBoundingClientRect();
      scrollBy({
        top: place.end
          ? r.bottom - place.at
          : r.top - Math.max(place.at, innerHeight * 0.4 - r.height + 1),
        behavior: "instant",
      });
    }
    wasWide = isWide;
    alignAll();
    watchView();
    measure();
  });
  ro.observe(root);
  alignAll();
  sync();
  measure();
  return () => {
    band.disconnect();
    seen.disconnect();
    view?.disconnect();
    ro.disconnect();
    cancelAnimationFrame(raf);
    cancelAnimationFrame(frame);
    root.removeEventListener("click", onStep);
    root.removeEventListener("focusin", onStep);
    root.removeEventListener("focusout", onFocusOut);
    removeEventListener("resize", onResize);
    removeEventListener("scroll", onScroll);
    root.removeAttribute("data-in-view");
    flagRow();
  };
}
