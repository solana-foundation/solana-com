import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { cn } from "@/app/components/utils";

gsap.registerPlugin(ScrollTrigger, SplitText);

export interface UseScrollTextHighlightOptions {
  highlightColor?: string;
}

export const useScrollTextHighlight = <T extends HTMLElement>(
  options: UseScrollTextHighlightOptions = {},
): { ref: React.RefObject<T | null> } => {
  const { highlightColor = "rgba(255,255,255,0.2)" } = options;

  const targetRef = useRef<T | null>(null);

  useLayoutEffect(() => {
    const element = targetRef.current;

    if (!element) return;

    const mm = gsap.matchMedia();

    // Under reduced motion the paragraph is left untouched: no split, no
    // scroll-scrubbed reveal. The unrevealed state is already the readable one
    // (the overlay's clip-path defaults to fully clipped), so plain text is the
    // correct resting state rather than a statically applied highlight.
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const triggers: ScrollTrigger[] = [];
      const killTriggers = () => {
        triggers.forEach((trigger) => trigger.kill());
        triggers.length = 0;
      };

      element.style.setProperty(
        "--highlight-color",
        highlightColor.replace(/\s+/g, ""),
      );
      const split = new SplitText(element, {
        autoSplit: true,
        type: "lines",
        linesClass: cn(
          `line whitespace-nowrap !inline-block`,
          `before:content-[attr(data-content)] before:absolute before:inset-0 before:rounded-sm`,
          `before:bg-[color:var(--highlight-color)] before:text-black`,
          `before:[clip-path:inset(0_var(--progress,100%)_0_0)]`,
        ),
        onSplit: (s) => {
          killTriggers();

          s.lines.forEach((target) => {
            target.setAttribute("data-content", target.textContent || "");

            const tween = gsap.fromTo(
              target,
              { "--progress": "100%" },
              {
                "--progress": "0%",
                ease: "none",
                scrollTrigger: {
                  trigger: target,
                  scrub: 0.2,
                  start: "top center",
                  end: "bottom center",
                },
              },
            );

            if (tween.scrollTrigger) {
              triggers.push(tween.scrollTrigger);
            }
          });
        },
      });

      return () => {
        killTriggers();
        split.revert();
      };
    });

    return () => {
      mm.revert();
    };
  }, [highlightColor]);

  return {
    ref: targetRef,
  };
};
