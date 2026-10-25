"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { openDocsSearch } from "@/lib/docs/search-hand-off";
import { DOCS_THEME_STORAGE_KEY } from "./theme-prepaint";

/*
 * Client islands for the docs header on /developers (docs-header.tsx). The
 * header is server-rendered and works without JavaScript: the tabs and
 * language links are plain anchors, the menus are <details>, and the search
 * field is a GET form to the docs. These add the theme toggle, the docs
 * search dialog on click and ⌘K/Ctrl+K, and closing the menus on Escape or
 * an outside click.
 */

type Theme = "light" | "dark";
type Preference = Theme | "system";

function readPreference(): Preference {
  let value: string | null = null;
  try {
    value = window.localStorage.getItem(DOCS_THEME_STORAGE_KEY);
  } catch {
    value = null;
  }
  if (value === "true") return "dark";
  if (value === "false") return "light";
  return value === "light" || value === "dark" ? value : "system";
}

function systemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/** Same rule as DOCS_THEME_PREPAINT_SCRIPT and the docs pages. */
function applyPreference(preference: Preference) {
  const theme = preference === "system" ? systemTheme() : preference;
  const html = document.documentElement;
  html.classList.remove("dark", "tw-dark", "light", "tw-light");
  html.classList.add(theme, `tw-${theme}`);
  html.setAttribute("data-theme-preference", preference);
  html.setAttribute("data-dh-js", "");
  html.style.colorScheme = theme;
}

