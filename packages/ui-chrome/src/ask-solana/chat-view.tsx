"use client";

import * as React from "react";
import classNames from "classnames";
import { twMerge } from "tailwind-merge";
import { useTranslations } from "next-intl";
import {
  ArrowUp,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  ThumbsDown,
  ThumbsUp,
} from "react-feather";
import {
  streamChat,
  sendFeedback,
  prewarmAskSession,
  splitCodeFollowupPrompt,
  type AskChatTiming,
  type AskCitation,
  type AskGenerativeUi,
  type CodeFollowupButton,
  type CodeFollowups,
} from "./api";
import { trackAskSolana } from "./analytics";
import { GenerativeUiAnswer } from "./generative-ui";
import { AnswerMarkdown, markdownToPlainPreview } from "./markdown";

function cn(...inputs: classNames.ArgumentArray) {
  return twMerge(classNames(inputs));
}

// Matches the current Inkeep exampleQuestions config (English-only there too).
const EXAMPLE_QUESTIONS = [
  "How to quickly install Solana dependencies for local development?",
  "What is the Solana Account Model?",
  "What is a Solana Token?",
];

const FALLBACK_COLLAPSE_CHAR_THRESHOLD = 1600;
const FALLBACK_COLLAPSE_LINE_THRESHOLD = 36;
const FALLBACK_COLLAPSE_CODE_BLOCK_THRESHOLD = 2;
const SUPPORTING_COLLAPSE_CHAR_THRESHOLD = 600;
const SUPPORTING_COLLAPSE_LINE_THRESHOLD = 16;
const SUPPORTING_COLLAPSE_CODE_BLOCK_THRESHOLD = 1;

type UserMessage = { role: "user"; content: string };
type AssistantMessage = {
  role: "assistant";
  content: string;
  citations: AskCitation[];
  generativeUi: AskGenerativeUi | null;
  codeFollowups: CodeFollowups | null;
  runId: string | null;
  state: "streaming" | "done" | "error";
  statusStage: string | null;
  visualStatus: string | null;
  errorKind: "rate_limited" | "generic" | null;
};
type ChatMessage = UserMessage | AssistantMessage;

/** Coarse lifecycle state for surfaces that render their own chat chrome. */
export type AskSolanaChatStatus =
  | "idle"
  | "thinking"
  | "searching"
  | "answering"
  | "complete"
  | "error";

type AskSolanaChatSurface = "modal" | "inline";

function FeedbackButtons({
  runId,
  isDark,
}: {
  runId: string;
  isDark: boolean;
}) {
  const t = useTranslations();
  const [given, setGiven] = React.useState<"up" | "down" | null>(null);

  const give = (rating: "up" | "down") => {
    if (given) return;
    setGiven(rating);
    void sendFeedback({ runId, rating });
    trackAskSolana("docs_ai_feedback", { run_id: runId, rating });
  };

  const buttonClass = (active: boolean) =>
    cn(
      "rounded p-1 transition-colors focus:outline-none focus:ring-2 focus:ring-[#9945FF]",
      isDark
        ? "text-gray-500 hover:text-gray-200"
        : "text-gray-400 hover:text-gray-700",
      active && "!text-[#14F195]",
    );

  return (
    <div
      className={cn(
        "mt-3 flex items-center gap-1 border-t pt-2",
        isDark ? "border-white/10" : "border-gray-200",
      )}
    >
      {given ? (
        <span
          className={cn("text-xs", isDark ? "text-gray-500" : "text-gray-400")}
        >
          {t("askSolana.feedbackThanks")}
        </span>
      ) : null}
      <button
        type="button"
        aria-label={t("askSolana.feedbackUp")}
        className={buttonClass(given === "up")}
        onClick={() => give("up")}
      >
        <ThumbsUp size={14} />
      </button>
      <button
        type="button"
        aria-label={t("askSolana.feedbackDown")}
        className={buttonClass(given === "down")}
        onClick={() => give("down")}
      >
        <ThumbsDown size={14} />
      </button>
    </div>
  );
}

