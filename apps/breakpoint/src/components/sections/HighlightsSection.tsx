"use client";

import React, { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import CarouselControls from "@/components/CarouselControls";

const AUTO_ADVANCE_MS = 7000;
const GLITCH_MS = 600;

const HIGHLIGHT_QUOTES = [
  {
    text: 'I don\'t know what "it" is but breakpoint is always a reminder that Solana has "it". EVERYBODY who comes can see it. those who haven\'t experienced it, there\'s always next year.',
    author: "Raj Gokal",
    handle: "@rajgokal",
    role: "Solana Co-Founder",
    href: "https://x.com/rajgokal/status/1999181588962431098",
  },
  {
    text: "Breakpoint AD25 @SolanaConf was the best event. People, energy, talks... everything shows you that this ecosystem is NOT slowing down. Very impressed by how @solana shifted from their meme culture to big boy plays with JPM and UAE gov't, meanwhile still retaining that fun culture.",
    author: "Alsie",
    handle: "@AlsieLC",
    role: "Dune / now Solana",
    href: "https://x.com/AlsieLC/status/2000283087876583550",
  },
  {
    text: "My thoughts on Breakpoint 2025: The most utility based conference so far. Everything people were dreaming about 5 years ago, everything that was a wild dream is now reality. Whoever organises Breakpoint just gets better and better every year. What a masterclass. It will just keep getting better and better.",
    author: "Marius",
    handle: "@y2kappa",
    role: "Co-founder, Kamino",
    href: "https://x.com/y2kappa/status/2000142768807559256",
  },
  {
    text: "Breakpoint in Abu Dhabi wasn't just a conference, it was a vibrant digital economy moving to a location for a week. It feels like progress, it feels like growth, it felt like moving forward towards shared value creation.",
    author: "Dr. Nick Almond",
    handle: "@DrNickA",
    role: "Head of Governance, Jito",
    href: "https://x.com/DrNickA/status/2000878240609493256",
  },
  {
    text: "Every Breakpoint we go big for a reason. @altitude TVS is up 10x since Abu Dhabi. Best conference ROI out there.",
    author: "Stepan",
    handle: "@SimkinStepan",
    role: "CEO, squads.xyz",
    href: "https://x.com/SimkinStepan/status/2003421960576074132",
  },
  {
    text: "This year's Breakpoint felt different. More people, more products, deeper technical conversations, and a visible increase in institutional participation. I leave Breakpoint 2025 with the realization that the Solana ecosystem has crossed an inflection point and fully come of age. We are the standard, no longer the underdogs.",
    author: "Harri Obi",
    handle: "@Harri_obi",
    role: "SuperteamNG",
    href: "https://x.com/Harri_obi/status/2000856544372514915",
  },
] as const;

export default function HighlightsSection() {
  const t = useTranslations("breakpoint");
  const [index, setIndex] = useState(0);
  const [isGlitching, setIsGlitching] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const timeoutsRef = useRef<Array<ReturnType<typeof setTimeout>>>([]);

  const activeQuote = HIGHLIGHT_QUOTES[index]!;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) =>
      setPrefersReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const clearPendingTimeouts = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  };

  const triggerGlitchTo = (next: number) => {
    clearPendingTimeouts();
    if (prefersReducedMotion) {
      setIndex(next);
      return;
    }
    setIsGlitching(true);
    timeoutsRef.current.push(
      setTimeout(() => setIndex(next), GLITCH_MS / 2),
      setTimeout(() => setIsGlitching(false), GLITCH_MS),
    );
  };

  const handlePrev = () => {
    const next = index === 0 ? HIGHLIGHT_QUOTES.length - 1 : index - 1;
    triggerGlitchTo(next);
  };

  const handleNext = () => {
    const next = (index + 1) % HIGHLIGHT_QUOTES.length;
    triggerGlitchTo(next);
  };

  useEffect(() => {
    if (isPaused || prefersReducedMotion) return;
    const id = setInterval(() => {
      const next = (index + 1) % HIGHLIGHT_QUOTES.length;
      triggerGlitchTo(next);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, isPaused, prefersReducedMotion]);

  useEffect(() => {
    return () => clearPendingTimeouts();
  }, []);

  return (
    <section className="pl-5 pt-[80px] md:pl-8 md:pt-[120px]">
      <div className="flex flex-col items-start justify-between gap-10 pr-5 md:flex-row md:gap-6 md:pr-0">
        <div className="flex flex-col gap-6 md:h-[227px] md:w-[501px] md:justify-center">
          <p className="font-mono text-base uppercase leading-[1.3] tracking-[1.28px] text-white">
            {t("highlights.eyebrow")}
          </p>
          <h2 className="font-sans text-[32px] font-normal leading-[1.15] tracking-[-0.96px] text-white md:text-[48px]">
            {t("highlights.headline")}
          </h2>
          <CarouselControls onPrev={handlePrev} onNext={handleNext} />
        </div>

        <div
          className="relative aspect-[772/600] w-full overflow-hidden bg-[#1e1e1e] md:h-[600px] md:w-[772px] md:flex-shrink-0"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <img
            src="/img/gallery/photo-6.jpg"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover grayscale"
          />
          <div className="absolute inset-0 bg-[#aa67fb] mix-blend-multiply" />

          <div className="absolute inset-[17.67%_12.25%_17.57%_20.6%]">
            <div
              className={`relative h-full w-full ${isGlitching ? "is-glitching" : ""}`}
            >
              <QuoteCard quote={activeQuote} />

              {isGlitching && !prefersReducedMotion && (
                <>
                  <div
                    aria-hidden="true"
                    className="glitch-slice glitch-slice-1 pointer-events-none absolute inset-0"
                  >
                    <QuoteCard quote={activeQuote} decorative />
                  </div>
                  <div
                    aria-hidden="true"
                    className="glitch-slice glitch-slice-2 pointer-events-none absolute inset-0"
                  >
                    <QuoteCard quote={activeQuote} decorative />
                  </div>
                  <div
                    aria-hidden="true"
                    className="glitch-slice glitch-slice-3 pointer-events-none absolute inset-0"
                  >
                    <QuoteCard quote={activeQuote} decorative />
                  </div>
                  <div
                    aria-hidden="true"
                    className="glitch-scanlines pointer-events-none absolute inset-0"
                  />
                  <div
                    aria-hidden="true"
                    className="glitch-static pointer-events-none absolute inset-0"
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .is-glitching :global(.quote-card-base) {
          animation: glitch-jitter ${GLITCH_MS}ms steps(8, end) 1;
        }

        .glitch-slice::after {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          mix-blend-mode: multiply;
        }

        .glitch-slice-1 {
          animation: glitch-slice-a ${GLITCH_MS}ms steps(10, end) 1;
        }
        .glitch-slice-1::after {
          background: #a665f6;
        }

        .glitch-slice-2 {
          animation: glitch-slice-b ${GLITCH_MS}ms steps(10, end) 1;
        }
        .glitch-slice-2::after {
          background: rgb(105, 52, 171);
        }

        .glitch-slice-3 {
          animation: glitch-slice-c ${GLITCH_MS}ms steps(10, end) 1;
        }
        .glitch-slice-3::after {
          background: #c695ff;
        }

        .glitch-scanlines {
          background-image: repeating-linear-gradient(
            to bottom,
            rgba(40, 8, 80, 0) 0px,
            rgba(40, 8, 80, 0) 2px,
            rgba(40, 8, 80, 0.45) 2px,
            rgba(40, 8, 80, 0.45) 3px
          );
          mix-blend-mode: multiply;
          animation: glitch-flicker ${GLITCH_MS}ms steps(12, end) 1;
        }

        .glitch-static {
          background-image:
            url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='1.6' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.667  0 0 0 0 0.404  0 0 0 0 0.984  0 0 0 1 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>"),
            url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'><filter id='g'><feTurbulence type='fractalNoise' baseFrequency='2.2' numOctaves='2' stitchTiles='stitch' seed='3'/><feColorMatrix values='0 0 0 0 0.306  0 0 0 0 1  0 0 0 0 0.631  0 0 0 1 0'/></filter><rect width='100%25' height='100%25' filter='url(%23g)'/></svg>");
          background-size:
            160px 160px,
            140px 140px;
          mix-blend-mode: multiply;
          opacity: 0;
          animation: glitch-static-burst ${GLITCH_MS}ms steps(14, end) 1;
        }

        @keyframes glitch-jitter {
          0%,
          100% {
            transform: translate(0, 0);
          }
          10% {
            transform: translate(-2px, 1px);
          }
          25% {
            transform: translate(3px, -1px);
          }
          40% {
            transform: translate(-1px, 2px);
          }
          55% {
            transform: translate(2px, -2px);
          }
          70% {
            transform: translate(-3px, 1px);
          }
          85% {
            transform: translate(1px, 0);
          }
        }

        @keyframes glitch-slice-a {
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

        @keyframes glitch-slice-b {
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

        @keyframes glitch-slice-c {
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

        @keyframes glitch-flicker {
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

        @keyframes glitch-static-burst {
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
            transform: translate(-14px, 8px);
          }
          50% {
            opacity: 0.7;
            transform: translate(10px, -6px);
          }
          75% {
            opacity: 0.3;
            transform: translate(-8px, 10px);
          }
          90% {
            opacity: 0.45;
            transform: translate(6px, -4px);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .glitch-slice,
          .glitch-scanlines,
          .glitch-static,
          .is-glitching :global(.quote-card-base) {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
}

function QuoteCard({
  quote,
  decorative = false,
}: {
  quote: (typeof HIGHLIGHT_QUOTES)[number];
  decorative?: boolean;
}) {
  return (
    <div className="quote-card-base flex h-full w-full flex-col items-start justify-between bg-white p-8">
      <p className="font-sans text-[24px] font-normal leading-[1.25] tracking-[-0.04em] text-black [text-indent:-0.45em] md:text-[32px]">
        &ldquo;{quote.text}&rdquo;
      </p>
      <div className="flex items-center gap-3">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
            fill="black"
          />
        </svg>
        <div className="flex flex-col">
          <a
            href={quote.href}
            target="_blank"
            rel="noreferrer"
            tabIndex={decorative ? -1 : 0}
            aria-hidden={decorative || undefined}
            className="font-sans text-[20px] font-bold leading-[1.18] tracking-[-0.01em] text-black underline decoration-solid underline-offset-[3px] md:text-[24px]"
          >
            {quote.handle}
          </a>
          <p className="font-sans text-sm leading-[1.3] text-black/70 md:text-base">
            {quote.author}
            {" · "}
            {quote.role}
          </p>
        </div>
      </div>
    </div>
  );
}
