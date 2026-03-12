"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { fadeInUp, stagger } from "@/lib/animations";

const CARDS = [
  {
    key: "speakers",
    href: "https://airtable.com/apph4y5MDXBxJ2uZy/pagRLZbQJSUsyz3Tn/form",
    accent: "#9945FF",
    accentRgb: "153, 69, 255",
    ordinal: "01",
  },
  {
    key: "sponsors",
    href: "https://solanafoundation.typeform.com/acc26-sponsor?typeform-source=luma.com",
    accent: "#19FB9B",
    accentRgb: "25, 251, 155",
    ordinal: "02",
  },
] as const;

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  }),
};

const lineReveal = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
      delay: 0.2,
    },
  },
};

interface GetInvolvedProps {
  translationPrefix?: string;
}

export function GetInvolved({
  translationPrefix = "accelerate.miami.getInvolved",
}: GetInvolvedProps) {
  const t = useTranslations(translationPrefix);

  return (
    <section id="get-involved" className="section-accelerate relative">
      <div className="container-accelerate">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
        >
          {/* Heading with gradient underline */}
          <div className="mb-10 lg:mb-14">
            <motion.h2 variants={fadeInUp} className="section-heading !mb-4">
              {t("heading")}
            </motion.h2>
            <div className="section-divider" />
          </div>

          {/* Cards grid */}
          <div className="grid gap-6 md:grid-cols-2 md:gap-5 lg:gap-7">
            {CARDS.map(({ key, href, accent, accentRgb, ordinal }, i) => (
              <motion.div
                key={key}
                custom={i}
                variants={cardVariants}
                whileHover={{ y: -6, transition: { duration: 0.3 } }}
                className="group relative flex flex-col overflow-hidden rounded-sm border border-white/[0.08] p-8 lg:p-10"
                style={
                  {
                    "--card-accent": accent,
                    "--card-accent-rgb": accentRgb,
                    background: `
                      radial-gradient(ellipse at 20% 0%, rgba(${accentRgb}, 0.06) 0%, transparent 60%),
                      rgba(255, 255, 255, 0.02)
                    `,
                  } as React.CSSProperties
                }
              >
                {/* Top accent line */}
                <div
                  className="absolute left-0 right-0 top-0 h-[2px] opacity-60 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background: `linear-gradient(to right, ${accent}, transparent 80%)`,
                  }}
                />

                {/* Hover glow overlay */}
                <div
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background: `radial-gradient(ellipse at 30% 0%, rgba(${accentRgb}, 0.08) 0%, transparent 70%)`,
                  }}
                />

                {/* Large decorative ordinal */}
                <div
                  className="pointer-events-none absolute -right-2 -top-4 select-none font-space-grotesk text-[120px] font-extralight leading-none opacity-[0.03] transition-opacity duration-500 group-hover:opacity-[0.07] lg:text-[140px]"
                  style={{ color: accent }}
                >
                  {ordinal}
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-1 flex-col">
                  {/* Accent dot + Title */}
                  <div className="mb-4 flex items-start gap-3">
                    <span
                      className="mt-[10px] block h-[6px] w-[6px] shrink-0 rounded-full"
                      style={{
                        backgroundColor: accent,
                        boxShadow: `0 0 8px rgba(${accentRgb}, 0.5)`,
                      }}
                    />
                    <h3 className="text-xl font-medium text-white lg:text-2xl">
                      {t(`${key}.title`)}
                    </h3>
                  </div>

                  <p className="text-p mb-8 !text-[16px] leading-relaxed text-white/50 lg:!text-[18px]">
                    {t(`${key}.description`)}
                  </p>

                  {/* CTA */}
                  <div className="mt-auto">
                    {href ? (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-cta group/btn h-[48px] px-7 transition-shadow duration-300 hover:shadow-[0_0_24px_rgba(153,69,255,0.25)]"
                      >
                        <span className="text-sm font-semibold uppercase tracking-[0.9px]">
                          {t(`${key}.cta`)}
                        </span>
                        <svg
                          className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-0.5"
                          fill="none"
                          viewBox="0 0 16 16"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path
                            d="M3 8h10M9 4l4 4-4 4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </a>
                    ) : (
                      <button
                        disabled
                        className="btn-cta h-[48px] px-7 !text-black/40 opacity-40"
                      >
                        <span className="text-sm font-semibold uppercase tracking-[0.9px]">
                          {t(`${key}.cta`)}
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
