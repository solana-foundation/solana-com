"use client";

import { useEffect } from "react";

const selector = "[data-scholars-reveal]";

export default function SectionReveal() {
  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>(selector),
    );

    if (!("IntersectionObserver" in window)) {
      sections.forEach((section) => {
        section.dataset.revealState = "visible";
      });
      return;
    }

    sections.forEach((section) => {
      section.dataset.revealState = "pending";
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
      sections.forEach((section) => observer.observe(section));
    });

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  return null;
}
