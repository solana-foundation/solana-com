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
import { fadeInUp, stagger } from "@/lib/animations";

const navLinkStyle =
  "font-semibold uppercase tracking-[0.05em] text-white transition-colors hover:text-white/80 text-button";

interface HeroProps {
  translationPrefix?: string;
  skylineImage?: string;
  logoImage?: string;
  homePath?: string;
  agendaPath?: string | null;
  showVideo?: boolean;
  ctaLabel?: string;
  backgroundContent?: React.ReactNode;
}

export function Hero({
  translationPrefix = "accelerate",
  skylineImage = "/images/hk-skyline.svg",
  logoImage = "/images/accelerate-logo.svg",
  homePath = "/accelerate",
  agendaPath = "/accelerate/hong-kong/agenda",
  showVideo = true,
  ctaLabel,
  backgroundContent,
}: HeroProps = {}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = useTranslations(translationPrefix);

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

      {/* Background content (Miami symbols) or default skyline */}
      {backgroundContent ? (
        <div className="pointer-events-none absolute inset-0 z-[1]">
          {backgroundContent}
        </div>
      ) : (
        <div
          className="pointer-events-none absolute left-1/2 top-0 z-[1] h-[600px] md:h-[750px] lg:h-[932px] w-[1187px] -translate-x-1/2"
          style={{ transform: "translateX(-50%) scaleY(-1) rotate(180deg)" }}
        >
          <Image
            src={getImagePath(skylineImage)}
            alt=""
            fill
            className="object-contain"
            priority
          />
        </div>
      )}

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
        <Link href={homePath} className="flex items-center">
          <Image
            src={getImagePath(logoImage)}
            alt="Accelerate APAC"
            width={197}
            height={100}
            className="h-[60px] w-auto lg:h-[100px]"
            priority
          />
        </Link>

        {/* Navigation */}
        <nav className="hidden items-center gap-[38px] md:flex">
          <a href="#speakers" className={navLinkStyle}>
            {t("nav.speakers")}
          </a>
          {agendaPath && (
            <Link href={agendaPath} className={navLinkStyle}>
              {t("nav.agenda")}
            </Link>
          )}
          <a href="#sponsors" className={navLinkStyle}>
            {t("nav.sponsors")}
          </a>
          <a href="#faq" className={navLinkStyle}>
            {t("nav.faq")}
          </a>
          <LanguageSelector className="!text-white/60 hover:!text-white" />
          <LumaModal lumaId="accelerate-miami">
            <button className="btn-outline-gradient px-7 py-4 text-button">
              <span>{ctaLabel || t("nav.requestToJoin")}</span>
              <svg width="8" height="8" viewBox="0 0 11 11" fill="none">
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
              className="absolute right-0 top-0 z-40 flex h-full w-full max-w-[320px] flex-col bg-accelerate-dark px-6 py-5"
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
                  className={navLinkStyle}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t("nav.speakers")}
                </a>
                {agendaPath && (
                  <Link
                    href={agendaPath}
                    className={navLinkStyle}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t("nav.agenda")}
                  </Link>
                )}
                <a
                  href="#sponsors"
                  className={navLinkStyle}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t("nav.sponsors")}
                </a>
                <a
                  href="#faq"
                  className={navLinkStyle}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t("nav.faq")}
                </a>
                <div className="mt-2">
                  <LanguageSelector className="!text-white/60 hover:!text-white" />
                </div>
                <LumaModal lumaId="accelerate-miami">
                  <button
                    type="button"
                    className="btn-outline-gradient mt-2 w-full px-7 py-4 text-button"
                  >
                    <span>{ctaLabel || t("nav.requestToJoin")}</span>
                    <svg width="8" height="8" viewBox="0 0 11 11" fill="none">
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

      {/* Main Content */}
      <div className="absolute inset-x-0 bottom-0 top-[120px] z-10 flex flex-col items-center justify-center px-4 md:top-[140px] md:px-8 lg:top-[160px]">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="flex w-full max-w-[960px] flex-col items-center gap-4 md:gap-6"
        >
          {showVideo ? (
            <>
              {/* Title row */}
              <motion.div
                variants={fadeInUp}
                className="flex items-center justify-center"
              >
                <h1 className="text-center text-lg font-semibold uppercase tracking-[0.15em] text-accelerate-gray-light sm:text-xl md:text-2xl leading-none">
                  {t("hero.title")}
                  <span className="ml-2 text-accelerate-green">/</span>
                  <span className="ml-2 text-accelerate-green">
                    {t("hero.dateLocation")}
                  </span>
                </h1>
              </motion.div>

              {/* YouTube embed */}
              <motion.div variants={fadeInUp} className="w-full">
                <YoutubeEmbed id="LsfnC62q8oE" title={t("hero.title")} />
              </motion.div>
            </>
          ) : (
            <>
              {/* Centered hero content — matches Figma layout */}
              <motion.div
                variants={fadeInUp}
                className="flex flex-col items-center gap-[20px] text-center"
              >
                <p className="text-lg text-accelerate-green font-normal leading-[1.1] sm:text-xl md:text-2xl lg:text-[32px]">
                  {t("hero.dateLocation")}
                </p>
                <h1 className="text-3xl font-light leading-none text-accelerate-gray-light font-diatype sm:text-4xl md:text-5xl lg:text-[60px]">
                  {t("hero.title")}
                </h1>
              </motion.div>

              {/* CTA Button */}
              <motion.div variants={fadeInUp}>
                <LumaModal lumaId="accelerate-miami">
                  <button className="btn-cta group h-[56px] w-[320px] justify-between px-[28px] py-[24px] sm:h-[66px] sm:w-[480px]">
                    <span className="text-sm uppercase tracking-[0.9px] font-semibold leading-none sm:text-lg">
                      {ctaLabel || t("nav.requestToJoin")}
                    </span>
                    <Image
                      src={getImagePath("/images/ticket-icon.svg")}
                      alt=""
                      width={18}
                      height={12}
                      className="flex-shrink-0"
                    />
                  </button>
                </LumaModal>
              </motion.div>
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
}
