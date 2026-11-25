"use client";

import {
  Content as DialogContent,
  Overlay as DialogOverlay,
  Portal as DialogPortal,
  Root as DialogRoot,
} from "@radix-ui/react-dialog";
import { useTranslations } from "next-intl";
import {
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
} from "react";
import { ASK_PANEL_WIDTH } from "@/lib/docs/ask/config";
import { askStore, type AskLayout } from "@/lib/docs/ask/store";
import { useAskSelector } from "@/lib/docs/ask/use-ask";
import { AskComposer } from "./ask-composer.client";
import { AskHeader } from "./ask-header.client";
import { AskThread } from "./ask-thread.client";
import { cn } from "./cn";
import { PALETTE } from "./ui";

/**
 * Id of the panel in every layout (the resize handle and the launchers
 * control it).
 */
export const ASK_PANEL_ID = "docs-ask-panel";

/**
 * Tokens the docs don't define on every route: answer body text (the docs'
 * prose colour; a touch brighter in dark for 14px text) and the code block
 * surfaces (docs.css has them only on docs pages). Plus the accent palette.
 */
const PANEL_TOKENS = `[--ask-body:#434046] dark:[--ask-body:#b4b1b8] [--ask-code-bg:#fafafb] dark:[--ask-code-bg:#111113] [--ask-code-head:#f4f4f5] dark:[--ask-code-head:#151518] ${PALETTE}`;

const ENTER =
  "animate-in fade-in-0 slide-in-from-right-2 duration-150 motion-reduce:animate-none rtl:slide-in-from-left-2";

/**
 * Header, thread and composer, the same in every layout. Docs links in an
 * answer navigate behind an overlay or full-screen panel, so following one
 * gets the panel out of the way (back to docked, or closed).
 */
function PanelBody({ layout, dialog }: { layout: AskLayout; dialog: boolean }) {
  const fullscreen = layout === "fullscreen";
  const prevLayout = useAskSelector((s) => s.prevLayout);
  const onClick = (event: MouseEvent<HTMLDivElement>) => {
    if (layout === "docked" || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
      return;
    const link = (event.target as Element).closest?.("a[data-ask-internal]");
    if (!link) return;
    if (fullscreen && prevLayout === "docked") askStore.setFullscreen(false);
    else askStore.close();
  };
  return (
    // Listens for link clicks only; the links are the controls.
    <div
      onClick={onClick}
      className={cn(
        "flex h-full flex-col bg-[var(--sol-page)] text-[14px] leading-6 text-[var(--sol-text)]",
        PANEL_TOKENS,
      )}
    >
      <AskHeader fullscreen={fullscreen} dialog={dialog} />
      <AskThread fullscreen={fullscreen} />
      <AskComposer fullscreen={fullscreen} />
    </div>
  );
}

/**
 * The docked panel's start edge: drag, or arrow keys (Shift for bigger
 * steps, Home/End for the limits); double-click goes back to the default
 * width. Invisible until hovered (a neutral rule, after a beat, so a pointer
 * resting there after docking doesn't light it), purple while focused or
 * dragged.
 */
function ResizeHandle() {
  const t = useTranslations("docsAsk");
  const width = useAskSelector((s) => s.width);
  const min = useAskSelector((s) => s.widthMin);
  const max = useAskSelector((s) => s.widthMax);
  const handle = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);

  const rtl = () =>
    !!handle.current && getComputedStyle(handle.current).direction === "rtl";

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(true);
  };
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    const panel = event.currentTarget.parentElement?.getBoundingClientRect();
    if (!panel) return;
    askStore.setWidth(
      rtl() ? event.clientX - panel.left : panel.right - event.clientX,
    );
  };
  const stopDragging = (event: PointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId);
    setDragging(false);
  };
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = event.shiftKey
      ? ASK_PANEL_WIDTH.largeStep
      : ASK_PANEL_WIDTH.step;
    // The panel grows towards the page: left in LTR, right in RTL.
    const grow = rtl() ? "ArrowRight" : "ArrowLeft";
    const shrink = rtl() ? "ArrowLeft" : "ArrowRight";
    let next: number | null = null;
    if (event.key === grow) next = width + step;
    else if (event.key === shrink) next = width - step;
    else if (event.key === "Home") next = min;
    else if (event.key === "End") next = max;
    if (next === null) return;
    event.preventDefault();
    askStore.setWidth(next);
  };

  return (
    <div
      ref={handle}
      role="separator"
      aria-orientation="vertical"
      aria-label={t("resize")}
      aria-controls={ASK_PANEL_ID}
      aria-valuenow={width}
      aria-valuemin={min}
      aria-valuemax={max}
      tabIndex={0}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={stopDragging}
      onPointerCancel={stopDragging}
      onKeyDown={onKeyDown}
      onDoubleClick={() => askStore.resetWidth()}
      className="group absolute inset-y-0 start-[-3px] z-10 w-1.5 cursor-col-resize touch-none outline-none"
    >
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-y-0 start-0.5 w-0.5 bg-[var(--sol-line-strong)] opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-hover:delay-150 group-focus-visible:bg-[var(--sol-purple)] group-focus-visible:opacity-100 group-focus-visible:delay-0 motion-reduce:transition-none",
          dragging && "bg-[var(--sol-purple)] opacity-100 delay-0",
        )}
      />
    </div>
  );
}