function currentTheme(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

/** The docs' theme drawings (18px grid): system, light (sun), dark (moon). */
const THEME_CHOICES: { value: Preference; label: string; paths: string[] }[] = [
  {
    value: "system",
    label: "Switch to system theme",
    paths: [
      "M4.5 15.5L9 14.5L13.5 15.5",
      "M9 11.75V14.5",
      "M14.25 2.75H3.75C2.64543 2.75 1.75 3.64543 1.75 4.75V9.75C1.75 10.8546 2.64543 11.75 3.75 11.75H14.25C15.3546 11.75 16.25 10.8546 16.25 9.75V4.75C16.25 3.64543 15.3546 2.75 14.25 2.75Z",
    ],
  },
  {
    value: "light",
    label: "Switch to light theme",
    paths: [
      "M9 1.25V2.25",
      "M14.48 3.52002L13.773 4.22702",
      "M16.75 9H15.75",
      "M14.48 14.4799L13.773 13.7729",
      "M9 16.75V15.75",
      "M3.52 14.4799L4.227 13.7729",
      "M1.25 9H2.25",
      "M3.52 3.52002L4.227 4.22702",
      "M9 13.25C11.3472 13.25 13.25 11.3472 13.25 9C13.25 6.65279 11.3472 4.75 9 4.75C6.65279 4.75 4.75 6.65279 4.75 9C4.75 11.3472 6.65279 13.25 9 13.25Z",
    ],
  },
  {
    value: "dark",
    label: "Switch to dark theme",
    paths: [
      "M13 11.75C9.548 11.75 6.75 8.95201 6.75 5.50001C6.75 4.14801 7.183 2.90101 7.912 1.87801C4.548 2.50601 2 5.45301 2 9.00001C2 13.004 5.246 16.25 9.25 16.25C12.622 16.25 15.448 13.944 16.259 10.826C15.309 11.409 14.196 11.75 13 11.75Z",
    ],
  },
];

/**
 * One-click light/dark switch, the same on /developers and the docs: the
 * icon is the mode a click switches to (moon in light mode, sun in dark), and
 * the choice is stored in localStorage "isDarkMode", which the docs also read
 * (theme-prepaint.tsx), so it carries over both ways. Until the first click the theme
 * follows the system. Hidden without JavaScript (docs-chrome.css).
 */
export function ThemeToggle({
  toDark,
  toLight,
  className = "dh-theme",
  children,
}: {
  toDark: string;
  toLight: string;
  className?: string;
  /** Optional visible text (mobile menu). */
  children?: (theme: Theme | null) => ReactNode;
}) {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    // Inline scripts do not run on client-side navigation, so apply the
    // stored preference here too (a no-op after the pre-paint script).
    applyPreference(readPreference());
    setTheme(currentTheme());

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onSystem = () => {
      if (readPreference() === "system") applyPreference("system");
    };
    // Another tab (the docs, say) changed the choice.
    const onStorage = (event: StorageEvent) => {
      if (event.key === DOCS_THEME_STORAGE_KEY || event.key === null)
        applyPreference(readPreference());
    };
    // Keep every toggle instance (header, mobile menu) in sync.
    const observer = new MutationObserver(() => setTheme(currentTheme()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    media.addEventListener("change", onSystem);
    window.addEventListener("storage", onStorage);
    return () => {
      media.removeEventListener("change", onSystem);
      window.removeEventListener("storage", onStorage);
      observer.disconnect();
      // Leaving /developers: the rest of the site manages its own scheme.
      document.documentElement.style.colorScheme = "";
    };
  }, []);

  const next: Theme = theme === "dark" ? "light" : "dark";
  const label = theme === "dark" ? toLight : toDark;

  return (
    <button
      type="button"
      className={className}
      aria-label={label}
      title={label}
      data-theme-toggle=""
      onClick={() => {
        try {
          window.localStorage.setItem(DOCS_THEME_STORAGE_KEY, next);
        } catch {
          // Storage blocked: the switch still applies to this page view.
        }
        applyPreference(next);
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 18 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        focusable="false"
        className="dh-icon dh-icon-moon"
      >
        {THEME_CHOICES[2]!.paths.map((d) => (
          <path key={d} d={d} />
        ))}
      </svg>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 18 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        focusable="false"
        className="dh-icon dh-icon-sun"
      >
        {THEME_CHOICES[1]!.paths.map((d) => (
          <path key={d} d={d} />
        ))}
      </svg>
      {children?.(theme)}
    </button>
  );
}

/**
 * The docs search field. It opens Inkeep's search (components/docs/
 * inkeep.client.tsx) on the page: on click, on Enter, and on ⌘K / Ctrl+K
 * anywhere on the page, with what was typed. Keyboard
 * focus alone does not open it (WCAG 3.2.1 On Focus): keyboard users can
 * type and press Enter. Without JavaScript the form submits to
 * `<docs>?q=<text>`, where the docs page opens its search with the text.
 */
export function DocsSearchField({
  action,
  prompt,
}: {
  /** Localized docs root, e.g. "/developers/docs" or "/ja/developers/docs". */
  action: string;
  prompt: string;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [mac, setMac] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
    setMac(/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent));
    const onKey = (event: KeyboardEvent) => {
      if (
        (event.metaKey || event.ctrlKey) &&
        !event.altKey &&
        !event.shiftKey &&
        event.key.toLowerCase() === "k"
      ) {
        // Capture phase, so the browser's own Cmd/Ctrl+K does not run.
        event.preventDefault();
        event.stopImmediatePropagation();
        openDocsSearch(input.current?.value ?? "");
      }
    };
    // The search icon (narrow headers) and other openers.
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
        return;
      const opener = (event.target as Element | null)?.closest?.(
        "[data-docs-search-open]",
      );
      if (!opener) return;
      event.preventDefault();
      openDocsSearch();
    };
    window.addEventListener("keydown", onKey, true);
    document.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("keydown", onKey, true);
      document.removeEventListener("click", onClick);
    };
  }, []);

  return (
    <form
      role="search"
      action={action}
      method="get"
      className="dh-search"
      data-ready={ready ? "" : undefined}
      onSubmit={(event) => {
        event.preventDefault();
        openDocsSearch(input.current?.value ?? "");
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        focusable="false"
        className="dh-icon"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
      <input
        ref={input}
        type="search"
        name="q"
        aria-label={prompt}
        placeholder={prompt}
        autoComplete="off"
        enterKeyHint="search"
        onClick={(event) => openDocsSearch(event.currentTarget.value)}
      />
      <kbd aria-hidden="true">{mac ? "⌘K" : "Ctrl K"}</kbd>
    </form>
  );
}

/**
 * Closes the header's <details> menus (language, mobile menu) on Escape, on
 * a click outside, and when another one opens. Renders nothing.
 */
export function HeaderMenus({ rootId }: { rootId: string }) {
  useEffect(() => {
    const root = document.getElementById(rootId);
    if (!root) return;
    const menus = () =>
      Array.from(root.querySelectorAll<HTMLDetailsElement>("details[open]"));
    const onClick = (event: MouseEvent) => {
      const target = event.target as Element;
      // The phone menu's backdrop and close button, and links in it.
      const closer = target.closest?.("[data-dh-close], .dh-drawer-panel a");
      for (const menu of menus())
        if (!menu.contains(target) || (closer && menu.contains(closer)))
          menu.open = false;
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      const open = menus();
      if (!open.length) return;
      const last = open[open.length - 1]!;
      last.open = false;
      last.querySelector("summary")?.focus();
    };
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [rootId]);
  return null;
}
