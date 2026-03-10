"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

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

const CARDS = [
  {
    key: "speakers",
    href: "https://airtable.com/apph4y5MDXBxJ2uZy/pagRLZbQJSUsyz3Tn/form",
  },
  {
    key: "sponsors",
    href: "https://solanafoundation.typeform.com/acc26-sponsor?typeform-source=luma.com",
  },
  {
    key: "press",
    href: null,
  },
] as const;

interface GetInvolvedProps {
  translationPrefix?: string;
}

export function GetInvolved({
  translationPrefix = "accelerate.miami.getInvolved",
}: GetInvolvedProps) {
  const t = useTranslations(translationPrefix);

  return (
    <section id="get-involved" className="relative bg-black py-12 lg:py-16">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-[60px]">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
        >
          <motion.h2
            variants={fadeInUp}
            className="text-h1 mb-8 text-accelerate-gray-100 lg:mb-12"
            style={{
              fontFamily:
                "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
            }}
          >
            {t("heading")}
          </motion.h2>

          <div className="mb-8 border-t border-white/10 lg:mb-10" />

          <div className="grid gap-6 md:grid-cols-3 md:gap-8">
            {CARDS.map(({ key, href }) => (
              <motion.div
                key={key}
                variants={fadeInUp}
                className="flex flex-col border border-white/10 bg-black/40 p-8 lg:p-10"
              >
                <h3
                  className="mb-3 text-xl font-medium text-white lg:text-2xl"
                  style={{
                    fontFamily:
                      "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
                  }}
                >
                  {t(`${key}.title`)}
                </h3>
                <p className="mb-8 text-white/60">{t(`${key}.description`)}</p>
                <div className="mt-auto">
                  {href ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex h-[48px] items-center justify-center rounded-[32px] px-7 text-black transition-all hover:opacity-90"
                      style={{
                        background:
                          "linear-gradient(to right, #9945FF, #19FB9B)",
                      }}
                    >
                      <span
                        className="text-sm font-semibold uppercase tracking-[0.9px]"
                        style={{
                          fontFamily:
                            "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
                        }}
                      >
                        {t(`${key}.cta`)}
                      </span>
                    </a>
                  ) : (
                    <button
                      disabled
                      className="group inline-flex h-[48px] items-center justify-center rounded-[32px] px-7 text-black/50 transition-all"
                      style={{
                        background:
                          "linear-gradient(to right, #9945FF80, #19FB9B80)",
                      }}
                    >
                      <span
                        className="text-sm font-semibold uppercase tracking-[0.9px]"
                        style={{
                          fontFamily:
                            "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
                        }}
                      >
                        {t(`${key}.cta`)}
                      </span>
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
