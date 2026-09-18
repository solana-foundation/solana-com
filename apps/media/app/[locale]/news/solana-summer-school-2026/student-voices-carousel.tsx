"use client";

import { useState } from "react";

const quotes = [
  {
    name: "Jae",
    color: "bg-[#e0ffc4]",
    text: "I started with almost no web3 experience and not much confidence in my English. A few months in, I actually believe I can build something and I've started thinking about a global career for the first time. It was also great to see how genuinely committed Solana is to growing builders.",
  },
  {
    name: "Sulav",
    color: "bg-[#f6e2ff]",
    text: "I applied with just amateur skills and a Learning mindset but the Hands-On exercise throughout the 6 weeks turned me into a guy who is genuinely interested in contributing the ecosystem now-SOLMAXI!",
  },
  {
    name: "Nan",
    color: "bg-[#cceeff]",
    text: "Solana Summer School pushed me from writing my first Anchor program to shipping a full dApp with a live token and AI pipeline, many thanks to Chaerin, Andre and other lecturers.",
  },
  {
    name: "Michal",
    color: "bg-[#fff1a8]",
    text: "I had been holding off on learning blockchain for a long time because I couldn't find anything suitable that could motivate me. Thanks to the Solana Summer School, I finally learned it and built a project!",
  },
] as const;

export function StudentVoicesCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeQuote = quotes[activeIndex] ?? quotes[0];

  const move = (direction: -1 | 1) => {
    setActiveIndex(
      (current) => (current + direction + quotes.length) % quotes.length,
    );
  };

  return (
    <section
      aria-label="Student voices"
      aria-roledescription="carousel"
      className="not-prose mx-auto grid w-full max-w-[1240px] gap-12 overflow-hidden px-6 py-24 md:grid-cols-[0.7fr_1.3fr] md:items-center md:px-10 md:py-32"
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") move(-1);
        if (event.key === "ArrowRight") move(1);
      }}
      tabIndex={0}
    >
      <div>
        <p className="mb-5 text-xs font-bold uppercase tracking-[0.24em] text-[#ffe45e]">
          Notes from the cohort
        </p>
        <h2 className="max-w-sm text-5xl font-light leading-[0.92] tracking-[-0.05em] text-white md:text-7xl">
          Student voices
        </h2>
        <div aria-hidden="true" className="mt-10 text-8xl text-[#ffe500]">
          ☺
        </div>
      </div>

      <div>
        <div className="relative mx-auto max-w-[600px] px-5 py-8 md:px-10 md:py-12">
          <div
            aria-hidden="true"
            className="absolute inset-x-12 inset-y-8 rotate-[5deg] bg-[#cceeff]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-x-9 inset-y-8 -rotate-[4deg] bg-[#f6cbd4]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-x-7 inset-y-7 rotate-[2deg] bg-[#d7ffb6]"
          />

          <blockquote
            aria-live="polite"
            aria-roledescription="slide"
            aria-label={`${activeIndex + 1} of ${quotes.length}`}
            className={`relative m-0 flex min-h-[480px] rotate-[-1deg] flex-col justify-between p-8 text-[#191918] shadow-[0_20px_70px_rgba(0,0,0,0.4)] transition-colors duration-300 motion-reduce:transition-none md:min-h-[540px] md:p-14 ${activeQuote.color}`}
          >
            <p className="m-0 text-xl font-normal leading-8 text-[#191918] md:text-[1.7rem] md:leading-[1.45]">
              “{activeQuote.text}”
            </p>
            <footer className="mt-10 text-base font-medium uppercase tracking-[0.16em]">
              — {activeQuote.name}
            </footer>
          </blockquote>
        </div>

        <div className="mt-2 flex items-center justify-center gap-4">
          <button
            type="button"
            aria-label="Previous student quote"
            onClick={() => move(-1)}
            className="flex size-12 items-center justify-center border border-[#14f195] text-xl text-[#14f195] transition-colors hover:bg-[#14f195] hover:text-[#191918] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14f195] focus-visible:ring-offset-4 focus-visible:ring-offset-[#191918]"
          >
            ←
          </button>
          <div className="flex gap-2" aria-label="Choose a student quote">
            {quotes.map((quote, index) => (
              <button
                key={quote.name}
                type="button"
                aria-label={`Show quote from ${quote.name}`}
                aria-current={index === activeIndex ? "true" : undefined}
                onClick={() => setActiveIndex(index)}
                className={`size-2.5 rounded-full border border-[#14f195] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14f195] focus-visible:ring-offset-4 focus-visible:ring-offset-[#191918] ${
                  index === activeIndex ? "bg-[#14f195]" : "bg-transparent"
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            aria-label="Next student quote"
            onClick={() => move(1)}
            className="flex size-12 items-center justify-center border border-[#14f195] text-xl text-[#14f195] transition-colors hover:bg-[#14f195] hover:text-[#191918] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14f195] focus-visible:ring-offset-4 focus-visible:ring-offset-[#191918]"
          >
            →
          </button>
        </div>
      </div>
    </section>
  );
}
