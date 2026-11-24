"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { cn } from "./cn";
import {
  askStore,
  type AskConversationReset,
  type AskErrorKind,
} from "@/lib/docs/ask/store";
import { useAskSelector } from "@/lib/docs/ask/use-ask";
import { CalloutIcon } from "../docs-ui-icons";
import { focusRing } from "./ui";

/** Inline text action, as the docs' underlined links but in body colour. */
const textButton = cn(
  "rounded-sm font-medium text-[var(--sol-text)] underline decoration-[var(--sol-line-strong)] underline-offset-[3px] transition-colors duration-150 hover:decoration-current motion-reduce:transition-none",
  focusRing,
);

/**
 * A docs callout glyph at 16px (its own class sizes it only in callouts):
 * danger for failures, info for a wait.
 */
function LineIcon({
  type = "danger",
  className,
}: {
  type?: "danger" | "info";
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "mt-0.5 grid size-4 shrink-0 place-items-center [&_svg]:size-4",
        className,
      )}
    >
      <CalloutIcon type={type} />
    </span>
  );
}

/** Nothing else is in the turn: the one case for a tinted box. */
const BOXED: ReadonlySet<AskErrorKind> = new Set(["unavailable", "offline"]);
/**
 * Asking again right away can't help: the question goes back instead (an
 * expired chat's, so the reader can add what the agent no longer has).
 */
const NO_RETRY: ReadonlySet<AskErrorKind> = new Set([
  "rateLimited",
  "tooLong",
  "conversationNotFound",
]);

/**
 * Nothing broke, the reader only has to wait (the per-minute limit) or send
 * the question again (an expired chat): a muted line, not a red one.
 */
const WAIT: ReadonlySet<AskErrorKind> = new Set([
  "rateLimited",
  "conversationNotFound",
]);

/**
 * Puts a refused question (and its page or quote) back in the composer,
 * once, unless the reader has started typing or quoting something else.
 * Once per turn, not per load: the answer keeps `questionRestored` with
 * the thread, so a reader who cleared the composer doesn't get it back on
 * reload. A quote sent without words goes back without them: its question
 * (`explainSelection`, "Explain this") was ours, not the reader's.
 */
function useRestoreQuestion(
  messageId: string,
  enabled: boolean,
  explainSelection: string,
) {
  useEffect(() => {
    if (!enabled) return;
    const { messages, composerDraft, composerQuote, pageContext } =
      askStore.getState();
    const index = messages.findIndex((message) => message.id === messageId);
    const answer = messages[index];
    if (answer?.role !== "assistant" || answer.questionRestored) return;
    askStore.markQuestionRestored(messageId);
    if (composerDraft.trim() || composerQuote) return;
    const question = messages
      .slice(0, Math.max(index, 0))
      .findLast((message) => message.role === "user");
    if (question?.role !== "user") return;
    if (question.quote) {
      // The words and the quote card, as they were; the page goes with
      // the quote.
      askStore.setComposerDraft(
        question.text === explainSelection ? "" : question.text,
      );
      askStore.setComposerQuote({
        ...question.quote,
        ...(question.pageContext ? { pageContext: question.pageContext } : {}),
      });
      return;
    }
    // What was sent: a code block's ask goes back without the page title.
    askStore.setComposerDraft(question.sent ?? question.text);
    if (question.pageContext && !pageContext)
      askStore.setPageContext(question.pageContext);
  }, [messageId, enabled, explainSelection]);
}

/**
 * Why an answer failed, with the one action that helps. On the latest turn:
 * a red line with the docs' danger icon and a "Try again" (or "New chat"
 * when the conversation is full) text button (a muted info line for a
 * wait or an expired chat); a tinted danger box only when the service or
 * the network is down. Older turns just say they didn't
 * finish. `latest` and `hasPartial` default to the message in the store.
 */
