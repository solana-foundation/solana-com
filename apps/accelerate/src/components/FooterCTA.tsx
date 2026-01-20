"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { LumaModal } from "./LumaModal";

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

export function FooterCTA() {
  return (
    <section className="relative overflow-hidden bg-black py-24 lg:py-32">
      {/* Hong Kong Chinese characters background image from Figma */}
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-[823px] w-[1464px] -translate-x-1/2">
        <Image
          src="/images/hk-characters.png"
          alt=""
          fill
          className="object-contain opacity-[0.08]"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-[1440px] px-6 lg:px-[60px]">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
          className="text-center"
        >
          {/* "Don't miss" subtitle */}
          <motion.p
            variants={fadeInUp}
            className="text-hero mb-4 text-white/60"
            style={{
              fontFamily: "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
            }}
          >
            Don&apos;t miss
          </motion.p>

          {/* "SOLANA ACCELERATE" heading with gradient */}
          <motion.h2
            variants={fadeInUp}
            className="text-hero mb-10"
            style={{
              fontFamily: "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
            }}
          >
            <span className="text-white">SOLANA </span>
            <span className="gradient-text">ACCELERATE</span>
          </motion.h2>

          {/* CTA Button */}
          <motion.div variants={fadeInUp} className="mb-8">
            <LumaModal lumaId="sol-accelerate-hk">
              <button
                className="group inline-flex h-[66px] items-center justify-between rounded-[32px] px-7 text-black transition-all hover:opacity-90"
                style={{
                  background: "linear-gradient(to right, #9945FF, #19FB9B)",
                  width: "480px",
                  maxWidth: "90vw",
                }}
              >
                <span
                  className="flex-1 text-left uppercase"
                  style={{
                    fontFamily: "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
                    fontWeight: 600,
                    fontSize: "18px",
                    letterSpacing: "0.9px",
                  }}
                >
                  Get Tickets
                </span>
                {/* Grid icon (4 squares) */}
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  className="shrink-0"
                >
                  <rect x="0" y="0" width="8" height="8" fill="black" />
                  <rect x="10" y="0" width="8" height="8" fill="black" />
                  <rect x="0" y="10" width="8" height="8" fill="black" />
                  <rect x="10" y="10" width="8" height="8" fill="black" />
                </svg>
              </button>
            </LumaModal>
          </motion.div>

          {/* "Limited tickets available" text */}
          <motion.p
            variants={fadeInUp}
            className="text-h2 text-white"
            style={{
              fontFamily: "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
            }}
          >
            Limited tickets available
          </motion.p>
        </motion.div>
      </div>

      {/* Bottom copyright */}
      <div className="relative z-10 mt-20 text-center">
        <p className="text-sm text-white/30">© Solana Foundation 2026</p>
      </div>
    </section>
  );
}