/**
 * Docked (viewport >= 1280px): a right-hand sidebar under the docs header,
 * beside the page, which makes room for it (html[data-ask=docked] and
 * --ask-w, see docs-page.tsx). Not modal: the page stays usable. Esc from
 * inside closes it, and the root hands focus back to whatever opened it.
 */
export function DockedPanel({ animate }: { animate: boolean }) {
  const t = useTranslations("docsAsk");
  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== "Escape" || event.defaultPrevented) return;
    // Esc that ends an IME composition isn't for the panel.
    if (event.nativeEvent.isComposing) return;
    event.preventDefault();
    askStore.close();
  };
  return (
    <aside
      id={ASK_PANEL_ID}
      data-dev-landing="docs"
      data-docs=""
      data-ask-panel=""
      aria-label={t("panelLabel")}
      onKeyDown={onKeyDown}
      className={cn(
        "fixed bottom-0 end-0 top-16 z-30 w-[var(--ask-w,420px)] border-s border-[var(--sol-line)] [view-transition-name:ask-panel]",
        animate && ENTER,
      )}
    >
      <ResizeHandle />
      <PanelBody layout="docked" dialog={false} />
    </aside>
  );
}

/**
 * Overlay (narrower viewports) and full screen, as a modal dialog. The
 * overlay slides in from the inline end over a dimmed page (full width
 * below 640px); Esc closes it. Full screen covers the whole window, docs
 * header included, and reads in a centred column; Esc goes back to the
 * previous layout.
 */
export function ModalPanel({
  layout,
  animate,
  onOpenFocus,
  onClosedFocus,
}: {
  layout: "overlay" | "fullscreen";
  animate: boolean;
  /** Where focus goes when the dialog opens (the composer). */
  onOpenFocus: () => void;
  /** Where focus goes once the dialog is gone. */
  onClosedFocus: () => void;
}) {
  const fullscreen = layout === "fullscreen";
  return (
    <DialogRoot
      open
      modal
      onOpenChange={(open) => {
        if (!open) askStore.close();
      }}
    >
      <DialogPortal>
        {fullscreen ? null : (
          <DialogOverlay
            className={cn(
              "fixed inset-0 z-[55] bg-black/40",
              animate &&
                "animate-in fade-in-0 duration-150 motion-reduce:animate-none",
            )}
          />
        )}
        <DialogContent
          id={ASK_PANEL_ID}
          data-dev-landing="docs"
          data-docs=""
          data-ask-panel=""
          aria-describedby={undefined}
          onOpenAutoFocus={(event) => {
            event.preventDefault();
            onOpenFocus();
          }}
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            onClosedFocus();
          }}
          onEscapeKeyDown={(event) => {
            if (!fullscreen) return;
            event.preventDefault();
            askStore.setFullscreen(false);
          }}
          className={cn(
            "fixed outline-none",
            fullscreen
              ? // Over the docs header (z-40) and its menus (z-50).
                "inset-0 z-[55]"
              : "inset-y-0 end-0 z-[55] w-[min(28rem,100vw)] border-s border-[var(--sol-line)] shadow-[var(--sol-menu-shadow)] max-sm:inset-0 max-sm:w-full max-sm:border-s-0 dark:border-[var(--sol-line-strong)]",
            animate &&
              (fullscreen
                ? "animate-in fade-in-0 duration-150 motion-reduce:animate-none"
                : ENTER),
          )}
        >
          <PanelBody layout={layout} dialog />
        </DialogContent>
      </DialogPortal>
    </DialogRoot>
  );
}
