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
): { ref: React.RefObject<T> } => {
  const { highlightColor = "rgba(255,255,255,0.2)" } = options;

  const targetRef = useRef<T | null>(null);

  useLayoutEffect(() => {
    const element = targetRef.current;

    if (!element) return;

    const triggers: ScrollTrigger[] = [];

    element.style.setProperty(
      "--highlight-color",
      highlightColor.replace(/\s+/g, ""),
    );
    const split = new SplitText(element, {
      autoSplit: true,
      type: "lines",
      linesClass: cn(
        `line whitespace-nowrap bg-[linear-gradient(to_right,var(--highlight-color)_50%,rgba(0,0,0,0)_50%)] bg-[length:201%_100%] bg-[position:100%_0] !inline-block rounded-sm`,
        `before:content-[attr(data-content)] before:absolute before:inset-0 before:bg-[linear-gradient(to_right,#000_50%,rgba(0,0,0,0)_50%)] before:bg-[length:201%_100%] before:bg-[position:var(--progress,100%)_0] before:rounded-sm`,
        `before:bg-clip-text before:text-transparent`,
      ),
      onSplit: (s) => {
        triggers.forEach((trigger) => trigger.kill());

        s.lines.forEach((target) => {
          target.setAttribute("data-content", target.textContent || "");

          const tween = gsap.to(target, {
            backgroundPositionX: 0,
            ease: "none",
            scrollTrigger: {
              trigger: target,
              scrub: 0,
              start: "top center",
              end: "bottom center",
            },
            onUpdate: function () {
              if (this?.progress)
                gsap.set(target, {
                  "--progress": `${100 - this.progress() * 100}%`,
                });
            },
          });

          if (tween.scrollTrigger) {
            triggers.push(tween.scrollTrigger);
          }
        });
      },
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
