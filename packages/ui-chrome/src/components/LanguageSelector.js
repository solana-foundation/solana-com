"use client";

import { useEffect, useRef, useState } from "react";
import Globe from "../assets/Globe.inline.svg";
import { ChevronDown } from "react-feather";
import { languages } from "@workspace/i18n/config";
import { usePathname } from "@workspace/i18n/routing";
import { useLocale } from "next-intl";

const Language = () => {
  const currentLocale = useLocale();
  const asPath = usePathname();

  const [open, setOpen] = useState(false);
  const [placeAbove, setPlaceAbove] = useState(false);
  const [maxHeight, setMaxHeight] = useState("50vh");
  const [isMobile, setIsMobile] = useState(false);

  const buttonRef = useRef(null);
  const menuRef = useRef(null);

  // Track mobile breakpoint
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640); // Tailwind sm = 640px
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Close on outside click
  useEffect(() => {
    const onClick = (e) => {
      if (!open) return;
      if (
        buttonRef.current?.contains(e.target) ||
        menuRef.current?.contains(e.target)
      ) {
        return;
      }
      setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Auto-position and clamp height (desktop only)
  useEffect(() => {
    if (!open || isMobile) return;

    const updatePosition = () => {
      if (!buttonRef.current) return;

      const btnRect = buttonRef.current.getBoundingClientRect();
      const viewportH = window.innerHeight;
      const margin = 8; // 0.5rem
      const spaceBelow = viewportH - btnRect.bottom - margin;
      const spaceAbove = btnRect.top - margin;

      const desired = Math.min(
        viewportH * 0.5,
        menuRef.current?.scrollHeight ?? Number.POSITIVE_INFINITY,
      );

      const needsAbove =
        spaceBelow < Math.min(desired, viewportH * 0.5) &&
        spaceAbove >= spaceBelow;
      setPlaceAbove(needsAbove);

      const allowed = Math.max(0, needsAbove ? spaceAbove : spaceBelow);
      setMaxHeight(`${Math.min(allowed, viewportH * 0.5)}px`);
    };

    updatePosition();

    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open, isMobile]);

  const positionClasses = placeAbove ? "bottom-full mb-2" : "top-full mt-2";

  return (
    <div className="relative -mt-1">
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1 p-0 text-sm uppercase text-[var(--body-text)] hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--body-text)] focus-visible:ring-offset-2"
        suppressHydrationWarning={true}
      >
        <Globe height="20" className="text-gray-500" />
        <span className="mx-1 align-middle text-gray-500">{currentLocale}</span>
        <ChevronDown
          size={17}
          className={`text-gray-500 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open &&
        (isMobile ? (
          // Mobile: centered overlay
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              ref={menuRef}
              role="menu"
              aria-label="Language options"
              className="w-full max-w-xs overflow-y-auto rounded-md bg-white p-1 text-sm shadow-lg ring-1 ring-black/5 dark:bg-neutral-900"
              style={{ maxHeight: "60vh" }}
            >
              {Object.keys(languages).map((language) => (
                <a
                  key={language}
                  role="menuitem"
                  href={"/" + language + asPath}
                  onClick={() => setOpen(false)}
                  className="block px-3 py-2 text-gray-700 hover:bg-gray-100"
                >
                  {languages[language]}
                </a>
              ))}
            </div>
          </div>
        ) : (
          // Desktop: anchored dropdown
          <div
            ref={menuRef}
            role="menu"
            aria-label="Language options"
            className={`absolute right-0 z-50 ${positionClasses} w-48 overflow-y-auto rounded-md bg-white p-1 text-sm shadow-lg ring-1 ring-black/5 dark:bg-neutral-900`}
            style={{ maxHeight }}
          >
            {Object.keys(languages).map((language) => (
              <a
                key={language}
                role="menuitem"
                href={"/" + language + asPath}
                onClick={() => setOpen(false)}
                className="block px-3 py-2 text-gray-700 hover:bg-gray-100"
              >
                {languages[language]}
              </a>
            ))}
          </div>
        ))}
    </div>
  );
};

export default Language;
