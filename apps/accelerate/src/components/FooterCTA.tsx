"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { LumaModal } from "./LumaModal";
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

export function FooterCTA() {
  const t = useTranslations("accelerate.footerCta");

  return (
    <section className="relative overflow-hidden bg-black py-12 lg:py-16">
      {/* Hong Kong Chinese characters background image from Figma - positioned behind text */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="relative h-full w-full max-w-[1464px]">
          <Image
            src={getImagePath("/images/hk-characters.png")}
            alt=""
            fill
            className="object-contain opacity-[0.8]"
          />
        </div>
      </div>

      {/* Dots pattern - overlaid over hk-characters, anchored to bottom, repeating horizontally */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 z-[1] h-[200px] sm:h-[250px] md:h-[300px] lg:h-[322px] opacity-70"
        style={{
          backgroundImage: `url('${getImagePath("/images/dots.svg")}')`,
          backgroundRepeat: "repeat-x",
          backgroundPosition: "bottom",
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1440px] px-6 lg:px-[60px]">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
          className="text-center"
        >
          {/* "Don't miss" subtitle */}
          <motion.p
            variants={fadeInUp}
            className="mb-3 text-xl text-white/60 sm:mb-4 sm:text-2xl md:text-3xl lg:text-hero"
            style={{
              fontFamily:
                "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
              fontWeight: 300,
              lineHeight: 1,
            }}
          >
            {t("dontMiss")}
          </motion.p>

          {/* "SOLANA ACCELERATE" heading with gradient */}
          <motion.h2
            variants={fadeInUp}
            className="mb-6 text-4xl sm:mb-8 sm:text-5xl md:mb-10 md:text-6xl lg:text-hero"
            style={{
              fontFamily:
                "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
              fontWeight: 300,
              lineHeight: 1,
            }}
          >
            <span className="text-white">{t("solana")} </span>
            <span className="gradient-text">{t("accelerate")}</span>
          </motion.h2>

          {/* CTA Button */}
          <motion.div variants={fadeInUp} className="mb-6 sm:mb-8">
            <LumaModal lumaId="accelerate-miami">
              <button
                className="group inline-flex h-[56px] w-full max-w-[480px] items-center justify-center rounded-[32px] px-5 text-black transition-all hover:opacity-90 sm:h-[66px] sm:px-7"
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
                  {t("requestToJoin")}
                </span>
                <Image
                  src={getImagePath("/images/ticket-icon.svg")}
                  alt="Ticket icon"
                  width={18}
                  height={12}
                  className="ml-2 flex-shrink-0"
                />
              </button>
            </LumaModal>
          </motion.div>

          {/* "Limited tickets available" text */}
          <motion.p
            variants={fadeInUp}
            className="text-lg text-white sm:text-xl md:text-h2"
            style={{
              fontFamily:
                "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
              fontWeight: 400,
              lineHeight: 1.1,
            }}
          >
            {t("limitedTickets")}
          </motion.p>
        </motion.div>
      </div>

      {/* Bottom copyright */}
      <div className="relative z-10 mt-12 text-center sm:mt-16 md:mt-20">
        <p className="text-xs text-white/30 sm:text-sm">{t("copyright")}</p>
      </div>
    </section>
  );
}
