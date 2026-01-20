"use client";

import { motion } from "framer-motion";

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
      {/* Large Chinese characters background */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
        <span
          className="select-none text-[20rem] font-bold leading-none text-white/[0.03] md:text-[30rem] lg:text-[40rem]"
          style={{
            fontFamily: "system-ui, sans-serif",
          }}
        >
          香港
        </span>
      </div>

      <div className="relative z-10 mx-auto max-w-[1440px] px-6 lg:px-[60px]">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
          className="text-center"
        >
          <motion.p
            variants={fadeInUp}
            className="mb-4 text-lg text-white/60"
          >
            Don&apos;t miss
          </motion.p>

          <motion.h2
            variants={fadeInUp}
            className="mb-10 text-4xl font-bold md:text-5xl lg:text-6xl"
          >
            <span className="text-white">SOLANA </span>
            <span
              className="bg-gradient-to-r from-[#9945FF] via-[#14F195] to-[#00D4FF] bg-clip-text text-transparent"
            >
              ACCELERATE
            </span>
          </motion.h2>

          <motion.div variants={fadeInUp}>
            <a
              href="#tickets"
              className="group inline-flex items-center gap-3 rounded-full border border-white/20 bg-transparent px-8 py-4 text-base font-medium text-white transition-all hover:border-white/40 hover:bg-white/5"
            >
              <span>Limited Tickets Available</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className="transition-transform group-hover:translate-x-1"
              >
                <path
                  d="M3 8H13M13 8L8 3M13 8L8 13"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom copyright */}
      <div className="relative z-10 mt-20 text-center">
        <p className="text-sm text-white/30">
          © Solana Foundation 2026
        </p>
      </div>
    </section>
  );
}
