"use client";

import { useRef } from "react";
import { motion } from "framer-motion";

interface Testimonial {
  name: string;
  role: string;
  handle: string;
  quote: string;
}

const testimonials: Testimonial[] = [
  {
    name: "Dan Albert",
    role: "Solana Foundation",
    handle: "@danalberteth",
    quote:
      "This has been Solana's largest ever event in the U.S. And I think it's been one of our most productive to date.",
  },
  {
    name: "Lily Liu",
    role: "Solana Foundation, President",
    handle: "@LilyLiu_",
    quote:
      "Solana's ambition is to become an emerging financial infrastructure for the world.",
  },
  {
    name: "Raj Gokal",
    role: "Solana, Co-Founder",
    handle: "@rajgokal",
    quote:
      "Most of the builders in the Solana ecosystem are grittier than I am. They keep me going.",
  },
  {
    name: "Dan Albert",
    role: "Solana Foundation",
    handle: "@danalberteth",
    quote:
      "We have leaders from business, from policy, from technology, all over coming here to collaborate and build the next chapter of blockchain in America.",
  },
  {
    name: "Lily Liu",
    role: "Solana Foundation, President",
    handle: "@LilyLiu_",
    quote:
      "We welcome competition because competition drives us to innovate faster and better.",
  },
  {
    name: "Jon Wong",
    role: "Solana Foundation",
    handle: "@jonwu_",
    quote:
      "We made a really concerted effort to make sure that there's interactive product demos at every single one of these kiosks.",
  },
  {
    name: "Lily Liu",
    role: "Solana Foundation, President",
    handle: "@LilyLiu_",
    quote:
      "Building a successful ecosystem is hundreds of times more difficult than just creating a project. The core asset of our ecosystem is talent.",
  },
];

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="flex h-[320px] w-[300px] flex-shrink-0 flex-col rounded-[30px] bg-[#1b1a1a] px-8 pb-8 pt-10 md:h-[361px] md:w-[379px]">
      <div className="flex flex-col gap-8 md:gap-10">
        {/* Author info */}
        <div className="flex items-center gap-5">
          {/* Avatar placeholder with initials */}
          <div className="flex h-[52px] w-[52px] flex-shrink-0 items-center justify-center rounded-full bg-accelerate-gray-300 md:h-16 md:w-16">
            <span className="text-[18px] font-semibold text-white md:text-[22px]">
              {testimonial.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </span>
          </div>
          <div className="flex flex-col gap-1 md:gap-2">
            <p className="text-[18px] font-normal leading-[1.4] text-accelerate-gray-100 md:text-[22px]">
              {testimonial.name}
            </p>
            <p className="font-diatype text-[13px] font-light leading-none tracking-[0.8px] text-accelerate-gray-200 md:text-[16px]">
              {testimonial.role}
            </p>
          </div>
        </div>

        {/* Quote */}
        <p className="font-diatype text-[16px] font-light leading-[1.4] text-accelerate-gray-100 md:text-[20px]">
          &ldquo;{testimonial.quote}&rdquo;
        </p>
      </div>
    </div>
  );
}

function ArrowButton({
  direction,
  onClick,
}: {
  direction: "left" | "right";
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-accelerate-gray-200 transition-colors hover:border-white/60"
      aria-label={`Scroll ${direction}`}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        className={direction === "left" ? "rotate-180" : ""}
      >
        <path
          d="M6 3l5 5-5 5"
          stroke="#8d8d8d"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

export function Testimonials() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = direction === "left" ? -420 : 420;
    el.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <section className="relative bg-black py-16 lg:py-24">
      <div className="mx-auto max-w-[1480px] px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col gap-8"
        >
          {/* Header row */}
          <div className="flex items-end justify-between">
            <h3 className="text-[24px] font-normal leading-[1.1] text-accelerate-gray-100 md:text-[30px]">
              What People Are Saying
            </h3>
            <div className="flex items-center gap-6">
              <ArrowButton direction="left" onClick={() => scroll("left")} />
              <ArrowButton direction="right" onClick={() => scroll("right")} />
            </div>
          </div>

          {/* Scrollable cards */}
          <div
            ref={scrollRef}
            className="scrollbar-hide flex snap-x gap-6 overflow-x-auto pb-4 md:gap-8"
          >
            {testimonials.map((t, i) => (
              <TestimonialCard key={i} testimonial={t} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
