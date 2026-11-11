"use client";

import type { SyntheticEvent } from "react";
import { animate, steps, useReducedMotion } from "motion/react";
import FaqToggle from "@@/src/assets/faq-toggle.inline.svg";
import { EASE_LAND, TURN } from "./motion";

type Item = { id: string; question: string; answer: string };

/**
 * Rows divided by rules only. Native <details>, so it works without script;
 * on open the marker turns a quarter and the answer fills in four steps.
 */
export function FaqList({ items }: { items: Item[] }) {
  const reduced = useReducedMotion();

  const onToggle = (event: SyntheticEvent<HTMLDetailsElement>) => {
    const details = event.currentTarget;
    if (reduced || !details.open) return;
    const marker = details.querySelector("[data-faq-marker]");
    const answer = details.querySelector("[data-faq-answer]");
    if (marker)
      animate(
        marker,
        { transformPerspective: 200, rotateY: [-90, 0] },
        { duration: TURN, ease: EASE_LAND },
      );
    if (answer)
      animate(
        answer,
        { clipPath: ["inset(0% 0% 100% 0%)", "inset(0% 0% 0% 0%)"] },
        { duration: 0.32, ease: steps(4, "end") },
      );
  };

  return (
    <div className="border-b border-ink/15">
      {items.map(({ id, question, answer }) => (
        <details
          key={id}
          onToggle={onToggle}
          className="group border-t border-ink/15"
        >
          <summary className="flex cursor-pointer list-none items-center gap-6 py-[22px] text-[20px] font-bold leading-none tracking-[-0.03em] outline-none focus-visible:underline focus-visible:underline-offset-[6px] group-open:text-bldr-purple md:text-[24px] [&::-webkit-details-marker]:hidden">
            <span className="flex-1">{question}</span>
            <FaqToggle
              aria-hidden
              data-faq-marker
              className="h-[23px] w-[26px] shrink-0"
            />
          </summary>
          <p
            data-faq-answer
            className="max-w-[60ch] pb-6 text-[18px] leading-none tracking-[-0.03em]"
          >
            {answer}
          </p>
        </details>
      ))}
    </div>
  );
}
