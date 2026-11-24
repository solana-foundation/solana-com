"use client";

import { useTranslations } from "next-intl";
import {
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from "react";
import { cn } from "./cn";
import { splitCodeFollowupPrompt } from "@solana-com/ui-chrome/ask-solana/api";
import type {
  AskAssistantMessage,
  AskQuote,
  AskUserMessage,
} from "@/lib/docs/ask/store";
import { answerParts } from "./answer-fold";
import { AskActions, entranceClass, useEntrance } from "./ask-actions.client";
import { AskConversationReset, AskError, AskStopped } from "./ask-error.client";
import { AskFollowups } from "./ask-followups.client";
import { AskFullAnswer, AskMarkdown } from "./ask-markdown.client";
import { AskSources, FileTextIcon } from "./ask-sources.client";
import { AskStatusRow } from "./ask-status.client";
import { AskVisual } from "./visuals/ask-visual.client";
import { enterUp, mono, textDirection, visuallyHidden } from "./ui";

const FENCE = /```[^\n]*\n([\s\S]*?)(?:\n```|$)/g;

/**
 * A question's words and any fenced code in it (a code block's Ask). The
 * words become the heading; "Explain this code from Keypairs:" drops its
 * colon, since the code follows in a frame rather than the sentence.
 */
function splitQuestion(text: string): { heading: string; snippets: string[] } {
  const words: string[] = [];
  const snippets: string[] = [];
  let last = 0;
  for (const match of text.matchAll(FENCE)) {
    words.push(text.slice(last, match.index));
    snippets.push(match[1] ?? "");
    last = match.index + match[0].length;
  }
  words.push(text.slice(last));
  const heading = words
    .map((part) => part.trim())
    .filter(Boolean)
    .join("\n\n");
  return {
    heading: snippets.length ? heading.replace(/:$/, "") : heading,
    snippets,
  };
}

/** Fades out the bottom of a box cut short by its max height (useCut). */
const cutFade = "[mask-image:linear-gradient(to_bottom,#000_65%,transparent)]";

/**
 * Whether `box` is cut short by its max height, re-measured as the panel
 * is resized (wrapping changes the height).
 */
function useCut(box: RefObject<HTMLElement | null>, text: string): boolean {
  const [cut, setCut] = useState(false);
  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const measure = () => setCut(el.scrollHeight > el.clientHeight + 1);
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [box, text]);
  return cut;
}

/**
 * The asked code as a reminder, in the answer's code frame: four lines,
 * wrapped rather than cut sideways, fading out at the bottom when there is
 * more (like the docs' collapsed code blocks). The page has the rest. The
 * fade is on the code, so the frame's border stays whole.
 */
function QuestionSnippet({
  code,
  className = "mt-2",
}: {
  code: string;
  className?: string;
}) {
  const frame = useRef<HTMLElement>(null);
  const cut = useCut(frame, code);
  return (
    <pre
      dir="ltr"
      className={cn(
        mono,
        "m-0 whitespace-pre-wrap break-words rounded-xl border border-[var(--sol-line)] bg-[var(--sol-page)] px-3.5 py-2.5 text-[13px] leading-[1.7] text-[var(--sol-text)] [&_code]:[font-family:inherit]",
        className,
      )}
    >
      <code
        ref={frame}
        className={cn("block max-h-[6.8em] overflow-hidden", cut && cutFade)}
      >
        {code}
      </code>
    </pre>
  );
}

/**
 * The text a question is about ("Ask AI about this"), above its words in
 * the bubble: code in the snippet frame, prose as a quote with the accent
 * bar, four lines at most, fading out when there is more. It follows the
 * words in the DOM (`order-first` puts it on top), so the turn's heading
 * still starts it and is read before the quote.
 */
function QuestionQuote({ quote }: { quote: AskQuote }) {
  const t = useTranslations("docsAsk");
  const box = useRef<HTMLDivElement>(null);
  const cut = useCut(box, quote.text);
  const label = (
    <span className={visuallyHidden}>{t("selection.quote")}: </span>
  );
  if (quote.code)
    return (
      <div className="order-first mb-2">
        {label}
        <QuestionSnippet code={quote.text} className="" />
      </div>
    );
  return (
    <blockquote className="order-first m-0 mb-2 border-s-2 border-[var(--sol-purple)] ps-3 text-[13.5px] leading-[1.55] text-[var(--sol-muted)]">
      {label}
      <div
        ref={box}
        dir="auto"
        className={cn(
          "max-h-[6.2em] overflow-hidden whitespace-pre-line break-words",
          cut && cutFade,
        )}
      >
        {quote.text}
      </div>
    </blockquote>
  );
}

