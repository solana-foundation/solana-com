"use client";

import { useId } from "react";
import { trackAskSolana } from "@solana-com/ui-chrome/ask-solana/analytics";
import { cn } from "./cn";
import { askStore, type CodeFollowups } from "@/lib/docs/ask/store";
import { entranceClass, useEntrance } from "./ask-actions.client";
import { focusRing } from "./ui";

/** What a pill shows and the question it asks. */
type Pill = {
  key: string;
  label: string;
  message: string;
  /** Before it asks (analytics). */
  onPick?: () => void;
};

/**
 * A prompt and its pills on one row, like the docs' "You've used this in"
 * pills; nothing is invented here. A pill asks its message as the next
 * question and leaves an attached page in the composer.
 */
function FollowupRow({
  prompt,
  pills,
  enter,
  className,
}: {
  prompt: string | null;
  pills: Pill[];
  /** Fade in (once, as the answer finishes). */
  enter: boolean;
  className?: string;
}) {
  const promptId = useId();
  return (
    <div
      role="group"
      aria-labelledby={prompt ? promptId : undefined}
      className={cn(
        "flex flex-wrap items-center gap-2",
        enter && entranceClass,
        className,
      )}
    >
      {prompt ? (
        <p
          id={promptId}
          className="m-0 me-0.5 text-[13px] leading-5 text-[var(--sol-muted)]"
        >
          {prompt}
        </p>
      ) : null}
      {pills.map((pill) => (
        <button
          key={pill.key}
          type="button"
          onClick={() => {
            pill.onPick?.();
            askStore.send(pill.message, { pageContext: null });
          }}
          className={cn(
            "rounded-full border border-solid border-[var(--sol-line)] px-2.5 py-0.5 text-start text-[13px] leading-5 text-[var(--sol-text)] transition-colors duration-150 hover:border-[var(--sol-purple-line)] hover:bg-[var(--sol-purple-soft)] hover:text-[var(--sol-purple-text)] motion-reduce:transition-none",
            focusRing,
          )}
        >
          {pill.label}
        </button>
      ))}
    </div>
  );
}

/**
 * The agent's code follow-ups: "Do you want to see a code example for
 * that?" with a pill per language.
 */
export function AskFollowups({
  followups,
  prompt,
  animate = true,
}: {
  followups: CodeFollowups;
  /** The prompt line, taken off the end of the answer text. */
  prompt: string | null;
  /** Fade in once (false: an answer restored as it was, on reload). */
  animate?: boolean;
}) {
  // Shown only under the latest finished answer; fades in with its sources.
  const enter = useEntrance(followups, animate);
  return (
    <FollowupRow
      prompt={prompt}
      pills={followups.buttons.map((button) => ({
        key: `${button.type}:${button.label}`,
        label: button.label,
        message: button.message,
        onPick: () =>
          trackAskSolana("docs_ai_code_followup_clicked", {
            language: button.language,
            type: button.type,
            surface: askStore.getState().layout,
          }),
      }))}
      enter={enter}
      className="mt-5 [animation-delay:120ms]"
    />
  );
}
