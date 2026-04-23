"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import EmailSubscribeDialog from "@/components/EmailSubscribeDialog";

const STICKY_OFFSET_PX = 12;
const SCROLL_THRESHOLD_PX = 24;

export default function Navigation() {
  const t = useTranslations("breakpoint");
  const [isSticky, setIsSticky] = useState(false);
  const [subscribeOpen, setSubscribeOpen] = useState(false);

  useEffect(() => {
    let ticking = false;

    const updateStickyState = () => {
      ticking = false;
      setIsSticky(window.scrollY > SCROLL_THRESHOLD_PX);
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(updateStickyState);
    };

    updateStickyState();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <>
      <nav
        aria-label="Primary"
        className={`left-1/2 z-30 flex h-12 -translate-x-1/2 items-center overflow-hidden bg-black pl-3 pr-2 py-2 transition-[width,transform,background-color,opacity] duration-300 ease-out ${
          isSticky
            ? "fixed w-[calc(100vw-32px)] max-w-[343px] md:w-[426px] md:max-w-none"
            : "absolute w-auto"
        }`}
        style={{ top: `${STICKY_OFFSET_PX}px` }}
      >
        <Link
          href="/"
          className="flex h-4 shrink-0 items-center gap-[5.705px] md:h-5 md:gap-[7px]"
          aria-label="Breakpoint 2026"
        >
          <img
            src="/assets/nav-solana.svg"
            alt=""
            aria-hidden="true"
            className="block h-[15.64px] w-[18.15px] md:h-[19.55px] md:w-[22.68px]"
          />
          <img
            src="/assets/nav-bp26.svg"
            alt="BP26"
            className="block h-4 w-[83.56px] md:h-5 md:w-[104.45px]"
          />
        </Link>

        <div className="flex flex-1 justify-end pr-1 md:pr-[4px]">
          <button
            type="button"
            onClick={() => setSubscribeOpen(true)}
            aria-hidden={!isSticky}
            tabIndex={isSticky ? 0 : -1}
            className={`inline-flex h-8 shrink-0 items-center justify-center gap-2 border border-white/40 bg-white px-2 font-mono text-[14px] font-bold uppercase leading-[0.9] tracking-[0.08em] text-black transition-all duration-300 hover:bg-[#e7d2f9] md:px-3 ${
              isSticky
                ? "pointer-events-auto translate-x-0 opacity-100"
                : "pointer-events-none translate-x-3 opacity-0"
            }`}
          >
            <span className="whitespace-nowrap">{t("hero.cta")}</span>
            <span
              aria-hidden="true"
              className="inline-flex size-3 items-center"
            >
              <svg
                width="8"
                height="8"
                viewBox="0 0 8 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.6 6.4L6.4 1.6M6.4 1.6H2.56M6.4 1.6V5.44"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="square"
                />
              </svg>
            </span>
          </button>
        </div>
      </nav>

      <EmailSubscribeDialog
        open={subscribeOpen}
        onClose={() => setSubscribeOpen(false)}
      />
    </>
  );
}