/**
 * A question, as a speech bubble at the inline end (the start of its turn,
 * so still a heading for screen readers): the page it was asked about above
 * it; inside it, the text it quotes (on top, though read after the
 * words), then its words and any code. Answers stay unboxed.
 */
export function AskQuestion({
  message,
  fullscreen,
}: {
  message: AskUserMessage;
  fullscreen: boolean;
}) {
  const t = useTranslations("docsAsk");
  const { heading, snippets } = useMemo(
    () => splitQuestion(message.text),
    [message.text],
  );
  const page = message.pageContext;
  const quote = message.quote;
  return (
    <div className="flex flex-col items-end">
      {page ? (
        <p className="m-0 mb-1.5 flex min-w-0 max-w-[85%] items-center gap-1.5 text-[12px] leading-4 text-[var(--sol-dim)]">
          <FileTextIcon className="size-3.5 shrink-0" />
          <span aria-hidden="true" className="min-w-0 truncate">
            {page.title}
          </span>
          <span className={visuallyHidden}>
            {t("pageContext", { title: page.title })}
          </span>
        </p>
      ) : null}
      {/* The reader's words set their own direction (English on an Arabic
          page); the hidden "You:" has its own, so it doesn't decide. */}
      <div
        className={cn(
          "flex max-w-[85%] flex-col rounded-[20px] bg-[var(--sol-purple-soft)] text-[var(--sol-text)]",
          fullscreen ? "px-5 py-3" : "px-4 py-2.5",
          // Code needs the room; words keep the bubble to their width.
          snippets.length || quote?.code ? "w-full" : "w-fit",
        )}
      >
        <h3
          dir="auto"
          className={cn(
            "m-0 whitespace-pre-wrap break-words font-normal",
            fullscreen
              ? "text-[16px] leading-[1.6]"
              : "text-[14.5px] leading-[1.55]",
          )}
        >
          <span dir="auto" className={visuallyHidden}>
            {t("you")}:{" "}
          </span>
          {heading}
        </h3>
        {quote ? <QuestionQuote quote={quote} /> : null}
        {snippets.map((code, index) => (
          <QuestionSnippet key={index} code={code} />
        ))}
      </div>
    </div>
  );
}

/**
 * "Answers can be wrong…" and "Chats are recorded…", once, under the first
 * finished answer: the empty state says it before the first question, and
 * one quiet line keeps saying it after (not a footer on every answer, or
 * under the composer).
 */
function Disclaimer({
  messageId,
  animate,
  checkLinks,
  privacy,
}: {
  messageId: string;
  animate: boolean;
  checkLinks: boolean;
  privacy: boolean;
}) {
  const t = useTranslations("docsAsk");
  const enter = useEntrance(`${messageId}:disclaimer`, animate);
  return (
    <p
      className={cn(
        "m-0 mt-3 text-[12px] leading-4 text-[var(--sol-dim)]",
        enter && cn(entranceClass, "[animation-delay:280ms]"),
      )}
    >
      {checkLinks ? <bdi>{t("disclaimer")}</bdi> : null}
      {checkLinks && privacy ? " " : null}
      {privacy ? <bdi>{t("privacy")}</bdi> : null}
    </p>
  );
}

/**
 * An answer: no bubble, no avatar, no name. Status while it is on its way,
 * the summary (or opening paragraph), the visual, the rest (folded under
 * "Full answer" when long, see ./answer-fold.ts), then (when done) sources,
 * follow-ups and actions; the latest answer shows them in full, older ones
 * fold sources and keep actions for hover. A failure or Stop ends it with
 * one line instead. An answer given in a new conversation (an expired
 * session) starts with a line saying so.
 */
