"use client";

import * as React from "react";
import classNames from "classnames";
import { twMerge } from "tailwind-merge";
import { useTranslations } from "next-intl";
import { Maximize2, Minimize2, Send, X } from "react-feather";
import { streamChat, type AskCitation } from "./api";
import { trackAskSolana } from "./analytics";
import { AnswerMarkdown } from "./markdown";

function cn(...inputs: classNames.ArgumentArray) {
  return twMerge(classNames(inputs));
}

// English-only copy, matching the design comp (precedent: the chat view's
// example questions are English-only too).
const GREETING =
  "Hi — I'm Vector. I'm a Solana expert and here to help your learning journey.";

type UserMessage = { role: "user"; content: string };
type AssistantMessage = {
  role: "assistant";
  content: string;
  citations: AskCitation[];
  state: "streaming" | "done" | "error";
  statusStage: string | null;
  errorKind: "rate_limited" | "generic" | null;
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
const EXPANDED_WIDTH = "max(360px, 33.333vw)";

export function AskSolanaWidget({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const t = useTranslations();
  const [expanded, setExpanded] = React.useState(false);
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [input, setInput] = React.useState("");
  const [isBusy, setIsBusy] = React.useState(false);
  const conversationIdRef = React.useRef<string | null>(null);
  const abortRef = React.useRef<AbortController | null>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (open) inputRef.current?.focus();
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
          if (message.role === "assistant") {
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

      setInput("");
      setIsBusy(true);
      setMessages((current) => [
        ...current,
        { role: "user", content: message },
        {
          role: "assistant",
          content: "",
          citations: [],
          state: "streaming",
          statusStage: null,
          errorKind: null,
        },
      ]);
      trackAskSolana("docs_ai_message_sent", {
        conversation_id: conversationIdRef.current,
        message_length: message.length,
        surface: "widget",
      });

      const controller = new AbortController();
      abortRef.current = controller;

      void streamChat({
        message,
        conversationId: conversationIdRef.current,
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
          onDone: ({ conversationId, citations }) => {
            if (conversationId) conversationIdRef.current = conversationId;
            updateLastAssistant((m) => ({
              ...m,
              citations,
              state: "done",
              statusStage: null,
            }));
            setIsBusy(false);
          },
          onError: (errorMessage) => {
            updateLastAssistant((m) => ({
              ...m,
              state: "error",
              statusStage: null,
              errorKind:
                errorMessage === "rate_limited" ? "rate_limited" : "generic",
            }));
            setIsBusy(false);
          },
        },
      });
    },
    [isBusy, updateLastAssistant],
  );

  const statusLabel = (stage: string | null) =>
    stage === "searching_docs"
      ? t("askSolana.statusSearching")
      : t("askSolana.statusThinking");

  return (
    <div
      role="dialog"
      aria-label="Vector — AI docs assistant"
      className={cn(
        "fixed z-[50] flex-col overflow-hidden border-white/10 bg-[#0a0a10] text-white",
        expanded
          ? "inset-y-0 right-0 w-[max(360px,33.333vw)] border-l shadow-[-24px_0_64px_rgba(0,0,0,0.45)]"
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
        html.${EXPANDED_HTML_CLASS} body { padding-right: ${EXPANDED_WIDTH}; }
      `}</style>
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
                  <AnswerMarkdown content={message.content} isDark />
                ) : null}
                {message.state === "streaming" && !message.content ? (
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <span className="inline-block size-2 animate-pulse rounded-full bg-[#9945FF]" />
                    {statusLabel(message.statusStage)}
                  </div>
                ) : null}
                {message.state === "error" ? (
                  <p className="text-sm text-red-400">
                    {message.errorKind === "rate_limited"
                      ? t("askSolana.errorRateLimited")
                      : t("askSolana.errorGeneric")}
                  </p>
                ) : null}
                {message.state === "done" && message.citations.length > 0 ? (
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
              </div>
            ),
          )}
        </div>
      </div>

      <div className="border-t border-white/10 p-3">
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
