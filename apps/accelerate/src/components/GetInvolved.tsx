"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { fadeInUp, stagger } from "@/lib/animations";

const CARDS = [
  {
    key: "speakers",
    href: null,
    closed: true,
    accent: "#9945FF",
    accentRgb: "153, 69, 255",
  },
  {
    key: "sponsors",
    href: "https://solanafoundation.typeform.com/acc26-sponsor?typeform-source=luma.com",
    closed: false,
    accent: "#19FB9B",
    accentRgb: "25, 251, 155",
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
            {CARDS.map(({ key, href, closed, accent, accentRgb }, i) => {
              const ordinal = String(i + 1).padStart(2, "0");

              return (
                <motion.div
                  key={key}
                  custom={i}
                  variants={cardVariants}
                  whileHover={
                    closed
                      ? undefined
                      : { y: -6, transition: { duration: 0.3 } }
                  }
                  className={`group relative flex flex-col overflow-hidden rounded-sm border p-8 lg:p-10 ${
                    closed ? "border-white/[0.04]" : "border-white/[0.08]"
                  }`}
                  style={
                    {
                      "--card-accent": accent,
                      "--card-accent-rgb": accentRgb,
                      background: closed
                        ? "rgba(255, 255, 255, 0.01)"
                        : `
                          radial-gradient(ellipse at 20% 0%, rgba(${accentRgb}, 0.06) 0%, transparent 60%),
                          rgba(255, 255, 255, 0.02)
                        `,
                    } as React.CSSProperties
                  }
                >
                  {/* Top accent line */}
                  <div
                    className={`absolute left-0 right-0 top-0 h-[2px] transition-opacity duration-500 ${
                      closed
                        ? "opacity-20"
                        : "opacity-60 group-hover:opacity-100"
                    }`}
                    style={{
                      background: closed
                        ? `linear-gradient(to right, rgba(${accentRgb}, 0.4), transparent 60%)`
                        : `linear-gradient(to right, ${accent}, transparent 80%)`,
                    }}
                  />

                  {/* Hover glow overlay — only for active cards */}
                  {!closed && (
                    <div
                      className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                      style={{
                        background: `radial-gradient(ellipse at 30% 0%, rgba(${accentRgb}, 0.08) 0%, transparent 70%)`,
                      }}
                    />
                  )}

                  {/* Large decorative ordinal */}
                  <div
                    className={`pointer-events-none absolute -right-2 -top-4 select-none font-space-grotesk text-[120px] font-extralight leading-none lg:text-[140px] ${
                      closed
                        ? "opacity-[0.02]"
                        : "opacity-[0.03] transition-opacity duration-500 group-hover:opacity-[0.07]"
                    }`}
                    style={{ color: closed ? "#fff" : accent }}
                  >
                    {ordinal}
                  </div>

                  {/* Content */}
                  <div className="relative z-10 flex flex-1 flex-col">
                    {/* Accent dot + Title + Closed badge */}
                    <div className="mb-4 flex items-start gap-3">
                      <span
                        className={`mt-[10px] block h-[6px] w-[6px] shrink-0 rounded-full ${closed ? "opacity-30" : ""}`}
                        style={{
                          backgroundColor: accent,
                          boxShadow: closed
                            ? "none"
                            : `0 0 8px rgba(${accentRgb}, 0.5)`,
                        }}
                      />
                      <div className="flex flex-wrap items-center gap-3">
                        <h3
                          className={`text-xl font-medium lg:text-2xl ${closed ? "text-white/40" : "text-white"}`}
                        >
                          {t(`${key}.title`)}
                        </h3>
                        {closed && (
                          <span
                            className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-widest"
                            style={{
                              borderColor: `rgba(${accentRgb}, 0.15)`,
                              color: `rgba(${accentRgb}, 0.5)`,
                              background: `rgba(${accentRgb}, 0.05)`,
                            }}
                          >
                            <span
                              className="block h-1 w-1 rounded-full"
                              style={{
                                backgroundColor: `rgba(${accentRgb}, 0.4)`,
                              }}
                            />
                            Closed
                          </span>
                        )}
                      </div>
                    </div>

                    <p
                      className={`text-p mb-8 !text-[16px] leading-relaxed lg:!text-[18px] ${
                        closed ? "text-white/25" : "text-white/50"
                      }`}
                    >
                      {t(`${key}.description`)}
                    </p>

                    {/* CTA */}
                    <div className="mt-auto">
                      {closed ? (
                        <div
                          className="inline-flex h-[48px] items-center justify-center gap-2 rounded-[32px] border px-7"
                          style={{
                            borderColor: `rgba(${accentRgb}, 0.1)`,
                            background: `rgba(${accentRgb}, 0.03)`,
                          }}
                        >
                          <svg
                            className="h-3.5 w-3.5"
                            style={{ color: `rgba(${accentRgb}, 0.35)` }}
                            fill="none"
                            viewBox="0 0 16 16"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          >
                            <path
                              d="M13.3 6.5V5.2a5.2 5.2 0 0 0-10.5 0v1.3M3.5 6.5h9a1.5 1.5 0 0 1 1.5 1.5v5.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5V8a1.5 1.5 0 0 1 1.5-1.5Z"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <span
                            className="text-sm font-medium uppercase tracking-[0.9px]"
                            style={{ color: `rgba(${accentRgb}, 0.35)` }}
                          >
                            Applications closed
                          </span>
                        </div>
                      ) : href ? (
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
                        <span className="text-sm text-white/30">
                          {t(`${key}.cta`)}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
