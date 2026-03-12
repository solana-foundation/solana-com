"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const getYoutubeEmbedUrl = (id: string) => {
  const params = new URLSearchParams({
    rel: "0",
    modestbranding: "1",
    autoplay: "1",
    mute: "1",
  });
  return `https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`;
};

const getYoutubeThumbnailUrl = (id: string) => {
  return `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
};

interface YoutubeEmbedProps {
  id: string;
  title?: string;
  className?: string;
}

export function YoutubeEmbed({ id, title, className }: YoutubeEmbedProps) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className={`relative ${className ?? ""}`}>
      {/* Atmospheric glow behind the video frame */}
      <div
        className="pointer-events-none absolute -inset-6 z-0 opacity-60 blur-2xl"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(153, 69, 255, 0.4) 0%, rgba(25, 251, 155, 0.15) 50%, transparent 80%)",
        }}
      />

      {/* Gradient border wrapper */}
      <div
        className="relative z-10 overflow-hidden rounded-xl p-[1.5px]"
        style={{
          background:
            "linear-gradient(135deg, #9945FF 0%, #2A88DE 40%, #19FB9B 100%)",
        }}
      >
        {/* Inner container */}
        <div className="relative w-full overflow-hidden rounded-[10px] bg-black">
          <AnimatePresence mode="wait">
            {!playing ? (
              <motion.div
                key="thumbnail"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="relative aspect-[16/9] w-full cursor-pointer group"
                onClick={() => setPlaying(true)}
              >
                <Image
                  src={getYoutubeThumbnailUrl(id)}
                  alt={title || "YouTube video"}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 900px"
                  quality={90}
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                />

                {/* Vignette overlay */}
                <div
                  className="absolute inset-0 transition-opacity duration-300 group-hover:opacity-60"
                  style={{
                    background:
                      "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 100%)",
                  }}
                />

                {/* Bottom gradient fade */}
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />

                {/* Play button — centered */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    className="flex h-[72px] w-[72px] items-center justify-center rounded-full"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(153, 69, 255, 0.85) 0%, rgba(25, 251, 155, 0.85) 100%)",
                      boxShadow:
                        "0 0 40px rgba(153, 69, 255, 0.4), 0 0 80px rgba(25, 251, 155, 0.2)",
                    }}
                    whileHover={{ scale: 1.12 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  >
                    <svg
                      width="22"
                      height="26"
                      viewBox="0 0 22 26"
                      fill="none"
                      className="ml-0.5"
                    >
                      <path d="M22 13L0 26V0L22 13Z" fill="white" />
                    </svg>
                  </motion.div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="iframe"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="relative aspect-[16/9] w-full"
              >
                <iframe
                  src={getYoutubeEmbedUrl(id)}
                  title={title || "YouTube video"}
                  className="absolute inset-0 h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
