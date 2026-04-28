"use client";

import React, {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useTranslations } from "@workspace/i18n/client";
import CarouselControls from "@/components/CarouselControls";
import GlitchOverlay from "@/components/GlitchOverlay";
import ImageTreatment from "@/components/ImageTreatment";

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
  const headingId = useId();

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
    <section className="pt-20 md:pt-[120px]">
      <div
        aria-labelledby={headingId}
        aria-roledescription="carousel"
        className="container flex flex-col items-start justify-between gap-10 lg:flex-row lg:gap-6"
        role="region"
      >
        <div className="flex flex-col gap-6 lg:h-[227px] lg:w-[501px] lg:justify-center">
          <p className="type-eyebrow text-white">{t("highlights.eyebrow")}</p>
          <h2 id={headingId} className="type-h3 text-white">
            {t("highlights.headline")}
          </h2>
          <CarouselControls
            labelPrefix={t("highlights.headline")}
            onPrev={handlePrev}
            onNext={handleNext}
          />
        </div>

        <div
          aria-live="off"
          className="relative min-h-[370px] w-full overflow-hidden bg-neutral-800 lg:h-[600px] lg:min-h-0 lg:w-[772px] lg:[aspect-ratio:772/600] lg:flex-shrink-0"
          onBlur={(event) => {
            if (
              !event.currentTarget.contains(event.relatedTarget as Node | null)
            ) {
              setIsPaused(false);
            }
          }}
          onFocus={() => setIsPaused(true)}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
        >
          <ImageTreatment
            src="/img/gallery/photo-6.jpg"
            alt=""
            aria-hidden="true"
            glitchPattern="p1"
            intensity={20}
            color="purple"
            lighting="even"
            motion
            className="absolute inset-0 h-full w-full"
          />

          <div className="absolute inset-4 md:inset-[14%_8%_14%_14%]">
            <div className="relative h-full w-full">
              <QuoteCard
                quote={activeQuote}
                jittering={isGlitching && !prefersReducedMotion}
              />

              <GlitchOverlay
                active={isGlitching && !prefersReducedMotion}
                size="lg"
              >
                <QuoteCard quote={activeQuote} decorative jittering />
              </GlitchOverlay>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function QuoteCard({
  quote,
  decorative = false,
  jittering = false,
}: {
  quote: (typeof HIGHLIGHT_QUOTES)[number];
  decorative?: boolean;
  jittering?: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLQuoteElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const card = cardRef.current;
    const quoteEl = quoteRef.current;
    const metaEl = metaRef.current;

    if (!card || !quoteEl || !metaEl) return;

    let frame = 0;

    const parseCssLength = (value: string) => {
      const trimmed = value.trim();
      if (trimmed.endsWith("rem")) {
        return (
          Number.parseFloat(trimmed) *
          Number.parseFloat(getComputedStyle(document.documentElement).fontSize)
        );
      }

      return Number.parseFloat(trimmed);
    };

    const applyFontSize = (size: number) => {
      quoteEl.style.fontSize = `${size}px`;
    };

    const fits = () => {
      const quoteRect = quoteEl.getBoundingClientRect();
      const metaRect = metaEl.getBoundingClientRect();

      return (
        quoteRect.bottom <= metaRect.top - 8 &&
        quoteEl.scrollHeight <= quoteEl.clientHeight + 0.5 &&
        quoteEl.scrollWidth <= quoteEl.clientWidth + 1 &&
        metaEl.scrollWidth <= metaEl.clientWidth + 1
      );
    };

    const fitQuote = () => {
      const quoteStyle = getComputedStyle(quoteEl);
      const maxSize = parseCssLength(
        quoteStyle.getPropertyValue("--bp-quote-fit-max"),
      );
      const minSize = parseCssLength(
        quoteStyle.getPropertyValue("--bp-quote-fit-min"),
      );
      const step = parseCssLength(
        quoteStyle.getPropertyValue("--bp-quote-fit-step"),
      );

      applyFontSize(maxSize);

      let nextSize = maxSize;
      while (nextSize > minSize && !fits()) {
        nextSize -= step;
        applyFontSize(nextSize);
      }
    };

    const scheduleFit = () => {
      cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(fitQuote);
    };

    const resizeObserver = new ResizeObserver(scheduleFit);
    resizeObserver.observe(card);
    resizeObserver.observe(metaEl);

    void document.fonts.ready.then(scheduleFit);
    scheduleFit();

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
    };
  }, [quote.author, quote.handle, quote.role, quote.text]);

  return (
    <figure
      ref={cardRef}
      className={`flex h-full w-full flex-col overflow-hidden bg-white p-5 md:p-8 ${jittering ? "bp-glitch-jitter" : ""}`}
    >
      <div className="flex min-h-0 flex-1 items-start">
        <blockquote ref={quoteRef} className="type-quote max-h-full text-black">
          &ldquo;{quote.text}&rdquo;
        </blockquote>
      </div>
      <figcaption
        ref={metaRef}
        className="flex items-center gap-2.5 pt-4 md:gap-3 md:pt-6"
      >
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
            className="type-p-large-bold text-black underline decoration-solid underline-offset-[3px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
          >
            {quote.handle}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
          <p className="type-caption text-black/70">
            {quote.author}
            {" · "}
            {quote.role}
          </p>
        </div>
      </figcaption>
    </figure>
  );
}
