"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { getImagePath } from "@/config";
import { useTranslations } from "@workspace/i18n/client";

export type VideoCarouselItem = {
  id: string;
  title?: string;
  translationKey?: string;
  thumbnail?: string;
};

const defaultVideos: VideoCarouselItem[] = [
  { id: "mIGoTSdkEww", translationKey: "titles.welcome" },
  { id: "rmSoC2H4-64", translationKey: "titles.opening" },
  { id: "HBLEqLRpSiA", translationKey: "titles.openingFireside" },
  {
    id: "3RRrMEq3TKY",
    translationKey: "titles.nextGenFinancialInfrastructure",
  },
  { id: "lr_KBUzQ_os", translationKey: "titles.etfEastToWest" },
  { id: "BobmmVMD_M4", translationKey: "titles.bridgingTheGap" },
  { id: "LplcpJ3pPOQ", translationKey: "titles.sgbLightning" },
  {
    id: "B_ZIRsr669g",
    translationKey: "titles.anza",
  },
  { id: "F2qbEHmXr-E", translationKey: "titles.twoWay" },
  {
    id: "EH8NWFbex3k",
    translationKey: "titles.sunrise",
  },
  { id: "t4LwRDDM2F4", translationKey: "titles.dflow" },
  { id: "G2SwIv9hh6s", translationKey: "titles.safepal" },
  {
    id: "qCk5aAbtrfc",
    translationKey: "titles.digitalAssets",
  },
  { id: "JS_gdZLMt4g", translationKey: "titles.trendsFun" },
  { id: "-jgT62zTZ1Y", translationKey: "titles.financialRails" },
  {
    id: "Q_BSNleN3u0",
    translationKey: "titles.stablecoinsCards",
  },
  {
    id: "I_qRlEObdeY",
    translationKey: "titles.compliantStablecoinRails",
  },
  {
    id: "m1bzEGvDPBI",
    translationKey: "titles.byreal",
  },
  {
    id: "d_tOrVEpBeY",
    translationKey: "titles.institutionalFinance",
  },
  {
    id: "X70DIWMrppA",
    translationKey: "titles.koreanSto",
  },
  { id: "ac6upzfmwGY", translationKey: "titles.jupiter" },
  {
    id: "O1rHOAVg4Is",
    translationKey: "titles.jito",
  },
  { id: "0WYpENQFS40", translationKey: "titles.tokenizeEverything" },
  { id: "TjWJxWq501A", translationKey: "titles.accelerateApac" },
  { id: "eHHPKk2cWBA", translationKey: "titles.matrixdock" },
  {
    id: "23v5QTyYeLg",
    translationKey: "titles.solanaDefi",
  },
  {
    id: "ovM3u1q563Q",
    translationKey: "titles.debridge",
  },
  { id: "6jVYIAlzvr0", translationKey: "titles.solflare" },
  { id: "9kJU_dtXOa8", translationKey: "titles.icmInfrastructure" },
  {
    id: "pMobZ1uMJBQ",
    translationKey: "titles.globalReserve",
  },
  {
    id: "lyi48CMrC2E",
    translationKey: "titles.hsdt",
  },
  {
    id: "Fe4ZETLDfaE",
    translationKey: "titles.bitcoinSolana",
  },
  { id: "pJlWEd0n0pY", translationKey: "titles.aiInfrastructure" },
  { id: "k9a6emVTxLY", translationKey: "titles.lightspeed" },
  {
    id: "nNWrGePQLqk",
    translationKey: "titles.fosun",
  },
  {
    id: "iKQp-Y3v4BI",
    translationKey: "titles.consumerCreator",
  },
  { id: "RpHfsh5TJhU", translationKey: "titles.internetCapital" },
  {
    id: "R0OPT-EExrQ",
    translationKey: "titles.doubleZero",
  },
  {
    id: "9mK84MOIyns",
    translationKey: "titles.wallStreet",
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
  closeLabel,
  onClose,
}: {
  videoId: string;
  title: string;
  closeLabel: string;
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
          aria-label={closeLabel}
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
  const t = useTranslations("accelerate.homepage.video");

  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex h-12 w-12 items-center justify-center rounded-full border border-accelerate-gray-200 bg-black/60 text-accelerate-gray-200 transition-colors hover:border-accelerate-green hover:text-accelerate-green"
      aria-label={t(direction === "left" ? "scrollLeft" : "scrollRight")}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        className={direction === "left" ? "rotate-180" : ""}
      >
        <path
          d="M6.75 3.75 12 9l-5.25 5.25"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

export function VideoCarousel({
  videos = defaultVideos,
  heading,
  headingKey,
}: {
  videos?: VideoCarouselItem[];
  heading?: string;
  headingKey?: string;
}) {
  const t = useTranslations("accelerate.homepage.video");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [modalVideo, setModalVideo] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const resolvedHeading = headingKey
    ? t(headingKey)
    : (heading ?? t("heading"));

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = direction === "left" ? -540 : 540;
    el.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <>
      <section className="relative overflow-hidden bg-black py-10 lg:py-16">
        <div className="pointer-events-none absolute inset-0 opacity-25">
          <Image
            src={getImagePath("/images/homepage/acc-hero-bg.webp")}
            alt=""
            fill
            className="object-cover"
          />
        </div>
        {/* Divider line */}
        <div className="relative z-10 mx-auto max-w-[1480px] px-6">
          <div className="relative mb-10 lg:mb-14">
            <div className="h-px bg-white/10" />
            <div className="absolute left-0 top-0 h-px w-1/3 bg-accelerate-green/30" />
          </div>
        </div>

        <div className="relative z-10 mx-auto max-w-[1480px] px-6">
          {/* Header row */}
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-[25px] font-light uppercase leading-none tracking-[1.25px] text-accelerate-gray-100 md:text-[32px] lg:text-[40px]">
              {resolvedHeading}
            </h3>

            {/* Circular navigation arrows */}
            <div className="flex items-center gap-3">
              <ArrowButton direction="left" onClick={() => scroll("left")} />
              <ArrowButton direction="right" onClick={() => scroll("right")} />
            </div>
          </div>

          {/* Video thumbnails */}
          <div
            ref={scrollRef}
            className="scrollbar-hide flex snap-x gap-3 overflow-x-auto pb-4"
          >
            {videos.map((video) => {
              const title = video.translationKey
                ? t(video.translationKey)
                : (video.title ?? "");

              return (
                <div
                  key={video.id}
                  className="w-[300px] flex-shrink-0 snap-start md:w-[400px] lg:w-[524px]"
                >
                  <div
                    className="group relative aspect-[524/295] cursor-pointer overflow-hidden bg-white/5"
                    onClick={() => setModalVideo({ id: video.id, title })}
                  >
                    <Image
                      src={
                        video.thumbnail ??
                        getImagePath(`/images/homepage/videos/${video.id}.jpg`)
                      }
                      alt={title}
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
              );
            })}
          </div>
        </div>
      </section>

      {/* Video modal */}
      <AnimatePresence>
        {modalVideo && (
          <VideoModal
            videoId={modalVideo.id}
            title={modalVideo.title}
            closeLabel={t("closeVideo")}
            onClose={() => setModalVideo(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