export function AskError({
  kind,
  messageId,
  latest,
  hasPartial,
}: {
  kind: AskErrorKind;
  messageId: string;
  /** The thread's last answer (default: looked up). */
  latest?: boolean;
  /** Some of the answer arrived (default: looked up). */
  hasPartial?: boolean;
}) {
  const t = useTranslations("docsAsk");
  const isLatest = useAskSelector(
    (s) => latest ?? s.messages.at(-1)?.id === messageId,
  );
  const partial = useAskSelector((s) => {
    if (hasPartial !== undefined) return hasPartial;
    const message = s.messages.find((m) => m.id === messageId);
    return (
      message?.role === "assistant" && (!!message.text.trim() || !!message.ui)
    );
  });
  useRestoreQuestion(
    messageId,
    isLatest && NO_RETRY.has(kind),
    t("prompts.explainSelection"),
  );

  if (!isLatest) {
    return (
      <p className="m-0 mt-3 text-[12px] leading-4 text-[var(--sol-dim)]">
        <bdi>{t("didntFinish")}</bdi>
      </p>
    );
  }

  // A failure after some text: the text did load, it just stopped (a
  // timeout mid-answer arrives as `unavailable`).
  const shown =
    (kind === "generic" || kind === "unavailable") && partial
      ? "incomplete"
      : kind;
  const full = kind === "conversationFull";
  const action = NO_RETRY.has(kind) ? null : (
    <button
      type="button"
      onClick={() => (full ? askStore.reset() : askStore.retry(messageId))}
      className={cn(textButton, "ms-1")}
    >
      <bdi>{full ? t("newChat") : t("retry")}</bdi>
    </button>
  );

  // Below, the message and its action flow as one sentence, wrapping
  // together. <bdi>: an untranslated (English) line in an Arabic answer
  // keeps its full stop at the end.
  if (BOXED.has(kind) && !partial) {
    return (
      <div className="mt-3 flex items-start gap-2.5 rounded-xl border border-[#fecaca] bg-[#fef2f2] px-3.5 py-3 text-[13px] leading-5 text-[var(--sol-text)] dark:border-[#7f1d1d] dark:bg-[oklab(0.577099_0.191149_0.0987651/0.2)]">
        <LineIcon className="text-[#991b1b] dark:text-[#fca5a5]" />
        <div className="min-w-0">
          <p className="m-0 inline">
            <bdi>{t(`errors.${shown}`)}</bdi>
          </p>
          {action}
        </div>
      </div>
    );
  }
  const wait = WAIT.has(kind);
  return (
    <div
      className={cn(
        "mt-3 flex items-start gap-2 text-[13px] leading-5",
        wait ? "text-[var(--sol-muted)]" : "text-[var(--sol-red)]",
      )}
    >
      <LineIcon type={wait ? "info" : "danger"} />
      <div className="min-w-0">
        <p className="m-0 inline">
          <bdi>{t(`errors.${shown}`)}</bdi>
        </p>
        {action}
      </div>
    </div>
  );
}

/**
 * Above an answer that went out without the conversation on screen (the
 * session was renewed, or the conversation was full): a muted info line
 * saying why the agent didn't have the earlier messages.
 */
export function AskConversationReset({ kind }: { kind: AskConversationReset }) {
  const t = useTranslations("docsAsk");
  return (
    <div className="mb-3 flex items-start gap-2 text-[13px] leading-5 text-[var(--sol-muted)]">
      <LineIcon type="info" />
      <p className="m-0 min-w-0">
        <bdi>{t(`conversationReset.${kind}`)}</bdi>
      </p>
    </div>
  );
}

/**
 * A stopped answer's one line: "Stopped · Ask again" (instead of the
 * actions row, which would offer copying half an answer).
 */
export function AskStopped({ messageId }: { messageId: string }) {
  const t = useTranslations("docsAsk");
  return (
    <div className="mt-3 flex items-center gap-2 text-[12px] leading-4 text-[var(--sol-dim)]">
      <p className="m-0">
        <bdi>{t("stopped")}</bdi>
      </p>
      <span aria-hidden="true">·</span>
      <button
        type="button"
        onClick={() => askStore.retry(messageId)}
        className={textButton}
      >
        <bdi>{t("askAgain")}</bdi>
      </button>
    </div>
  );
}
