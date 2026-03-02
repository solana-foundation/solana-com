"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { getImagePath } from "@/config";

const videos = [
  {
    id: "LsfnC62q8oE",
    title: "Welcome to Solana Accelerate APAC",
    thumbnail: getImagePath("/images/homepage/video-thumb-1.jpg"),
  },
  {
    id: "mIGoTSdkEww",
    title: "Accelerate APAC Opening",
    thumbnail: getImagePath("/images/homepage/video-thumb-2.jpg"),
  },
  {
    id: "7GynS0cj_rA",
    title: "Opening Fireside",
    thumbnail: getImagePath("/images/homepage/video-thumb-3.jpg"),
  },
  {
    id: "dQw4w9WgXcQ",
    title: "Panel Discussion",
    thumbnail: getImagePath("/images/homepage/video-thumb-4.jpg"),
  },
];

const getYoutubeEmbedUrl = (id: string) => {
  const params = new URLSearchParams({
    rel: "0",
    modestbranding: "1",
    autoplay: "1",
  });
  return `https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`;
};

export function VideoCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = direction === "left" ? -540 : 540;
    el.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <section className="relative bg-black py-10 lg:py-16">
      {/* Divider line - matches Figma Line 22 (full width) + Line 23 (accent) */}
      <div className="mx-auto max-w-[1920px] px-6 lg:px-[60px]">
        <div className="relative mb-10 lg:mb-14">
          <div className="h-px bg-white/10" />
          {/* Green accent line on the left ~1/3 width */}
          <div className="absolute left-0 top-0 h-px w-1/3 bg-[#19fb9b]/30" />
        </div>
      </div>

      <div className="mx-auto max-w-[1920px] px-6 lg:px-[60px]">
        {/* Header row */}
        <div className="mb-6 flex items-center justify-between">
          {/* Title - Space Grotesk Regular 40px */}
          <h3
            className="text-[24px] font-normal uppercase leading-[1.1] tracking-[2px] text-[#b3b2bc] md:text-[32px] lg:text-[40px]"
            style={{
              fontFamily:
                "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
            }}
          >
            Accelerate APAC 2026
          </h3>

          {/* Navigation arrows */}
          <div className="flex items-center gap-10">
            <button
              onClick={() => scroll("left")}
              className="flex h-9 w-9 -scale-x-100 items-center justify-center transition-opacity hover:opacity-70"
              aria-label="Scroll left"
            >
              <Image
                src={getImagePath("/images/homepage/arrow-scroll.svg")}
                alt=""
                width={36}
                height={36}
              />
            </button>
            <button
              onClick={() => scroll("right")}
              className="flex h-9 w-9 items-center justify-center transition-opacity hover:opacity-70"
              aria-label="Scroll right"
            >
              <Image
                src={getImagePath("/images/homepage/arrow-scroll.svg")}
                alt=""
                width={36}
                height={36}
              />
            </button>
          </div>
        </div>

        {/* Video thumbnails - 524px wide each with gaps */}
        <div
          ref={scrollRef}
          className="scrollbar-hide flex snap-x gap-3 overflow-x-auto pb-4"
        >
          {videos.map((video) => (
            <div
              key={video.id}
              className="w-[300px] flex-shrink-0 snap-start md:w-[400px] lg:w-[524px]"
            >
              <div className="group relative aspect-[524/295] cursor-pointer overflow-hidden rounded-none bg-white/5">
                <AnimatePresence mode="wait">
                  {playingId === video.id ? (
                    <motion.iframe
                      key="iframe"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      src={getYoutubeEmbedUrl(video.id)}
                      title={video.title}
                      className="absolute inset-0 h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <motion.div
                      key="thumbnail"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="relative h-full w-full"
                      onClick={() => setPlayingId(video.id)}
                    >
                      <Image
                        src={video.thumbnail}
                        alt={video.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      {/* Play button overlay */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors group-hover:bg-black/30">
                        <div
                          className="flex h-14 w-14 items-center justify-center rounded-full"
                          style={{
                            background:
                              "linear-gradient(135deg, rgba(153, 69, 255, 0.85) 0%, rgba(25, 251, 155, 0.85) 100%)",
                          }}
                        >
                          <svg
                            width="18"
                            height="20"
                            viewBox="0 0 22 26"
                            fill="none"
                            className="ml-0.5"
                          >
                            <path d="M22 13L0 26V0L22 13Z" fill="white" />
                          </svg>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