function Citations({
  citations,
  isDark,
}: {
  citations: AskCitation[];
  isDark: boolean;
}) {
  const t = useTranslations();
  if (citations.length === 0) return null;
  return (
    <div
      className={cn(
        "mt-3 border-t pt-3",
        isDark ? "border-white/10" : "border-gray-200",
      )}
    >
      <div
        className={cn(
          "mb-1.5 text-xs font-medium uppercase tracking-wide",
          isDark ? "text-gray-500" : "text-gray-400",
        )}
      >
        {t("askSolana.sources")}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {citations.map((citation) => (
          <a
            key={citation.url}
            href={citation.url}
            className={cn(
              "rounded-full border px-2.5 py-1 text-xs transition-colors",
              isDark
                ? "border-gray-700 text-gray-300 hover:border-gray-500 hover:text-white"
                : "border-gray-300 text-gray-600 hover:border-gray-400 hover:text-black",
            )}
          >
            {citation.title || citation.url}
          </a>
        ))}
      </div>
    </div>
  );
}

function CodeFollowupCta({
  followups,
  isDark,
  disabled,
  onSelect,
}: {
  followups: CodeFollowups | null;
  isDark: boolean;
  disabled: boolean;
  onSelect: (_button: CodeFollowupButton) => void;
}) {
  if (!followups || followups.buttons.length === 0) return null;

  return (
    <section
      className={cn(
        "mt-3 rounded-lg border p-3",
        isDark
          ? "border-white/10 bg-white/[0.035]"
          : "border-gray-200 bg-gray-50",
      )}
    >
      <p
        className={cn(
          "m-0 text-sm leading-relaxed",
          isDark ? "text-gray-300" : "text-gray-700",
        )}
      >
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
            className={cn(
              "rounded-md border px-3 py-1.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#9945FF] disabled:cursor-not-allowed disabled:opacity-50",
              isDark
                ? "border-white/15 text-gray-200 hover:border-white/30 hover:text-white"
                : "border-gray-300 text-gray-700 hover:border-gray-400 hover:text-black",
            )}
          >
            {button.label}
          </button>
        ))}
      </div>
    </section>
  );
}

function findMarkdownHeading(content: string, title: string): number {
  const pattern = new RegExp(`^#{1,6}\\s+${title}\\s*$`, "im");
  const match = pattern.exec(content);
  return match?.index ?? -1;
}

function splitCanonicalAnswer(content: string): {
  summary: string;
  inDepth: string | null;
  canonical: boolean;
} {
  const summaryIndex = findMarkdownHeading(content, "Summary response");
  const inDepthIndex = findMarkdownHeading(content, "Indepth response");

  if (summaryIndex >= 0 && inDepthIndex > summaryIndex) {
    return {
      summary: content.slice(summaryIndex, inDepthIndex).trim(),
      inDepth: content.slice(inDepthIndex).trim(),
      canonical: true,
    };
  }

  return { summary: content, inDepth: null, canonical: false };
}

