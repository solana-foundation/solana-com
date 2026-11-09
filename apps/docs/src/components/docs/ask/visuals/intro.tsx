import { cn } from "../cn";
import type { VisualIntro } from "@/lib/docs/ask/generative-ui/schema";
import { bodyText } from "./frame";

/**
 * answer_intro: a lead-in in the answer's own prose (no frame), so it takes
 * the message's type size; AskVisual leaves it out when it repeats the
 * summary.
 */
export function VisualIntroBlock({ intro }: { intro: VisualIntro }) {
  return (
    <div className="my-4 first:mt-0 last:mb-0">
      {intro.title ? (
        <p className="m-0 font-medium text-[var(--sol-text)]">{intro.title}</p>
      ) : null}
      {intro.body ? (
        <p className={cn(bodyText, "m-0", intro.title && "mt-1")}>
          {intro.body}
        </p>
      ) : null}
      {intro.bullets.length > 0 ? (
        <ul
          className={cn(
            bodyText,
            "m-0 mt-3 list-disc space-y-1 ps-5 marker:text-[var(--sol-dim)]",
          )}
        >
          {intro.bullets.map((bullet) => (
            <li key={bullet} className="ps-1">
              {bullet}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
