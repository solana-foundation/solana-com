"use client";

import { useEffect, useRef, useState } from "react";
import type { FAQPageSection } from "@/content/faq-page";

type FAQSubnavProps = {
  sections: Pick<FAQPageSection, "id" | "title">[];
};

export default function FAQSubnav({ sections }: FAQSubnavProps) {
  const navRef = useRef<HTMLElement>(null);
  const [activeSectionId, setActiveSectionId] = useState(sections[0]?.id ?? "");
  const [isSubnavPinned, setIsSubnavPinned] = useState(false);

  useEffect(() => {
    if (sections.length === 0) return;

    let animationFrame = 0;

    const updateActiveSection = () => {
      animationFrame = 0;

      const scrollY = window.scrollY;
      const nav = navRef.current;
      const navHeight = nav?.offsetHeight ?? 0;
      const probeY = scrollY + navHeight + 1;
      let currentSectionId = sections[0]?.id ?? "";

      if (nav) {
        const stickyTop = Number.parseFloat(window.getComputedStyle(nav).top);
        const pinned =
          nav.getBoundingClientRect().top <=
          (Number.isFinite(stickyTop) ? stickyTop : 0) + 0.5;

        setIsSubnavPinned((current) => (current === pinned ? current : pinned));
      }

      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (!element) continue;

        const sectionTop = element.getBoundingClientRect().top + scrollY;
        if (probeY >= sectionTop) {
          currentSectionId = section.id;
        } else {
          break;
        }
      }

      setActiveSectionId(currentSectionId);
    };

    const requestUpdate = () => {
      if (animationFrame !== 0) return;
      animationFrame = window.requestAnimationFrame(updateActiveSection);
    };

    updateActiveSection();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    window.addEventListener("hashchange", requestUpdate);

    return () => {
      if (animationFrame !== 0) {
        window.cancelAnimationFrame(animationFrame);
      }
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      window.removeEventListener("hashchange", requestUpdate);
    };
  }, [sections]);

  return (
    <>
      <div
        aria-hidden="true"
        className={`pointer-events-none fixed inset-x-0 top-0 z-20 h-10 bg-black transition-opacity duration-150 ${
          isSubnavPinned ? "opacity-100" : "opacity-0"
        }`}
      />
      <nav
        ref={navRef}
        aria-label="FAQ categories"
        className="sticky top-10 z-30 border-b border-neutral-700 bg-black px-xs pb-s pt-m md:px-m"
      >
        <div className="scrollbar-hidden mx-auto flex max-w-full gap-2xs overflow-x-auto scroll-px-xs md:justify-center">
          {sections.map((section) => {
            const isActive = activeSectionId === section.id;

            return (
              <a
                key={section.id}
                href={`#${section.id}`}
                aria-current={isActive ? "location" : undefined}
                onClick={() => setActiveSectionId(section.id)}
                className={`inline-flex shrink-0 items-center justify-center border p-2xs font-mono text-button uppercase text-white transition-colors focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-white ${
                  isActive
                    ? "border-stroke-tertiary bg-neutral-700"
                    : "border-stroke-primary bg-black hover:border-stroke-tertiary hover:bg-neutral-700"
                }`}
              >
                {section.title}
              </a>
            );
          })}
        </div>
      </nav>
    </>
  );
}
