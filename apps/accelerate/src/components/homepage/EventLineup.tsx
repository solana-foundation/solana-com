"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { EventCard } from "./EventCard";
import { getImagePath } from "@/config";

const events = [
  {
    image: getImagePath("/images/homepage/hk-card-photo.jpg"),
    city: "Hong Kong",
    subtitle: "Solana Accelerate APAC",
    dateLocation: "Feb 11 / Hong Kong @ Consensus",
    href: "/accelerate/hong-kong",
    external: false,
    active: true,
  },
  {
    image: getImagePath("/images/homepage/miami-card-photo.jpg"),
    city: "Miami",
    subtitle: "Solana Accelerate USA",
    dateLocation: "May 5 / Miami",
    href: "https://lu.ma/accelerate-miami",
    external: true,
    active: true,
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
        {/* Heading - Space Grotesk Light 80px */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center text-[40px] font-light uppercase leading-[1.2] tracking-[4px] text-[#b3b2bc] md:text-[60px] lg:mb-16 lg:text-[80px]"
          style={{
            fontFamily:
              "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
          }}
        >
          2026 Accelerate
          <br />
          Lineup
        </motion.h2>

        {/* Cards with scroll arrows */}
        <div className="relative">
          {/* Left arrow */}
          <button
            onClick={() => scroll("left")}
            className={`absolute -left-2 top-1/2 z-10 -translate-y-1/2 lg:-left-4 ${
              canScrollLeft ? "opacity-100" : "opacity-30"
            }`}
            aria-label="Scroll left"
            disabled={!canScrollLeft}
          >
            <div className="flex h-9 w-9 -scale-x-100 items-center justify-center">
              <Image
                src={getImagePath("/images/homepage/arrow-scroll.svg")}
                alt=""
                width={36}
                height={36}
              />
            </div>
          </button>

          {/* Right arrow */}
          <button
            onClick={() => scroll("right")}
            className={`absolute -right-2 top-1/2 z-10 -translate-y-1/2 lg:-right-4 ${
              canScrollRight ? "opacity-100" : "opacity-30"
            }`}
            aria-label="Scroll right"
            disabled={!canScrollRight}
          >
            <Image
              src={getImagePath("/images/homepage/arrow-scroll.svg")}
              alt=""
              width={36}
              height={36}
            />
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
                className="w-[calc(100vw-48px)] max-w-[529px] flex-shrink-0 snap-center"
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
