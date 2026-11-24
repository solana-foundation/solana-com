"use client";

import { useFormatter, useTranslations } from "next-intl";
import { useLayoutEffect, useRef, useState } from "react";
import { cn } from "./cn";
import { ASK_MAX_MESSAGE_CHARS } from "@/lib/docs/ask/config";
import { quotedQuestion, type AskComposerQuote } from "@/lib/docs/ask/quote";
import { askStore } from "@/lib/docs/ask/store";
import { useAskSelector } from "@/lib/docs/ask/use-ask";
import { ArrowUpIcon, StopIcon, XIcon } from "../docs-ui-icons";
import { FileTextIcon } from "./ask-sources.client";
import { focusRing, mono, visuallyHidden } from "./ui";

/** How the root finds (and focuses) the composer's field. */
export const COMPOSER_SELECTOR = "[data-ask-composer]";

/** 1 to 8 lines of 20px, plus the field's vertical padding. */
const MAX_HEIGHT = 8 * 20 + 12;

/** The page chip's × (and the quote card's). */
const removeButton = cn(
  "grid size-4 shrink-0 place-items-center rounded-sm text-[var(--sol-dim)] transition-colors duration-150 hover:text-[var(--sol-text)] motion-reduce:transition-none [&_svg]:size-3.5",
  focusRing,
);

/**
 * Text selected on the page ("Ask AI about this"), waiting to go with the
 * next question: a quote under the page chip, with the chip's ×. Three
 * lines at most; the bubble shows more once it is sent.
 */
function QuoteCard({
  quote,
  onRemove,
}: {
  quote: AskComposerQuote;
  onRemove: () => void;
}) {
  const t = useTranslations("docsAsk");
  return (
    <div className="mb-2 flex items-start gap-1.5 rounded-e-md border border-s-2 border-[var(--sol-line)] border-s-[var(--sol-purple)] bg-[var(--sol-page)] py-1 pe-1 ps-2 text-[12px] leading-[18px] text-[var(--sol-dim)]">
      <p
        dir={quote.code ? "ltr" : "auto"}
        className={cn(
          "m-0 line-clamp-3 min-w-0 flex-1 break-words",
          quote.code ? cn(mono, "whitespace-pre-wrap text-[11.5px]") : "",
        )}
      >
        <span className={visuallyHidden}>{t("selection.quote")}: </span>
        {quote.text}
      </p>
      <button
        type="button"
        aria-label={t("selection.removeQuote")}
        title={t("selection.removeQuote")}
        onClick={onRemove}
        className={cn(removeButton, "mt-px")}
      >
        <XIcon />
      </button>
    </div>
  );
}

/**
 * The question field, one row like the docs header's search field: an
 * autosizing textarea (Enter sends, Shift+Enter adds a line) with Send
 * beside it, which turns into Stop while an answer streams. An attached
 * page sits in a chip above the field, and selected text in a quote card
 * under it; with a quote, Send works without a question. Too long a
 * question (quote included) turns the ring red and shows the count. The
 * draft lives in the store, so it survives switching to full screen.
 */
