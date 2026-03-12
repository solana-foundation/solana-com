"use client";

import { useRef, useEffect, useLayoutEffect } from "react";
import Image from "next/image";
import { Link } from "@workspace/i18n/routing";

const useBrowserLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import { getImagePath } from "@/config";
import { LumaModal } from "@/components/LumaModal";

export function HomepageHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();

  // Responsive breakpoint values for the logo animation path.
  // Stored in a ref so the resize handler and scroll handler share state.
  // Defaults to mobile values so SSR / first-paint is correct on small screens.
  const dims = useRef({
    heroTop: 113,
    heroLeft: 48,
    heroHeight: 124,
    navTop: 16,
    navLeft: 24,
    navHeight: 40,
    scrollEnd: 200,
  });

  function ease(t: number) {
    return 1 - Math.pow(1 - t, 3);
  }
  function progress(v: number) {
    return ease(Math.min(Math.max(v / dims.current.scrollEnd, 0), 1));
  }
  function lerp(a: number, b: number, t: number) {
    return a + (b - a) * t;
  }

  // Explicit MotionValues so we can imperatively set them on both scroll
  // *and* resize — useTransform only re-evaluates when scrollY changes,
  // which left desktop showing mobile dims until the first scroll.
  const logoTop = useMotionValue(dims.current.heroTop);
  const logoLeft = useMotionValue(dims.current.heroLeft);
  const logoHeight = useMotionValue(dims.current.heroHeight);

  function recalc(sv: number) {
    const p = progress(sv);
    logoTop.set(lerp(dims.current.heroTop, dims.current.navTop, p));
    logoLeft.set(lerp(dims.current.heroLeft, dims.current.navLeft, p));
    logoHeight.set(lerp(dims.current.heroHeight, dims.current.navHeight, p));
  }

  // Re-derive on every scroll tick.
  useMotionValueEvent(scrollY, "change", recalc);

  // On mount + resize: update breakpoint dims, then immediately recalc so
  // the logo snaps to the right position for the viewport width.
  // useLayoutEffect ensures this runs before the browser paints, preventing
  // a flash of the mobile-default position on desktop screens.
  useBrowserLayoutEffect(() => {
    function update() {
      const xl = window.innerWidth >= 1536;
      const lg = window.innerWidth >= 1024;
      const md = window.innerWidth >= 768;
      dims.current = {
        heroTop: lg ? 196 : md ? 150 : 113,
        heroLeft: xl ? 395 : lg ? 260 : 48,
        heroHeight: xl ? 276 : lg ? 220 : md ? 200 : 124,
        navTop: lg ? 33 : 16,
        navLeft: lg ? 60 : 24,
        navHeight: lg ? 80 : md ? 50 : 40,
        scrollEnd: xl ? 300 : lg ? 240 : 200,
      };
      recalc(scrollY.get());
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section
      ref={sectionRef}
      className="relative z-[1] h-[600px] w-full bg-black md:h-[800px] lg:h-[1000px]"
    >
      {/* Globe video background */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute left-[-40%] top-[15%] h-[85%] w-[230%] md:left-[400px] md:top-1/2 md:h-[80%] md:w-[80%] md:-translate-y-1/2">
          {/* Placeholder image shown while video loads */}
          <Image
            src={getImagePath("/images/globe-bg.webp")}
            alt=""
            fill
            className="object-cover object-top"
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
      </div>

      {/* Left edge fade */}
      <div
        className="pointer-events-none absolute left-0 top-0 z-[2] h-full w-[100px] md:w-[250px] lg:w-[473px]"
        style={{
          background:
            "linear-gradient(to right, black 15.35%, rgba(0,0,0,0) 73.26%)",
        }}
      />

      {/* Right edge fade */}
      <div
        className="pointer-events-none absolute right-0 top-0 z-[2] h-full w-[100px] md:w-[250px] lg:w-[473px]"
        style={{
          background:
            "linear-gradient(to left, black 15.35%, rgba(0,0,0,0) 73.26%)",
        }}
      />

      {/* Bottom fade — tall multi-stop gradient for a smooth video blend */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 z-[2] h-[50%] w-full"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.15) 30%, rgba(0,0,0,0.5) 55%, rgba(0,0,0,0.85) 75%, black 100%)",
        }}
      />

      {/* Scroll-driven logo — shrinks from hero size toward the header slot */}
      <motion.div
        className="pointer-events-none absolute z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
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
        <div className="pt-[113px] md:pt-[150px] lg:ml-[200px] lg:pt-[196px] 2xl:ml-[335px]">
          <div className="h-[124px] md:h-[200px] lg:h-[276px]" />
        </div>

        {/* Next Event card - positioned right */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="absolute left-[37px] top-[501px] z-10 w-[316px] md:left-auto md:right-[60px] md:top-[400px] md:w-[420px] lg:right-[220px] lg:top-[520px] lg:w-[500px]"
        >
          {/* "NEXT EVENT" label */}
          <p className="mb-5 text-right text-[16px] font-normal uppercase tracking-[0.8px] text-white">
            Next Event
          </p>

          {/* Card container */}
          <div
            className="rounded-lg border border-accelerate-gray-dark p-6"
            style={{ background: "rgba(0, 0, 0, 0.6)" }}
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              {/* City + Date */}
              <div className="flex flex-col gap-[2.5px]">
                <p className="text-[25px] font-light uppercase leading-none tracking-[1.25px] text-accelerate-gray-light md:text-2xl lg:text-[28px]">
                  Miami
                </p>
                <p className="font-diatype text-[22px] leading-[1.2] text-accelerate-green md:text-xl lg:text-[24px]">
                  May 5
                </p>
              </div>

              {/* GET TICKETS CTA */}
              <LumaModal lumaId="accelerate-miami">
                <button className="btn-cta h-[48px] w-full justify-between px-5 md:w-[200px] md:px-7 lg:w-[240px]">
                  <span className="text-[13.43px] font-semibold uppercase tracking-[0.67px] leading-none md:text-[18px]">
                    Request to Join
                  </span>
                  <svg width="9" height="9" viewBox="0 0 11 11" fill="none">
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
            </div>
          </div>

          {/* Learn More link */}
          <div className="mt-5 flex items-center justify-end gap-3">
            <Link
              href="/accelerate/miami"
              className="inline-flex items-center gap-3 text-[16px] font-normal uppercase tracking-[0.8px] leading-none text-white transition-colors hover:text-white/80"
            >
              Learn More
              <Image
                src={getImagePath("/images/homepage/circle-plus.svg")}
                alt=""
                width={24}
                height={24}
              />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