export function AssistantMessage({
  message,
  latest,
  fullscreen,
  disclaimer = false,
  privacy = false,
}: {
  message: AskAssistantMessage;
  /**
   * The thread's last answer: only it offers follow-up chips, lists its
   * sources open, shows its actions without hover and says why it failed.
   */
  latest: boolean;
  fullscreen: boolean;
  /** The thread's first finished answer that links pages: "Answers can be wrong…". */
  disclaimer?: boolean;
  /** The thread's first finished answer: "Chats are recorded…". */
  privacy?: boolean;
}) {
  const t = useTranslations("docsAsk");
  const { state, status, ui, codeFollowups } = message;
  const active = state === "pending" || state === "streaming";
  // Seen on its way (here, or asked again): its tail (sources, follow-ups,
  // actions) fades in as it finishes. A thread restored on reload, or an
  // answer that finished while the panel was closed, appears as it is.
  const [live, setLive] = useState(active);
  if (active && !live) setLive(true);
  const hasVisual = !!ui;
  const { lead, rest, fold, prompt } = useMemo(() => {
    const split = splitCodeFollowupPrompt(message.text, codeFollowups);
    return {
      ...answerParts(split.body, active, hasVisual),
      prompt: split.prompt,
    };
  }, [message.text, codeFollowups, active, hasVisual]);
  const copyText = [lead, rest].filter(Boolean).join("\n\n");
  const done = state === "done";
  const partial = !!lead || !!ui;
  // English answers stay left to right on an Arabic page. Known once text
  // arrives, for icons to flip with `group-data-[dir=rtl]/answer:`.
  const first = lead || rest;
  const dir = first ? textDirection(first) : "auto";

  return (
    <div
      dir={dir}
      data-dir={dir}
      className={cn(
        "group/answer text-[var(--ask-body)]",
        fullscreen
          ? "text-[15.5px] leading-[1.75]"
          : "text-[14px] leading-[1.7]",
      )}
    >
      <span dir="auto" className={visuallyHidden}>
        {t("panelLabel")}:{" "}
      </span>
      {message.conversationReset ? (
        <AskConversationReset kind={message.conversationReset} />
      ) : null}
      {/* Until the first word: a visual that arrives early (a template)
          goes under the status row, which keeps saying it's on its way. */}
      {active && !lead ? (
        <AskStatusRow status={status ?? "preparing"} thinking />
      ) : null}
      {lead ? <AskMarkdown text={lead} streaming={active} /> : null}
      {ui ? (
        <div className={lead || active ? "mt-4" : undefined}>
          <AskVisual ui={ui} streaming={active} summary={lead} />
        </div>
      ) : active && status === "visual" && lead ? (
        <div className="mt-4">
          <AskStatusRow status="visual" />
        </div>
      ) : null}
      {rest && fold ? (
        <AskFullAnswer
          messageId={message.id}
          text={rest}
          streaming={active}
          partial={state === "error" || state === "stopped"}
        />
      ) : rest ? (
        // Short enough to read here; it fades in where the folded row was.
        <div
          className={cn(
            "mt-4",
            live &&
              "animate-in fade-in-0 duration-200 motion-reduce:animate-none",
          )}
        >
          <AskMarkdown text={rest} streaming={active} />
        </div>
      ) : null}
      {state === "error" || state === "stopped" ? (
        // With nothing above it, the line takes the status row's place.
        <div className={partial ? undefined : "[&>*]:!mt-0"}>
          {state === "error" ? (
            <AskError
              kind={message.error ?? "generic"}
              messageId={message.id}
              latest={latest}
              hasPartial={partial}
            />
          ) : (
            <AskStopped messageId={message.id} />
          )}
        </div>
      ) : null}
      {done && latest ? (
        <>
          <AskSources citations={message.citations} animate={live} />
          {codeFollowups ? (
            <AskFollowups
              followups={codeFollowups}
              prompt={prompt}
              animate={live}
            />
          ) : null}
          <AskActions message={message} copyText={copyText} animate={live} />
        </>
      ) : null}
      {done && !latest ? (
        // Folded sources and the hover-only actions share one row, so the
        // hidden actions don't leave a blank band before the next turn. An
        // opened list too wide to share it pushes the actions under it.
        <div className="mt-5 flex flex-wrap items-start justify-between gap-x-3 gap-y-2">
          <AskSources
            citations={message.citations}
            latest={false}
            className="mt-0 min-w-0 flex-auto"
          />
          <AskActions
            message={message}
            copyText={copyText}
            latest={false}
            className="mt-0 ms-auto"
          />
        </div>
      ) : null}
      {done && (disclaimer || privacy) ? (
        <Disclaimer
          messageId={message.id}
          animate={live && latest}
          checkLinks={disclaimer}
          privacy={privacy}
        />
      ) : null}
    </div>
  );
}

/**
 * One turn: the question as its heading, the answer under it. Each part
 * fades and rises in once when it is new (not when the thread remounts).
 */
export function AskTurn({
  question,
  answer,
  latest,
  fullscreen,
  disclaimer = false,
  privacy = false,
  enterQuestion,
  enterAnswer,
}: {
  question?: AskUserMessage;
  answer?: AskAssistantMessage;
  latest: boolean;
  fullscreen: boolean;
  /** The answer is the thread's first finished one that links pages. */
  disclaimer?: boolean;
  /** The answer is the thread's first finished one. */
  privacy?: boolean;
  enterQuestion: boolean;
  enterAnswer: boolean;
}) {
  return (
    <>
      {question ? (
        <div className={enterQuestion ? enterUp : undefined}>
          <AskQuestion message={question} fullscreen={fullscreen} />
        </div>
      ) : null}
      {answer ? (
        <div className={cn(question && "mt-5", enterAnswer && enterUp)}>
          <AssistantMessage
            message={answer}
            latest={latest}
            fullscreen={fullscreen}
            disclaimer={disclaimer}
            privacy={privacy}
          />
        </div>
      ) : null}
    </>
  );
}
