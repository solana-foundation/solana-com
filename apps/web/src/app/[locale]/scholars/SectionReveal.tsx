"use client";

import { useEffect } from "react";

const selector = "[data-scholars-reveal]";

export default function SectionReveal() {
  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>(selector),
    );

    const reduceMotion = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      sections.forEach((section) => {
        section.dataset.revealState = "visible";
      });
      return;
    }

    // Do not hide a section that has already reached the viewport during
    // hydration. Only sections still below the fold are eligible to reveal.
    const pendingSections = sections.filter((section) => {
      const rect = section.getBoundingClientRect();
      const isVisible = rect.bottom > 0 && rect.top < window.innerHeight;
      section.dataset.revealState = isVisible ? "visible" : "pending";
      return !isVisible;
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const section = entry.target as HTMLElement;
          section.dataset.revealState = "visible";
          observer.unobserve(section);
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 },
    );

    const frame = requestAnimationFrame(() => {
      pendingSections.forEach((section) => observer.observe(section));
    });

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  return null;
}