function CanonicalMarkdownAnswer({
  content,
  codeFollowups,
  isDark,
  condense,
  supporting = false,
}: {
  content: string;
  codeFollowups: CodeFollowups | null;
  isDark: boolean;
  condense: boolean;
  supporting?: boolean;
}) {
  const [expanded, setExpanded] = React.useState(false);
  const { body } = splitCodeFollowupPrompt(content, codeFollowups);
  const sections = splitCanonicalAnswer(body);
  const canCollapseInDepth =
    Boolean(sections.inDepth) &&
    condense &&
    (supporting
      ? shouldCondenseSupportingAnswer(sections.inDepth ?? "")
      : shouldCondenseMarkdownAnswer(sections.inDepth ?? ""));
  const showInDepth =
    sections.inDepth &&
    (!canCollapseInDepth || expanded || !sections.canonical);

  React.useEffect(() => {
    setExpanded(false);
  }, [content]);

  if (!sections.canonical) {
    return (
      <MarkdownFallbackAnswer
        content={body}
        isDark={isDark}
        condense={condense}
        forceCondense={supporting}
        supporting={supporting}
        title="Summary response"
        compactLabel="Summary response"
        expandedLabel="Indepth response"
      />
    );
  }

  return (
    <section
      className={cn(
        "overflow-hidden rounded-xl border",
        isDark
          ? "border-white/15 bg-white/[0.035]"
          : "border-gray-200 bg-gray-50/60",
      )}
    >
      <div className="p-3.5">
        <AnswerMarkdown content={sections.summary} isDark={isDark} />
      </div>
      {sections.inDepth ? (
        <div
          className={cn(
            "border-t",
            isDark ? "border-white/10" : "border-gray-200",
          )}
        >
          {showInDepth ? (
            <div className="p-3.5">
              <AnswerMarkdown
                content={sections.inDepth}
                isDark={isDark}
                density={canCollapseInDepth ? "compact" : "default"}
              />
            </div>
          ) : null}
          {canCollapseInDepth ? (
            <div
              className={cn(
                showInDepth && "border-t",
                isDark ? "border-white/10" : "border-gray-200",
              )}
            >
              <button
                type="button"
                aria-expanded={expanded}
                onClick={() => setExpanded((value) => !value)}
                className={cn(
                  "flex w-full items-center justify-between gap-3 px-3.5 py-2.5 text-left text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#9945FF]",
                  isDark
                    ? "text-gray-300 hover:bg-white/[0.04] hover:text-white"
                    : "text-gray-700 hover:bg-gray-100 hover:text-black",
                )}
              >
                <span>
                  {expanded
                    ? "Hide in-depth response"
                    : "Show in-depth response"}
                </span>
                {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

function shouldCondenseMarkdownAnswer(content: string): boolean {
  const codeFenceCount = content.match(/```/g)?.length ?? 0;
  const codeBlockCount = Math.floor(codeFenceCount / 2);
  return (
    content.length > FALLBACK_COLLAPSE_CHAR_THRESHOLD ||
    content.split("\n").length > FALLBACK_COLLAPSE_LINE_THRESHOLD ||
    codeBlockCount >= FALLBACK_COLLAPSE_CODE_BLOCK_THRESHOLD
  );
}

function shouldCondenseSupportingAnswer(content: string): boolean {
  const codeFenceCount = content.match(/```/g)?.length ?? 0;
  const codeBlockCount = Math.floor(codeFenceCount / 2);
  return (
    content.length > SUPPORTING_COLLAPSE_CHAR_THRESHOLD ||
    content.split("\n").length > SUPPORTING_COLLAPSE_LINE_THRESHOLD ||
    codeBlockCount >= SUPPORTING_COLLAPSE_CODE_BLOCK_THRESHOLD
  );
}

function MarkdownFallbackAnswer({
  content,
  isDark,
  condense,
  forceCondense = false,
  supporting = false,
  title = "Answer",
  compactLabel = "Compact view",
  expandedLabel = "Full text",
}: {
  content: string;
  isDark: boolean;
  condense: boolean;
  forceCondense?: boolean;
  supporting?: boolean;
  title?: string;
  compactLabel?: string;
  expandedLabel?: string;
}) {
  const [expanded, setExpanded] = React.useState(false);
  const canCondense =
    condense &&
    (forceCondense ||
      (supporting
        ? shouldCondenseSupportingAnswer(content)
        : shouldCondenseMarkdownAnswer(content)));
  const isCollapsed = canCondense && !expanded;
  const collapsedPreview = supporting ? markdownToPlainPreview(content) : null;

  React.useEffect(() => {
    setExpanded(false);
  }, [content]);

  return (
    <section
      className={cn(
        "overflow-hidden rounded-xl border",
        isDark
          ? "border-white/15 bg-white/[0.035]"
          : "border-gray-200 bg-gray-50/60",
      )}
    >
      {canCondense ? (
        <div
          className={cn(
            "flex items-center justify-between gap-3 border-b px-3 py-2",
            isDark ? "border-white/10" : "border-gray-200",
          )}
        >
          <div className="min-w-0">
            <div
              className={cn(
                "text-xs font-semibold",
                isDark ? "text-gray-200" : "text-gray-900",
              )}
            >
              {title}
            </div>
            <div
              className={cn(
                "text-[11px]",
                isDark ? "text-gray-500" : "text-gray-500",
              )}
            >
              {expanded ? expandedLabel : compactLabel}
            </div>
          </div>
          <button
            type="button"
            aria-expanded={expanded}
            onClick={() => setExpanded((value) => !value)}
            className={cn(
              "inline-flex shrink-0 items-center gap-1 rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#9945FF]",
              isDark
                ? "border-white/10 text-gray-300 hover:border-white/20 hover:text-white"
                : "border-gray-300 text-gray-600 hover:border-gray-400 hover:text-black",
            )}
          >
            {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            {expanded ? "Hide in-depth response" : "Show in-depth response"}
          </button>
        </div>
      ) : null}
      <div className={canCondense ? "p-3" : "p-3.5"}>
        <div
          className={cn(
            "relative",
            isCollapsed && !supporting && "max-h-[460px] overflow-hidden",
          )}
        >
          {isCollapsed && supporting ? (
            <p
              className={cn(
                "m-0 text-sm leading-relaxed",
                isDark ? "text-gray-400" : "text-gray-600",
              )}
            >
              {collapsedPreview || "Full markdown answer is available."}
            </p>
          ) : (
            <AnswerMarkdown
              content={content}
              isDark={isDark}
              density={canCondense ? "compact" : "default"}
            />
          )}
          {isCollapsed && !supporting ? (
            <div
              className={cn(
                "pointer-events-none absolute inset-x-0 bottom-0 h-24",
                isDark
                  ? "bg-gradient-to-b from-transparent to-[#0d0d11]"
                  : "bg-gradient-to-b from-transparent to-gray-50",
              )}
            />
          ) : null}
        </div>
      </div>
    </section>
  );
}

function AssistantStatusPanel({
  isDark,
  status,
}: {
  isDark: boolean;
  status: string;
}) {
  return (
    <section
      aria-live="polite"
      className={cn(
        "overflow-hidden rounded-xl border",
        isDark
          ? "border-white/15 bg-white/[0.035]"
          : "border-gray-200 bg-gray-50/70",
      )}
    >
      <div
        className={cn(
          "flex items-center gap-2 px-3 py-2.5",
          isDark ? "border-white/10" : "border-gray-200",
        )}
      >
        <span className="inline-block size-2 shrink-0 animate-pulse rounded-full bg-[#14F195]" />
        <span
          className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-600")}
        >
          {status}
        </span>
      </div>
    </section>
  );
}

function StreamingDraftAnswer({
  content,
  isDark,
}: {
  content: string;
  isDark: boolean;
}) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-xl border",
        isDark
          ? "border-white/10 bg-black/25"
          : "border-gray-200 bg-gray-50/70",
      )}
    >
      <div className="p-3">
        <div className="relative max-h-64 overflow-hidden">
          <AnswerMarkdown content={content} isDark={isDark} density="compact" />
          <div
            className={cn(
              "pointer-events-none absolute inset-x-0 bottom-0 h-16",
              isDark
                ? "bg-gradient-to-b from-transparent to-[#0b0b10]"
                : "bg-gradient-to-b from-transparent to-gray-50",
            )}
          />
        </div>
      </div>
    </section>
  );
}

export function AskSolanaChatView({
  isDark,
  initialQuery,
  className,
  onStatusChange,
  surface = "modal",
}: {
  isDark: boolean;
  initialQuery: string;
  className?: string;
  onStatusChange?: (_status: AskSolanaChatStatus) => void;
  surface?: AskSolanaChatSurface;
}) {
  const t = useTranslations();
  const isInlineSurface = surface === "inline";
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [input, setInput] = React.useState("");
  const [isBusy, setIsBusy] = React.useState(false);
  const [chatStatus, setChatStatus] = React.useState<AskSolanaChatStatus>(
    initialQuery.trim().length > 0 ? "thinking" : "idle",
  );
  const conversationIdRef = React.useRef<string | null>(null);
  const abortRef = React.useRef<AbortController | null>(null);
  const requestIdRef = React.useRef(0);
  const deferredAbortRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLTextAreaElement>(null);

  const latestAssistantIndex = React.useMemo(() => {
    let result = -1;
    messages.forEach((message, index) => {
      if (message.role === "assistant") result = index;
    });
    return result;
  }, [messages]);

  const latestMessage =
    latestAssistantIndex >= 0 ? messages[latestAssistantIndex] : null;
  const shouldFocusStructuredAnswer =
    latestMessage?.role === "assistant" &&
    latestMessage.state === "done" &&
    Boolean(latestMessage.generativeUi);

  React.useEffect(() => {
    inputRef.current?.focus();
  }, []);

  React.useEffect(() => {
    prewarmAskSession();
  }, []);

  React.useEffect(() => {
    onStatusChange?.(chatStatus);
  }, [chatStatus, onStatusChange]);

  React.useEffect(() => {
    if (deferredAbortRef.current) {
      clearTimeout(deferredAbortRef.current);
      deferredAbortRef.current = null;
    }

    // Abort any in-flight stream when the modal unmounts. Deferring by one
    // tick keeps React StrictMode's development effect probe from canceling
    // an initial-query stream immediately after it starts.
    return () => {
      const controller = abortRef.current;
      deferredAbortRef.current = setTimeout(() => {
        if (abortRef.current === controller) controller?.abort();
      }, 0);
    };
  }, []);

  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    if (shouldFocusStructuredAnswer) {
      const target = el.querySelector<HTMLElement>(
        '[data-ask-latest-assistant="true"]',
      );
      if (target) {
        const containerRect = el.getBoundingClientRect();
        const targetRect = target.getBoundingClientRect();
        el.scrollTop = Math.max(
          0,
          el.scrollTop + targetRect.top - containerRect.top - 12,
        );
        return;
      }
    }

    el.scrollTop = el.scrollHeight;
  }, [messages, shouldFocusStructuredAnswer]);

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
      setIsBusy(true);
      setChatStatus("thinking");
      setMessages((current) => [
        ...current,
        { role: "user", content: message },
        {
          role: "assistant",
          content: "",
          citations: [],
          generativeUi: null,
          codeFollowups: null,
          runId: null,
          state: "streaming",
          statusStage: null,
          visualStatus: null,
          errorKind: null,
        },
      ]);
      trackAskSolana("docs_ai_message_sent", {
        conversation_id: conversationIdRef.current,
        message_length: message.length,
      });

      const controller = new AbortController();
      abortRef.current = controller;
      const trackTiming = (timing: AskChatTiming) => {
        trackAskSolana("docs_ai_timing", {
          surface,
          phase: timing.phase,
          elapsed_ms: timing.elapsedMs,
          detail: timing.detail ?? undefined,
          conversation_id: conversationIdRef.current,
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
        conversationId: conversationIdRef.current,
        signal: controller.signal,
        handlers: {
          onStatus: (stage) => {
            setChatStatus(
              stage === "searching_docs"
                ? "searching"
                : stage === "cache_hit"
                  ? "answering"
                  : "thinking",
            );
            updateLastAssistant((m) => ({ ...m, statusStage: stage }));
          },
          onDelta: (text) => {
            setChatStatus("answering");
            updateLastAssistant((m) => ({
              ...m,
              content: m.content + text,
              statusStage: null,
            }));
          },
          onUiStatus: (stage) => {
            updateLastAssistant((m) => ({
              ...m,
              visualStatus: stage,
            }));
          },
          onGenerativeUi: (generativeUi) => {
            setChatStatus("answering");
            updateLastAssistant((m) => ({
              ...m,
              generativeUi,
              visualStatus: null,
              statusStage: null,
            }));
          },
          onDone: ({
            response,
            runId,
            conversationId,
            citations,
            generativeUi,
            codeFollowups,
          }) => {
            if (conversationId) conversationIdRef.current = conversationId;
            updateLastAssistant((m) => ({
              ...m,
              content: response ?? m.content,
              runId,
              citations,
              codeFollowups,
              state: "done",
              statusStage: null,
              visualStatus: null,
            }));
            deferGenerativeUi(generativeUi);
            setChatStatus("complete");
            setIsBusy(false);
          },
          onError: (errorMessage) => {
            updateLastAssistant((m) => ({
              ...m,
              state: "error",
              statusStage: null,
              visualStatus: null,
              errorKind:
                errorMessage === "rate_limited" ? "rate_limited" : "generic",
            }));
            setChatStatus("error");
            setIsBusy(false);
          },
          onTiming: trackTiming,
        },
      });
    },
    [isBusy, surface, updateLastAssistant],
  );

  // Entry points hand a question in via initialQuery (hero ask bar, search
  // handoff, guided mode) — send it immediately so the answer starts
  // without a second submit.
  const initialSentRef = React.useRef(false);
  React.useEffect(() => {
    if (initialSentRef.current) return;
    initialSentRef.current = true;
    if (initialQuery.trim().length > 0) send(initialQuery);
  }, [initialQuery, send]);

  const resetChat = () => {
    abortRef.current?.abort();
    requestIdRef.current += 1;
    conversationIdRef.current = null;
    setMessages([]);
    setIsBusy(false);
    setChatStatus("idle");
    inputRef.current?.focus();
  };

  const statusLabel = (stage: string | null) =>
    stage === "searching_docs"
      ? "Searching docs context"
      : stage === "cache_hit"
        ? "Loading cached answer"
        : stage === "session_start"
          ? "Opening Ask Solana session"
          : stage === "session_ready"
            ? "Session ready"
            : stage === "chat_connecting"
              ? "Connecting to Ask Solana"
              : stage
                ? "Preparing answer"
                : "Preparing answer";
  const visualStatusLabel = (stage: string | null) =>
    stage === "building_visual"
      ? "Building visual companion"
      : stage
        ? "Building visual companion"
        : "Building visual companion";
  const handleCodeFollowup = (button: CodeFollowupButton) => {
    trackAskSolana("docs_ai_code_followup_clicked", {
      language: button.language,
      type: button.type,
    });
    send(button.message);
  };

  return (
    <div
      className={cn("relative z-[1] flex h-full min-h-0 flex-col", className)}
    >
      <div
        ref={scrollRef}
        className={cn(
          "min-h-0 flex-1 overflow-y-auto",
          isInlineSurface ? "px-4 py-4 md:px-6 md:py-5" : "px-5 py-4",
        )}
      >
        {messages.length === 0 ? (
          <div
            className={cn(
              "flex h-full flex-col justify-center gap-4",
              isInlineSurface && "mx-auto w-full max-w-[1040px]",
            )}
          >
            <p
              className={cn(
                "text-sm",
                isDark ? "text-gray-400" : "text-gray-500",
              )}
            >
              {t("askSolana.intro")}
            </p>
            <div>
              <div
                className={cn(
                  "mb-2 text-xs font-medium uppercase tracking-wide",
                  isDark ? "text-gray-500" : "text-gray-400",
                )}
              >
                {t("askSolana.exampleQuestionsLabel")}
              </div>
              <div className="flex flex-col items-start gap-2">
                {EXAMPLE_QUESTIONS.map((question) => (
                  <button
                    key={question}
                    type="button"
                    onClick={() => send(question)}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-left text-sm transition-colors",
                      isDark
                        ? "border-gray-700 text-gray-300 hover:border-gray-500 hover:text-white"
                        : "border-gray-300 text-gray-600 hover:border-gray-400 hover:text-black",
                    )}
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div
            className={cn(
              "flex flex-col",
              isInlineSurface ? "mx-auto w-full max-w-[1040px] gap-6" : "gap-5",
            )}
          >
            {messages.map((message, index) =>
              message.role === "user" ? (
                <div key={index} className="flex justify-end">
                  <div
                    className={cn(
                      "max-w-[85%] border px-4 py-2.5 text-sm",
                      isInlineSurface
                        ? "rounded-lg"
                        : "rounded-2xl rounded-br-sm",
                      isDark
                        ? "border-white/10 bg-white/10 text-white"
                        : "border-gray-200 bg-gray-100 text-black",
                    )}
                  >
                    {message.content}
                  </div>
                </div>
              ) : (
                <div
                  key={index}
                  data-ask-latest-assistant={
                    index === latestAssistantIndex ? "true" : undefined
                  }
                  className={cn(
                    "max-w-full border-l pl-3",
                    isDark ? "border-white/15" : "border-gray-200",
                  )}
                >
                  {message.content ? (
                    <div>
                      {message.state === "streaming" ? (
                        <StreamingDraftAnswer
                          content={message.content}
                          isDark={isDark}
                        />
                      ) : (
                        <CanonicalMarkdownAnswer
                          content={message.content}
                          codeFollowups={message.codeFollowups}
                          isDark={isDark}
                          condense={message.state === "done"}
                          supporting={Boolean(message.generativeUi)}
                        />
                      )}
                    </div>
                  ) : null}
                  {message.state === "streaming" && !message.content ? (
                    <AssistantStatusPanel
                      isDark={isDark}
                      status={statusLabel(message.statusStage)}
                    />
                  ) : null}
                  {message.visualStatus && !message.generativeUi ? (
                    <div className="mt-3">
                      <AssistantStatusPanel
                        isDark={isDark}
                        status={visualStatusLabel(message.visualStatus)}
                      />
                    </div>
                  ) : null}
                  {message.state === "error" ? (
                    <p
                      className={cn(
                        "text-sm",
                        isDark ? "text-red-400" : "text-red-500",
                      )}
                    >
                      {message.errorKind === "rate_limited"
                        ? t("askSolana.errorRateLimited")
                        : t("askSolana.errorGeneric")}
                    </p>
                  ) : null}
                  {message.state === "done" ? (
                    <>
                      <CodeFollowupCta
                        followups={message.codeFollowups}
                        isDark={isDark}
                        disabled={isBusy}
                        onSelect={handleCodeFollowup}
                      />
                      {message.generativeUi ? (
                        <div className="mt-3">
                          <GenerativeUiAnswer ui={message.generativeUi} />
                        </div>
                      ) : null}
                      <Citations
                        citations={message.citations}
                        isDark={isDark}
                      />
                      {message.runId ? (
                        <FeedbackButtons
                          runId={message.runId}
                          isDark={isDark}
                        />
                      ) : null}
                    </>
                  ) : null}
                </div>
              ),
            )}
          </div>
        )}
      </div>

      <div
        className={cn(
          "border-t",
          isInlineSurface ? "px-4 py-3 md:px-6" : "px-5 py-3",
          isDark
            ? isInlineSurface
              ? "border-white/15 bg-[#09090d]"
              : "border-white/10"
            : "border-gray-200",
        )}
      >
        <div className={cn(isInlineSurface && "mx-auto w-full max-w-[1040px]")}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className={cn(
              "flex items-end gap-2 border px-3 py-2",
              isInlineSurface ? "rounded-lg" : "rounded-xl",
              isDark
                ? isInlineSurface
                  ? "border-white/15 bg-black/60 focus-within:border-white/30"
                  : "border-gray-700 bg-black/40 focus-within:border-gray-500"
                : "border-gray-300 bg-white focus-within:border-gray-400",
            )}
          >
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              placeholder={t("askSolana.inputPlaceholder")}
              className={cn(
                "max-h-32 flex-1 resize-none bg-transparent text-sm outline-none",
                isDark
                  ? "text-white placeholder:text-gray-500"
                  : "text-black placeholder:text-gray-400",
              )}
            />
            <button
              type="submit"
              disabled={isBusy || input.trim().length === 0}
              aria-label={t("askSolana.send")}
              className={cn(
                "grid size-8 shrink-0 place-items-center transition-all",
                isInlineSurface ? "rounded-md" : "rounded-lg",
                // !important: the global form reset ([type="submit"] {
                // background-image: none }) otherwise hides the gradient.
                "!bg-gradient-to-r from-[#9945FF] to-[#14F195] text-white",
                "disabled:opacity-40",
              )}
            >
              <ArrowUp size={16} />
            </button>
          </form>
          <div className="mt-2 flex items-center justify-between gap-2">
            <p
              className={cn(
                "text-xs",
                isDark ? "text-gray-600" : "text-gray-400",
              )}
            >
              {t("askSolana.disclaimer")}
            </p>
            {messages.length > 0 ? (
              <button
                type="button"
                onClick={resetChat}
                className={cn(
                  "flex shrink-0 items-center gap-1 text-xs transition-colors",
                  isDark
                    ? "text-gray-500 hover:text-gray-300"
                    : "text-gray-400 hover:text-gray-600",
                )}
              >
                <RotateCcw size={12} />
                {t("askSolana.newChat")}
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