export function AskComposer({ fullscreen }: { fullscreen: boolean }) {
  const t = useTranslations("docsAsk");
  const format = useFormatter();
  const draft = useAskSelector((s) => s.composerDraft);
  const busy = useAskSelector((s) => s.busy);
  const pageContext = useAskSelector((s) => s.pageContext);
  const quote = useAskSelector((s) => s.composerQuote);
  const empty = useAskSelector((s) => s.messages.length === 0);
  const field = useRef<HTMLTextAreaElement>(null);
  /** A send refused as too long: it stands until the draft or quote changes. */
  const [refused, setRefused] = useState<{
    draft: string;
    quote: AskComposerQuote | null;
  } | null>(null);
  // What the limit counts: the message as sent, quote included.
  const length = quote
    ? quotedQuestion(quote, draft.trim() || t("prompts.explainSelection"))
        .length
    : draft.length;
  const tooLong =
    (refused?.draft === draft && refused.quote === quote) ||
    length > ASK_MAX_MESSAGE_CHARS;

  // Autosize through a custom property (no inline height style).
  useLayoutEffect(() => {
    const el = field.current;
    if (!el) return;
    el.style.setProperty("--ask-field-h", "auto");
    el.style.setProperty(
      "--ask-field-h",
      `${Math.min(el.scrollHeight, MAX_HEIGHT)}px`,
    );
  }, [draft, fullscreen]);

  const submit = () => {
    const result = askStore.submitComposer();
    setRefused(
      !result.ok && result.reason === "tooLong" ? { draft, quote } : null,
    );
  };

  const canSend = (draft.trim().length > 0 || !!quote) && !tooLong;
  const placeholder = empty ? t("placeholder") : t("placeholderFollowUp");

  return (
    // A rule across the panel keeps the thread's last line off the field.
    // Full screen reads as one page, so the thread fades out above the
    // field instead.
    <div
      className={cn(
        "relative shrink-0",
        !fullscreen && "border-t border-[var(--sol-line)]",
      )}
    >
      {fullscreen ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-8 h-8 bg-gradient-to-t from-[var(--sol-page)] to-transparent"
        />
      ) : null}
      <div
        className={cn(
          "pt-3",
          fullscreen
            ? "mx-auto w-full max-w-[46rem] px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]"
            : "px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))]",
        )}
      >
        {pageContext ? (
          <div className="mb-2 flex">
            <span className="inline-flex min-w-0 items-center gap-1.5 rounded-md border border-[var(--sol-line)] bg-[var(--sol-page)] py-0.5 pe-1 ps-1.5 text-[12px] leading-5 text-[var(--sol-muted)]">
              <FileTextIcon className="size-3.5 shrink-0 text-[var(--sol-dim)]" />
              <span className="min-w-0 truncate">
                {t("pageContext", { title: pageContext.title })}
              </span>
              <button
                type="button"
                aria-label={t("removePageContext")}
                title={t("removePageContext")}
                onClick={() => {
                  askStore.setPageContext(null);
                  field.current?.focus();
                }}
                className={removeButton}
              >
                <XIcon />
              </button>
            </span>
          </div>
        ) : null}
        {quote ? (
          <QuoteCard
            quote={quote}
            onRemove={() => {
              askStore.setComposerQuote(null);
              field.current?.focus();
            }}
          />
        ) : null}
        <div
          className={cn(
            "flex items-end gap-1.5 rounded-[10px] bg-[var(--sol-field)] p-1 ps-3 transition-shadow duration-150 motion-reduce:transition-none",
            tooLong
              ? "shadow-[inset_0_0_0_1px_var(--sol-red),0_0_0_3px_rgb(180_35_24/0.12)] dark:shadow-[inset_0_0_0_1px_var(--sol-red),0_0_0_3px_rgb(248_113_113/0.16)]"
              : "shadow-[inset_0_0_0_1px_var(--sol-field-line)] focus-within:shadow-[inset_0_0_0_1px_var(--sol-purple),0_0_0_3px_var(--sol-purple-soft)] hover:shadow-[inset_0_0_0_1px_var(--sol-field-line-hover)] hover:focus-within:shadow-[inset_0_0_0_1px_var(--sol-purple),0_0_0_3px_var(--sol-purple-soft)]",
          )}
        >
          <textarea
            ref={field}
            data-ask-composer=""
            dir="auto"
            rows={1}
            value={draft}
            aria-label={placeholder}
            placeholder={placeholder}
            aria-invalid={tooLong || undefined}
            enterKeyHint="send"
            onChange={(event) => askStore.setComposerDraft(event.target.value)}
            onKeyDown={(event) => {
              if (
                event.key === "Enter" &&
                !event.shiftKey &&
                !event.nativeEvent.isComposing
              ) {
                event.preventDefault();
                submit();
              }
            }}
            className={cn(
              "m-0 h-[var(--ask-field-h,auto)] max-h-[172px] min-h-8 min-w-0 flex-1 resize-none overflow-y-auto border-0 bg-transparent px-0 py-1.5 text-[14px] leading-5 text-[var(--sol-text)] outline-none placeholder:text-[var(--sol-dim)] max-sm:text-[16px]",
              fullscreen && "text-[15px] leading-6",
            )}
          />
          {busy ? (
            <button
              type="button"
              aria-label={t("stop")}
              title={t("stop")}
              onClick={() => askStore.stop()}
              className={cn(
                // The docs' icon button, not a black square: the loudest
                // control while an answer streams shouldn't be Stop.
                "grid size-8 shrink-0 place-items-center rounded-lg bg-[var(--sol-soft)] text-[var(--sol-text)] shadow-[inset_0_0_0_1px_var(--sol-line-strong)] transition-colors duration-150 hover:bg-[var(--sol-line)] motion-reduce:transition-none [&_svg]:size-2.5",
                focusRing,
              )}
            >
              <StopIcon />
            </button>
          ) : (
            <button
              type="button"
              aria-label={t("send")}
              title={t("send")}
              disabled={!canSend}
              onClick={submit}
              className={cn(
                "grid size-8 shrink-0 place-items-center rounded-lg transition-colors duration-150 motion-reduce:transition-none [&_svg]:size-4",
                canSend
                  ? "bg-[var(--sol-cta)] text-[var(--sol-cta-text)] hover:bg-[var(--sol-cta-hover)]"
                  : "cursor-default bg-[var(--sol-soft)] text-[var(--sol-dim)]",
                focusRing,
              )}
            >
              <ArrowUpIcon />
            </button>
          )}
        </div>
        {tooLong ? (
          <div className="mt-2 flex items-baseline justify-between gap-3">
            <p
              role="alert"
              className="m-0 text-[12px] leading-4 text-[var(--sol-red)]"
            >
              {/* With a quote, the count includes it: removing it helps too. */}
              {quote ? t("errors.tooLongWithQuote") : t("errors.tooLong")}
            </p>
            <span
              className={cn(
                mono,
                "shrink-0 text-[11px] leading-4 tabular-nums text-[var(--sol-red)]",
              )}
            >
              {format.number(length)}/{format.number(ASK_MAX_MESSAGE_CHARS)}
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
