"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { cn } from "./cn";
import { askStore, type AskAssistantMessage } from "@/lib/docs/ask/store";
import { CheckIcon, CopyIcon, RotateCcwIcon } from "../docs-ui-icons";
import { enterUp, focusRing, toneScope, useCopy, visuallyHidden } from "./ui";

const entered = new Set<unknown>();

/**
 * True on the first mount that shows `key` (an answer's id or citations)
 * while `enabled`: a finished answer's tail fades in once, not again when
 * the thread remounts (docked ↔ full screen) or re-renders.
 */
export function useEntrance(key: unknown, enabled: boolean): boolean {
  const [enter] = useState(() => enabled && !entered.has(key));
  useEffect(() => {
    if (enabled) entered.add(key);
  }, [key, enabled]);
  return enter;
}

/** Fade and 4px rise; pair with `[animation-delay:…]` to stagger. */
export const entranceClass = `${enterUp} [animation-fill-mode:both]`;

/** The copied check and a chosen rating pop in. */
const popClass =
  "animate-in zoom-in-50 duration-150 motion-reduce:animate-none";

function IconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={cn(
        "grid size-7 place-items-center rounded-md text-[var(--sol-dim)] transition-colors duration-150 hover:bg-[var(--sol-soft)] hover:text-[var(--sol-text)] motion-reduce:transition-none [&_svg]:size-[15px]",
        focusRing,
      )}
    >
      {children}
    </button>
  );
}

/** A chosen rating in its tone: Yes green, No amber. */
const RATING_TONE = {
  up: toneScope.green,
  down: toneScope.amber,
} as const;

/** "Helpful? Yes No", as the docs' page feedback: words, not thumbs. */
function Feedback({ message }: { message: AskAssistantMessage }) {
  const t = useTranslations("docsAsk");
  // Pop only on the reader's own choice, not a restored one.
  const [chose, setChose] = useState(false);
  const rate = (rating: "up" | "down") => {
    setChose(true);
    askStore.rate(message.id, rating);
  };
  return (
    <div
      role="group"
      aria-label={t("helpfulPrompt")}
      className="flex items-center gap-1 text-[12px] leading-5"
    >
      {/* <bdi>: an untranslated "Helpful?" keeps its "?" at the end in an
          Arabic answer. */}
      <span role="status" className="me-1 text-[var(--sol-dim)]">
        <bdi>{message.rating ? t("feedbackThanks") : t("helpfulPrompt")}</bdi>
      </span>
      {(["up", "down"] as const).map((rating) => {
        const selected = message.rating === rating;
        return (
          <button
            key={rating}
            type="button"
            aria-pressed={selected}
            onClick={() => rate(rating)}
            className={cn("group/rate rounded-md font-medium", focusRing)}
          >
            {/* Keyed, so a new choice remounts it and pops; the button
                (and its focus) stays. */}
            <span
              key={selected ? "on" : "off"}
              className={cn(
                "inline-block rounded-md px-1.5 transition-colors duration-150 motion-reduce:transition-none",
                selected
                  ? [
                      RATING_TONE[rating],
                      "bg-[var(--tone-soft)] text-[var(--tone)]",
                      chose && popClass,
                    ]
                  : "text-[var(--sol-muted)] group-hover/rate:bg-[var(--sol-soft)] group-hover/rate:text-[var(--sol-text)]",
              )}
            >
              <bdi>{rating === "up" ? t("yes") : t("no")}</bdi>
            </span>
          </button>
        );
      })}
    </div>
  );
}

/**
 * Under a finished answer: Helpful? Yes / No (only when the run can be
 * rated), then Copy answer and Ask again at the end. Always shown on the
 * latest answer; on older ones it waits for hover or focus on the turn
 * (`group/turn`) or the row, and stays on screens without hover.
 */
export function AskActions({
  message,
  copyText,
  latest = true,
  animate = true,
  className,
}: {
  message: AskAssistantMessage;
  /** The answer as Markdown, without the section headings. */
  copyText: string;
  /** The thread's last answer. */
  latest?: boolean;
  /** Fade in once (false: an answer restored as it was, on reload). */
  animate?: boolean;
  /** Replaces the top margin when it shares a row (older turns). */
  className?: string;
}) {
  const t = useTranslations("docsAsk");
  const [copied, copy] = useCopy();
  // `&& latest`: once a newer answer arrives, the row hides behind hover.
  const enter = useEntrance(message.id, latest && animate) && latest;
  // After the sources' rows (40ms apart, the first five).
  const delay = Math.min(message.citations.length, 5) + 1;
  return (
    <div
      style={enter ? ({ "--ask-enter": delay } as CSSProperties) : undefined}
      className={cn(
        "mt-4 flex flex-wrap items-center gap-x-3 gap-y-1",
        !latest &&
          "opacity-0 transition-opacity duration-150 focus-within:opacity-100 hover:opacity-100 group-focus-within/turn:opacity-100 group-hover/turn:opacity-100 motion-reduce:transition-none [@media(hover:none)]:opacity-100",
        enter &&
          cn(entranceClass, "[animation-delay:calc(var(--ask-enter)*40ms)]"),
        className,
      )}
    >
      {message.runId ? <Feedback message={message} /> : null}
      {/* -me-1.5: the glyphs, not the hit areas, meet the column's end. */}
      <div className="relative -me-1.5 ms-auto flex items-center gap-0.5">
        {copyText ? (
          <IconButton
            label={copied ? t("copied") : t("copyAnswer")}
            onClick={() => copy(copyText)}
          >
            {copied ? (
              <CheckIcon className={cn(popClass, "text-[var(--sol-purple)]")} />
            ) : (
              <CopyIcon />
            )}
          </IconButton>
        ) : null}
        <IconButton
          label={t("askAgain")}
          onClick={() => askStore.retry(message.id)}
        >
          <RotateCcwIcon />
        </IconButton>
        <span role="status" className={visuallyHidden}>
          {copied ? t("copied") : ""}
        </span>
      </div>
    </div>
  );
}
