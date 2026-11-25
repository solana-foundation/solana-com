"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import type { AskStatus } from "@/lib/docs/ask/store";
import { spinner, visuallyHidden } from "./ui";

/** How long each "Staking…"-style word stays before the next one. */
const WORD_MS = 2600;

function pick(words: string[], not?: string): string {
  if (words.length < 2) return words[0] ?? "";
  let next = not;
  while (next === not) next = words[Math.floor(Math.random() * words.length)];
  return next!;
}

/**
 * A rotating Solana word ("Staking…", "Gossiping…") until the answer's text
 * starts. Shown only to sighted readers: the thread's live region announces
 * the plain status, and with reduced motion the word holds.
 */
function useThinkingWord(enabled: boolean): string | null {
  const t = useTranslations("docsAsk");
  const words = t.raw("status.thinking") as string[];
  const [word, setWord] = useState(() => (enabled ? pick(words) : null));

  useEffect(() => {
    if (!enabled) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(
      () => setWord((current) => pick(words, current ?? undefined)),
      WORD_MS,
    );
    return () => window.clearInterval(id);
  }, [enabled, words]);

  return enabled ? word : null;
}

/** Each new word (or status) fades and rises in; keyed, so it replays. */
const WORD_ENTER =
  "inline-block animate-in fade-in-0 slide-in-from-bottom-1 duration-200 motion-reduce:animate-none";

/**
 * The brand-gradient ring plus what the assistant is doing while an answer
 * is on its way. Until the answer's text starts (`thinking`) the row shows
 * the rotating words and keeps the real stage for screen readers.
 */
export function AskStatusRow({
  status,
  thinking = false,
}: {
  status: AskStatus;
  thinking?: boolean;
}) {
  const t = useTranslations("docsAsk");
  const word = useThinkingWord(thinking);
  const label = t(`status.${status}`);
  return (
    <div className="flex items-center gap-2 text-[13px] leading-5 text-[var(--sol-dim)]">
      <span aria-hidden="true" className={spinner} />
      {word ? (
        <>
          <span key={word} aria-hidden="true" className={WORD_ENTER}>
            {word}
          </span>
          <span className={visuallyHidden}>{label}</span>
        </>
      ) : (
        <span key={label} className={WORD_ENTER}>
          {label}
        </span>
      )}
    </div>
  );
}
