"use client";

import { motion } from "framer-motion";
import { Link } from "@workspace/i18n/routing";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { getImagePath } from "@/config";
import { fadeInUp, stagger } from "@/lib/animations";

export function AgendaBanner() {
  const t = useTranslations("accelerate.agendaBanner");

  const highlights = [
    { count: t("sessionsCount"), label: t("sessionsLabel") },
    { count: t("speakersCount"), label: t("speakersLabel") },
    { count: t("fullDayCount"), label: t("fullDayLabel") },
  ];

  return (
    <section className="relative overflow-hidden bg-black py-16 lg:py-24">
      {/* Background gradient effects */}
      <div className="pointer-events-none absolute inset-0">
        {/* Purple glow on left */}
        <div
          className="absolute -left-[200px] top-1/2 h-[600px] w-[600px] -translate-y-1/2"
          style={{
            background:
              "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(153, 69, 255, 0.3) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        {/* Green glow on right */}
        <div
          className="absolute -right-[200px] top-1/2 h-[600px] w-[600px] -translate-y-1/2"
          style={{
            background:
              "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(25, 251, 155, 0.2) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
      </div>

      {/* Pattern background */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-30">
        <Image
          src={getImagePath("/images/pattern-bgr.svg")}
          alt=""
          fill
          className="object-cover"
        />
      </div>

      <div className="container-accelerate relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
          className="text-center"
        >
          {/* Eyebrow */}
          <motion.p
            variants={fadeInUp}
            className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-accelerate-green"
          >
            {t("eyebrow")}
          </motion.p>

          {/* Heading */}
          <motion.h2
            variants={fadeInUp}
            className="mb-6 text-3xl font-light text-accelerate-gray-light sm:text-4xl md:text-5xl lg:text-6xl"
          >
            {t("heading")}{" "}
            <span className="gradient-text">{t("headingHighlight")}</span>
          </motion.h2>

          {/* Description */}
          <motion.p
            variants={fadeInUp}
            className="mx-auto mb-10 max-w-2xl text-lg text-white/60"
          >
            {t("description")}
          </motion.p>

          {/* Stats */}
          <motion.div
            variants={fadeInUp}
            className="mb-10 flex flex-wrap items-center justify-center gap-8 lg:gap-16"
          >
            {highlights.map((item) => (
              <div key={item.label} className="text-center">
                <p className="gradient-text text-4xl font-semibold lg:text-5xl">
                  {item.count}
                </p>
                <p className="mt-1 text-sm uppercase tracking-wider text-white/50">
                  {item.label}
                </p>
              </div>
            ))}
          </motion.div>

          {/* CTA Button */}
          <motion.div variants={fadeInUp}>
            <Link
              href="/accelerate/hong-kong/agenda"
              className="btn-cta h-[56px] px-8 sm:h-[66px]"
            >
              <span className="text-sm uppercase font-semibold sm:text-base sm:tracking-[0.9px]">
                {t("viewFullAgenda")}
              </span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className="transition-transform group-hover:translate-x-1"
              >
                <path
                  d="M6 12L10 8L6 4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
