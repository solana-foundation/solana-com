"use client";

import { motion } from "framer-motion";
import { Link } from "@workspace/i18n/routing";
import Image from "next/image";
import { useTranslations } from "next-intl";
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

      <div className="relative z-10 mx-auto max-w-[1440px] px-6 lg:px-[60px]">
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
            className="mb-6 text-3xl font-light sm:text-4xl md:text-5xl lg:text-6xl"
            style={{
              fontFamily:
                "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
              color: "#D2D2D2",
            }}
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
                <p
                  className="gradient-text text-4xl font-semibold lg:text-5xl"
                  style={{
                    fontFamily:
                      "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
                  }}
                >
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
              href="/accelerate/agenda"
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
                {t("viewFullAgenda")}
              </span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className="ml-2 transition-transform group-hover:translate-x-1"
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
