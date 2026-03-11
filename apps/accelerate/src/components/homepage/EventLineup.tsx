"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { EventCard } from "./EventCard";
import { getImagePath } from "@/config";

const events = [
  {
    image: getImagePath("/images/homepage/miami-card-photo.jpg"),
    city: "Miami",
    subtitle: "Solana Accelerate USA",
    dateLocation: "May 5 / Miami",
    href: "/accelerate/miami",
    external: false,
    active: true,
  },
  {
    image: getImagePath("/images/homepage/hk-card-photo.jpg"),
    city: "Hong Kong",
    subtitle: "Solana Accelerate APAC",
    dateLocation: "Feb 11 / Hong Kong @ Consensus",
    href: "/accelerate/hong-kong",
    external: false,
    active: false,
  },
];

export function EventLineup() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = direction === "left" ? -560 : 560;
    el.scrollBy({ left: amount, behavior: "smooth" });
    setTimeout(checkScroll, 400);
  };

  return (
    <section className="relative bg-black py-16 lg:py-24">
      {/* Pattern background */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <Image
          src={getImagePath("/images/homepage/pattern-bgr.svg")}
          alt=""
          fill
          className="object-cover"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-[1480px] px-6">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center text-[40px] font-light uppercase leading-[1.2] tracking-[4px] text-accelerate-gray-100 md:text-[60px] lg:mb-16 lg:text-[80px]"
        >
          2026 Accelerate Lineup
        </motion.h2>

        {/* Cards with scroll arrows */}
        <div className="relative">
          {/* Left arrow — rotated 180deg per Figma */}
          <button
            onClick={() => scroll("left")}
            className={`absolute -left-2 top-1/2 z-10 hidden -translate-y-1/2 md:block lg:-left-4 ${
              canScrollLeft ? "opacity-100" : "opacity-30"
            }`}
            aria-label="Scroll left"
            disabled={!canScrollLeft}
          >
            <svg
              width="36"
              height="36"
              viewBox="0 0 36 36"
              fill="none"
              className="rotate-180"
            >
              <circle cx="18" cy="18" r="18" fill="#838191" />
              <g transform="translate(9, 10)">
                <path
                  d="M17.79 8.56L11.07 15.77C10.93 15.92 10.76 16 10.55 16C10.35 16 10.17 15.92 10.03 15.77C9.89 15.62 9.82 15.44 9.82 15.22C9.82 15 9.89 14.81 10.03 14.66L15.51 8.78H0.73C0.63 8.79 0.54 8.76 0.45 8.73C0.37 8.69 0.29 8.64 0.21 8.56C0.07 8.4 0 8.22 0 8C0 7.78 0.07 7.6 0.21 7.44C0.29 7.36 0.37 7.31 0.45 7.27C0.54 7.24 0.63 7.21 0.73 7.2L15.51 7.22L10.03 1.34C9.89 1.19 9.82 1 9.82 0.78C9.82 0.56 9.89 0.38 10.03 0.23C10.17 0.08 10.35 0 10.55 0C10.76 0 10.93 0.08 11.07 0.23L17.79 7.44C17.93 7.6 18 7.78 18 8C18 8.22 17.93 8.4 17.79 8.56Z"
                  fill="black"
                />
              </g>
            </svg>
          </button>

          {/* Right arrow */}
          <button
            onClick={() => scroll("right")}
            className={`absolute -right-2 top-1/2 z-10 hidden -translate-y-1/2 md:block lg:-right-4 ${
              canScrollRight ? "opacity-100" : "opacity-30"
            }`}
            aria-label="Scroll right"
            disabled={!canScrollRight}
          >
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <circle cx="18" cy="18" r="18" fill="#838191" />
              <g transform="translate(9, 10)">
                <path
                  d="M17.79 8.56L11.07 15.77C10.93 15.92 10.76 16 10.55 16C10.35 16 10.17 15.92 10.03 15.77C9.89 15.62 9.82 15.44 9.82 15.22C9.82 15 9.89 14.81 10.03 14.66L15.51 8.78H0.73C0.63 8.79 0.54 8.76 0.45 8.73C0.37 8.69 0.29 8.64 0.21 8.56C0.07 8.4 0 8.22 0 8C0 7.78 0.07 7.6 0.21 7.44C0.29 7.36 0.37 7.31 0.45 7.27C0.54 7.24 0.63 7.21 0.73 7.2L15.51 7.22L10.03 1.34C9.89 1.19 9.82 1 9.82 0.78C9.82 0.56 9.89 0.38 10.03 0.23C10.17 0.08 10.35 0 10.55 0C10.76 0 10.93 0.08 11.07 0.23L17.79 7.44C17.93 7.6 18 7.78 18 8C18 8.22 17.93 8.4 17.79 8.56Z"
                  fill="black"
                />
              </g>
            </svg>
          </button>

          {/* Scrollable cards */}
          <div
            ref={scrollRef}
            onScroll={checkScroll}
            className="scrollbar-hide flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 lg:justify-center"
          >
            {events.map((event) => (
              <motion.div
                key={event.city}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="w-[242px] max-w-[529px] flex-shrink-0 snap-center md:w-[calc(100vw-48px)]"
              >
                <EventCard {...event} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
