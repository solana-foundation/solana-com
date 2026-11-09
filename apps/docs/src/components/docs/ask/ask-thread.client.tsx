"use client";

import { useTranslations } from "next-intl";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
} from "react";
import { cn } from "./cn";
import { splitAnswerSections } from "@/lib/docs/ask/protocol";
import type {
  AskAssistantMessage,
  AskMessage,
  AskUserMessage,
} from "@/lib/docs/ask/store";
import { useAskSelector } from "@/lib/docs/ask/use-ask";
import { ArrowDownIcon } from "../docs-ui-icons";
import { AskEmpty } from "./ask-empty.client";
import { AskTurn } from "./ask-message.client";
import { focusRing, visuallyHidden } from "./ui";

/** Within this many px of the end counts as "at the bottom". */
const STICK_THRESHOLD = 80;

type Turn = {
  key: string;
  question?: AskUserMessage;
  answer?: AskAssistantMessage;
};

/** Questions with their answers, one list item each. */
function toTurns(messages: AskMessage[]): Turn[] {
  const turns: Turn[] = [];
  for (const message of messages) {
    const current = turns.at(-1);
    if (message.role === "user") {
      turns.push({ key: message.id, question: message });
    } else if (current?.question && !current.answer) {
      current.answer = message;
    } else {
      turns.push({ key: message.id, answer: message });
    }
  }
  return turns;
}

/**
 * Something the reader hasn't seen yet: a new turn, or the latest answer's
 * text, visual, sources or state changing.
 */
function progress(messages: AskMessage[]): string {
  const last = messages.at(-1);
  if (last?.role !== "assistant") return String(messages.length);
  return `${messages.length}:${last.state}:${last.text.length}:${last.ui ? 1 : 0}:${last.citations.length}`;
}

