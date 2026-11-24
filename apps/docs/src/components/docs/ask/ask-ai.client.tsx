"use client";

import { useTranslations } from "next-intl";
import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { connectAskAnalytics } from "@/lib/docs/ask/analytics";
import {
  askStore,
  connectAskAiEvents,
  connectAskHtml,
} from "@/lib/docs/ask/store";
import { useAskSelector } from "@/lib/docs/ask/use-ask";
import { COMPOSER_SELECTOR } from "./ask-composer.client";
import { AskLauncher, LAUNCHER_SELECTOR } from "./ask-launcher.client";
import { DockedPanel, ModalPanel } from "./ask-panel.client";
import { AskSelection } from "./ask-selection.client";

/**
 * Focuses the composer with the caret at the end of the draft: the docked
 * field stays mounted and would keep wherever its caret last was.
 */
function focusComposer() {
  const field = document.querySelector<HTMLTextAreaElement>(COMPOSER_SELECTOR);
  if (!field) return;
  field.focus({ preventScroll: true });
  const end = field.value.length;
  field.setSelectionRange(end, end);
}

/** Text fields other than our composer keep ⌘I / Ctrl+I (italic, say). */
function isOtherField(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  if (target.matches(COMPOSER_SELECTOR)) return false;
  return (
    target.isContentEditable ||
    target.closest("input, textarea, select, [contenteditable='true']") !== null
  );
}

/**
 * Ask AI on the docs (/developers/docs): the launcher, the one panel and
 * the "Ask AI about this" pill by selected text, mounted once in the docs
 * layout (DocsAssistant) so the conversation survives client-side
 * navigation, and the panel's room on <html> goes when it unmounts (a move
 * to the cookbook, which has Inkeep). Routes every
 * opener to the store (`openAskAi()` from code blocks, page actions and
 * the search hand-off; `[data-docs-ask-open]` buttons; ⌘I / Ctrl+I; the
 * pill), passes the localized prompts to it, sends Ask AI's analytics
 * events (and the search's) to GA4, and gives focus back to whatever
 * opened the panel when it closes. Stored state (an open panel, the
 * thread) is read after hydration, and not at all while the page is only
 * prerendered.
 */
export function AskAi() {
  const t = useTranslations("docsAsk");
  const hydrated = useAskSelector((s) => s.hydrated);
  const open = useAskSelector((s) => s.open);
  const layout = useAskSelector((s) => s.layout);
  const focusRequest = useAskSelector((s) => s.focusRequest);
  const opener = useRef<HTMLElement | null>(null);
  const handledFocus = useRef(0);
  const wasOpen = useRef(false);

  // A panel restored open on load appears without the slide-in.
  const restored = useRef<"pending" | "open" | "settled">("pending");
  if (hydrated && restored.current === "pending")
    restored.current = open ? "open" : "settled";
  if (!open && restored.current === "open") restored.current = "settled";
  const animate = restored.current === "settled";

  useEffect(() => {
    askStore.setPrompts({
      explainCode: (title) => t("prompts.explainCode", { title }),
      explainCodeSent: () => t("prompts.explainCodeSent"),
      explainSelection: () => t("prompts.explainSelection"),
    });
  }, [t]);

  // Before paint: back on the docs after the cookbook, a docked panel
  // takes its room in the same frame.
  useLayoutEffect(() => connectAskHtml(), []);
  useEffect(() => connectAskAiEvents(), []);
  useEffect(() => connectAskAnalytics(), []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== "i" || event.altKey || event.shiftKey)
        return;
      if (!(event.metaKey || event.ctrlKey) || isOtherField(event.target))
        return;
      event.preventDefault();
      askStore.toggle();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Remember the opener before the panel takes focus.
  useLayoutEffect(() => {
    if (!open) return;
    const active = document.activeElement;
    opener.current =
      active instanceof HTMLElement &&
      active !== document.body &&
      !active.closest("[data-ask-panel]")
        ? active
        : null;
  }, [open]);

  const restoreFocus = useCallback(() => {
    // Still open: the layout changed (full screen ↔ docked).
    if (askStore.getState().open) return focusComposer();
    // The opener if it can still take focus (it may be gone or hidden),
    // else the launcher.
    const launcher = document.querySelector<HTMLElement>(LAUNCHER_SELECTOR);
    for (const element of [opener.current, launcher]) {
      if (!element?.isConnected) continue;
      element.focus({ preventScroll: true });
      if (document.activeElement === element) return;
    }
  }, []);

  // The docked panel is not a dialog: if it held focus, hand it back.
  useEffect(() => {
    if (open) {
      wasOpen.current = true;
      return;
    }
    if (!wasOpen.current) return;
    wasOpen.current = false;
    const active = document.activeElement;
    if (!active || active === document.body) restoreFocus();
  }, [open, restoreFocus]);

  // "Focus the composer" requests (open, New chat, Ask about this page).
  useEffect(() => {
    if (!open || focusRequest <= handledFocus.current) return;
    handledFocus.current = focusRequest;
    focusComposer();
  }, [open, focusRequest]);

  return (
    <>
      <AskLauncher />
      <AskSelection />
      {hydrated && open ? (
        layout === "docked" ? (
          <DockedPanel animate={animate} />
        ) : (
          <ModalPanel
            layout={layout}
            animate={animate}
            onOpenFocus={focusComposer}
            onClosedFocus={restoreFocus}
          />
        )
      ) : null}
    </>
  );
}
