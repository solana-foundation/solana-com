import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

export interface UseScrollTextHighlightOptions {
  highlightColor?: string;
}

export const useScrollTextHighlight = <T extends HTMLElement>(
  options: UseScrollTextHighlightOptions = {},
): { ref: React.RefObject<T> } => {
  const { highlightColor = "rgba(255,255,255,0.2)" } = options;

  const targetRef = useRef<T | null>(null);

  useLayoutEffect(() => {
    const element = targetRef.current;
    if (!element) return;
    element.style.setProperty(
      "--highlight-color",
      highlightColor.replace(/\s+/g, ""),
    );
    const split = new SplitText(element, {
      type: "lines",
      linesClass: `line bg-[linear-gradient(to_right,var(--highlight-color)_50%,rgba(0,0,0,0)_50%)] bg-[length:201%_100%] bg-[position:100%_0] !inline-block rounded-sm`,
    });

    const triggers: ScrollTrigger[] = [];

    split.lines.forEach((target) => {
      const tween = gsap.to(target, {
        backgroundPositionX: 0,
        ease: "none",
        scrollTrigger: {
          trigger: target,
          scrub: 0,
          start: "top center",
          end: "bottom center",
        },
      });

      if (tween.scrollTrigger) {
        triggers.push(tween.scrollTrigger);
      }
    });

    return () => {
      split.revert();
      triggers.forEach((trigger) => trigger.kill());
    };
  }, [highlightColor]);

  return {
    ref: targetRef,
  };
};
