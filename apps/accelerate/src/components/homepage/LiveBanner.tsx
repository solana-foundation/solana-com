"use client";

import { motion } from "framer-motion";

const MARQUEE_ITEMS = Array(8).fill(null);

export function LiveBanner() {
  return (
    <section
      className="relative z-20 overflow-hidden py-3"
      style={{
        background: "linear-gradient(to right, #9945FF, #19FB9B)",
      }}
    >
      <div className="flex">
        <motion.div
          className="flex shrink-0 items-center gap-6"
          animate={{ x: [0, "-50%"] }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 20,
              ease: "linear",
            },
          }}
        >
          {MARQUEE_ITEMS.map((_, i) => (
            <div key={i} className="flex shrink-0 items-center gap-6">
              <span className="flex items-center gap-1.5">
                <span className="text-[18px] font-semibold uppercase tracking-[0.9px] text-black">
                  LIVE
                </span>
                <span className="relative flex h-[10px] w-[10px]">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accelerate-green opacity-60" />
                  <span className="relative inline-flex h-[10px] w-[10px] rounded-full bg-accelerate-green" />
                </span>
              </span>
              <span className="font-diatype text-[16px] font-light tracking-[0.8px] text-black">
                Join Solana Accelerate Hong Kong streaming
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
