"use client";

import * as React from "react";
import classNames from "classnames";
import { twMerge } from "tailwind-merge";
import { useTranslations } from "next-intl";
import { ArrowUp, RotateCcw, ThumbsDown, ThumbsUp } from "react-feather";
import { streamChat, sendFeedback, type AskCitation } from "./api";
import { trackAskSolana } from "./analytics";
import { AnswerMarkdown } from "./markdown";

function cn(...inputs: classNames.ArgumentArray) {
  return twMerge(classNames(inputs));
}

// Matches the current Inkeep exampleQuestions config (English-only there too).
const EXAMPLE_QUESTIONS = [
  "How to quickly install Solana dependencies for local development?",
  "What is the Solana Account Model?",
  "What is a Solana Token?",
];

type UserMessage = { role: "user"; content: string };
type AssistantMessage = {
  role: "assistant";
  content: string;
  citations: AskCitation[];
  runId: string | null;
  state: "streaming" | "done" | "error";
  statusStage: string | null;
  errorKind: "rate_limited" | "generic" | null;
};
type ChatMessage = UserMessage | AssistantMessage;

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
    <div className="mt-2 flex items-center gap-1">
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
    <div className="mt-3">
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

export function AskSolanaChatView({
  isDark,
  initialQuery,
}: {
  isDark: boolean;
  initialQuery: string;
}) {
  const t = useTranslations();
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [input, setInput] = React.useState("");
  const [isBusy, setIsBusy] = React.useState(false);
  const conversationIdRef = React.useRef<string | null>(null);
  const abortRef = React.useRef<AbortController | null>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    inputRef.current?.focus();
  }, []);

  React.useEffect(() => {
    // Abort any in-flight stream when the modal unmounts.
    return () => abortRef.current?.abort();
  }, []);

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
          runId: null,
          state: "streaming",
          statusStage: null,
          errorKind: null,
        },
      ]);
      trackAskSolana("docs_ai_message_sent", {
        conversation_id: conversationIdRef.current,
        message_length: message.length,
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
          onDone: ({ runId, conversationId, citations }) => {
            if (conversationId) conversationIdRef.current = conversationId;
            updateLastAssistant((m) => ({
              ...m,
              runId,
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
    conversationIdRef.current = null;
    setMessages([]);
    setIsBusy(false);
    inputRef.current?.focus();
  };

  const statusLabel = (stage: string | null) =>
    stage === "searching_docs"
      ? t("askSolana.statusSearching")
      : t("askSolana.statusThinking");

  return (
    <div className="relative z-[1] flex h-full min-h-0 flex-col">
      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col justify-center gap-4">
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
          <div className="flex flex-col gap-4">
            {messages.map((message, index) =>
              message.role === "user" ? (
                <div key={index} className="flex justify-end">
                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl rounded-br-sm px-4 py-2.5 text-sm",
                      isDark
                        ? "bg-white/10 text-white"
                        : "bg-gray-100 text-black",
                    )}
                  >
                    {message.content}
                  </div>
                </div>
              ) : (
                <div key={index} className="max-w-full">
                  {message.content ? (
                    <AnswerMarkdown content={message.content} isDark={isDark} />
                  ) : null}
                  {message.state === "streaming" && !message.content ? (
                    <div
                      className={cn(
                        "flex items-center gap-2 text-sm",
                        isDark ? "text-gray-400" : "text-gray-500",
                      )}
                    >
                      <span className="inline-block size-2 animate-pulse rounded-full bg-[#9945FF]" />
                      {statusLabel(message.statusStage)}
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
          "border-t px-5 py-3",
          isDark ? "border-white/10" : "border-gray-200",
        )}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className={cn(
            "flex items-end gap-2 rounded-xl border px-3 py-2",
            isDark
              ? "border-gray-700 bg-black/40 focus-within:border-gray-500"
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
              "rounded-lg p-1.5 transition-all",
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
  );
}
