"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { getImagePath } from "@/config";
import type { Speaker } from "@/types/speakers";

type MiamiSpeakersCarouselProps = {
  heading: string;
  speakers: Speaker[];
};

function getSpeakerImageSrc(image: string) {
  if (!image) return "";
  return image.startsWith("http") ? image : getImagePath(image);
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function SpeakerCard({ speaker, index }: { speaker: Speaker; index: number }) {
  const imageSrc = getSpeakerImageSrc(speaker.image);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay: index * 0.04,
        ease: [0.16, 1, 0.3, 1],
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative flex min-w-[220px] snap-start flex-col sm:min-w-[260px]"
    >
      {/* Card container with gradient border on hover */}
      <div className="relative overflow-hidden rounded-[20px]">
        {/* Gradient border effect */}
        <motion.div
          className="absolute inset-0 z-10 rounded-[20px] pointer-events-none"
          style={{
            background:
              "linear-gradient(160deg, rgba(153,69,255,0.5), rgba(25,251,155,0.3), rgba(0,212,255,0.5)) padding-box, linear-gradient(160deg, #9945FF, #19FB9B, #00D4FF) border-box",
            border: "1px solid transparent",
            mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            maskComposite: "exclude",
            WebkitMaskComposite: "xor",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.4 }}
        />

        {/* Image area — tall cinematic ratio */}
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-accelerate-gray-300">
          {imageSrc ? (
            <motion.div
              className="h-full w-full"
              animate={{
                scale: isHovered ? 1.06 : 1,
                filter: isHovered ? "grayscale(0%)" : "grayscale(100%)",
              }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <Image
                src={imageSrc}
                alt={speaker.name}
                fill
                sizes="(max-width: 640px) 220px, 260px"
                className="object-cover object-top"
              />
            </motion.div>
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-accelerate-purple/20 via-transparent to-accelerate-cyan/20">
              <span className="text-[56px] font-light uppercase tracking-[0.3em] text-white/20">
                {speaker.firstName.slice(0, 1)}
                {speaker.lastName.slice(0, 1)}
              </span>
            </div>
          )}

          {/* Hover color wash */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-accelerate-purple/15 via-transparent to-accelerate-green/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.5 }}
          />

          {/* Noise texture overlay */}
          <div
            className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              backgroundSize: "128px 128px",
            }}
          />
        </div>
      </div>

      {/* Speaker info — below the image */}
      <div className="mt-4 flex flex-1 flex-col">
        <motion.h3
          className="text-[22px] font-light uppercase leading-[0.88] tracking-[0.06em] sm:text-[26px]"
          animate={{
            color: isHovered ? "#19FB9B" : "#9945FF",
          }}
          transition={{ duration: 0.35 }}
        >
          <span className="block">{speaker.firstName || speaker.name}</span>
          {speaker.lastName ? (
            <span className="block">{speaker.lastName}</span>
          ) : null}
        </motion.h3>

        <div className="mt-2 flex flex-1 items-end justify-between gap-2">
          <div className="min-w-0 flex-1">
            {speaker.company ? (
              <p className="font-diatype text-[15px] leading-tight text-white sm:text-[16px]">
                {speaker.company}
              </p>
            ) : null}
            {speaker.title ? (
              <p className="font-diatype mt-0.5 text-[13px] leading-snug text-white/60 sm:text-sm">
                {speaker.title}
              </p>
            ) : null}
          </div>
          {speaker.twitter ? (
            <a
              href={
                speaker.twitter.startsWith("http")
                  ? speaker.twitter
                  : `https://x.com/${speaker.twitter.replace(/^@/, "")}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 text-white/40 transition-colors hover:text-white"
              aria-label={`${speaker.name} on X`}
            >
              <XIcon className="h-4 w-4" />
            </a>
          ) : null}
        </div>
      </div>

      {/* Accent line below card */}
      <motion.div
        className="mt-2 h-[2px] w-full origin-left rounded-full"
        style={{
          background: "linear-gradient(90deg, #9945FF, #19FB9B 60%, #00D4FF)",
        }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isHovered ? 1 : 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      />
    </motion.article>
  );
}

function ScrollTrack({ progress }: { progress: number }) {
  return (
    <div className="relative h-[3px] w-full max-w-[180px] overflow-hidden rounded-full bg-white/[0.06]">
      {/* Filled track */}
      <motion.div
        className="absolute inset-y-0 left-0 rounded-full"
        style={{
          background: "linear-gradient(90deg, #9945FF, #19FB9B, #00D4FF)",
        }}
        animate={{ width: `${Math.max(progress * 100, 4)}%` }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      />
      {/* Glow dot at leading edge */}
      <motion.div
        className="absolute top-1/2 h-[9px] w-[9px] -translate-y-1/2 rounded-full"
        style={{
          background: "#19FB9B",
          boxShadow: "0 0 8px 2px rgba(25, 251, 155, 0.5)",
        }}
        animate={{ left: `${Math.max(progress * 100, 2)}%` }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      />
    </div>
  );
}

export function MiamiSpeakersCarousel({
  heading,
  speakers,
}: MiamiSpeakersCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });
  const [scrollProgress, setScrollProgress] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    const maxScroll = scrollWidth - clientWidth;

    if (maxScroll <= 0) {
      setScrollProgress(1);
      setCanScrollLeft(false);
      setCanScrollRight(false);
      return;
    }

    setScrollProgress(scrollLeft / maxScroll);
    setCanScrollLeft(scrollLeft > 2);
    setCanScrollRight(scrollLeft < maxScroll - 2);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !isInView) return;

    updateScrollState();
    container.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    return () => {
      container.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [isInView, updateScrollState, speakers]);

  const scrollByCards = (direction: "prev" | "next") => {
    const container = containerRef.current;
    if (!container) return;

    const amount = Math.round(container.clientWidth * 0.82);
    container.scrollBy({
      left: direction === "next" ? amount : -amount,
      behavior: "smooth",
    });
  };

  if (!speakers.length) return null;

  return (
    <section
      ref={sectionRef}
      id="speakers"
      className="section-accelerate overflow-hidden"
    >
      <div className="container-accelerate">
        {/* Header row */}
        <div className="mb-8 flex items-end justify-between gap-4 lg:mb-10">
          <div>
            <motion.p
              initial={{ opacity: 0, x: -12 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-3 font-diatype text-xs uppercase tracking-[0.3em] text-white/35"
            >
              Miami &middot; 2026
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                delay: 0.15,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="section-heading !mb-0"
            >
              {heading}
            </motion.h2>
          </div>

          {/* Navigation controls */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="hidden items-center gap-5 sm:flex"
          >
            <ScrollTrack progress={scrollProgress} />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => scrollByCards("prev")}
                disabled={!canScrollLeft}
                className="flex h-9 w-9 items-center justify-center disabled:pointer-events-none disabled:opacity-30"
                aria-label="Previous speakers"
              >
                <Image
                  src={getImagePath("/images/faq-arrow.svg")}
                  alt=""
                  width={36}
                  height={36}
                  className="h-9 w-9 rotate-180"
                />
              </button>
              <button
                type="button"
                onClick={() => scrollByCards("next")}
                disabled={!canScrollRight}
                className="flex h-9 w-9 items-center justify-center disabled:pointer-events-none disabled:opacity-30"
                aria-label="Next speakers"
              >
                <Image
                  src={getImagePath("/images/faq-arrow.svg")}
                  alt=""
                  width={36}
                  height={36}
                  className="h-9 w-9"
                />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Divider with gradient fade */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8 h-px w-full origin-left bg-gradient-to-r from-accelerate-purple/30 via-white/[0.12] to-transparent"
        />

        {/* Carousel */}
        <div
          ref={containerRef}
          className="scrollbar-hide flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 sm:gap-5"
        >
          {isInView &&
            speakers.map((speaker, i) => (
              <SpeakerCard key={speaker.slug} speaker={speaker} index={i} />
            ))}
        </div>

        {/* Mobile scroll indicator */}
        <div className="mt-3 flex justify-center sm:hidden">
          <ScrollTrack progress={scrollProgress} />
        </div>
      </div>
    </section>
  );
}
