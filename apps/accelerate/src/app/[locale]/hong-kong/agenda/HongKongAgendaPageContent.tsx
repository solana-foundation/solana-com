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
import { fadeInUp, stagger } from "@/lib/animations";

export function HongKongAgendaPageContent() {
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
      <header className="relative z-20">
        <div className="container-accelerate flex items-center justify-between py-5 lg:py-5">
          <Link href="/accelerate/hong-kong" className="flex items-center">
            <Image
              src={getImagePath("/images/accelerate-logo.svg")}
              alt="Accelerate APAC"
              width={197}
              height={100}
              className="h-[60px] w-auto lg:h-[80px]"
              priority
            />
          </Link>

          <nav className="hidden items-center gap-[38px] md:flex">
            <Link
              href="/accelerate/hong-kong#speakers"
              className="font-semibold uppercase tracking-[0.05em] text-white transition-colors hover:text-white/80 text-button"
            >
              {t("nav.speakers")}
            </Link>
            <Link
              href="/accelerate/hong-kong/agenda"
              className="font-semibold uppercase tracking-[0.05em] text-accelerate-green transition-colors hover:text-accelerate-green/80 text-button"
            >
              {t("nav.agenda")}
            </Link>
            <Link
              href="/accelerate/hong-kong#sponsors"
              className="font-semibold uppercase tracking-[0.05em] text-white transition-colors hover:text-white/80 text-button"
            >
              {t("nav.sponsors")}
            </Link>
            <Link
              href="/accelerate/hong-kong#faq"
              className="font-semibold uppercase tracking-[0.05em] text-white transition-colors hover:text-white/80 text-button"
            >
              {t("nav.faq")}
            </Link>
            <LanguageSelector className="!text-white/60 hover:!text-white" />
            <LumaModal lumaId="accelerate-miami">
              <button className="btn-outline-gradient px-7 py-4 text-button">
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
                <Link
                  href="/accelerate/hong-kong#speakers"
                  className="font-semibold uppercase tracking-[0.05em] text-white transition-colors hover:text-white/80 text-button"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t("nav.speakers")}
                </Link>
                <Link
                  href="/accelerate/hong-kong/agenda"
                  className="font-semibold uppercase tracking-[0.05em] text-accelerate-green transition-colors hover:text-accelerate-green/80 text-button"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t("nav.agenda")}
                </Link>
                <Link
                  href="/accelerate/hong-kong#sponsors"
                  className="font-semibold uppercase tracking-[0.05em] text-white transition-colors hover:text-white/80 text-button"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t("nav.sponsors")}
                </Link>
                <Link
                  href="/accelerate/hong-kong#faq"
                  className="font-semibold uppercase tracking-[0.05em] text-white transition-colors hover:text-white/80 text-button"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t("nav.faq")}
                </Link>
                <div className="mt-2">
                  <LanguageSelector className="!text-white/60 hover:!text-white" />
                </div>
                <LumaModal lumaId="accelerate-miami">
                  <button
                    type="button"
                    className="btn-outline-gradient mt-2 w-full px-7 py-4 text-button"
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

      <section className="relative overflow-hidden bg-black py-12 lg:py-20">
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

        <div className="container-accelerate relative z-10">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.div variants={fadeInUp}>
              <Link
                href="/accelerate/hong-kong"
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
              className="mb-4 text-base font-medium uppercase tracking-[0.08em] text-white/70"
            >
              {t("agendaPage.dateLocation")}
            </motion.p>

            <motion.h1
              variants={fadeInUp}
              className="max-w-[900px] text-[52px] font-normal leading-none tracking-[-0.03em] text-white sm:text-[72px] lg:text-[96px]"
            >
              {t("agendaPage.conference")}{" "}
              <span className="text-accelerate-green">
                {t("agendaPage.agendaHighlight")}
              </span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="mt-6 max-w-[650px] text-lg leading-relaxed text-white/70 lg:text-xl"
            >
              {t("agendaPage.description")}
            </motion.p>
          </motion.div>
        </div>
      </section>

      <Agenda />

      <section className="relative overflow-hidden border-t border-white/10 bg-black py-20">
        <div className="container-accelerate relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
            className="mx-auto max-w-[900px] text-center"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-[48px] font-normal leading-none tracking-[-0.03em] text-white sm:text-[72px] lg:text-[96px]"
            >
              {t("agendaPage.readyTo")}{" "}
              <span className="text-accelerate-green">
                {t("agendaPage.accelerateHighlight")}
              </span>
              ?
            </motion.h2>
            <motion.div variants={fadeInUp} className="mt-8">
              <LumaModal lumaId="accelerate-miami">
                <button className="btn-outline-gradient px-8 py-4 text-button">
                  <span>{t("agendaPage.requestToJoin")}</span>
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
            </motion.div>
            <motion.p
              variants={fadeInUp}
              className="mt-12 text-sm text-white/40"
            >
              {t("agendaPage.copyright")}
            </motion.p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
