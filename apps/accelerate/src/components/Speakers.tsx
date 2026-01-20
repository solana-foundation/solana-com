"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

interface Speaker {
  name: string;
  firstName: string;
  lastName: string;
  title: string;
  company: string;
  image: string;
  twitter?: string;
}

interface SpeakerCardProps {
  speaker: Speaker;
}

function SpeakerCard({ speaker }: SpeakerCardProps) {
  return (
    <motion.div
      variants={fadeInUp}
      className="relative flex w-[300px] flex-shrink-0 flex-col gap-5 sm:w-[340px] lg:w-[380px]"
    >
      {/* Image - rounded rectangular */}
      <div className="relative h-[300px] w-full overflow-hidden rounded-[48px] bg-[#a0a0a0] sm:h-[340px] lg:h-[380px]">
        <Image
          src={speaker.image}
          alt={speaker.name}
          fill
          className="object-cover grayscale"
        />
      </div>

      {/* Info - no left border */}
      <div className="relative flex flex-col gap-3">
        {/* Name - uppercase, multi-line */}
        <div
          className="text-h1 uppercase leading-none text-accelerate-purple"
          style={{
            fontFamily: "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
          }}
        >
          <p className="mb-0">{speaker.firstName}</p>
          <p>{speaker.lastName}</p>
        </div>

        {/* Company and Title with X icon */}
        <div className="flex flex-col gap-1">
          {/* Company */}
          <p
            className="text-h2 text-white"
            style={{
              fontFamily: "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
            }}
          >
            {speaker.company}
          </p>

          {/* Title with X icon */}
          <div className="flex items-center justify-between gap-4">
            <p className="text-p text-white">{speaker.title}</p>

            {/* Circular X button */}
            {speaker.twitter && (
              <a
                href={speaker.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full transition-opacity hover:opacity-80"
              >
                <Image
                  src="/images/x-social.svg"
                  alt="X (Twitter)"
                  width={20}
                  height={20}
                  className="object-contain"
                />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function Speakers() {
  const speakers: Speaker[] = [
    {
      name: "Lily Liu",
      firstName: "LILY",
      lastName: "LIU",
      title: "President",
      company: "Solana foundation",
      image: "/images/speakers/lily-liu.png",
      twitter: "https://twitter.com/calilyliu",
    },
    {
      name: "Chris Chung",
      firstName: "CHRIS",
      lastName: "CHUNG",
      title: "CEO & Co-Founder",
      company: "Titan",
      image: "/images/speakers/chris-chung.png",
      twitter: "https://twitter.com/cchung",
    },
    {
      name: "Shina Foo",
      firstName: "SHINA",
      lastName: "FOO",
      title: "Head of Growth",
      company: "Perena",
      image: "/images/speakers/shina-foo.png",
      twitter: "https://twitter.com/shinafoo",
    },
    {
      name: "Shawn Chain",
      firstName: "SHAWN",
      lastName: "CHAIN",
      title: "CEO",
      company: "Singapore Gulf Bank",
      image: "/images/speakers/shawn-chain.png",
      twitter: "https://twitter.com/shawnchain",
    },
  ];

  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const scrollCarousel = (direction: "left" | "right") => {
    if (!carouselRef.current) return;

    const scrollAmount = 400; // Scroll by card width + gap
    const newScrollLeft =
      carouselRef.current.scrollLeft +
      (direction === "left" ? -scrollAmount : scrollAmount);

    carouselRef.current.scrollTo({
      left: newScrollLeft,
      behavior: "smooth",
    });
  };

  const checkScrollButtons = () => {
    if (!carouselRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScrollButtons();
    // Check on window resize
    window.addEventListener("resize", checkScrollButtons);
    return () => window.removeEventListener("resize", checkScrollButtons);
  }, []);

  return (
    <section id="speakers" className="bg-black py-20 lg:py-28">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-[60px]">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
        >
          {/* Header with title, underline, and ALL SPEAKERS button */}
          <div className="mb-12 flex items-start justify-between lg:mb-20">
            <motion.div variants={fadeInUp} className="flex flex-col">
              <h2
                className="text-h1 text-accelerate-gray-100"
                style={{
                  fontFamily: "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
                }}
              >
                Speakers
              </h2>
            </motion.div>

            {/* Right side: ALL SPEAKERS button and carousel controls */}
            <motion.div variants={fadeInUp} className="flex flex-col items-end gap-2">
              {/* ALL SPEAKERS button */}
              <a
                href="#speakers"
                className="inline-flex items-center gap-2 rounded-full px-8 py-4 font-semibold uppercase tracking-[0.05em] text-white transition-colors hover:bg-white/5"
                style={{
                  fontFamily: "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
                  fontSize: "16px",
                  background: "linear-gradient(black, black) padding-box, linear-gradient(to right, #9945FF, #19FB9B) border-box",
                  border: "1px solid transparent",
                }}
              >
                <span>ALL SPEAKERS</span>
                <svg width="8" height="8" viewBox="0 0 11 11" fill="none">
                  <path
                    d="M2 9L9 2M9 2H4M9 2V7"
                    stroke="#19FB9B"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>

            </motion.div>
          </div>

          {/* Divider line */}
          <div className="mb-12 border-t border-white/10 lg:mb-10" />

          {/* Carousel Navigation Buttons - right aligned with ALL SPEAKERS button */}
          <div className="flex justify-end gap-2 mb-10">
            <button
              onClick={() => scrollCarousel("left")}
              disabled={!canScrollLeft}
              className="flex items-center justify-center transition-opacity disabled:opacity-40 hover:opacity-80 disabled:hover:opacity-40"
              aria-label="Scroll left"
            >
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="rotate-180">
                <circle cx="18" cy="18" r="18" fill="#838191" />
                <path d="M26.7899 18.5553L20.0682 25.7744C19.9282 25.9248 19.7558 26 19.5512 26C19.3465 26 19.1741 25.9248 19.0341 25.7744C18.8941 25.624 18.8241 25.4389 18.8241 25.2191C18.8241 24.9993 18.8941 24.8142 19.0341 24.6638L24.5117 18.7809L9.72711 18.7983C9.63016 18.7867 9.5386 18.7636 9.45242 18.7289C9.36625 18.6941 9.28546 18.6363 9.21005 18.5553C9.07002 18.4049 9 18.2198 9 18C9 17.7802 9.07002 17.5951 9.21005 17.4447C9.28546 17.3637 9.36625 17.3059 9.45242 17.2712C9.5386 17.2364 9.63016 17.2133 9.72711 17.2017L24.5117 17.2191L19.0341 11.3362C18.8941 11.1858 18.8241 11.0007 18.8241 10.7809C18.8241 10.5611 18.8941 10.376 19.0341 10.2256C19.1741 10.0752 19.3465 10 19.5512 10C19.7558 10 19.9282 10.0752 20.0682 10.2256L26.7899 17.4447C26.93 17.5951 27 17.7802 27 18C27 18.2198 26.93 18.4049 26.7899 18.5553Z" fill="black" />
              </svg>
            </button>
            <button
              onClick={() => scrollCarousel("right")}
              disabled={!canScrollRight}
              className="flex items-center justify-center transition-opacity disabled:opacity-40 hover:opacity-80 disabled:hover:opacity-40"
              aria-label="Scroll right"
            >
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="18" cy="18" r="18" fill="#838191" />
                <path d="M26.7899 18.5553L20.0682 25.7744C19.9282 25.9248 19.7558 26 19.5512 26C19.3465 26 19.1741 25.9248 19.0341 25.7744C18.8941 25.624 18.8241 25.4389 18.8241 25.2191C18.8241 24.9993 18.8941 24.8142 19.0341 24.6638L24.5117 18.7809L9.72711 18.7983C9.63016 18.7867 9.5386 18.7636 9.45242 18.7289C9.36625 18.6941 9.28546 18.6363 9.21005 18.5553C9.07002 18.4049 9 18.2198 9 18C9 17.7802 9.07002 17.5951 9.21005 17.4447C9.28546 17.3637 9.36625 17.3059 9.45242 17.2712C9.5386 17.2364 9.63016 17.2133 9.72711 17.2017L24.5117 17.2191L19.0341 11.3362C18.8941 11.1858 18.8241 11.0007 18.8241 10.7809C18.8241 10.5611 18.8941 10.376 19.0341 10.2256C19.1741 10.0752 19.3465 10 19.5512 10C19.7558 10 19.9282 10.0752 20.0682 10.2256L26.7899 17.4447C26.93 17.5951 27 17.7802 27 18C27 18.2198 26.93 18.4049 26.7899 18.5553Z" fill="black" />
              </svg>
            </button>
          </div>

          {/* Carousel Navigation and Cards */}
          <div className="relative">
            {/* Speaker Cards Carousel */}
            <div
              ref={carouselRef}
              onScroll={checkScrollButtons}
              className="-mx-6 overflow-x-auto px-6 scrollbar-hide lg:mx-0 lg:px-0"
            >
              <div className="flex gap-6">
                {speakers.map((speaker) => (
                  <SpeakerCard key={speaker.name} speaker={speaker} />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
