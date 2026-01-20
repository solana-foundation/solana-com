"use client";

import { motion } from "framer-motion";
import Image from "next/image";

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

export function Hero() {
  return (
    <section className="relative min-h-[80vh] overflow-hidden bg-accelerate-dark">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-accelerate-dark/50 via-accelerate-dark/70 to-accelerate-dark" />
        {/* Animated gradient lines */}
        <div className="absolute inset-0 overflow-hidden">
          <svg
            className="absolute left-0 top-1/4 h-[200px] w-full opacity-60"
            viewBox="0 0 1440 200"
            fill="none"
            preserveAspectRatio="none"
          >
            <path
              d="M0 100 Q 360 20, 720 100 T 1440 100"
              stroke="url(#gradient1)"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M0 120 Q 360 40, 720 120 T 1440 120"
              stroke="url(#gradient2)"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M0 140 Q 360 60, 720 140 T 1440 140"
              stroke="url(#gradient3)"
              strokeWidth="2"
              fill="none"
            />
            <defs>
              <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#9945FF" />
                <stop offset="50%" stopColor="#14F195" />
                <stop offset="100%" stopColor="#00D4FF" />
              </linearGradient>
              <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#14F195" />
                <stop offset="50%" stopColor="#00D4FF" />
                <stop offset="100%" stopColor="#9945FF" />
              </linearGradient>
              <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00D4FF" />
                <stop offset="50%" stopColor="#9945FF" />
                <stop offset="100%" stopColor="#14F195" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      <div className="container-accelerate relative z-10 flex min-h-[80vh] flex-col items-center justify-center py-20 text-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="max-w-4xl"
        >
          {/* Logo */}
          <motion.div variants={fadeInUp} className="mb-8">
            <Image
              src="/images/accelerate-logo.svg"
              alt="Accelerate"
              width={200}
              height={50}
              className="mx-auto"
              priority
            />
          </motion.div>

          {/* Location badge */}
          <motion.div
            variants={fadeInUp}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm text-white/80"
          >
            <span className="text-accelerate-green">●</span>
            Hong Kong
          </motion.div>

          {/* Main heading */}
          <motion.h1 variants={fadeInUp} className="heading-xl mb-6 text-white">
            Solana Accelerate <span className="gradient-text">APAC</span>
          </motion.h1>

          {/* Navigation links */}
          <motion.nav
            variants={fadeInUp}
            className="mb-12 flex flex-wrap items-center justify-center gap-6 text-sm text-white/60"
          >
            <a
              href="#event-details"
              className="transition-colors hover:text-white"
            >
              Event details
            </a>
            <span className="text-white/20">|</span>
            <a href="#tickets" className="transition-colors hover:text-white">
              Tickets
            </a>
            <span className="text-white/20">|</span>
            <a href="#speakers" className="transition-colors hover:text-white">
              Speakers
            </a>
            <span className="text-white/20">|</span>
            <a href="#sponsors" className="transition-colors hover:text-white">
              Sponsors
            </a>
            <span className="text-white/20">|</span>
            <a href="#faq" className="transition-colors hover:text-white">
              FAQ
            </a>
          </motion.nav>
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-accelerate-dark to-transparent" />
    </section>
  );
}
