"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useTranslations } from "@workspace/i18n/client";
import { Link } from "@workspace/i18n/routing";
import EmailSubscribeDialog from "@/components/EmailSubscribeDialog";
import GlitchOverlay from "@/components/GlitchOverlay";
import MenuOverlay from "@/components/MenuOverlay";
import { isRelativeHref } from "@/lib/links";

const STICKY_OFFSET_PX = 12;
const SCROLL_THRESHOLD_PX = 24;
const GLITCH_MS = 520;
// Must stay in sync with --bp-glitch-duration for .bp-glitch-sm in globals.css.
const CTA_SIZE_CLASSES =
  "gap-1 px-1.5 !text-[12px] !font-bold !leading-[0.9] !tracking-normal min-[360px]:gap-2 min-[360px]:px-3 min-[360px]:!text-[14px] min-[360px]:!tracking-[0.08em] md:px-3";

type NavigationProps = {
  ctaAlwaysVisible?: boolean;
  ctaHref?: string;
  ctaLabel?: string;
  showMenuButton?: boolean;
};

function MenuGlyph() {
  return (
    <span aria-hidden="true" className="relative block size-3">
      <span className="absolute left-0 top-[2px] h-[2px] w-3 bg-white" />
      <span className="absolute left-0 top-[8px] h-[2px] w-3 bg-white" />
    </span>
  );
}

export default function Navigation({
  ctaAlwaysVisible = false,
  ctaHref,
  ctaLabel,
  showMenuButton = true,
}: NavigationProps = {}) {
  const t = useTranslations("breakpoint");
  const [isSticky, setIsSticky] = useState(false);
  const [isGlitching, setIsGlitching] = useState(false);
  const [subscribeOpen, setSubscribeOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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

  useEffect(() => {
    if (!isSticky) {
      setIsGlitching(false);
      return;
    }
    setIsGlitching(true);
    const id = window.setTimeout(() => setIsGlitching(false), GLITCH_MS);
    return () => window.clearTimeout(id);
  }, [isSticky]);

  const resolvedCtaLabel = ctaLabel ?? t("hero.cta");
  const showCta = ctaAlwaysVisible || isSticky;

  const ctaInner = (
    <>
      <span className="whitespace-nowrap">{resolvedCtaLabel}</span>
      <span aria-hidden="true" className="inline-flex size-3 items-center">
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
    </>
  );

  const ctaClasses = `relative inline-flex h-8 shrink-0 items-center justify-center border border-white/40 bg-white font-mono font-bold uppercase leading-[0.9] text-black hover:bg-[#e7d2f9] ${CTA_SIZE_CLASSES} ${
    showCta ? "pointer-events-auto" : "pointer-events-none"
  } ${isGlitching ? "bp-glitch-jitter" : ""} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white`;

  const ctaAriaProps = {
    "aria-hidden": !showCta,
    tabIndex: showCta ? 0 : -1,
  };

  const ctaElement = ctaHref ? (
    isRelativeHref(ctaHref) ? (
      <Link href={ctaHref} className={ctaClasses} {...ctaAriaProps}>
        {ctaInner}
      </Link>
    ) : (
      <a href={ctaHref} className={ctaClasses} {...ctaAriaProps}>
        {ctaInner}
      </a>
    )
  ) : (
    <button
      type="button"
      onClick={() => setSubscribeOpen(true)}
      className={ctaClasses}
      {...ctaAriaProps}
    >
      {ctaInner}
    </button>
  );

  return (
    <>
      <nav
        aria-label="Primary"
        className={`left-1/2 z-30 flex h-12 -translate-x-1/2 items-center overflow-hidden bg-black pl-3 pr-2 py-2 transition-[width,transform,background-color,opacity] duration-300 ease-out ${
          isSticky
            ? "fixed w-[calc(100vw-32px)] max-w-[343px] md:w-[426px] md:max-w-none"
            : ctaAlwaysVisible
              ? "absolute w-[calc(100vw-32px)] max-w-[343px] md:w-[426px] md:max-w-none"
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
            width={23}
            height={20}
            className="block h-[15.64px] w-[18.15px] md:h-[19.55px] md:w-[22.68px]"
          />
          <img
            src="/assets/nav-bp26.svg"
            alt=""
            aria-hidden="true"
            width={104}
            height={20}
            className="block h-4 w-[83.56px] md:h-5 md:w-[104.45px]"
          />
        </Link>

        <div
          className={`flex flex-1 items-center justify-end gap-2 pr-1 md:pr-[4px] ${
            showCta ? "" : "ml-2"
          }`}
        >
          <motion.div
            className={`relative ${showCta ? "inline-flex" : "hidden"}`}
            initial={false}
            animate={{
              opacity: showCta ? 1 : 0,
              x: showCta ? 0 : 6,
            }}
            transition={{ duration: 0 }}
          >
            {ctaElement}

            <GlitchOverlay active={isGlitching} size="sm">
              <span
                className={`inline-flex h-8 w-full items-center justify-center border border-white/40 bg-white font-mono font-bold uppercase leading-[0.9] text-black ${CTA_SIZE_CLASSES}`}
              >
                {ctaInner}
              </span>
            </GlitchOverlay>
          </motion.div>

          {showMenuButton && (
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-haspopup="dialog"
              aria-expanded={menuOpen}
              className="flex size-8 shrink-0 items-center justify-center bg-neutral-800 text-white transition-colors hover:bg-purple hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <MenuGlyph />
            </button>
          )}
        </div>
      </nav>

      <EmailSubscribeDialog
        open={subscribeOpen}
        onClose={() => setSubscribeOpen(false)}
      />

      <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
