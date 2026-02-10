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
      <p
        className="gradient-text text-h2"
        style={{
          fontFamily: "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
        }}
      >
        {label}
      </p>
      <div>
        <p
          className="text-h2 text-white"
          style={{
            fontFamily:
              "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
          }}
        >
          {value}
        </p>
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

export function GettingThere() {
  const t = useTranslations("accelerate.gettingThere");

  return (
    <section id="getting-there" className="bg-black py-12 lg:py-16">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-[60px]">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
        >
          {/* Section heading */}
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

          {/* Divider line */}
          <div className="mb-8 border-t border-white/10 lg:mb-10" />

          <div className="mx-auto max-w-4xl">
            <InfoRow
              label={t("nearestAirportLabel")}
              value={t("nearestAirportValue")}
            />
            <InfoRow
              label={t("accommodationsLabel")}
              value={t("accommodationsValue")}
              subValue={t("accommodationsSubValue")}
              link={{
                text: t("viewDetailsHere"),
                href: "https://consensus-hongkong.coindesk.com/travel/",
              }}
            />
            <InfoRow
              label=""
              value={t("nomadzValue")}
              subValue={t("nomadzSubValue")}
              link={{
                text: "nomadz.xyz",
                href: "https://nomadz.xyz",
              }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
