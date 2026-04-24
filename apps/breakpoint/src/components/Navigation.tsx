"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "@workspace/i18n/client";
import { Link } from "@workspace/i18n/routing";
import EmailSubscribeDialog from "@/components/EmailSubscribeDialog";

const STICKY_OFFSET_PX = 12;
const SCROLL_THRESHOLD_PX = 24;
const GLITCH_MS = 520;

export default function Navigation() {
  const t = useTranslations("breakpoint");
  const [isSticky, setIsSticky] = useState(false);
  const [isGlitching, setIsGlitching] = useState(false);
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

  useEffect(() => {
    if (!isSticky) {
      setIsGlitching(false);
      return;
    }
    setIsGlitching(true);
    const id = window.setTimeout(() => setIsGlitching(false), GLITCH_MS);
    return () => window.clearTimeout(id);
  }, [isSticky]);

  const ctaLabel = t("hero.cta");

  const ctaInner = (
    <>
      <span className="whitespace-nowrap">{ctaLabel}</span>
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
          <div
            className={`cta-wrap relative inline-flex ${isSticky ? "is-revealed" : ""} ${isGlitching ? "is-glitching" : ""}`}
          >
            <button
              type="button"
              onClick={() => setSubscribeOpen(true)}
              aria-hidden={!isSticky}
              tabIndex={isSticky ? 0 : -1}
              className={`cta-button relative inline-flex h-8 shrink-0 items-center justify-center gap-2 border border-white/40 bg-white px-2 font-mono text-[14px] font-bold uppercase leading-[0.9] tracking-[0.08em] text-black hover:bg-[#e7d2f9] md:px-3 ${
                isSticky ? "pointer-events-auto" : "pointer-events-none"
              }`}
            >
              {ctaInner}
            </button>

            {isGlitching && (
              <>
                <span
                  aria-hidden="true"
                  className="cta-slice cta-slice-1 pointer-events-none absolute inset-0 inline-flex h-8 items-center justify-center gap-2 border border-white/40 bg-white px-2 font-mono text-[14px] font-bold uppercase leading-[0.9] tracking-[0.08em] text-black md:px-3"
                >
                  {ctaInner}
                </span>
                <span
                  aria-hidden="true"
                  className="cta-slice cta-slice-2 pointer-events-none absolute inset-0 inline-flex h-8 items-center justify-center gap-2 border border-white/40 bg-white px-2 font-mono text-[14px] font-bold uppercase leading-[0.9] tracking-[0.08em] text-black md:px-3"
                >
                  {ctaInner}
                </span>
                <span
                  aria-hidden="true"
                  className="cta-static pointer-events-none absolute inset-0"
                />
              </>
            )}
          </div>
        </div>
      </nav>

      <EmailSubscribeDialog
        open={subscribeOpen}
        onClose={() => setSubscribeOpen(false)}
      />

      <style jsx>{`
        .cta-wrap {
          opacity: 0;
          transform: translateX(6px);
          transition:
            opacity 0s,
            transform 0s;
        }
        .cta-wrap.is-revealed {
          opacity: 1;
          transform: translateX(0);
        }
        .cta-wrap.is-glitching .cta-button {
          animation: cta-glitch-in ${GLITCH_MS}ms steps(8, end) 1;
        }

        .cta-slice {
          mix-blend-mode: screen;
        }
        .cta-slice-1 {
          color: #a665f6;
          animation: cta-slice-a ${GLITCH_MS}ms steps(10, end) 1;
        }
        .cta-slice-2 {
          color: #3cffa1;
          animation: cta-slice-b ${GLITCH_MS}ms steps(10, end) 1;
        }

        .cta-static {
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='2.4' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.667  0 0 0 0 0.404  0 0 0 0 0.984  0 0 0 1 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
          background-size: 80px 80px;
          mix-blend-mode: multiply;
          opacity: 0;
          animation: cta-static-burst ${GLITCH_MS}ms steps(12, end) 1;
        }

        @keyframes cta-glitch-in {
          0% {
            clip-path: inset(0 100% 0 0);
            transform: translate(6px, 0);
            opacity: 0;
          }
          12% {
            clip-path: inset(40% 0 38% 0);
            transform: translate(-3px, 1px);
            opacity: 1;
          }
          25% {
            clip-path: inset(0 28% 0 0);
            transform: translate(2px, -1px);
            opacity: 1;
          }
          40% {
            clip-path: inset(62% 0 12% 0);
            transform: translate(-2px, 1px);
            opacity: 1;
          }
          55% {
            clip-path: inset(0 8% 0 0);
            transform: translate(1px, 0);
            opacity: 1;
          }
          70% {
            clip-path: inset(18% 0 68% 0);
            transform: translate(-1px, 0);
            opacity: 1;
          }
          85% {
            clip-path: inset(0);
            transform: translate(1px, 0);
            opacity: 1;
          }
          100% {
            clip-path: inset(0);
            transform: translate(0, 0);
            opacity: 1;
          }
        }

        @keyframes cta-slice-a {
          0%,
          100% {
            clip-path: inset(0 0 100% 0);
            transform: translateX(0);
            opacity: 0;
          }
          10% {
            clip-path: inset(12% 0 72% 0);
            transform: translateX(-8px);
            opacity: 0.9;
          }
          30% {
            clip-path: inset(48% 0 32% 0);
            transform: translateX(7px);
            opacity: 0.7;
          }
          55% {
            clip-path: inset(22% 0 60% 0);
            transform: translateX(-5px);
            opacity: 0.8;
          }
          80% {
            clip-path: inset(68% 0 14% 0);
            transform: translateX(3px);
            opacity: 0.4;
          }
        }

        @keyframes cta-slice-b {
          0%,
          100% {
            clip-path: inset(0 0 100% 0);
            transform: translateX(0);
            opacity: 0;
          }
          15% {
            clip-path: inset(55% 0 28% 0);
            transform: translateX(6px);
            opacity: 0.8;
          }
          35% {
            clip-path: inset(8% 0 76% 0);
            transform: translateX(-7px);
            opacity: 0.6;
          }
          60% {
            clip-path: inset(36% 0 48% 0);
            transform: translateX(5px);
            opacity: 0.7;
          }
          82% {
            clip-path: inset(20% 0 62% 0);
            transform: translateX(-2px);
            opacity: 0.3;
          }
        }

        @keyframes cta-static-burst {
          0%,
          100% {
            opacity: 0;
          }
          15% {
            opacity: 0.45;
          }
          35% {
            opacity: 0.15;
          }
          55% {
            opacity: 0.55;
          }
          80% {
            opacity: 0.2;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .cta-wrap {
            transition:
              opacity 300ms ease-out,
              transform 300ms ease-out;
          }
          .cta-wrap.is-glitching .cta-button,
          .cta-slice,
          .cta-static {
            animation: none !important;
          }
          .cta-slice,
          .cta-static {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
