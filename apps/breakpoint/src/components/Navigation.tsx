"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
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

        <div className="flex flex-1 justify-end pr-1 md:pr-[4px]">
          <motion.div
            className={`cta-wrap relative inline-flex ${isGlitching ? "is-glitching" : ""}`}
            initial={false}
            animate={{
              opacity: isSticky ? 1 : 0,
              x: isSticky ? 0 : 6,
            }}
            transition={{ duration: 0 }}
          >
            <button
              type="button"
              onClick={() => setSubscribeOpen(true)}
              aria-hidden={!isSticky}
              tabIndex={isSticky ? 0 : -1}
              className={`cta-button relative inline-flex h-8 shrink-0 items-center justify-center gap-2 border border-white/40 bg-white px-2 font-mono text-[14px] font-bold uppercase leading-[0.9] tracking-[0.08em] text-black hover:bg-[#e7d2f9] md:px-3 ${
                isSticky ? "pointer-events-auto" : "pointer-events-none"
              } focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white`}
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
                  className="cta-slice cta-slice-3 pointer-events-none absolute inset-0 inline-flex h-8 items-center justify-center gap-2 border border-white/40 bg-white px-2 font-mono text-[14px] font-bold uppercase leading-[0.9] tracking-[0.08em] text-black md:px-3"
                >
                  {ctaInner}
                </span>
                <span
                  aria-hidden="true"
                  className="cta-scanlines pointer-events-none absolute inset-0"
                />
                <span
                  aria-hidden="true"
                  className="cta-static pointer-events-none absolute inset-0"
                />
              </>
            )}
          </motion.div>
        </div>
      </nav>

      <EmailSubscribeDialog
        open={subscribeOpen}
        onClose={() => setSubscribeOpen(false)}
      />

      {/* eslint-disable-next-line react/no-unknown-property */}
      <style jsx>{`
        .cta-wrap.is-glitching .cta-button {
          animation: cta-glitch-in ${GLITCH_MS}ms steps(8, end) 1;
        }

        .cta-slice::after {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          mix-blend-mode: multiply;
        }

        .cta-slice-1 {
          animation: cta-slice-a ${GLITCH_MS}ms steps(10, end) 1;
        }
        .cta-slice-1::after {
          background: #a665f6;
        }

        .cta-slice-2 {
          animation: cta-slice-b ${GLITCH_MS}ms steps(10, end) 1;
        }
        .cta-slice-2::after {
          background: rgb(105, 52, 171);
        }

        .cta-slice-3 {
          animation: cta-slice-c ${GLITCH_MS}ms steps(10, end) 1;
        }
        .cta-slice-3::after {
          background: #c695ff;
        }

        .cta-scanlines {
          background-image: repeating-linear-gradient(
            to bottom,
            rgba(40, 8, 80, 0) 0px,
            rgba(40, 8, 80, 0) 1px,
            rgba(40, 8, 80, 0.45) 1px,
            rgba(40, 8, 80, 0.45) 2px
          );
          mix-blend-mode: multiply;
          animation: cta-flicker ${GLITCH_MS}ms steps(12, end) 1;
        }

        .cta-static {
          background-image:
            url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='60' height='60'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='1.6' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.667  0 0 0 0 0.404  0 0 0 0 0.984  0 0 0 1 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>"),
            url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='50' height='50'><filter id='g'><feTurbulence type='fractalNoise' baseFrequency='2.2' numOctaves='2' stitchTiles='stitch' seed='3'/><feColorMatrix values='0 0 0 0 0.306  0 0 0 0 1  0 0 0 0 0.631  0 0 0 1 0'/></filter><rect width='100%25' height='100%25' filter='url(%23g)'/></svg>");
          background-size:
            60px 60px,
            50px 50px;
          mix-blend-mode: multiply;
          opacity: 0;
          animation: cta-static-burst ${GLITCH_MS}ms steps(14, end) 1;
        }

        @keyframes cta-glitch-in {
          0% {
            clip-path: inset(0 100% 0 0);
            transform: translate(6px, 0);
            opacity: 0;
          }
          10% {
            clip-path: inset(40% 0 38% 0);
            transform: translate(-2px, 1px);
            opacity: 1;
          }
          22% {
            clip-path: inset(0 28% 0 0);
            transform: translate(3px, -1px);
            opacity: 1;
          }
          35% {
            clip-path: inset(62% 0 12% 0);
            transform: translate(-1px, 2px);
            opacity: 1;
          }
          50% {
            clip-path: inset(0);
            transform: translate(2px, -2px);
            opacity: 1;
          }
          65% {
            clip-path: inset(0);
            transform: translate(-3px, 1px);
            opacity: 1;
          }
          80% {
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
          }
          10% {
            clip-path: inset(8% 0 78% 0);
            transform: translateX(-14px);
          }
          25% {
            clip-path: inset(32% 0 52% 0);
            transform: translateX(16px);
          }
          40% {
            clip-path: inset(4% 0 82% 0);
            transform: translateX(-8px);
          }
          55% {
            clip-path: inset(55% 0 28% 0);
            transform: translateX(18px);
          }
          70% {
            clip-path: inset(18% 0 65% 0);
            transform: translateX(-20px);
          }
          85% {
            clip-path: inset(70% 0 12% 0);
            transform: translateX(6px);
          }
        }

        @keyframes cta-slice-b {
          0%,
          100% {
            clip-path: inset(0 0 100% 0);
            transform: translateX(0);
          }
          15% {
            clip-path: inset(45% 0 38% 0);
            transform: translateX(12px);
          }
          30% {
            clip-path: inset(12% 0 72% 0);
            transform: translateX(-16px);
          }
          50% {
            clip-path: inset(62% 0 22% 0);
            transform: translateX(24px);
          }
          65% {
            clip-path: inset(28% 0 58% 0);
            transform: translateX(-12px);
          }
          80% {
            clip-path: inset(8% 0 80% 0);
            transform: translateX(4px);
          }
        }

        @keyframes cta-slice-c {
          0%,
          100% {
            clip-path: inset(0 0 100% 0);
            transform: translateX(0);
          }
          20% {
            clip-path: inset(78% 0 8% 0);
            transform: translateX(-6px);
          }
          40% {
            clip-path: inset(40% 0 44% 0);
            transform: translateX(20px);
          }
          60% {
            clip-path: inset(14% 0 72% 0);
            transform: translateX(-24px);
          }
          80% {
            clip-path: inset(58% 0 28% 0);
            transform: translateX(10px);
          }
        }

        @keyframes cta-flicker {
          0%,
          100% {
            opacity: 0;
          }
          10% {
            opacity: 0.7;
          }
          30% {
            opacity: 0.15;
          }
          50% {
            opacity: 0.85;
          }
          70% {
            opacity: 0.25;
          }
          90% {
            opacity: 0.6;
          }
        }

        @keyframes cta-static-burst {
          0%,
          100% {
            opacity: 0;
            transform: translate(0, 0);
          }
          15% {
            opacity: 0.55;
            transform: translate(0, 0);
          }
          30% {
            opacity: 0.2;
            transform: translate(-10px, 4px);
          }
          50% {
            opacity: 0.7;
            transform: translate(8px, -3px);
          }
          75% {
            opacity: 0.3;
            transform: translate(-6px, 5px);
          }
          90% {
            opacity: 0.45;
            transform: translate(4px, -2px);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .cta-wrap.is-glitching .cta-button,
          .cta-slice,
          .cta-scanlines,
          .cta-static {
            animation: none !important;
          }
          .cta-slice,
          .cta-scanlines,
          .cta-static {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
