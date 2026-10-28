"use client";

import * as React from "react";
import classNames from "classnames";
import { twMerge } from "tailwind-merge";
import { useTranslations } from "next-intl";
import {
  ExternalLink,
  Maximize2,
  Minimize2,
  RotateCcw,
  Send,
  X,
} from "react-feather";
import {
  prewarmAskSession,
  splitCodeFollowupPrompt,
  streamChat,
  type AskChatTiming,
  type AskCitation,
  type AskGenerativeUi,
  type CodeFollowupButton,
  type CodeFollowups,
} from "./api";
import { trackAskSolana } from "./analytics";
import {
  getStoredConversationId,
  storeConversationId,
} from "./conversation-store";
import { GenerativeUiAnswer } from "./generative-ui";
import { AnswerMarkdown } from "./markdown";
import type { AskSolanaWidgetSeed } from "./widget-store";

function cn(...inputs: classNames.ArgumentArray) {
  return twMerge(classNames(inputs));
}

// English-only copy, matching the design comp (precedent: the chat view's
// example questions are English-only too).
const GREETING =
  "Hi — I'm Vector. I'm a Solana expert and here to help your learning journey.";

function WidgetAnswerMarkdown({
  content,
  codeFollowups,
}: {
  content: string;
  codeFollowups: CodeFollowups | null;
}) {
  const { body } = splitCodeFollowupPrompt(content, codeFollowups);

  if (!body.trim()) return null;

  return <AnswerMarkdown content={body} isDark />;
}

function WidgetCodeFollowupCta({
  followups,
  disabled,
  onSelect,
}: {
  followups: CodeFollowups | null;
  disabled: boolean;
  onSelect: (_button: CodeFollowupButton) => void;
}) {
  if (!followups || followups.buttons.length === 0) return null;

  return (
    <section className="mt-3 rounded-xl border border-white/10 bg-white/[0.035] p-3">
      <p className="m-0 text-sm leading-relaxed text-gray-300">
        {followups.prompt}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {followups.buttons.map((button) => (
          <button
            key={`${button.language}-${button.message}`}
            type="button"
            data-language={button.language}
            disabled={disabled}
            onClick={() => onSelect(button)}
            className="rounded-lg border border-white/15 px-3 py-1.5 text-sm font-medium text-gray-200 transition-colors hover:border-white/30 hover:text-white focus:outline-none focus:ring-2 focus:ring-[#9945FF] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {button.label}
          </button>
        ))}
      </div>
    </section>
  );
}

type UserMessage = { role: "user"; content: string };
type AssistantMessage = {
  role: "assistant";
  content: string;
  citations: AskCitation[];
  generativeUi: AskGenerativeUi | null;
  codeFollowups: CodeFollowups | null;
  state: "streaming" | "done" | "error";
  statusStage: string | null;
  visualStatus: string | null;
  errorKind:
    | "rate_limited"
    | "conversation_not_found"
    | "conversation_full"
    | "generic"
    | null;
};
type ChatMessage = UserMessage | AssistantMessage;

/**
 * Compact "Vector" chat popover anchored above the fixed launcher robot
 * (bottom-right). Talks to the same docs-agent backend as the modal chat
 * view, in the launcher-widget shell from the design comp: gradient top
 * edge, online header, greeting bubble, "Message Vector…" composer.
 * Deliberately dark-only — it floats on the brand near-black regardless of
 * site theme. Stays mounted while closed so the conversation survives
 * toggling the launcher.
 *
 * The header's expand toggle docks the chat as a full-height panel over the
 * right third of the screen; a class on <html> pads the body so the page
 * content shifts left beside it instead of being covered.
 */
const EXPANDED_HTML_CLASS = "ask-solana-expanded";
const DEFAULT_PANEL_WIDTH = "max(360px, 33.333vw)";
const PANEL_WIDTH_VAR = "--ask-solana-panel-width";
const RESIZING_HTML_CLASS = "ask-solana-resizing";
const PANEL_WIDTH_STORAGE_KEY = "ask-solana:panel-width";
const MIN_PANEL_WIDTH = 320;
// Leave at least a quarter of the viewport for the page beside the panel.
const clampPanelWidth = (width: number) =>
  Math.round(
    Math.min(Math.max(width, MIN_PANEL_WIDTH), window.innerWidth * 0.75),
  );