/** Markdown as one line of plain text, for the live region. */
function plainText(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?(```|$)/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/^\s*(?:#{1,6}|[-*+]|\d+\.)\s+/gm, "")
    .replace(/[*_~>|]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 600);
}

/**
 * What the live region says about the latest answer: its status while it
 * is on its way, then its summary, error or "Stopped". Not every delta, and
 * not a thread restored when the panel opens.
 */
function useAnnouncement(last: AskAssistantMessage | undefined): string {
  const t = useTranslations("docsAsk");
  const state = last?.state;
  const status = last?.status;
  const error = last?.error;
  const reset = last?.conversationReset;
  // The text is final (and stable) once the answer is done.
  const finished = state === "done" ? (last?.text ?? "") : null;
  const key = last ? `${last.id}:${state}:${status ?? ""}` : "";
  const seen = useRef(key);
  const [text, setText] = useState("");
  useEffect(() => {
    if (seen.current === key || !state) return;
    seen.current = key;
    if (state === "pending" || state === "streaming") {
      setText(t(`status.${status ?? "preparing"}`));
    } else if (finished !== null) {
      const summary = plainText(splitAnswerSections(finished).summary);
      setText(
        reset ? `${t(`conversationReset.${reset}`)} ${summary}` : summary,
      );
    } else if (state === "error") {
      setText(t(`errors.${error ?? "generic"}`));
    } else {
      setText(t("stopped"));
    }
  }, [key, state, status, error, finished, reset, t]);
  return text;
}

/**
 * The conversation as a list of turns (question as heading, then its
 * answer), scrolled to the end as answers arrive while the reader is at the
 * bottom, until the latest question reaches the top: a tall visual then
 * leaves the question, status and summary in view rather than pushing them
 * off. Once they scroll up (or following stops) it stays put; a labelled
 * "Jump to latest" pill appears at the inline end only while something new
 * is arriving or has arrived below. A polite live region announces status
 * changes and finished answers.
 */
export function AskThread({ fullscreen }: { fullscreen: boolean }) {
  const messages = useAskSelector((s) => s.messages);
  const busy = useAskSelector((s) => s.busy);
  const scroller = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const stick = useRef(true);
  /** Following stops at the latest question (until the reader goes past it). */
  const capped = useRef(true);
  const [away, setAway] = useState(false);
  const [unseen, setUnseen] = useState(false);

  const turns = useMemo(() => toTurns(messages), [messages]);
  // The disclaimer ("check them against the linked pages") stays under
  // the first finished answer that links pages, not under a decline; the
  // line that chats are recorded, under the first finished answer.
  const firstDone = messages.find(
    (message) => message.role === "assistant" && message.state === "done",
  )?.id;
  const firstLinked = messages.find(
    (message) =>
      message.role === "assistant" &&
      message.state === "done" &&
      message.citations.length > 0,
  )?.id;
  const last = messages.at(-1);
  const lastAssistant = last?.role === "assistant" ? last : undefined;
  const announcement = useAnnouncement(lastAssistant);
  const t = useTranslations("docsAsk");

  // What was already there when the thread mounted (a restored
  // conversation, or the switch to full screen) appears without motion.
  const initial = useRef<Set<string> | null>(null);
  initial.current ??= new Set(messages.map((message) => message.id));
  const isNew = (id?: string) => !!id && !initial.current?.has(id);

  const toBottom = useCallback((smooth = false) => {
    const el = scroller.current;
    if (!el) return;
    if (
      smooth &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    } else {
      el.scrollTop = el.scrollHeight;
    }
  }, []);

  /** Where the latest turn starts, in the scroller's content. */
  const latestTop = useCallback(() => {
    const el = scroller.current;
    const turn = content.current?.querySelector("ol > li:last-child");
    if (!el || !turn) return Infinity;
    return (
      turn.getBoundingClientRect().top -
      el.getBoundingClientRect().top +
      el.scrollTop
    );
  }, []);

  const onScroll = useCallback(() => {
    const el = scroller.current;
    if (!el) return;
    const distance = el.scrollHeight - el.scrollTop - el.clientHeight;
    stick.current = distance < STICK_THRESHOLD;
    setAway(!stick.current);
    if (stick.current) setUnseen(false);
    // The reader went down past the question themselves: follow again.
    if (stick.current && el.scrollTop > latestTop() + 1) capped.current = false;
  }, [latestTop]);

  // Follows the end, but not past the latest question's top: there it
  // stops, and the Jump to latest pill offers the rest.
  const follow = useCallback(() => {
    const el = scroller.current;
    if (!el) return;
    const top = capped.current ? latestTop() : Infinity;
    if (el.scrollHeight - el.clientHeight > top + 1) {
      el.scrollTop = top;
      stick.current = false;
      setAway(true);
      return;
    }
    toBottom();
  }, [latestTop, toBottom]);

  // A new question always brings the end into view. A thread restored as
  // it was (or remounted for full screen) opens at its end, uncapped.
  const count = messages.length;
  const lastIsNew = isNew(messages.at(-1)?.id);
  useEffect(() => {
    stick.current = true;
    capped.current = lastIsNew;
    toBottom();
  }, [count, lastIsNew, toBottom]);

  // New content while the reader is up the thread: offer the way down.
  const step = progress(messages);
  const seenStep = useRef(step);
  useEffect(() => {
    if (step === seenStep.current) return;
    seenStep.current = step;
    if (!stick.current) setUnseen(true);
  }, [step]);

  // Growth (text, a visual, sources) follows the end while the reader is
  // there. Opening a disclosure is reading, not waiting: it stops following.
  useEffect(() => {
    const el = content.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => {
      if (stick.current) follow();
      else onScroll();
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [follow, onScroll]);
  const onToggle = (event: MouseEvent<HTMLDivElement>) => {
    if ((event.target as Element).closest?.("[aria-expanded], summary"))
      stick.current = false;
  };

  const showJump = away && messages.length > 0 && (busy || unseen);

  return (
    <div className="relative min-h-0 flex-1">
      {/* Full screen has no header rule: the thread fades out under the
          buttons instead of being cut off. */}
      {fullscreen ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-6 bg-gradient-to-b from-[var(--sol-page)] to-transparent"
        />
      ) : null}
      <div
        ref={scroller}
        onScroll={onScroll}
        className="h-full overflow-y-auto overscroll-contain"
      >
        {/* pb-12 keeps the end clear of the Jump to latest pill. */}
        <div
          ref={content}
          onClickCapture={onToggle}
          className={cn(
            fullscreen
              ? "mx-auto w-full max-w-[46rem] px-6 pb-12 pt-8"
              : "px-4 pb-12 pt-5",
          )}
        >
          {messages.length === 0 ? (
            <AskEmpty />
          ) : (
            <ol className="m-0 list-none p-0">
              {turns.map((turn, index) => (
                <li
                  key={turn.key}
                  className={cn("group/turn", index > 0 && "mt-8")}
                >
                  <AskTurn
                    question={turn.question}
                    answer={turn.answer}
                    latest={index === turns.length - 1}
                    fullscreen={fullscreen}
                    disclaimer={
                      !!firstLinked && turn.answer?.id === firstLinked
                    }
                    privacy={!!firstDone && turn.answer?.id === firstDone}
                    enterQuestion={isNew(turn.question?.id)}
                    enterAnswer={isNew(turn.answer?.id)}
                  />
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
      {showJump ? (
        <button
          type="button"
          onClick={() => {
            stick.current = true;
            capped.current = false;
            setUnseen(false);
            toBottom(true);
          }}
          className={cn(
            "absolute bottom-3 end-4 inline-flex h-7 items-center gap-1 rounded-full border border-solid border-[var(--sol-line-strong)] bg-[var(--sol-page)] pe-2.5 ps-2 text-[12px] leading-4 text-[var(--sol-muted)] shadow-[var(--sol-menu-shadow)] transition-colors duration-150 animate-in fade-in-0 slide-in-from-bottom-1 hover:bg-[var(--sol-soft)] hover:text-[var(--sol-text)] motion-reduce:animate-none motion-reduce:transition-none [&_svg]:size-3",
            focusRing,
          )}
        >
          <ArrowDownIcon />
          {t("jumpToLatest")}
        </button>
      ) : null}
      <div aria-live="polite" className={visuallyHidden}>
        {announcement}
      </div>
    </div>
  );
}
