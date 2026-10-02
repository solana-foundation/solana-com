"use client";

import { motion } from "motion/react";
import { Link } from "@workspace/i18n/routing";
import { useTranslations } from "@workspace/i18n/client";
import { Agenda } from "./Agenda";
import { EventHeader } from "./EventHeader";
import { fadeInUp, stagger } from "@/lib/animations";
import type { AgendaData } from "@/lib/miami-agenda";
import type { AccelerateEvent } from "@/data/events";

type EventAgendaPageProps = {
  event: AccelerateEvent;
  data?: AgendaData;
};

function BackArrow() {
  return (
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
  );
}

export function EventAgendaPage({ event, data }: EventAgendaPageProps) {
  const t = useTranslations(event.pageTranslations);

  return (
    <div className="min-h-screen bg-black">
      <EventHeader
        variant="page"
        translationPrefix={event.navigationTranslations}
        homePath={event.homePath}
        agendaPath={event.agendaPath}
        logoImage={event.logoImage}
        logoAlt={event.logoAlt}
        showSpeakersNav={event.agendaShowSpeakersNav}
        activeNav="agenda"
        lumaId={event.lumaId}
      />

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
                href={event.homePath}
                className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-white/60 transition-colors hover:text-white"
              >
                <BackArrow />
                {t("backToAccelerate")}
              </Link>
            </motion.div>

            <motion.p
              variants={fadeInUp}
              className="mb-4 text-base font-medium uppercase tracking-[0.08em] text-white/70"
            >
              {t("dateLocation")}
            </motion.p>

            <motion.h1
              variants={fadeInUp}
              className="max-w-[900px] text-[52px] font-normal leading-none tracking-[-0.03em] text-white sm:text-[72px] lg:text-[96px]"
            >
              {t("conference")}{" "}
              <span className="text-accelerate-green">
                {t("agendaHighlight")}
              </span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="mt-6 max-w-[650px] text-lg leading-relaxed text-white/70 lg:text-xl"
            >
              {t("description")}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {data ? (
        data.sessions.length > 0 ? (
          <Agenda data={data} filterMode="format" />
        ) : (
          <section className="bg-black py-12 lg:py-16">
            <div className="mx-auto max-w-[1440px] px-6 lg:px-[60px]">
              <p className="text-white/60">{t("comingSoon")}</p>
            </div>
          </section>
        )
      ) : (
        <Agenda />
      )}

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
              {t("readyTo")}{" "}
              <span className="text-accelerate-green">
                {t("accelerateHighlight")}
              </span>
              ?
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="mt-12 text-sm text-white/40"
            >
              {t("copyright")}
            </motion.p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
