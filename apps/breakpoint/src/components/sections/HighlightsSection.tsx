"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import CarouselControls from "@/components/CarouselControls";

const HIGHLIGHT_QUOTES = [
  {
    text: "breakpoint is at its best when market vibes suck. this year has been the best ever. onward!",
    author: "Raj Gokal",
    handle: "@rajgokal",
    role: "Solana Co-Founder",
    href: "https://x.com/rajgokal/status/1999827993431007344",
  },
  {
    text: 'I don\'t know what "it" is but breakpoint is always a reminder that Solana has "it". EVERYBODY who comes can see it. those who haven\'t experienced it, there\'s always next year.',
    author: "Raj Gokal",
    handle: "@rajgokal",
    role: "Solana Co-Founder",
    href: "https://x.com/rajgokal/status/1999181588962431098",
  },
  {
    text: "This year's Breakpoint felt different. More people, more products, deeper technical conversations, and a visible increase in institutional participation. I leave Breakpoint 2025 with the realization that the Solana ecosystem has crossed an inflection point and fully come of age. We are the standard, no longer the underdogs.",
    author: "Harri Obi",
    handle: "@Harri_obi",
    role: "SuperteamNG",
    href: "https://x.com/Harri_obi/status/2000856544372514915",
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
] as const;

export default function HighlightsSection() {
  const t = useTranslations("breakpoint");
  const [index, setIndex] = useState(0);

  const activeQuote = HIGHLIGHT_QUOTES[index]!;

  const handlePrev = () => {
    setIndex((prev) => (prev === 0 ? HIGHLIGHT_QUOTES.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % HIGHLIGHT_QUOTES.length);
  };

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

        <div className="relative aspect-[772/600] w-full overflow-hidden bg-[#1e1e1e] md:h-[600px] md:w-[772px] md:flex-shrink-0">
          <img
            src="/img/gallery/photo-6.jpg"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover grayscale"
          />
          <div className="absolute inset-0 bg-[#aa67fb] mix-blend-multiply" />
          <div className="absolute inset-[17.67%_12.25%_17.57%_20.6%] flex flex-col items-start justify-between bg-white p-8">
            <p className="font-sans text-[24px] font-normal leading-[1.25] tracking-[-0.04em] text-black [text-indent:-0.45em] md:text-[32px]">
              &ldquo;{activeQuote.text}&rdquo;
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
                  href={activeQuote.href}
                  target="_blank"
                  rel="noreferrer"
                  className="font-sans text-[20px] font-bold leading-[1.18] tracking-[-0.01em] text-black underline decoration-solid underline-offset-[3px] md:text-[24px]"
                >
                  {activeQuote.handle}
                </a>
                <p className="font-sans text-sm leading-[1.3] text-black/70 md:text-base">
                  {activeQuote.author}
                  {" · "}
                  {activeQuote.role}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