export function AskSolanaWidget({
  open,
  onClose,
  seed = null,
}: {
  open: boolean;
  onClose: () => void;
  /** A question to open the panel with: expands the widget and sends it once per seed id. */
  seed?: AskSolanaWidgetSeed | null;
}) {
  const t = useTranslations();
  const [expanded, setExpanded] = React.useState(false);
  // User-chosen panel width in px; null = the default (a third of the screen).
  const [panelWidth, setPanelWidth] = React.useState<number | null>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [input, setInput] = React.useState("");
  const [isBusy, setIsBusy] = React.useState(false);
  const [notice, setNotice] = React.useState<string | null>(null);
  const abortRef = React.useRef<AbortController | null>(null);
  const requestIdRef = React.useRef(0);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (!open) return;
    prewarmAskSession();
    inputRef.current?.focus();
  }, [open]);

  React.useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  React.useEffect(() => {
    // Abort any in-flight stream when the widget unmounts.
    return () => abortRef.current?.abort();
  }, []);

  React.useEffect(() => {
    // Shift the page content left while the chat is docked as a side panel.
    const root = document.documentElement;
    if (open && expanded) root.classList.add(EXPANDED_HTML_CLASS);
    else root.classList.remove(EXPANDED_HTML_CLASS);
    return () => root.classList.remove(EXPANDED_HTML_CLASS);
  }, [open, expanded]);

  React.useEffect(() => {
    // Restore the width the visitor last dragged the panel to.
    try {
      const saved = Number(
        window.localStorage.getItem(PANEL_WIDTH_STORAGE_KEY),
      );
      if (Number.isFinite(saved) && saved > 0) {
        setPanelWidth(clampPanelWidth(saved));
      }
    } catch {
      // Storage unavailable (private mode, blocked): keep the default.
    }
  }, []);

  React.useEffect(() => {
    // The page's right padding follows the same variable as the panel, so the
    // two always add up to the viewport.
    const root = document.documentElement;
    if (open && expanded && panelWidth !== null) {
      root.style.setProperty(PANEL_WIDTH_VAR, `${panelWidth}px`);
    } else {
      root.style.removeProperty(PANEL_WIDTH_VAR);
    }
    return () => {
      root.style.removeProperty(PANEL_WIDTH_VAR);
    };
  }, [open, expanded, panelWidth]);

  const savePanelWidth = (width: number | null) => {
    try {
      if (width === null) {
        window.localStorage.removeItem(PANEL_WIDTH_STORAGE_KEY);
      } else {
        window.localStorage.setItem(PANEL_WIDTH_STORAGE_KEY, String(width));
      }
    } catch {
      // Ignore storage failures; the width just won't persist.
    }
  };

  const onResizePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    document.documentElement.classList.add(RESIZING_HTML_CLASS);
  };

  const onResizePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
    setPanelWidth(clampPanelWidth(window.innerWidth - event.clientX));
  };

  const onResizePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
    event.currentTarget.releasePointerCapture(event.pointerId);
    document.documentElement.classList.remove(RESIZING_HTML_CLASS);
    const width = panelRef.current?.getBoundingClientRect().width;
    if (width) savePanelWidth(clampPanelWidth(width));
  };

  const onResizeKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const current =
      panelRef.current?.getBoundingClientRect().width ?? MIN_PANEL_WIDTH;
    const step = event.shiftKey ? 96 : 24;
    let next: number;
    // The panel is on the right, so ArrowLeft widens it.
    if (event.key === "ArrowLeft") next = clampPanelWidth(current + step);
    else if (event.key === "ArrowRight") next = clampPanelWidth(current - step);
    else return;
    event.preventDefault();
    setPanelWidth(next);
    savePanelWidth(next);
  };

  const resetPanelWidth = () => {
    setPanelWidth(null);
    savePanelWidth(null);
  };

  const toggleExpanded = () => {
    const next = !expanded;
    if (next) trackAskSolana("docs_ai_widget_expanded", {});
    setExpanded(next);
  };

  React.useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  const updateLastAssistant = React.useCallback(
    (update: (message: AssistantMessage) => AssistantMessage) => {
      setMessages((current) => {
        const next = [...current];
        for (let i = next.length - 1; i >= 0; i--) {
          const message = next[i];
          if (message && message.role === "assistant") {
            next[i] = update(message);
            break;
          }
        }
        return next;
      });
    },
    [],
  );

  const send = React.useCallback(
    (raw: string) => {
      const message = raw.trim();
      if (!message || isBusy) return;

      const requestId = requestIdRef.current + 1;
      requestIdRef.current = requestId;
      setInput("");
      setNotice(null);
      setIsBusy(true);
      setMessages((current) => [
        ...current,
        { role: "user", content: message },
        {
          role: "assistant",
          content: "",
          citations: [],
          generativeUi: null,
          codeFollowups: null,
          state: "streaming",
          statusStage: null,
          visualStatus: null,
          errorKind: null,
        },
      ]);
      trackAskSolana("docs_ai_message_sent", {
        conversation_id: getStoredConversationId(),
        message_length: message.length,
        surface: "widget",
      });

      const controller = new AbortController();
      abortRef.current = controller;
      const trackTiming = (timing: AskChatTiming) => {
        trackAskSolana("docs_ai_timing", {
          surface: "widget",
          phase: timing.phase,
          elapsed_ms: timing.elapsedMs,
          detail: timing.detail ?? undefined,
          conversation_id: getStoredConversationId(),
        });
      };
      const deferGenerativeUi = (generativeUi: AskGenerativeUi | null) => {
        if (!generativeUi) return;
        window.setTimeout(() => {
          if (requestIdRef.current !== requestId) return;
          updateLastAssistant((m) =>
            m.generativeUi ? m : { ...m, generativeUi, statusStage: null },
          );
        }, 0);
      };

      void streamChat({
        message,
        conversationId: getStoredConversationId(),
        signal: controller.signal,
        handlers: {
          onStatus: (stage) =>
            updateLastAssistant((m) => ({ ...m, statusStage: stage })),
          onDelta: (text) =>
            updateLastAssistant((m) => ({
              ...m,
              content: m.content + text,
              statusStage: null,
            })),
          onUiStatus: (stage) =>
            updateLastAssistant((m) => ({
              ...m,
              visualStatus: stage,
            })),
          onGenerativeUi: (generativeUi) =>
            updateLastAssistant((m) => ({
              ...m,
              generativeUi,
              visualStatus: null,
              statusStage: null,
            })),
          onDone: ({
            response,
            conversationId,
            citations,
            generativeUi,
            codeFollowups,
          }) => {
            if (conversationId) storeConversationId(conversationId);
            updateLastAssistant((m) => ({
              ...m,
              content: response ?? m.content,
              citations,
              codeFollowups,
              state: "done",
              statusStage: null,
              visualStatus: null,
            }));
            deferGenerativeUi(generativeUi);
            setIsBusy(false);
          },
          onError: (errorMessage) => {
            updateLastAssistant((m) => ({
              ...m,
              state: "error",
              statusStage: null,
              visualStatus: null,
              errorKind:
                errorMessage === "rate_limited" ||
                errorMessage === "conversation_not_found" ||
                errorMessage === "conversation_full"
                  ? errorMessage
                  : "generic",
            }));
            if (errorMessage === "conversation_full") storeConversationId(null);
            setIsBusy(false);
          },
          onConversationReset: () => {
            storeConversationId(null);
            setNotice(t("askSolana.conversationReset"));
          },
          onTiming: trackTiming,
        },
      });
    },
    [isBusy, t, updateLastAssistant],
  );

  const lastSeedIdRef = React.useRef<number | null>(null);
  React.useEffect(() => {
    if (!seed || lastSeedIdRef.current === seed.id) return;
    lastSeedIdRef.current = seed.id;
    setExpanded(true);
    send(seed.query);
  }, [seed, send]);

  // Starts a fresh conversation; the anonymous session token is kept.
  const resetChat = () => {
    abortRef.current?.abort();
    requestIdRef.current += 1;
    storeConversationId(null);
    setMessages([]);
    setNotice(null);
    setIsBusy(false);
    inputRef.current?.focus();
  };

  // Full-screen view in a new tab, re-asking the latest question there.
  const openFullScreen = () => {
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    const url = lastUser
      ? `/docs/ask?q=${encodeURIComponent(lastUser.content)}`
      : "/docs/ask";
    trackAskSolana("docs_ai_widget_fullscreen", {
      conversation_id: getStoredConversationId(),
    });
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const statusLabel = (stage: string | null) =>
    stage === "searching_docs"
      ? t("askSolana.statusSearching")
      : stage === "cache_hit"
        ? "Loading cached answer"
        : stage === "session_start"
          ? "Opening session"
          : stage === "chat_connecting"
            ? "Connecting"
            : t("askSolana.statusThinking");
  const visualStatusLabel = (stage: string | null) =>
    stage ? "Building visual companion" : "Building visual companion";
  const handleCodeFollowup = (button: CodeFollowupButton) => {
    trackAskSolana("docs_ai_code_followup_clicked", {
      language: button.language,
      type: button.type,
      surface: "widget",
    });
    send(button.message);
  };

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-label="Vector — AI docs assistant"
      className={cn(
        "fixed z-[50] flex-col overflow-hidden border-white/10 bg-[#0a0a10] text-white",
        expanded
          ? "inset-y-0 right-0 w-[var(--ask-solana-panel-width)] border-l shadow-[-24px_0_64px_rgba(0,0,0,0.45)]"
          : [
              "bottom-[110px] right-8",
              "w-[min(376px,calc(100vw-32px))] h-[min(560px,calc(100vh-170px))]",
              "rounded-2xl border shadow-[0_24px_64px_rgba(0,0,0,0.6)]",
            ],
        open ? "flex" : "hidden",
      )}
    >
      <style>{`
        body { transition: padding-right 0.3s ease; }
        html.${RESIZING_HTML_CLASS} body { transition: none; }
        html.${EXPANDED_HTML_CLASS} { ${PANEL_WIDTH_VAR}: ${DEFAULT_PANEL_WIDTH}; }
        html.${EXPANDED_HTML_CLASS} body { padding-right: var(${PANEL_WIDTH_VAR}); }
      `}</style>
      {expanded ? (
        <div
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize chat panel"
          title="Drag to resize · double-click to reset"
          tabIndex={0}
          onPointerDown={onResizePointerDown}
          onPointerMove={onResizePointerMove}
          onPointerUp={onResizePointerUp}
          onPointerCancel={onResizePointerUp}
          onKeyDown={onResizeKeyDown}
          onDoubleClick={resetPanelWidth}
          className="absolute inset-y-0 left-0 z-10 w-1.5 cursor-col-resize touch-none transition-colors hover:bg-[#9945FF]/50 focus:bg-[#9945FF]/60 focus:outline-none active:bg-[#9945FF]/70 max-md:hidden"
        />
      ) : null}
      <div
        className="h-0.5 shrink-0 bg-gradient-to-r from-[#9945FF] to-[#14F195]"
        aria-hidden="true"
      />

      <div className="flex items-start justify-between border-b border-white/10 px-4 py-3">
        <div>
          <div className="text-[15px] font-semibold leading-tight">Vector</div>
          <div className="mt-1 flex items-center gap-1.5 font-mono text-[11px] text-gray-500">
            <span
              className="inline-block size-1.5 animate-pulse rounded-full bg-[#14F195]"
              aria-hidden="true"
            />
            Online · ai docs assistant
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            aria-label={t("askSolana.newChat")}
            title={t("askSolana.newChat")}
            onClick={resetChat}
            className="rounded-lg border border-white/10 p-1.5 text-gray-400 transition-colors hover:text-white focus:outline-none focus:ring-2 focus:ring-[#9945FF]"
          >
            <RotateCcw size={14} />
          </button>
          <button
            type="button"
            aria-label="Open full screen in a new tab"
            title="Open full screen in a new tab"
            onClick={openFullScreen}
            className="rounded-lg border border-white/10 p-1.5 text-gray-400 transition-colors hover:text-white focus:outline-none focus:ring-2 focus:ring-[#9945FF]"
          >
            <ExternalLink size={14} />
          </button>
          <button
            type="button"
            aria-label={expanded ? "Collapse chat" : "Expand chat"}
            title={expanded ? "Collapse chat" : "Expand chat"}
            onClick={toggleExpanded}
            className="rounded-lg border border-white/10 p-1.5 text-gray-400 transition-colors hover:text-white focus:outline-none focus:ring-2 focus:ring-[#9945FF] max-md:hidden"
          >
            {expanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
          <button
            type="button"
            aria-label={t("commands.close")}
            onClick={onClose}
            className="rounded-lg border border-white/10 p-1.5 text-gray-400 transition-colors hover:text-white focus:outline-none focus:ring-2 focus:ring-[#9945FF]"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        <div className="mb-3 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-gray-600">
          Ask about this page
        </div>
        <div className="flex flex-col gap-3">
          <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-white/[0.06] px-4 py-3 text-sm leading-relaxed text-gray-200">
            {GREETING}
          </div>
          {messages.map((message, index) =>
            message.role === "user" ? (
              <div key={index} className="flex justify-end">
                <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-white/10 px-4 py-2.5 text-sm">
                  {message.content}
                </div>
              </div>
            ) : (
              <div key={index} className="max-w-full text-sm">
                {message.content ? (
                  <WidgetAnswerMarkdown
                    content={message.content}
                    codeFollowups={message.codeFollowups}
                  />
                ) : null}
                {message.state === "streaming" && !message.content ? (
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <span className="inline-block size-2 animate-pulse rounded-full bg-[#9945FF]" />
                    {statusLabel(message.statusStage)}
                  </div>
                ) : null}
                {message.visualStatus && !message.generativeUi ? (
                  <div className="mt-3 flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-3 py-2 text-sm text-gray-400">
                    <span className="inline-block size-2 animate-pulse rounded-full bg-[#14F195]" />
                    {visualStatusLabel(message.visualStatus)}
                  </div>
                ) : null}
                {message.state === "error" ? (
                  <div className="text-sm text-red-400">
                    <p>
                      {message.errorKind === "rate_limited"
                        ? t("askSolana.errorRateLimited")
                        : message.errorKind === "conversation_not_found"
                          ? t("askSolana.conversationReset")
                          : message.errorKind === "conversation_full"
                            ? t("askSolana.conversationFull")
                            : t("askSolana.errorGeneric")}
                    </p>
                    {message.errorKind === "conversation_full" ? (
                      <button
                        type="button"
                        onClick={resetChat}
                        className="mt-2 rounded-lg border border-white/20 px-3 py-1.5 text-white transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[#9945FF]"
                      >
                        {t("askSolana.newChat")}
                      </button>
                    ) : null}
                  </div>
                ) : null}
                {message.state === "done" ? (
                  <>
                    <WidgetCodeFollowupCta
                      followups={message.codeFollowups}
                      disabled={isBusy}
                      onSelect={handleCodeFollowup}
                    />
                    {message.generativeUi ? (
                      <div className="mt-3">
                        <GenerativeUiAnswer ui={message.generativeUi} />
                      </div>
                    ) : null}
                    {message.citations.length > 0 ? (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {message.citations.map((citation) => (
                          <a
                            key={citation.url}
                            href={citation.url}
                            className="rounded-full border border-gray-700 px-2.5 py-1 text-xs text-gray-300 transition-colors hover:border-gray-500 hover:text-white"
                          >
                            {citation.title || citation.url}
                          </a>
                        ))}
                      </div>
                    ) : null}
                  </>
                ) : null}
              </div>
            ),
          )}
        </div>
      </div>

      <div className="border-t border-white/10 p-3">
        {notice ? (
          <p role="status" className="mb-2 text-xs text-gray-400">
            {notice}
          </p>
        ) : null}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="relative"
        >
          <textarea
            ref={inputRef}
            rows={expanded ? 3 : 1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(input);
              }
            }}
            placeholder="Message Vector…"
            className={cn(
              "block w-full resize-none overflow-x-hidden rounded-xl border border-white/10 bg-black/40 py-2.5 pl-3.5 pr-12 text-sm text-white outline-none placeholder:text-gray-500 focus:border-white/20",
              expanded ? "max-h-48" : "max-h-28",
            )}
          />
          <button
            type="submit"
            disabled={isBusy || input.trim().length === 0}
            aria-label={t("askSolana.send")}
            className={cn(
              // !important: the global form reset ([type="submit"] {
              // background-image: none }) ties this class's specificity and
              // wins on order, hiding the gradient.
              "absolute grid place-items-center rounded-lg !bg-gradient-to-br from-[#9945FF] to-[#14F195] text-[#0a0a10] transition-opacity disabled:opacity-40",
              expanded
                ? "bottom-2 right-2 size-9"
                : "right-1.5 top-1/2 size-8 -translate-y-1/2",
            )}
          >
            <Send size={15} />
          </button>
        </form>
      </div>
    </div>
  );
}
