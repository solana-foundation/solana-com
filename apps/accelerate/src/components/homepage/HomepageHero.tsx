"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { getImagePath } from "@/config";

export function HomepageHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();

  // Responsive breakpoint values for the logo animation path.
  // Stored in a ref so the useTransform mapper always reads latest values.
  const dims = useRef({
    heroTop: 196,
    heroLeft: 260,
    heroHeight: 276,
    navTop: 33,
    navLeft: 60,
    navHeight: 80,
    scrollEnd: 300,
  });

  useEffect(() => {
    function update() {
      const lg = window.innerWidth >= 1024;
      const md = window.innerWidth >= 768;
      dims.current = {
        heroTop: lg ? 196 : md ? 150 : 100,
        heroLeft: lg ? 260 : 24,
        heroHeight: lg ? 276 : md ? 200 : 140,
        navTop: lg ? 33 : 16,
        navLeft: lg ? 60 : 24,
        navHeight: lg ? 80 : md ? 50 : 40,
        scrollEnd: lg ? 300 : 200,
      };
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  function ease(t: number) {
    return 1 - Math.pow(1 - t, 3);
  }
  function progress(v: number) {
    return ease(Math.min(Math.max(v / dims.current.scrollEnd, 0), 1));
  }
  function lerp(a: number, b: number, t: number) {
    return a + (b - a) * t;
  }

  const logoTop = useTransform(scrollY, (v) =>
    lerp(dims.current.heroTop, dims.current.navTop, progress(v)),
  );
  const logoLeft = useTransform(scrollY, (v) =>
    lerp(dims.current.heroLeft, dims.current.navLeft, progress(v)),
  );
  const logoHeight = useTransform(scrollY, (v) =>
    lerp(dims.current.heroHeight, dims.current.navHeight, progress(v)),
  );

  return (
    <section
      ref={sectionRef}
      className="relative z-[1] h-[600px] w-full overflow-hidden bg-black md:h-[800px] lg:h-[1000px]"
    >
      {/* Globe video background - sized down and offset right */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute left-[400px] top-1/2 h-[80%] w-[80%] -translate-y-1/2">
          {/* Placeholder image shown while video loads */}
          <Image
            src={getImagePath("/images/globe-bg.webp")}
            alt=""
            fill
            className="object-contain"
            priority
          />
          {/* Globe video */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 h-full w-full object-contain"
            controlsList="nodownload"
            poster={getImagePath("/images/globe-bg.webp")}
          >
            <source
              src={getImagePath("/video/globe-export.mp4")}
              type="video/mp4"
            />
          </video>
        </div>
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

      {/* Scroll-driven logo — shrinks from hero size toward the header slot */}
      <motion.div
        className="pointer-events-none absolute z-10"
        style={{ top: logoTop, left: logoLeft }}
      >
        <motion.img
          src={getImagePath("/images/solana-accelerate-logo.svg")}
          alt="Solana Accelerate"
          style={{ height: logoHeight, width: "auto" }}
        />
      </motion.div>

      {/* Main content */}
      <div className="relative z-10 mx-auto max-w-[1920px] px-6 lg:px-[60px]">
        {/* Logo spacer — reserves the space where the logo starts */}
        <div className="pt-[100px] md:pt-[150px] lg:ml-[200px] lg:pt-[196px]">
          <div className="h-[140px] md:h-[200px] lg:h-[276px]" />
        </div>

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
