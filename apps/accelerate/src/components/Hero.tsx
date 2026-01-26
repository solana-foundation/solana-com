"use client";

import { motion } from "framer-motion";
import Link from "next/link";
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

export function Hero() {
  return (
    <section className="relative h-[600px] md:h-[750px] lg:h-[932px] w-full overflow-hidden bg-black">
      {/* Purple/Magenta gradient glow on left */}
      <div className="pointer-events-none absolute -left-[100px] top-0 h-full w-[800px]">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 30% 50%, rgba(153, 69, 255, 0.6) 0%, rgba(137, 58, 233, 0.4) 30%, rgba(100, 40, 180, 0.2) 50%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
      </div>

      {/* Hong Kong Skyline - centered, flipped (z-1: bottom layer) */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 z-[1] h-[600px] md:h-[750px] lg:h-[932px] w-[1187px] -translate-x-1/2"
        style={{ transform: "translateX(-50%) scaleY(-1) rotate(180deg)" }}
      >
        <Image
          src="/images/hk-skyline.svg"
          alt=""
          fill
          className="object-contain"
          priority
        />
      </div>

      {/* Dots pattern (z-2: between skyline and wave) */}
      <div className="pointer-events-none absolute bottom-0 right-0 z-[2] h-[200px] md:h-[250px] lg:h-[322px] w-full">
        <Image
          src="/images/dots.svg"
          alt=""
          fill
          className="object-cover object-right-bottom"
        />
      </div>

      {/* Wave lines - Footer Element (z-3: top decorative layer) */}
      <div className="pointer-events-none absolute left-0 top-[250px] md:top-[320px] lg:top-[406px] z-[3] h-[350px] md:h-[430px] lg:h-[526px] w-full">
        <Image
          src="/images/wave-lines.svg"
          alt=""
          fill
          className="object-cover"
        />
      </div>

      {/* Pills Left */}
      <div
        className="pointer-events-none absolute hidden lg:block"
        style={{ left: "-62px", top: "186px", width: "433px", height: "191px" }}
      >
        <Image src="/images/pills-left.svg" alt="" width={433} height={191} />
      </div>

      {/* Pills Right - rotated 180deg */}
      <div
        className="pointer-events-none absolute hidden lg:block"
        style={{
          left: "calc(100% - 419px)",
          top: "261px",
          width: "359px",
          height: "116px",
          transform: "rotate(180deg)",
        }}
      >
        <Image src="/images/pills-right.svg" alt="" width={359} height={116} />
      </div>

      {/* Header Navigation */}
      <header className="relative z-20 flex items-center justify-between px-6 py-5 lg:px-[240px] lg:py-5">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/images/accelerate-logo.svg"
            alt="Accelerate APAC"
            width={197}
            height={100}
            className="h-[60px] w-auto lg:h-[100px]"
            priority
          />
        </Link>

        {/* Navigation */}
        <nav className="hidden items-center gap-[38px] md:flex">
          <a
            href="#speakers"
            className="font-semibold uppercase tracking-[0.05em] text-white transition-colors hover:text-white/80"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "16px",
            }}
          >
            Speakers
          </a>
          <a
            href="#sponsors"
            className="font-semibold uppercase tracking-[0.05em] text-white transition-colors hover:text-white/80"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "16px",
            }}
          >
            Sponsors
          </a>
          <a
            href="#faq"
            className="font-semibold uppercase tracking-[0.05em] text-white transition-colors hover:text-white/80"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "16px",
            }}
          >
            FAQ
          </a>
          <LumaModal lumaId="sol-accelerate-hk">
            <button
              className="relative inline-flex items-center justify-between rounded-full bg-transparent px-7 py-4 font-semibold uppercase tracking-[0.05em] text-white transition-colors hover:bg-white/5"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "16px",
                minWidth: "186px",
                background:
                  "linear-gradient(black, black) padding-box, linear-gradient(to right, #9945FF, #19FB9B) border-box",
                border: "1px solid transparent",
              }}
            >
              <span>Request to Join</span>
              <svg
                width="8"
                height="8"
                viewBox="0 0 11 11"
                fill="none"
                className="ml-2"
              >
                <path
                  d="M2 9L9 2M9 2H4M9 2V7"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </LumaModal>
        </nav>

        {/* Mobile menu button */}
        <button className="flex h-10 w-10 items-center justify-center text-white md:hidden">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </header>

      {/* Main Content - positioned at center */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="flex flex-col items-center gap-10"
        >
          {/* Date/Location and Main Heading */}
          <div className="flex flex-col items-center gap-5">
            <motion.p
              variants={fadeInUp}
              className="text-xl md:text-2xl lg:text-[32px]"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 400,
                lineHeight: 1.1,
                color: "#19FB9B",
              }}
            >
              February 11 / Hong Kong
            </motion.p>

            <motion.h1
              variants={fadeInUp}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-[84px]"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 300,
                lineHeight: 1,
                color: "#D2D2D2",
              }}
            >
              Solana Accelerate APAC
            </motion.h1>
          </div>

          {/* CTA Button */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-col items-center gap-4"
          >
            <LumaModal lumaId="sol-accelerate-hk">
              <button
                className="group inline-flex h-[66px] items-center justify-center rounded-[32px] px-7 py-6 text-black transition-all hover:opacity-90"
                style={{
                  background: "linear-gradient(to right, #9945FF, #19FB9B)",
                  width: "480px",
                  maxWidth: "90vw",
                }}
              >
                <span
                  className="uppercase"
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 600,
                    fontSize: "18px",
                    letterSpacing: "0.9px",
                  }}
                >
                  Request to Join
                </span>
                <Image
                  src="/images/ticket-icon.svg"
                  alt="Ticket icon"
                  width={18}
                  height={12}
                  className="ml-2"
                />
              </button>
            </LumaModal>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
