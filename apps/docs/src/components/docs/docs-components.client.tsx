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
          if (open) block?.removeAttribute("data-expanded");
          else block?.setAttribute("data-expanded", "");
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

/** "Ask Assistant" next to Copy: hands the block's code to Ask AI. */
export function AskCodeButton() {
  const ref = useRef<HTMLButtonElement>(null);
  return (
    <div className="code-block-ask-button">
      <button
        ref={ref}
        type="button"
        aria-label="Ask Assistant"
        className="code-copy"
        onClick={() => {
          const root =
            ref.current?.closest("[data-code-copy-scope]") ??
            ref.current?.closest(".code-block");
          const pre =
            root?.querySelector('[role="tabpanel"]:not([hidden]) pre') ??
            root?.querySelector("pre");
          openAskAi(pre?.textContent ?? "");
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
