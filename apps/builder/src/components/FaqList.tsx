"use client";

import type { MouseEvent } from "react";
import { animate, steps, useReducedMotion } from "motion/react";
import FaqToggle from "@@/src/assets/faq-toggle.inline.svg";
import { EASE_LAND, TURN } from "./motion";

const HIDDEN = "inset(0% 0% 100% 0%)";

type Item = { id: string; question: string; answer: string };

/**
 * Rows divided by rules only. Native <details> sharing a `name`, so it works
 * without script and only one row is open at a time; on open the marker turns
 * a quarter and the answer fills in four steps.
 */
export function FaqList({ items }: { items: Item[] }) {
  const reduced = useReducedMotion();

  // Opened here rather than in a toggle handler: toggle fires a frame after
  // the row opens, so the whole answer painted once before its fill began.
  const onSummaryClick = (event: MouseEvent<HTMLElement>) => {
    const details = event.currentTarget.closest("details");
    if (reduced || !details || details.open) return;
    event.preventDefault();
    const marker = details.querySelector<HTMLElement>("[data-faq-marker]");
    const answer = details.querySelector<HTMLElement>("[data-faq-answer]");
    if (answer) answer.style.clipPath = HIDDEN;
    details.open = true;
    if (marker)
      animate(
        marker,
        // Perspective is pinned for the whole turn. A single value animates
        // up from 0, and near 0 the edge-on marker projects as a purple slab
        // down the full height of the column.
        { transformPerspective: [200, 200], rotateY: [-90, 0] },
        { duration: TURN, ease: EASE_LAND },
      );
    if (answer)
      animate(
        answer,
        { clipPath: [HIDDEN, "inset(0% 0% 0% 0%)"] },
        { duration: 0.32, ease: steps(4, "end") },
      );
  };

  return (
    <div className="border-b border-ink/15">
      {items.map(({ id, question, answer }) => (
        <details
          key={id}
          name="bldr-faq"
          className="group border-t border-ink/15"
        >
          <summary
            onClick={onSummaryClick}
            className="flex cursor-pointer list-none items-center gap-6 py-[22px] text-[20px] font-bold leading-none tracking-[-0.03em] outline-none focus-visible:underline focus-visible:underline-offset-[6px] group-open:text-bldr-purple md:text-[24px] [&::-webkit-details-marker]:hidden"
          >
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
