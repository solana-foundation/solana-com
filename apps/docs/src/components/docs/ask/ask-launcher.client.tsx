"use client";

import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState, type ReactNode } from "react";
import { cn } from "./cn";
import { isAskAiPath } from "@/lib/docs/ask-ai";
import { askStore } from "@/lib/docs/ask/store";
import { useAskSelector } from "@/lib/docs/ask/use-ask";
import { useHydrated } from "@/lib/docs/use-hydrated";
import { ASK_PANEL_ID } from "./ask-panel.client";
import { focusRing } from "./ui";

/** How the root finds the launcher (to give focus back on close). */
export const LAUNCHER_SELECTOR = "[data-ask-launcher]";

/**
 * What a launcher tells assistive tech: whether the panel is open, which
 * element it is (only while it exists), and that it opens a dialog where
 * the panel is one (the overlay below 1280px; docked, it is a sidebar).
 */
function useLauncherState() {
  const open = useAskSelector((s) => s.open);
  const overlay = useAskSelector((s) => s.prevLayout === "overlay");
  return {
    "aria-expanded": open,
    "aria-controls": open ? ASK_PANEL_ID : undefined,
    "aria-haspopup": overlay ? ("dialog" as const) : undefined,
  };
}

/** Hovering or focusing a launcher starts a session: the first answer is quicker. */
const warmProps = {
  onPointerEnter: () => askStore.warm(),
  onFocus: () => askStore.warm(),
};

/**
 * The docs header's ✨ (below 1280px, where there's no floating pill). It
 * opens through `[data-docs-ask-open]` (DOCS_ASK_OPEN_ATTR) like the
 * page's other openers; the header (a server component) sets its look.
 * `byPath`: for the prerendered 404, whose render doesn't know the URL;
 * shown once hydrated, on a /developers/docs URL only (isAskAiPath), as
 * the panel is (components/docs/docs-assistant.client.tsx).
 */
export function AskHeaderButton({
  label,
  className,
  children,
  byPath = false,
}: {
  label: string;
  className?: string;
  children: ReactNode;
  byPath?: boolean;
}) {
  const state = useLauncherState();
  const pathname = usePathname();
  const hydrated = useHydrated();
  if (byPath && !(hydrated && isAskAiPath(pathname))) return null;
  return (
    <button
      type="button"
      className={className}
      aria-label={label}
      title={label}
      data-docs-ask-open=""
      {...state}
      {...warmProps}
    >
      {children}
    </button>
  );
}

/**
 * "Ask AI ✨": a purple pill at the bottom end of the page from 1280px,
 * where it sits in the table of contents' column (narrower screens use the
 * header's ✨ button, so the pill never covers the page). Hidden while the
 * panel is open, including before hydration when the prepaint script has
 * docked it. Hovering or focusing it starts a session. The shortcut
 * (⌘I / Ctrl I) is only in the tooltip. The pill stays invisible until
 * hydration, since it can't open anything before then.
 */
export function AskLauncher() {
  const t = useTranslations("docsAsk");
  const tc = useTranslations("commands");
  const state = useLauncherState();
  const [shortcut, setShortcut] = useState<string | null>(null);
  useEffect(() => {
    setShortcut(
      /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)
        ? "⌘I"
        : "Ctrl I",
    );
  }, []);
  return (
    <div
      data-dev-landing="docs"
      data-docs=""
      className={cn(
        "fixed bottom-6 end-6 z-30 rounded-full !bg-transparent max-xl:hidden [html[data-ask]_&]:invisible",
        shortcut === null && "invisible",
      )}
    >
      <button
        type="button"
        data-ask-launcher=""
        aria-label={tc("askAI")}
        title={shortcut ? t("shortcutHint", { key: shortcut }) : undefined}
        onClick={() => askStore.open()}
        {...state}
        {...warmProps}
        className={cn(
          "group inline-flex h-9 items-center gap-1.5 rounded-full bg-[var(--sol-cta)] px-3.5 text-[14px] font-medium leading-5 text-[var(--sol-cta-text)] shadow-[0_6px_20px_-8px_rgb(153_69_255/0.55)] transition-colors duration-150 hover:bg-[var(--sol-cta-hover)] motion-reduce:transition-none",
          focusRing,
        )}
      >
        {tc("askAI")}
        {/* The emoji's colours can't be set, so a filter draws it white,
            like the label. */}
        <span
          aria-hidden="true"
          className="inline-block text-[15px] leading-none brightness-0 invert transition-transform duration-200 motion-safe:group-hover:rotate-12 motion-safe:group-hover:scale-110 motion-reduce:transition-none"
        >
          ✨
        </span>
      </button>
    </div>
  );
}
