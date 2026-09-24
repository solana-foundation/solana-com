"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { useTranslations } from "@workspace/i18n/client";
import { LumaModal } from "./LumaModal";
import { YoutubeEmbed } from "./YoutubeEmbed";
import { EventHeader } from "./EventHeader";
import { getImagePath } from "@/config";
import { fadeInUp, stagger } from "@/lib/animations";

interface HeroProps {
  translationPrefix?: string;
  skylineImage?: string;
  logoImage?: string;
  logoAlt?: string;
  homePath?: string;
  agendaPath?: string | null;
  showSpeakersNav?: boolean;
  showVideo?: boolean;
  showCta?: boolean;
  videoId?: string;
  videoPlatform?: "youtube" | "vimeo";
  vimeoHash?: string;
  ctaLabel?: string;
  lumaId?: string;
  backgroundContent?: React.ReactNode;
}

export function Hero({
  translationPrefix = "accelerate",
  skylineImage = "/images/hk-skyline.svg",
  logoImage = "/images/accelerate-logo.svg",
  logoAlt,
  homePath = "/accelerate",
  agendaPath = "/accelerate/hong-kong/agenda",
  showSpeakersNav = true,
  showVideo = true,
  showCta = false,
  videoId = "LsfnC62q8oE",
  videoPlatform = "youtube",
  vimeoHash,
  ctaLabel,
  lumaId,
  backgroundContent,
}: HeroProps = {}) {
  const t = useTranslations(translationPrefix);

  return (
    <section className="relative h-[600px] md:h-[750px] lg:h-[932px] w-full overflow-hidden bg-black">
      {/* Purple/Magenta gradient glow on left */}
      <div className="pointer-events-none absolute -left-[100px] top-0 h-full w-[800px]">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 30% 50%, rgba(153, 69, 255, 0.6) 0%, rgba(137, 58, 233, 0.4) 30%, rgba(100, 40, 180, 0.2) 50%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
      </div>

      {/* Background content (Miami symbols) or default skyline */}
      {backgroundContent ? (
        <div className="pointer-events-none absolute inset-0 z-[1]">
          {backgroundContent}
        </div>
      ) : (
        <div
          className="pointer-events-none absolute left-1/2 top-0 z-[1] h-[600px] md:h-[750px] lg:h-[932px] w-[1187px] -translate-x-1/2"
          style={{ transform: "translateX(-50%) scaleY(-1) rotate(180deg)" }}
        >
          <Image
            src={getImagePath(skylineImage)}
            alt=""
            fill
            className="object-contain"
            priority
          />
        </div>
      )}

      {/* Dots pattern (z-2: between skyline and wave) */}
      <div className="pointer-events-none absolute bottom-0 right-0 z-[2] h-[200px] md:h-[250px] lg:h-[322px] w-full">
        <Image
          src={getImagePath("/images/dots.svg")}
          alt=""
          fill
          className="object-cover object-right-bottom"
        />
      </div>

      {/* Wave lines - Footer Element (z-3: top decorative layer) */}
      <div className="pointer-events-none absolute left-0 top-[250px] md:top-[320px] lg:top-[406px] z-[3] h-[350px] md:h-[430px] lg:h-[526px] w-full">
        <Image
          src={getImagePath("/images/wave-lines.svg")}
          alt=""
          fill
          className="object-cover"
        />
      </div>

      {/* Pills Left */}
      <div
        className="pointer-events-none absolute hidden lg:block"
        style={{ left: "-62px", top: "186px", width: "433px", height: "191px" }}
      >
        <Image
          src={getImagePath("/images/pills-left.svg")}
          alt=""
          width={433}
          height={191}
        />
      </div>

      {/* Pills Right - rotated 180deg */}
      <div
        className="pointer-events-none absolute hidden lg:block"
        style={{
          left: "calc(100% - 419px)",
          top: "261px",
          width: "359px",
          height: "116px",
          transform: "rotate(180deg)",
        }}
      >
        <Image
          src={getImagePath("/images/pills-right.svg")}
          alt=""
          width={359}
          height={116}
        />
      </div>

      <EventHeader
        variant="hero"
        translationPrefix={translationPrefix}
        homePath={homePath}
        agendaPath={agendaPath}
        logoImage={logoImage}
        logoAlt={logoAlt ?? t("nav.logoAlt")}
        showSpeakersNav={showSpeakersNav}
        showCta={showCta}
        ctaLabel={ctaLabel}
        lumaId={lumaId}
      />

      {/* Main Content */}
      <div className="absolute inset-x-0 bottom-0 top-[120px] z-10 flex flex-col items-center justify-center px-4 md:top-[140px] md:px-8 lg:top-[160px]">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="flex w-full max-w-[960px] flex-col items-center gap-4 md:gap-6"
        >
          {showVideo ? (
            <>
              {/* Title row */}
              <motion.div
                variants={fadeInUp}
                className="flex items-center justify-center"
              >
                <h1 className="text-center text-lg font-semibold uppercase tracking-[0.15em] text-accelerate-gray-light sm:text-xl md:text-2xl leading-none">
                  {t("hero.title")}
                  <span className="ml-2 text-accelerate-green">/</span>
                  <span className="ml-2 text-accelerate-green">
                    {t("hero.dateLocation")}
                  </span>
                </h1>
              </motion.div>

              {/* Event video */}
              <motion.div variants={fadeInUp} className="w-full">
                <YoutubeEmbed
                  id={videoId}
                  platform={videoPlatform}
                  vimeoHash={vimeoHash}
                  title={t("hero.title")}
                />
              </motion.div>
            </>
          ) : (
            <>
              {/* Centered hero content — matches Figma layout */}
              <motion.div
                variants={fadeInUp}
                className="flex flex-col items-center gap-[20px] text-center"
              >
                <p className="text-lg text-accelerate-green font-normal leading-[1.1] sm:text-xl md:text-2xl lg:text-[32px]">
                  {t("hero.dateLocation")}
                </p>
                <h1 className="text-3xl font-light leading-none text-accelerate-gray-light font-diatype sm:text-4xl md:text-5xl lg:text-[60px]">
                  {t("hero.title")}
                </h1>
              </motion.div>

              {/* CTA Button */}
              {showCta && (
                <motion.div variants={fadeInUp}>
                  <LumaModal lumaId="accelerate-miami">
                    <button className="btn-cta group h-[56px] w-[320px] justify-between px-[28px] py-[24px] sm:h-[66px] sm:w-[480px]">
                      <span className="text-sm uppercase tracking-[0.9px] font-semibold leading-none sm:text-lg">
                        {ctaLabel || t("nav.requestToJoin")}
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
              )}
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
}
