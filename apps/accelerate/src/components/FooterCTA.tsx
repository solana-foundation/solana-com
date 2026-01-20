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
    <section className="relative overflow-hidden bg-accelerate-dark py-24">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="text-[20rem] font-bold leading-none text-white/5"
            style={{
              fontFamily: "system-ui, sans-serif",
              letterSpacing: "-0.05em",
            }}
          >
            香港
          </span>
        </div>
      </div>

      <div className="container-accelerate relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
          className="text-center"
        >
          <motion.p variants={fadeInUp} className="mb-4 text-lg text-white/60">
            Don&apos;t miss
          </motion.p>
          <motion.h2 variants={fadeInUp} className="heading-xl mb-8 text-white">
            SOLANA <span className="gradient-text">ACCELERATE</span>
          </motion.h2>

          <motion.div variants={fadeInUp}>
            <a
              href="#tickets"
              className="btn-gradient inline-flex items-center gap-2 text-lg"
            >
              <span>Limited Tickets Available</span>
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </a>
          </motion.div>

          <motion.p variants={fadeInUp} className="mt-8 text-sm text-white/40">
            February 19, 2025 • Hong Kong Convention and Exhibition Centre
          </motion.p>
        </motion.div>
      </div>

      {/* Bottom gradient wave decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          className="h-24 w-full"
          viewBox="0 0 1440 96"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            d="M0 96V48C240 16 480 0 720 16C960 32 1200 80 1440 48V96H0Z"
            fill="url(#footerGradient)"
            fillOpacity="0.1"
          />
          <defs>
            <linearGradient id="footerGradient" x1="0" y1="0" x2="1440" y2="0">
              <stop offset="0%" stopColor="#9945FF" />
              <stop offset="50%" stopColor="#14F195" />
              <stop offset="100%" stopColor="#00D4FF" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </section>
  );
}
