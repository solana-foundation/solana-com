"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "@workspace/i18n/client";

function QuickLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      className="type-button-small inline-flex h-8 items-center justify-center border border-stroke-secondary px-3 text-white transition-colors hover:border-stroke-tertiary hover:bg-neutral-700 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-white"
    >
      {label}
    </a>
  );
}

export default function TravelSubnav() {
  const t = useTranslations("breakpoint.travel.subnav");
  const navRef = useRef<HTMLElement>(null);
  const [isSubnavPinned, setIsSubnavPinned] = useState(false);
  const travelLinks = [
    { href: "#flights", label: t("flights") },
    { href: "#hotels", label: t("hotels") },
    { href: "#visas", label: t("visas") },
  ];

  useEffect(() => {
    let animationFrame = 0;

    const updatePinnedState = () => {
      animationFrame = 0;

      const nav = navRef.current;
      if (!nav) return;

      const stickyTop = Number.parseFloat(window.getComputedStyle(nav).top);
      const pinned =
        nav.getBoundingClientRect().top <=
        (Number.isFinite(stickyTop) ? stickyTop : 0) + 0.5;

      setIsSubnavPinned((current) => (current === pinned ? current : pinned));
    };

    const requestUpdate = () => {
      if (animationFrame !== 0) return;
      animationFrame = window.requestAnimationFrame(updatePinnedState);
    };

    updatePinnedState();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      if (animationFrame !== 0) {
        window.cancelAnimationFrame(animationFrame);
      }
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, []);

  return (
    <>
      <div
        data-travel-subnav-blackout
        aria-hidden="true"
        className={`pointer-events-none fixed inset-x-0 top-0 z-20 h-20 bg-black transition-opacity duration-150 ${
          isSubnavPinned ? "opacity-100" : "opacity-0"
        }`}
      />
      <nav
        ref={navRef}
        aria-label={t("label")}
        className="sticky top-20 z-30 border-b border-neutral-700 bg-black py-[28.5px]"
      >
        <div className="container flex w-full max-w-[1440px] flex-wrap items-center gap-1 md:gap-2">
          {travelLinks.map((link) => (
            <QuickLink key={link.href} href={link.href} label={link.label} />
          ))}
        </div>
      </nav>
    </>
  );
}
