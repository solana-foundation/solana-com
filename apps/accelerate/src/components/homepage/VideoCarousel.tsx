"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { getImagePath } from "@/config";

const videos = [
  { id: "mIGoTSdkEww", title: "Welcome to Solana Accelerate APAC" },
  { id: "rmSoC2H4-64", title: "Opening" },
  { id: "HBLEqLRpSiA", title: "Opening Fireside" },
  {
    id: "3RRrMEq3TKY",
    title:
      "Partnering to Build Next-Gen Financial Infrastructure For Onchain Assets",
  },
  { id: "lr_KBUzQ_os", title: "ETF from East to West" },
  { id: "BobmmVMD_M4", title: "Bridging The Gap" },
  { id: "LplcpJ3pPOQ", title: "SGB – Lightning Product Talk" },
  {
    id: "B_ZIRsr669g",
    title: "Anza - Engineering Internet Capital Markets",
  },
  { id: "F2qbEHmXr-E", title: "2WA - Lightning Product Talk" },
  {
    id: "EH8NWFbex3k",
    title: "Sunrise - Day One, Minute One, How Assets List On Solana",
  },
  { id: "t4LwRDDM2F4", title: "DFlow Product Lightning Talk" },
  { id: "G2SwIv9hh6s", title: "Safepal Lightning Product Talk" },
  {
    id: "qCk5aAbtrfc",
    title: "Digital Assets Trading And Liquidity in 2026",
  },
  { id: "JS_gdZLMt4g", title: "Trends.Fun" },
  { id: "-jgT62zTZ1Y", title: "Building New Financial Rails" },
  {
    id: "Q_BSNleN3u0",
    title: "Solana Stablecoins: How Solana Can Win Cards",
  },
  {
    id: "I_qRlEObdeY",
    title: "Beyond The Hype: Building Compliant And Scalable Stablecoin Rails",
  },
  {
    id: "m1bzEGvDPBI",
    title:
      "ByReal - Transforming Liquidity & Infra for Internet Capital Markets Era",
  },
  {
    id: "d_tOrVEpBeY",
    title: "Institutional Finance Accelerating Tokenization",
  },
  {
    id: "X70DIWMrppA",
    title: "Korean STO Market Outlook & Global Partnership Strategy",
  },
  { id: "ac6upzfmwGY", title: "Jupiter - The Onchain Super App" },
  {
    id: "O1rHOAVg4Is",
    title: "Jito - Building The Market Layer of Solana",
  },
  { id: "0WYpENQFS40", title: "Tokenize Everything on Solana" },
  { id: "TjWJxWq501A", title: "Accelerate APAC 2026" },
  { id: "eHHPKk2cWBA", title: "Matrixdock - Digital Gold on Solana" },
  {
    id: "23v5QTyYeLg",
    title: "Solana DeFi: The Execution Layer For Global Finance",
  },
  {
    id: "ovM3u1q563Q",
    title: "DeBridge Universal Execution To Make Infrastructure Disappear",
  },
  { id: "6jVYIAlzvr0", title: "Solflare" },
  { id: "9kJU_dtXOa8", title: "ICM Infrastructure Talk" },
  {
    id: "pMobZ1uMJBQ",
    title:
      "The New Global Reserve: Why Solana is the OS for Digital Asset Treasuries",
  },
  {
    id: "lyi48CMrC2E",
    title: "HSDT Solana Company - The Solana Supercycle Starts in Asia",
  },
  {
    id: "Fe4ZETLDfaE",
    title: "Bitcoin Is the Asset, Solana is the Infrastructure",
  },
  { id: "pJlWEd0n0pY", title: "Infrastructure of AI" },
  { id: "k9a6emVTxLY", title: "Introducing Lightspeed" },
  {
    id: "nNWrGePQLqk",
    title: "Fosun Finloop and Finchain Introduction",
  },
  {
    id: "iKQp-Y3v4BI",
    title: "Consumer App And Creator Economy on Solana",
  },
  { id: "RpHfsh5TJhU", title: "Internet Capital Showcase" },
  {
    id: "R0OPT-EExrQ",
    title: "DoubleZero - The Internet in Internet Capital Markets",
  },
  {
    id: "9mK84MOIyns",
    title: "What Wall Street Wants: Metrics That Matter",
  },
].map((v) => ({
  ...v,
  thumbnail: getImagePath(`/images/homepage/videos/${v.id}.jpg`),
}));

const getYoutubeEmbedUrl = (id: string) => {
  const params = new URLSearchParams({
    rel: "0",
    modestbranding: "1",
    autoplay: "1",
  });
  return `https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`;
};

function VideoModal({
  videoId,
  title,
  onClose,
}: {
  videoId: string;
  title: string;
  onClose: () => void;
}) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-[1080px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -right-2 -top-10 flex h-8 w-8 items-center justify-center text-white/70 transition-colors hover:text-white"
          aria-label="Close video"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M18 6L6 18M6 6l12 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
        <div className="aspect-video w-full overflow-hidden rounded-lg bg-black">
          <iframe
            src={getYoutubeEmbedUrl(videoId)}
            title={title}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

/* Circular arrow button matching Figma ArrowScrol component */
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

export function VideoCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [modalVideo, setModalVideo] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = direction === "left" ? -540 : 540;
    el.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <>
      <section className="relative bg-black py-10 lg:py-16">
        {/* Divider line */}
        <div className="mx-auto max-w-[1480px] px-6">
          <div className="relative mb-10 lg:mb-14">
            <div className="h-px bg-white/10" />
            <div className="absolute left-0 top-0 h-px w-1/3 bg-accelerate-green/30" />
          </div>
        </div>

        <div className="mx-auto max-w-[1480px] px-6">
          {/* Header row */}
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-[25px] font-light uppercase leading-none tracking-[1.25px] text-accelerate-gray-100 md:text-[32px] lg:text-[40px]">
              Accelerate APAC 2026
            </h3>

            {/* Circular navigation arrows */}
            <div className="flex items-center gap-10">
              <ArrowButton direction="left" onClick={() => scroll("left")} />
              <ArrowButton direction="right" onClick={() => scroll("right")} />
            </div>
          </div>

          {/* Video thumbnails */}
          <div
            ref={scrollRef}
            className="scrollbar-hide flex snap-x gap-3 overflow-x-auto pb-4"
          >
            {videos.map((video) => (
              <div
                key={video.id}
                className="w-[300px] flex-shrink-0 snap-start md:w-[400px] lg:w-[524px]"
              >
                <div
                  className="group relative aspect-[524/295] cursor-pointer overflow-hidden bg-white/5"
                  onClick={() =>
                    setModalVideo({ id: video.id, title: video.title })
                  }
                >
                  <Image
                    src={video.thumbnail}
                    alt={video.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {/* Play button overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors group-hover:bg-black/30">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accelerate-gradient">
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
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video modal */}
      <AnimatePresence>
        {modalVideo && (
          <VideoModal
            videoId={modalVideo.id}
            title={modalVideo.title}
            onClose={() => setModalVideo(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
