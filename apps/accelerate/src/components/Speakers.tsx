"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRef, useState, useEffect, useCallback } from "react";
import speakersData from "../data/speakers.json";

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
}

interface SpeakerCardProps {
  speaker: Speaker;
  cardWidth?: number;
}

function SpeakerCard({ speaker, cardWidth }: SpeakerCardProps) {
  const aspectRatio = 1; // Square images
  const imageHeight = cardWidth ? cardWidth : undefined;

  return (
    <motion.div
      variants={fadeInUp}
      className="relative flex w-[300px] flex-shrink-0 flex-col gap-5"
      style={{
        width: cardWidth ? `${cardWidth}px` : undefined,
        minWidth: cardWidth ? `${cardWidth}px` : undefined,
      }}
    >
      {/* Image - rounded rectangular */}
      <div
        className="relative h-[300px] w-full overflow-hidden rounded-3xl bg-[#a0a0a0]"
        style={{
          height: imageHeight ? `${imageHeight}px` : undefined,
        }}
      >
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
            fontFamily:
              "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
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
              fontFamily:
                "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
            }}
          >
            {speaker.company}
          </p>

          {/* Title */}
          <div className="flex items-center justify-between gap-4">
            <p className="text-p text-white">{speaker.title}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function SmallSpeakerCard({ speaker }: { speaker: Speaker }) {
  return (
    <motion.div
      variants={fadeInUp}
      className="relative flex w-[140px] flex-shrink-0 flex-col gap-2 sm:w-[160px] sm:gap-3 lg:w-[180px]"
    >
      {/* Image - responsive sizes: 120px mobile, 140px tablet, 150px desktop */}
      <div className="relative h-[120px] w-[120px] overflow-hidden rounded-2xl bg-[#a0a0a0] sm:h-[140px] sm:w-[140px] lg:h-[150px] lg:w-[150px]">
        <Image
          src={speaker.image}
          alt={speaker.name}
          width={150}
          height={150}
          className="object-cover grayscale"
        />
      </div>

      {/* Info */}
      <div className="relative flex w-[120px] flex-col gap-1.5 sm:w-[140px] sm:gap-2 lg:w-[150px]">
        {/* Name - uppercase, multi-line */}
        <div
          className="text-[14px] uppercase leading-none text-accelerate-purple sm:text-[16px] lg:text-[18px]"
          style={{
            fontFamily:
              "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
          }}
        >
          <p className="mb-0">{speaker.firstName}</p>
          <p>{speaker.lastName}</p>
        </div>

        {/* Company and Title */}
        <div className="flex flex-col gap-0.5 sm:gap-1">
          {/* Company */}
          <p
            className="text-[12px] text-white sm:text-[14px] lg:text-[16px]"
            style={{
              fontFamily:
                "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
            }}
          >
            {speaker.company}
          </p>

          {/* Title */}
          <p className="text-xs text-white/80 sm:text-sm">{speaker.title}</p>
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
      image: "/images/speakers/lily-liu.webp",
    },
    {
      name: "Chris Chung",
      firstName: "CHRIS",
      lastName: "CHUNG",
      title: "CEO & Co-Founder",
      company: "Titan",
      image: "/images/speakers/chris-chung.webp",
    },
    {
      name: "Shina Foo",
      firstName: "SHINA",
      lastName: "FOO",
      title: "Head of Growth",
      company: "Perena",
      image: "/images/speakers/shina-foo.webp",
    },
    {
      name: "Shawn Chain",
      firstName: "SHAWN",
      lastName: "CHAIN",
      title: "CEO",
      company: "Singapore Gulf Bank",
      image: "/images/speakers/shawn-chan.webp",
    },
  ];

  const carouselRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [cardWidth, setCardWidth] = useState<number | null>(null);
  const dragStart = useRef({ x: 0, scrollLeft: 0 });

  // Calculate card width to fit 4 across on desktop, responsive on tablet
  const calculateCardWidth = useCallback(() => {
    if (!containerRef.current) return;

    const containerWidth = containerRef.current.clientWidth;
    const gap = 24; // gap-6 = 24px

    // Mobile (< 640px) - fixed width for better UX
    if (containerWidth < 640) {
      setCardWidth(300);
      return;
    }

    // Tablet (640px - 1024px) - show 2 cards
    if (containerWidth < 1024) {
      const calculatedWidth = (containerWidth - gap) / 2;
      setCardWidth(Math.max(300, calculatedWidth));
      return;
    }

    // Desktop (>= 1024px) - show 4 cards
    const calculatedWidth = (containerWidth - 3 * gap) / 4;
    setCardWidth(Math.max(280, calculatedWidth));
  }, []);

  useEffect(() => {
    calculateCardWidth();
    window.addEventListener("resize", calculateCardWidth);
    return () => window.removeEventListener("resize", calculateCardWidth);
  }, [calculateCardWidth]);

  const scrollCarousel = (direction: "left" | "right") => {
    if (!carouselRef.current || cardWidth === null) return;

    const gap = 24; // gap-6 = 24px
    const scrollAmount = cardWidth + gap; // Scroll by card width + gap
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

  // Touch/Mouse handlers for dragging
  const handleDragStart = useCallback((clientX: number) => {
    if (!carouselRef.current) return;
    setIsDragging(true);
    dragStart.current = {
      x: clientX,
      scrollLeft: carouselRef.current.scrollLeft,
    };
  }, []);

  const handleDragMove = useCallback(
    (clientX: number) => {
      if (!isDragging || !carouselRef.current) return;
      const deltaX = clientX - dragStart.current.x;
      carouselRef.current.scrollLeft = dragStart.current.scrollLeft - deltaX;
    },
    [isDragging],
  );

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    checkScrollButtons();
  }, []);

  // Touch event handlers
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches[0]) {
        handleDragStart(e.touches[0].clientX);
      }
    },
    [handleDragStart],
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches[0]) {
        handleDragMove(e.touches[0].clientX);
      }
    },
    [handleDragMove],
  );

  const handleTouchEnd = useCallback(() => {
    handleDragEnd();
  }, [handleDragEnd]);

  // Mouse event handlers (for desktop drag support)
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      handleDragStart(e.clientX);
      e.preventDefault();
    },
    [handleDragStart],
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      handleDragMove(e.clientX);
    },
    [handleDragMove],
  );

  const handleMouseUp = useCallback(() => {
    handleDragEnd();
  }, [handleDragEnd]);

  useEffect(() => {
    checkScrollButtons();
    // Check on window resize
    window.addEventListener("resize", checkScrollButtons);
    return () => window.removeEventListener("resize", checkScrollButtons);
  }, []);

  // Add global mouse move/up listeners for dragging
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <section id="speakers" className="bg-black py-12 lg:py-16">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-[60px]">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
        >
          {/* Header with title, underline, and ALL SPEAKERS button */}
          <div className="mb-8 flex items-start justify-between lg:mb-12">
            <motion.div variants={fadeInUp} className="flex flex-col">
              <h2
                className="text-h1 text-accelerate-gray-100"
                style={{
                  fontFamily:
                    "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
                }}
              >
                Speakers
              </h2>
            </motion.div>
          </div>

          {/* Divider line */}
          <div className="mb-8 border-t border-white/10 lg:mb-10" />

          {/* Carousel Navigation Buttons - right aligned with ALL SPEAKERS button */}
          <div className="flex justify-end gap-2 mb-8">
            <button
              onClick={() => scrollCarousel("left")}
              disabled={!canScrollLeft}
              className="flex items-center justify-center transition-opacity disabled:opacity-40 hover:opacity-80 disabled:hover:opacity-40"
              aria-label="Scroll left"
            >
              <svg
                width="36"
                height="36"
                viewBox="0 0 36 36"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="rotate-180"
              >
                <circle cx="18" cy="18" r="18" fill="#838191" />
                <path
                  d="M26.7899 18.5553L20.0682 25.7744C19.9282 25.9248 19.7558 26 19.5512 26C19.3465 26 19.1741 25.9248 19.0341 25.7744C18.8941 25.624 18.8241 25.4389 18.8241 25.2191C18.8241 24.9993 18.8941 24.8142 19.0341 24.6638L24.5117 18.7809L9.72711 18.7983C9.63016 18.7867 9.5386 18.7636 9.45242 18.7289C9.36625 18.6941 9.28546 18.6363 9.21005 18.5553C9.07002 18.4049 9 18.2198 9 18C9 17.7802 9.07002 17.5951 9.21005 17.4447C9.28546 17.3637 9.36625 17.3059 9.45242 17.2712C9.5386 17.2364 9.63016 17.2133 9.72711 17.2017L24.5117 17.2191L19.0341 11.3362C18.8941 11.1858 18.8241 11.0007 18.8241 10.7809C18.8241 10.5611 18.8941 10.376 19.0341 10.2256C19.1741 10.0752 19.3465 10 19.5512 10C19.7558 10 19.9282 10.0752 20.0682 10.2256L26.7899 17.4447C26.93 17.5951 27 17.7802 27 18C27 18.2198 26.93 18.4049 26.7899 18.5553Z"
                  fill="black"
                />
              </svg>
            </button>
            <button
              onClick={() => scrollCarousel("right")}
              disabled={!canScrollRight}
              className="flex items-center justify-center transition-opacity disabled:opacity-40 hover:opacity-80 disabled:hover:opacity-40"
              aria-label="Scroll right"
            >
              <svg
                width="36"
                height="36"
                viewBox="0 0 36 36"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="18" cy="18" r="18" fill="#838191" />
                <path
                  d="M26.7899 18.5553L20.0682 25.7744C19.9282 25.9248 19.7558 26 19.5512 26C19.3465 26 19.1741 25.9248 19.0341 25.7744C18.8941 25.624 18.8241 25.4389 18.8241 25.2191C18.8241 24.9993 18.8941 24.8142 19.0341 24.6638L24.5117 18.7809L9.72711 18.7983C9.63016 18.7867 9.5386 18.7636 9.45242 18.7289C9.36625 18.6941 9.28546 18.6363 9.21005 18.5553C9.07002 18.4049 9 18.2198 9 18C9 17.7802 9.07002 17.5951 9.21005 17.4447C9.28546 17.3637 9.36625 17.3059 9.45242 17.2712C9.5386 17.2364 9.63016 17.2133 9.72711 17.2017L24.5117 17.2191L19.0341 11.3362C18.8941 11.1858 18.8241 11.0007 18.8241 10.7809C18.8241 10.5611 18.8941 10.376 19.0341 10.2256C19.1741 10.0752 19.3465 10 19.5512 10C19.7558 10 19.9282 10.0752 20.0682 10.2256L26.7899 17.4447C26.93 17.5951 27 17.7802 27 18C27 18.2198 26.93 18.4049 26.7899 18.5553Z"
                  fill="black"
                />
              </svg>
            </button>
          </div>

          {/* Carousel Navigation and Cards */}
          <div className="relative" ref={containerRef}>
            {/* Speaker Cards Carousel */}
            <div
              ref={carouselRef}
              onScroll={checkScrollButtons}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onMouseDown={handleMouseDown}
              className="-mx-6 overflow-x-auto px-6 scrollbar-hide lg:mx-0 lg:px-0"
              style={{
                touchAction: "pan-x",
                WebkitOverflowScrolling: "touch",
                cursor: isDragging ? "grabbing" : "grab",
                userSelect: "none",
              }}
            >
              <div className="flex gap-6">
                {speakers.map((speaker) => (
                  <SpeakerCard
                    key={speaker.name}
                    speaker={speaker}
                    cardWidth={cardWidth || undefined}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* All Speakers Section - Vertically Scrolling Panel */}
      <div className="mx-auto max-w-[1440px] px-6 lg:px-[60px]">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
        >
          {/* Header */}
          <div className="my-8 flex items-start justify-between lg:mb-12">
            <motion.div variants={fadeInUp} className="flex flex-col">
              <h2
                className="text-h2 text-accelerate-gray-100"
                style={{
                  fontFamily:
                    "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
                }}
              >
                All Speakers
              </h2>
            </motion.div>
          </div>

          {/* Vertically Scrolling Panel with Horizontal Cards */}
          <div className="relative">
            <div
              className="max-h-[600px] overflow-y-auto overflow-x-hidden scrollbar-custom border-t border-b border-white/10 pr-2 py-8"
              style={{
                WebkitOverflowScrolling: "touch",
              }}
            >
              <div className="flex flex-wrap justify-center gap-4 pb-4 sm:gap-5 lg:gap-6">
                {speakersData.speakers.map((speaker) => (
                  <SmallSpeakerCard key={speaker.slug} speaker={speaker} />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
