"use client";

import { DialogTitle } from "@radix-ui/react-dialog";
import { trackAskSolana } from "@solana-com/ui-chrome/ask-solana/analytics";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  useCallback,
  useLayoutEffect,
  useRef,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
  type RefCallback,
  type SyntheticEvent,
} from "react";
import { fullscreenHref } from "@/lib/docs/ask/handoff";
import { askStore } from "@/lib/docs/ask/store";
import { useAskSelector } from "@/lib/docs/ask/use-ask";
import { Maximize2Icon, Minimize2Icon, XIcon } from "../docs-ui-icons";
import { cn } from "./cn";
import { focusRing, headerHover, headerIconButton, visuallyHidden } from "./ui";

function HeaderButton({
  label,
  onClick,
  className,
  children,
  ref,
}: {
  label: string;
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  children: ReactNode;
  ref?: RefCallback<HTMLElement>;
}) {
  return (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={cn(headerIconButton, focusRing, className)}
    >
      {children}
    </button>
  );
}

function currentFullscreenHref(): string {
  if (typeof window === "undefined") return "";
  const { pathname, search, hash } = window.location;
  return fullscreenHref(
    { pathname, search, hash },
    askStore.getState().threadId,
  );
}

const modified = (event: MouseEvent | KeyboardEvent) =>
  event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;

/** Bri's full-screen event: expanded in place, or opened in a new tab. */
const trackFullscreen = (source: "expand" | "new_tab") =>
  trackAskSolana("docs_ai_widget_fullscreen", {
    conversation_id: askStore.getState().conversationId,
    source,
  });

/**
 * Expand to full screen: looks like the other header buttons but is a link
 * to this page full screen (lib/docs/ask/handoff.ts), so Ctrl/Cmd-click,
 * Shift-click, middle-click and "Open in new tab" open the conversation in
 * a new tab. A plain click expands in place. Whenever the browser may be
 * about to open the link, the thread is left for the new tab first.
 */
function ExpandLink({
  label,
  className,
  onExpand,
  ref,
}: {
  label: string;
  className?: string;
  /** Before a plain click expands in place. */
  onExpand?: (event: MouseEvent<HTMLAnchorElement>) => void;
  ref?: RefCallback<HTMLElement>;
}) {
  const link = useRef<HTMLAnchorElement | null>(null);
  const setLink = useCallback(
    (element: HTMLAnchorElement | null) => {
      link.current = element;
      ref?.(element);
    },
    [ref],
  );
  const pathname = usePathname();
  const threadId = useAskSelector((s) => s.threadId);
  // The link is this page and this thread. After a client-side navigation
  // the address bar changes only as the new page commits, after render.
  useLayoutEffect(() => {
    if (link.current) link.current.href = currentFullscreenHref();
  }, [pathname, threadId]);
  // A hash or query change re-renders nothing: refresh before each use.
  const refresh = (event: SyntheticEvent<HTMLAnchorElement>) => {
    event.currentTarget.href = currentFullscreenHref();
  };
  const handOff = (event: SyntheticEvent<HTMLAnchorElement>) => {
    refresh(event);
    askStore.prepareHandoff();
  };
  return (
    <a
      ref={setLink}
      href={currentFullscreenHref()}
      aria-label={label}
      title={label}
      onPointerEnter={refresh}
      onFocus={refresh}
      onPointerDown={handOff}
      onAuxClick={(event) => {
        if (event.button === 1) trackFullscreen("new_tab");
        handOff(event);
      }}
      onContextMenu={handOff}
      onDragStart={handOff}
      onKeyDown={(event) => {
        if (event.key === "Enter" && modified(event)) handOff(event);
      }}
      onClick={(event) => {
        if (event.button !== 0 || modified(event)) {
          if (event.button === 0) trackFullscreen("new_tab");
          return handOff(event);
        }
        event.preventDefault();
        askStore.releaseHandoff();
        onExpand?.(event);
        trackFullscreen("expand");
        askStore.setFullscreen(true);
      }}
      className={cn(headerIconButton, focusRing, className)}
    >
      <Maximize2Icon />
    </a>
  );
}

/**
 * The panel's title row: "Ask AI", then New chat (a labelled text button,
 * once there is a conversation), Expand / Exit full screen and Close. No
 * icon or badge beside the title. Header, thread and composer share one
 * 16px gutter. Full screen is a page under the docs header, so it has no bar
 * of its own: no rule, the title only for screen readers, and the buttons
 * at the reading column's top end. In a dialog (overlay, full screen) the
 * title labels it.
 */
export function AskHeader({
  fullscreen,
  dialog,
}: {
  fullscreen: boolean;
  dialog: boolean;
}) {
  const t = useTranslations("docsAsk");
  const tc = useTranslations("commands");
  const empty = useAskSelector((s) => s.messages.length === 0 && !s.busy);
  // Overlay ↔ full screen keeps the dialog but swaps Expand (a link) and
  // Exit (a button): focus on one moves to the other, not to the dialog.
  const toggle = useRef<HTMLElement | null>(null);
  const keepFocus = useRef(false);
  const setToggle = useCallback((element: HTMLElement | null) => {
    toggle.current = element;
  }, []);
  const toggled = (event: MouseEvent<HTMLElement>) => {
    keepFocus.current = document.activeElement === event.currentTarget;
  };
  useLayoutEffect(() => {
    if (keepFocus.current) toggle.current?.focus({ preventScroll: true });
    keepFocus.current = false;
  }, [fullscreen]);
  const titleClass = fullscreen
    ? visuallyHidden
    : "m-0 text-[14px] font-medium leading-5 tracking-normal text-[var(--sol-text)]";
  return (
    <div
      className={cn(
        "shrink-0",
        !fullscreen && "border-b border-[var(--sol-line)]",
      )}
    >
      <div
        className={cn(
          "flex h-12 items-center gap-2",
          fullscreen
            ? "mx-auto w-full max-w-[46rem] justify-end px-6"
            : "justify-between px-4",
        )}
      >
        {dialog ? (
          <DialogTitle className={titleClass}>{t("panelLabel")}</DialogTitle>
        ) : (
          <h2 className={titleClass}>{t("panelLabel")}</h2>
        )}
        {/* -me-1.5 lines the Close glyph up with the content's end edge. */}
        <div className="-me-1.5 flex items-center gap-0.5">
          {empty ? null : (
            <button
              type="button"
              onClick={() => askStore.reset()}
              className={cn(
                "me-1 h-7 rounded-lg px-2 text-[13px] leading-5 text-[var(--sol-muted)] transition-colors duration-150 motion-reduce:transition-none",
                headerHover,
                focusRing,
              )}
            >
              {t("newChat")}
            </button>
          )}
          {/* A phone sheet is already full screen; full screen keeps its
              way back at every width. */}
          {fullscreen ? (
            <HeaderButton
              ref={setToggle}
              label={t("collapse")}
              onClick={(event) => {
                toggled(event);
                askStore.setFullscreen(false);
              }}
            >
              <Minimize2Icon />
            </HeaderButton>
          ) : (
            <ExpandLink
              ref={setToggle}
              label={t("expand")}
              onExpand={toggled}
              className="max-sm:hidden"
            />
          )}
          <HeaderButton label={tc("close")} onClick={() => askStore.close()}>
            <XIcon />
          </HeaderButton>
        </div>
      </div>
    </div>
  );
}
