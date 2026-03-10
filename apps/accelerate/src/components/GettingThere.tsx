"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { fadeInUp, stagger } from "@/lib/animations";

interface InfoRowProps {
  label: string;
  value: string;
  subValue?: string;
  link?: {
    text: string;
    href: string;
  };
}

function InfoRow({ label, value, subValue, link }: InfoRowProps) {
  return (
    <motion.div
      variants={fadeInUp}
      className="grid grid-cols-1 gap-4 border-b border-white/10 py-6 last:border-b-0 lg:grid-cols-[360px_1fr]"
    >
      <p className="gradient-text text-h2">{label}</p>
      <div>
        <p className="text-h2 text-white">{value}</p>
        {subValue && (
          <p className="text-p mt-3 text-accelerate-green">
            {subValue}
            {link && (
              <>
                {" "}
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accelerate-green underline hover:no-underline"
                >
                  {link.text}
                </a>
              </>
            )}
          </p>
        )}
      </div>
    </motion.div>
  );
}

interface GettingThereProps {
  translationPrefix?: string;
}

export function GettingThere({
  translationPrefix = "accelerate.gettingThere",
}: GettingThereProps = {}) {
  const t = useTranslations(translationPrefix);

  return (
    <section id="getting-there" className="section-accelerate">
      <div className="container-accelerate">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
        >
          {/* Section heading */}
          <motion.h2 variants={fadeInUp} className="section-heading">
            {t("heading")}
          </motion.h2>

          {/* Divider line */}
          <div className="section-divider" />

          <div className="mx-auto max-w-4xl">
            <InfoRow
              label={t("nearestAirportLabel")}
              value={t("nearestAirportValue")}
            />
            <InfoRow
              label={t("accommodationsLabel")}
              value={t("accommodationsValue")}
              subValue={
                t.has("accommodationsSubValue")
                  ? t("accommodationsSubValue")
                  : undefined
              }
              link={
                t.has("viewDetailsHere")
                  ? {
                      text: t("viewDetailsHere"),
                      href: t.has("viewDetailsLink")
                        ? t("viewDetailsLink")
                        : "https://consensus-hongkong.coindesk.com/travel/",
                    }
                  : undefined
              }
            />
            {t.has("nomadzValue") && (
              <InfoRow
                label=""
                value={t("nomadzValue")}
                subValue={
                  t.has("nomadzSubValue") ? t("nomadzSubValue") : undefined
                }
                link={{
                  text: "nomadz.xyz",
                  href: "https://nomadz.xyz",
                }}
              />
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
