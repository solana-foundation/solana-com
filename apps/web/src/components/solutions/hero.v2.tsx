import React from "react";
import type { ComponentType } from "react";
import Image from "next/image";
import { Button } from "@/app/components/ui/button";
import { ArrowDownToLine } from "lucide-react";
import { cn } from "@/app/components/utils";
import UnicornScene from "unicornstudio-react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

export type SolutionHeroStat = {
  value: string;
  label: string;
  Icon?:
    | string
    | ComponentType<{
        className?: string;
        size?: string | number;
        "aria-hidden"?: boolean;
      }>;
};

export type SolutionHeroProps = {
  title: string;
  subtitle: string;
  reportEyebrow?: string;
  reportDescription?: string;
  emailCta?: string;
  onEmailClick?: () => void;
  extraCta?: string;
  extraCtaHref?: string;
  stats?: SolutionHeroStat[];
  reportImgSrc?: string;
  bgJsonFilePath?: string;
};

/**
 * Displays a hero section with a title, subtitle, stats, and an email CTA.
 *
 * @component
 * @param {SolutionHeroProps} props - The props for the component.
 * @param {string} props.title - The title of the hero section.
 * @param {string} props.subtitle - The subtitle of the hero section.
 * @param {string} props.reportEyebrow - The eyebrow of the report.
 * @param {string} props.reportDescription - The description of the report.
 * @param {string} props.emailCta - The email CTA.
 * @param {() => void} props.onEmailClick - The function to call when the email CTA is clicked.
 * @param {string} props.extraCta - The extra CTA.
 * @param {string} props.extraCtaHref - The href of the extra CTA.
 * @param {SolutionHeroStat[]} props.stats - The stats to display in the hero section.
 * @param {string} props.reportImgSrc - The source of the report image.
 * @param {string} props.bgJsonFilePath - The path to the background JSON file.
 *
 * @example
 * <SolutionHero
 *   title="Hero Title"
 *   subtitle="Hero Subtitle"
 *   stats={[{ value: "100", label: "Stat 1" }]}
 * />
 */
