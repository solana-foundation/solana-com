"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { fadeInUp, stagger } from "@/lib/animations";

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
    <section id="get-involved" className="section-accelerate relative">
      <div className="container-accelerate">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
        >
          <motion.h2 variants={fadeInUp} className="section-heading">
            {t("heading")}
          </motion.h2>

          <div className="section-divider" />

          <div className="grid gap-6 md:grid-cols-3 md:gap-8">
            {CARDS.map(({ key, href }) => (
              <motion.div
                key={key}
                variants={fadeInUp}
                className="flex flex-col border border-white/10 bg-black/40 p-8 lg:p-10"
              >
                <h3 className="mb-3 text-xl font-medium text-white lg:text-2xl">
                  {t(`${key}.title`)}
                </h3>
                <p className="mb-8 text-white/60">{t(`${key}.description`)}</p>
                <div className="mt-auto">
                  {href ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-cta h-[48px] px-7"
                    >
                      <span className="text-sm font-semibold uppercase tracking-[0.9px]">
                        {t(`${key}.cta`)}
                      </span>
                    </a>
                  ) : (
                    <button
                      disabled
                      className="btn-cta h-[48px] px-7 !text-black/50 opacity-50"
                    >
                      <span className="text-sm font-semibold uppercase tracking-[0.9px]">
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
