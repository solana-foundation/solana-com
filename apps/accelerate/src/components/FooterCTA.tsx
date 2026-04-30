"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { LumaModal } from "./LumaModal";
import { getImagePath } from "@/config";
import { fadeInUp, stagger } from "@/lib/animations";

interface FooterCTAProps {
  translationPrefix?: string;
  backgroundImage?: string;
  lumaId?: string;
}

export function FooterCTA({
  translationPrefix = "accelerate.footerCta",
  backgroundImage = "/images/hk-characters.png",
  lumaId = "accelerate-miami",
}: FooterCTAProps = {}) {
  const t = useTranslations(translationPrefix);

  return (
    <section
      className={`relative overflow-hidden bg-black ${
        backgroundImage === "/images/palm-trees.svg"
          ? "py-16 lg:py-24"
          : "py-12 lg:py-16"
      }`}
    >
      {/* Background palm trees or HK characters */}
      {backgroundImage === "/images/palm-trees.svg" ? (
        <div className="pointer-events-none absolute inset-0 z-[0]">
          {/* Palm tree 1 - right side, leaves cascade toward center-left */}
          <div
            className="absolute"
            style={{
              right: "25%",
              bottom: "-30%",
              width: "33%",
              maxWidth: "1000px",
            }}
          >
            <Image
              src={getImagePath("/images/solana-palm.png")}
              alt=""
              width={759}
              height={1275}
              className="h-auto w-full opacity-90"
              style={{
                transform: "rotate(210deg) scaleY(-1)",
              }}
            />
          </div>
          {/* Palm tree 2 - left side, leaves extend toward center-right */}
          <div
            className="absolute"
            style={{
              left: "20%",
              bottom: "-30%",
              width: "30%",
              maxWidth: "900px",
            }}
          >
            <Image
              src={getImagePath("/images/solana-palm.png")}
              alt=""
              width={580}
              height={975}
              className="h-auto w-full opacity-90"
              style={{
                transform: "rotate(-30deg)",
              }}
            />
          </div>
        </div>
      ) : (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="relative h-full w-full max-w-[1464px]">
            <Image
              src={getImagePath(backgroundImage)}
              alt=""
              fill
              className="object-contain opacity-[0.8]"
            />
          </div>
        </div>
      )}

      {/* Dots pattern - overlaid, anchored to bottom, repeating horizontally */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 z-[1] h-[200px] sm:h-[250px] md:h-[300px] lg:h-[322px] opacity-70"
        style={{
          backgroundImage: `url('${getImagePath("/images/dots.svg")}')`,
          backgroundRepeat: "repeat-x",
          backgroundPosition: "bottom",
        }}
      />

      <div className="container-accelerate relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
          className="flex flex-col items-center gap-[40px] text-center lg:gap-[80px]"
        >
          {/* Text block: "Don't miss" + "SOLANA ACCELERATE" */}
          <div className="flex w-full flex-col gap-[10px] lg:gap-[20px]">
            {/* "Don't miss" subtitle */}
            <motion.p
              variants={fadeInUp}
              className="text-xl font-light leading-none text-accelerate-gray-light sm:text-2xl md:text-3xl lg:text-hero"
            >
              {t("dontMiss")}
            </motion.p>

            {/* "SOLANA ACCELERATE" heading with gradient */}
            <motion.h2
              variants={fadeInUp}
              className="text-4xl font-light leading-none sm:text-5xl md:text-6xl lg:text-hero"
            >
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(5.72deg, #9945FF 10.43%, #8752F3 30.85%, #5497D5 49.41%, #43B4CA 58.69%, #28E0B9 69.83%, #19FB9B 93.03%)",
                }}
              >
                {t("solana")} {t("accelerate")}
              </span>
            </motion.h2>
          </div>

          {/* CTA block: Button + "Limited tickets available" */}
          <div className="flex flex-col items-center gap-[30px] lg:gap-[61px]">
            {/* CTA Button */}
            <motion.div variants={fadeInUp}>
              <LumaModal lumaId={lumaId}>
                <button className="btn-cta group h-[56px] w-[320px] justify-between px-[20px] sm:h-[66px] sm:w-[480px] sm:px-[28px]">
                  <span className="text-sm uppercase tracking-[0.9px] font-semibold leading-none sm:text-lg">
                    {t("requestToJoin")}
                  </span>
                  <Image
                    src={getImagePath("/images/ticket-icon.svg")}
                    alt=""
                    width={18}
                    height={12}
                    className="flex-shrink-0"
                  />
                </button>
              </LumaModal>
            </motion.div>

            {/* "Limited tickets available" text */}
            <motion.p
              variants={fadeInUp}
              className="text-lg text-accelerate-green font-normal leading-[1.1] sm:text-xl md:text-[32px]"
            >
              {t("limitedTickets")}
            </motion.p>
          </div>
        </motion.div>
      </div>

      {/* Bottom copyright */}
      <div className="relative z-10 mt-12 text-center sm:mt-16 md:mt-20">
        <p className="text-xs text-white/30 sm:text-sm">{t("copyright")}</p>
      </div>
    </section>
  );
}
