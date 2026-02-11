"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@workspace/i18n/routing";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { LumaModal } from "./LumaModal";
import { YoutubeEmbed } from "./YoutubeEmbed";
import { LanguageSelector } from "@solana-com/ui-chrome";
import { getImagePath } from "@/config";

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

const navLinkStyle = {
  fontFamily: "'Space Grotesk', sans-serif",
  fontSize: "16px",
};

export function Hero() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = useTranslations("accelerate");

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

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
          src={getImagePath("/images/hk-skyline.svg")}
          alt=""
          fill
          className="object-contain"
          priority
        />
      </div>

      {/* Dots pattern (z-2: between skyline and wave) */}
      <div className="pointer-events-none absolute bottom-0 right-0 z-[2] h-[200px] md:h-[250px] lg:h-[322px] w-full">
        <Image
          src={getImagePath("/images/dots.svg")}
          alt=""
          fill
          className="object-cover object-right-bottom"
        />
      </div>

      {/* Wave lines - Footer Element (z-3: top decorative layer) */}
      <div className="pointer-events-none absolute left-0 top-[250px] md:top-[320px] lg:top-[406px] z-[3] h-[350px] md:h-[430px] lg:h-[526px] w-full">
        <Image
          src={getImagePath("/images/wave-lines.svg")}
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
        <Image
          src={getImagePath("/images/pills-left.svg")}
          alt=""
          width={433}
          height={191}
        />
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
        <Image
          src={getImagePath("/images/pills-right.svg")}
          alt=""
          width={359}
          height={116}
        />
      </div>

      {/* Header Navigation */}
      <header className="relative z-20 flex items-center justify-between px-6 py-5 lg:px-[240px] lg:py-5">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src={getImagePath("/images/accelerate-logo.svg")}
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
            {t("nav.speakers")}
          </a>
          <Link
            href="/accelerate/agenda"
            className="font-semibold uppercase tracking-[0.05em] text-white transition-colors hover:text-white/80"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "16px",
            }}
          >
            {t("nav.agenda")}
          </Link>
          <a
            href="#sponsors"
            className="font-semibold uppercase tracking-[0.05em] text-white transition-colors hover:text-white/80"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "16px",
            }}
          >
            {t("nav.sponsors")}
          </a>
          <a
            href="#faq"
            className="font-semibold uppercase tracking-[0.05em] text-white transition-colors hover:text-white/80"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "16px",
            }}
          >
            {t("nav.faq")}
          </a>
          <LanguageSelector className="!text-white/60 hover:!text-white" />
          <LumaModal lumaId="sol-accelerate-hk">
            <button
              className="relative inline-flex items-center justify-center rounded-full bg-transparent px-7 py-4 font-semibold uppercase tracking-[0.05em] text-white transition-colors hover:bg-white/5"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "16px",
                minWidth: "186px",
                background:
                  "linear-gradient(black, black) padding-box, linear-gradient(to right, #9945FF, #19FB9B) border-box",
                border: "1px solid transparent",
              }}
            >
              <span>{t("nav.requestToJoin")}</span>
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
        <button
          type="button"
          aria-label={mobileMenuOpen ? t("nav.closeMenu") : t("nav.openMenu")}
          aria-expanded={mobileMenuOpen}
          className="flex h-10 w-10 items-center justify-center text-white md:hidden"
          onClick={() => setMobileMenuOpen(true)}
        >
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

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div key="mobile-menu" className="fixed inset-0 z-30 md:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              aria-hidden="true"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "tween", duration: 0.25 }}
              className="absolute right-0 top-0 z-40 flex h-full w-full max-w-[320px] flex-col bg-[#0D0D0D] px-6 py-5"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-white/60">
                  {t("nav.menu")}
                </span>
                <button
                  type="button"
                  aria-label={t("nav.closeMenu")}
                  className="flex h-10 w-10 items-center justify-center text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <nav className="mt-8 flex flex-col gap-6">
                <a
                  href="#speakers"
                  className="font-semibold uppercase tracking-[0.05em] text-white transition-colors hover:text-white/80"
                  style={navLinkStyle}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t("nav.speakers")}
                </a>
                <Link
                  href="/accelerate/agenda"
                  className="font-semibold uppercase tracking-[0.05em] text-white transition-colors hover:text-white/80"
                  style={navLinkStyle}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t("nav.agenda")}
                </Link>
                <a
                  href="#sponsors"
                  className="font-semibold uppercase tracking-[0.05em] text-white transition-colors hover:text-white/80"
                  style={navLinkStyle}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t("nav.sponsors")}
                </a>
                <a
                  href="#faq"
                  className="font-semibold uppercase tracking-[0.05em] text-white transition-colors hover:text-white/80"
                  style={navLinkStyle}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t("nav.faq")}
                </a>
                <div className="mt-2">
                  <LanguageSelector className="!text-white/60 hover:!text-white" />
                </div>
                <LumaModal lumaId="sol-accelerate-hk">
                  <button
                    type="button"
                    className="relative mt-2 w-full inline-flex items-center justify-center rounded-full bg-transparent px-7 py-4 font-semibold uppercase tracking-[0.05em] text-white transition-colors hover:bg-white/5"
                    style={{
                      ...navLinkStyle,
                      minWidth: "186px",
                      background:
                        "linear-gradient(black, black) padding-box, linear-gradient(to right, #9945FF, #19FB9B) border-box",
                      border: "1px solid transparent",
                    }}
                  >
                    <span>{t("nav.requestToJoin")}</span>
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
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Content - YouTube Live Stream */}
      <div className="absolute inset-x-0 bottom-0 top-[120px] z-10 flex flex-col items-center justify-center px-4 md:top-[140px] md:px-8 lg:top-[160px]">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="flex w-full max-w-[960px] flex-col items-center gap-4 md:gap-6"
        >
          {/* Title row with live indicator */}
          <motion.div variants={fadeInUp} className="flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#19FB9B] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#19FB9B]" />
            </span>
            <h1
              className="text-center text-lg font-semibold uppercase tracking-[0.15em] sm:text-xl md:text-2xl"
              style={{
                fontFamily:
                  "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
                lineHeight: 1,
                color: "#D2D2D2",
              }}
            >
              {t("hero.title")}
              <span className="ml-2 text-[#19FB9B]">/</span>
              <span className="ml-2 text-[#19FB9B]">
                {t("hero.dateLocation")}
              </span>
            </h1>
          </motion.div>

          {/* YouTube embed */}
          <motion.div variants={fadeInUp} className="w-full">
            <YoutubeEmbed id="j0Y2uZ7Xmbs" title={t("hero.title")} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