export const SolutionHero: React.FC<SolutionHeroProps> = ({
  title,
  subtitle,
  reportEyebrow,
  reportDescription,
  emailCta,
  onEmailClick,
  extraCta,
  extraCtaHref,
  stats,
  reportImgSrc,
  bgJsonFilePath,
}) => {
  const { ref: statsRef, isIntersecting } =
    useIntersectionObserver<HTMLDivElement>({
      threshold: 0.2,
      triggerOnce: true,
    });

  // Render a line break after every new line
  const titleNodes = React.useMemo(
    () =>
      title.split(/(\n)/).map((part, idx) =>
        part === "\n" ? (
          <React.Fragment key={idx}>
            <br />
          </React.Fragment>
        ) : (
          part
        ),
      ),
    [title],
  );

  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-black text-white text-left"
      aria-labelledby="hero-title"
    >
      {bgJsonFilePath && (
        <UnicornScene
          className="!absolute inset-0 z-0"
          jsonFilePath={bgJsonFilePath}
          width="100%"
          height="100%"
          scale={1}
          dpi={typeof window !== "undefined" ? window.devicePixelRatio : 2}
          fps={30}
          lazyLoad={true}
          production={true}
          onError={(error) => console.error("UnicornScene error:", error)}
        />
      )}
      <div className="min-h-[844px] md:min-h-[1080px] xl:min-h-[1200px] max-w-[1440px] mx-auto flex flex-col justify-between relative">
        {/* Hero Content */}
        <div className="px-[20px] md:px-[32px] xl:px-[40px] py-[64px] md:py-[112px] xl:py-[160px] max-w-5xl">
          <h1
            id="hero-title"
            className="m-0 font-brand font-medium leading-[1.1] md:leading-none text-[40px] md:text-[56px] xl:text-[88px] tracking-[-1.6px] md:tracking-[-2.24px] xl:tracking-[-3.52px]"
          >
            {titleNodes}
          </h1>
          <p className="text-[#ABABBA] text-lg md:text-2xl mt-[12px] xl:mt-[24px] mb-0 max-w-xl tracking-[-0.36px] md:tracking-[-0.48px] leading-[1.33]">
            {subtitle}
          </p>

          {extraCta && extraCtaHref && (
            <div className="mt-[32px] xl:mt-[64px]">
              <Button
                className="rounded-full text-base md:text-lg px-5 bg-white text-black hover:!bg-white/90 tracking-[-0.16px] md:tracking-[-0.18px]"
                size="lg"
                asChild
              >
                <a
                  href={extraCtaHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={extraCta}
                >
                  {extraCta}
                </a>
              </Button>
            </div>
          )}

          {emailCta && onEmailClick && (
            <div className="mt-[32px] xl:mt-[64px]">
              <Button
                className="rounded-full text-base md:text-lg px-5 bg-white text-black hover:!bg-white/90 tracking-[-0.16px] md:tracking-[-0.18px]"
                size="lg"
                aria-label={emailCta}
                onClick={onEmailClick}
              >
                <ArrowDownToLine
                  aria-hidden={true}
                  className="-ml-2 p-1 !size-6 bg-black text-white rounded-full"
                  strokeWidth={3}
                />
                {emailCta}
              </Button>
            </div>
          )}
        </div>

        {/* Bottom Content */}
        {((stats && stats.length > 0) || (emailCta && onEmailClick)) && (
          <div
            ref={statsRef}
            className="w-full flex flex-col xl:flex-row xl:pb-10"
          >
            {/* Stats */}
            <div
              className={cn(
                "grid grid-cols-2 xl:grid-cols-4 w-full xl:min-h-44",
                {
                  "xl:w-2/3": Boolean(emailCta),
                  "xl:grid-cols-2": stats.length === 2,
                  "xl:grid-cols-3": stats.length === 3,
                  "xl:grid-cols-4": stats.length > 3,
                },
              )}
            >
              {stats?.map((stat, index) => (
                <div
                  key={stat.label}
                  className={cn(
                    "p-[16px] xl:p-[16px_24px] flex flex-col justify-between gap-4 max-xl:border-t border-white/15",
                    {
                      "border-l  ": index % 2,
                      "xl:border-l ": index,
                      "animate-fade-in-up": isIntersecting,
                    },
                  )}
                  style={
                    isIntersecting
                      ? { animationDelay: `${0.1 + index * 0.1}s` }
                      : { opacity: 0 }
                  }
                >
                  <div className="max-md:hidden">
                    {stat.Icon && typeof stat.Icon === "string" ? (
                      <Image
                        src={stat.Icon}
                        alt=""
                        width={32}
                        height={32}
                        className="xl:size-8 md:size-5"
                      />
                    ) : stat.Icon ? (
                      <stat.Icon className="xl:size-8 md:size-5" />
                    ) : null}
                  </div>
                  <div>
                    <div className="text-[20px] xl:text-[40px] leading-none uppercase font-light">
                      {stat.value}
                    </div>
                    <div className="mt-[6px] md:mt-[8px] text-[14px] md:text-[18px] font-medium leading-[1.42] md:leading-[1.44] xl:leading-[1.33]">
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
              {stats.length % 2 !== 0 && (
                <div
                  className={cn(
                    "p-[16px] xl:p-[16px_24px] flex flex-col justify-between gap-4 max-xl:border-t border-white/15 xl:hidden border-l",
                    {
                      "animate-fade-in-up": isIntersecting,
                    },
                  )}
                  style={
                    isIntersecting
                      ? { animationDelay: `${0.1 + stats.length * 0.1}s` }
                      : { opacity: 0 }
                  }
                />
              )}
            </div>

            {/* Download Section */}
            {emailCta && onEmailClick && (
              <div className="overflow-hidden w-full xl:w-1/3 p-[0_12px_12px] md:p-[12px] xl:p-[0_24px_0_0]">
                <div className="flex flex-row items-stretch p-4 md:p-6 bg-white xl:bg-[url('/src/img/solutions/hero-texture.svg')] bg-cover bg-[position:right_bottom] text-black rounded-xl">
                  {reportImgSrc && (
                    <div className="grow-0 shrink-0 mr-4">
                      <Image
                        src={reportImgSrc}
                        alt=""
                        width={114}
                        height={152}
                        className="!h-auto w-[80px] md:w-[70px] xl:w-[114px]"
                        quality={100}
                      />
                    </div>
                  )}
                  <div className="grow flex flex-col justify-between gap-[12px] xl:gap-4">
                    <div>
                      {reportEyebrow && (
                        <p className="font-medium text-base md:text-lg m-0 tracking-[-0.16px] md:tracking-[-0.18px] xl:tracking-[-0.2px]">
                          {reportEyebrow}
                        </p>
                      )}
                      {reportDescription && (
                        <p className="text-[14px] md:text-base opacity-70 mb-0 mt-[3px] tracking-[-0.14px] md:tracking-[-0.16px] leading-[1.25] md:leading-[1.44]">
                          {reportDescription}
                        </p>
                      )}
                    </div>
                    <div>
                      <Button
                        className="rounded-full text-base font-light px-4 h-8 bg-black text-white hover:!bg-black/90 tracking-[-0.16px] md:tracking-[-0.18px]"
                        size="lg"
                        aria-label={emailCta}
                        onClick={onEmailClick}
                      >
                        <ArrowDownToLine
                          aria-hidden={true}
                          className="-ml-2 p-1 !size-5 bg-white text-black rounded-full"
                          strokeWidth={3}
                        />
                        {emailCta}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
