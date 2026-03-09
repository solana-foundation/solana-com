"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { getImagePath } from "@/config";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

export function HomepageHero() {
  return (
    <section className="relative h-[600px] w-full overflow-hidden bg-black md:h-[800px] lg:h-[1000px]">
      {/* Globe video background - centered, full hero coverage */}
      <div className="pointer-events-none absolute inset-0 z-0 flex items-start justify-center">
        {/* Placeholder image shown while video loads */}
        <Image
          src={getImagePath("/images/globe-bg.webp")}
          alt=""
          fill
          className="object-cover"
          priority
        />
        {/* Globe video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
          controlsList="nodownload"
          poster={getImagePath("/images/globe-bg.webp")}
        >
          <source
            src={getImagePath("/video/globe-export.mp4")}
            type="video/mp4"
          />
        </video>
      </div>

      {/* Left edge fade */}
      <div
        className="pointer-events-none absolute left-0 top-0 z-[2] h-full w-[250px] lg:w-[473px]"
        style={{
          background:
            "linear-gradient(to right, black 15.35%, rgba(0,0,0,0) 73.26%)",
        }}
      />

      {/* Right edge fade */}
      <div
        className="pointer-events-none absolute right-0 top-0 z-[2] h-full w-[250px] lg:w-[473px]"
        style={{
          background:
            "linear-gradient(to left, black 15.35%, rgba(0,0,0,0) 73.26%)",
        }}
      />

      {/* Bottom fade */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 z-[2] h-[165px] w-full"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0) 15.35%, black 73.26%)",
        }}
      />

      {/* Aurora wave lines decoration */}
      <div className="pointer-events-none absolute left-[-181px] top-[735px] z-[3] hidden h-[978px] w-[2219px] lg:block">
        <Image
          src={getImagePath("/images/wave-lines.svg")}
          alt=""
          fill
          className="object-contain"
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 mx-auto max-w-[1920px] px-6 lg:px-[60px]">
        {/* Accelerate Logo - positioned to match Figma left:395px */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="pt-[100px] md:pt-[150px] lg:ml-[335px] lg:pt-[196px]"
        >
          <motion.div variants={fadeInUp} className="flex flex-col">
            {/* Solana mark + text - matches Figma logo component top portion */}
            <div className="mb-1 flex items-center gap-1.5">
              <Image
                src={getImagePath("/images/solana-logo.svg")}
                alt=""
                width={16}
                height={14}
                className="h-[10px] w-auto md:h-[12px] lg:h-[14px]"
              />
              <span
                className="text-[10px] font-normal uppercase tracking-[1.5px] text-white md:text-[12px] lg:text-[14px]"
                style={{
                  fontFamily:
                    "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
                }}
              >
                Solana
              </span>
            </div>
            <Image
              src={getImagePath("/images/accelerate-logo.svg")}
              alt="Solana Accelerate"
              width={488}
              height={276}
              className="h-[120px] w-auto md:h-[180px] lg:h-[240px]"
              priority
            />
          </motion.div>
        </motion.div>

        {/* Next Event card - positioned right */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="absolute right-6 top-[300px] z-10 w-[320px] md:right-[60px] md:top-[400px] md:w-[420px] lg:right-[220px] lg:top-[520px] lg:w-[500px]"
        >
          {/* "NEXT EVENT" label */}
          <p
            className="mb-6 text-right font-normal uppercase tracking-[0.8px] text-white"
            style={{
              fontFamily:
                "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
              fontSize: "16px",
            }}
          >
            Next Event
          </p>

          {/* Card container */}
          <div
            className="rounded-xl border border-[#3d3d3d] px-5 py-8"
            style={{ background: "rgba(0, 0, 0, 0.6)" }}
          >
            <div className="flex items-center justify-between">
              {/* Left: City + Date */}
              <div className="flex flex-col gap-1">
                <p
                  className="text-xl font-light uppercase tracking-[1.4px] text-[#d2d2d2] md:text-2xl lg:text-[28px]"
                  style={{
                    fontFamily:
                      "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
                    lineHeight: 1,
                  }}
                >
                  Miami
                </p>
                <p
                  className="text-lg text-[#19fb9b] md:text-xl lg:text-[24px]"
                  style={{
                    fontFamily: "'ABC Diatype', sans-serif",
                    lineHeight: 1.2,
                  }}
                >
                  May 5
                </p>
              </div>

              {/* Right: GET TICKETS CTA */}
              <a
                href="https://lu.ma/accelerate-miami"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-[160px] items-center justify-between rounded-[32px] px-5 py-5 text-black md:w-[200px] md:px-7 lg:w-[240px]"
                style={{
                  background: "linear-gradient(to right, #9945FF, #19FB9B)",
                }}
              >
                <span
                  className="text-sm font-semibold uppercase tracking-[0.9px] md:text-[18px]"
                  style={{
                    fontFamily:
                      "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
                    lineHeight: 1,
                  }}
                >
                  GET TICKETS
                </span>
                <svg width="12" height="12" viewBox="0 0 11 11" fill="none">
                  <path
                    d="M2 9L9 2M9 2H4M9 2V7"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </div>
          </div>

          {/* Learn More link */}
          <div className="mt-6 flex items-center justify-end gap-3">
            <a
              href="https://lu.ma/accelerate-miami"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 font-normal uppercase tracking-[0.8px] text-white transition-colors hover:text-white/80"
              style={{
                fontFamily:
                  "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
                fontSize: "16px",
                lineHeight: 1,
              }}
            >
              Learn More
              <Image
                src={getImagePath("/images/homepage/circle-plus.svg")}
                alt=""
                width={24}
                height={24}
              />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
