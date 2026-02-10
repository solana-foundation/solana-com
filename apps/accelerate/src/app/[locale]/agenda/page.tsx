"use client";

import { useState, useEffect } from "react";
import { Link } from "@workspace/i18n/routing";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { Agenda } from "@/components/Agenda";
import { LumaModal } from "@/components/LumaModal";
import { LanguageSelector } from "@solana-com/ui-chrome";
import { getImagePath } from "@/config";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const navLinkStyle = {
  fontFamily: "'Space Grotesk', sans-serif",
  fontSize: "16px",
};

export default function AgendaPage() {
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
    <div className="min-h-screen bg-black">
      {/* Header Navigation */}
      <header className="relative z-20">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-5 lg:px-[60px] lg:py-5">
          {/* Logo */}
          <Link href="/accelerate" className="flex items-center">
            <Image
              src={getImagePath("/images/accelerate-logo.svg")}
              alt="Accelerate APAC"
              width={197}
              height={100}
              className="h-[60px] w-auto lg:h-[80px]"
              priority
            />
          </Link>

          {/* Navigation */}
          <nav className="hidden items-center gap-[38px] md:flex">
            <Link
              href="/accelerate#speakers"
              className="font-semibold uppercase tracking-[0.05em] text-white transition-colors hover:text-white/80"
              style={navLinkStyle}
            >
              {t("nav.speakers")}
            </Link>
            <Link
              href="/accelerate/agenda"
              className="font-semibold uppercase tracking-[0.05em] text-accelerate-green transition-colors hover:text-accelerate-green/80"
              style={navLinkStyle}
            >
              {t("nav.agenda")}
            </Link>
            <Link
              href="/accelerate#sponsors"
              className="font-semibold uppercase tracking-[0.05em] text-white transition-colors hover:text-white/80"
              style={navLinkStyle}
            >
              {t("nav.sponsors")}
            </Link>
            <Link
              href="/accelerate#faq"
              className="font-semibold uppercase tracking-[0.05em] text-white transition-colors hover:text-white/80"
              style={navLinkStyle}
            >
              {t("nav.faq")}
            </Link>
            <LanguageSelector className="!text-white/60 hover:!text-white" />
            <LumaModal lumaId="sol-accelerate-hk">
              <button
                className="relative inline-flex items-center justify-center rounded-full bg-transparent px-7 py-4 font-semibold uppercase tracking-[0.05em] text-white transition-colors hover:bg-white/5"
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
        </div>
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
                <Link
                  href="/accelerate#speakers"
                  className="font-semibold uppercase tracking-[0.05em] text-white transition-colors hover:text-white/80"
                  style={navLinkStyle}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t("nav.speakers")}
                </Link>
                <Link
                  href="/accelerate/agenda"
                  className="font-semibold uppercase tracking-[0.05em] text-accelerate-green transition-colors hover:text-accelerate-green/80"
                  style={navLinkStyle}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t("nav.agenda")}
                </Link>
                <Link
                  href="/accelerate#sponsors"
                  className="font-semibold uppercase tracking-[0.05em] text-white transition-colors hover:text-white/80"
                  style={navLinkStyle}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t("nav.sponsors")}
                </Link>
                <Link
                  href="/accelerate#faq"
                  className="font-semibold uppercase tracking-[0.05em] text-white transition-colors hover:text-white/80"
                  style={navLinkStyle}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t("nav.faq")}
                </Link>
                <div className="mt-2">
                  <LanguageSelector className="!text-white/60 hover:!text-white" />
                </div>
                <LumaModal lumaId="sol-accelerate-hk">
                  <button
                    type="button"
                    className="relative mt-2 inline-flex w-full items-center justify-center rounded-full bg-transparent px-7 py-4 font-semibold uppercase tracking-[0.05em] text-white transition-colors hover:bg-white/5"
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

      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-black py-12 lg:py-20">
        {/* Gradient glow */}
        <div className="pointer-events-none absolute -left-[200px] top-0 h-full w-[600px]">
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 60% 50% at 30% 50%, rgba(153, 69, 255, 0.4) 0%, rgba(137, 58, 233, 0.2) 40%, transparent 70%)",
              filter: "blur(80px)",
            }}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-[1440px] px-6 lg:px-[60px]">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.1 } },
            }}
          >
            <motion.div variants={fadeInUp}>
              <Link
                href="/accelerate"
                className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-white/60 transition-colors hover:text-white"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  className="rotate-180"
                >
                  <path
                    d="M6 12L10 8L6 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {t("agendaPage.backToAccelerate")}
              </Link>
            </motion.div>

            <motion.p
              variants={fadeInUp}
              className="mb-3 text-lg font-medium text-accelerate-green md:text-xl"
              style={{
                fontFamily:
                  "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
              }}
            >
              {t("agendaPage.dateLocation")}
            </motion.p>

            <motion.h1
              variants={fadeInUp}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-[72px]"
              style={{
                fontFamily:
                  "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
                fontWeight: 300,
                lineHeight: 1,
                color: "#D2D2D2",
              }}
            >
              {t("agendaPage.conference")}{" "}
              <span className="gradient-text">
                {t("agendaPage.agendaHighlight")}
              </span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="mt-6 max-w-2xl text-lg text-white/60"
            >
              {t("agendaPage.description")}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Agenda Content */}
      <Agenda />

      {/* Footer CTA */}
      <section className="relative bg-black py-16 lg:py-24">
        <div className="mx-auto max-w-[1440px] px-6 text-center lg:px-[60px]">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              visible: { transition: { staggerChildren: 0.1 } },
            }}
          >
            <motion.h2
              variants={fadeInUp}
              className="mb-6 text-3xl font-light text-white sm:text-4xl md:text-5xl"
              style={{
                fontFamily:
                  "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
              }}
            >
              {t("agendaPage.readyTo")}{" "}
              <span className="gradient-text">
                {t("agendaPage.accelerateHighlight")}
              </span>
              ?
            </motion.h2>

            <motion.div variants={fadeInUp}>
              <LumaModal lumaId="sol-accelerate-hk">
                <button
                  className="group inline-flex h-[56px] items-center justify-center rounded-[32px] px-8 text-black transition-all hover:opacity-90 sm:h-[66px]"
                  style={{
                    background: "linear-gradient(to right, #9945FF, #19FB9B)",
                  }}
                >
                  <span
                    className="text-sm uppercase sm:text-base sm:tracking-[0.9px]"
                    style={{
                      fontFamily:
                        "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
                      fontWeight: 600,
                    }}
                  >
                    {t("agendaPage.requestToJoin")}
                  </span>
                  <Image
                    src={getImagePath("/images/ticket-icon.svg")}
                    alt="Ticket icon"
                    width={18}
                    height={12}
                    className="ml-2 flex-shrink-0"
                  />
                </button>
              </LumaModal>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 text-center">
          <p className="text-xs text-white/30 sm:text-sm">
            {t("agendaPage.copyright")}
          </p>
        </div>
      </section>
    </div>
  );
}
