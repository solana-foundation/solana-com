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
  stats: SolutionHeroStat[];
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
          className="!absolute top-0 right-0 bottom-0 -z-1"
          jsonFilePath={bgJsonFilePath}
          width="100%"
          height="100%"
          scale={1}
          dpi={1}
          fps={30}
          lazyLoad={true}
          production={true}
        />
      )}
      <div className="min-h-[844px] md:min-h-[1080px] xl:min-h-[1200px] max-w-sm md:max-w-3xl xl:max-w-[1440px] mx-auto flex flex-col justify-between relative">
        {/* Hero Content */}
        <div className="px-5 md:px-[32px] xl:px-[40px] py-[64px] md:py-[112px] xl:py-[160px] max-w-5xl">
          <h1
            id="hero-title"
            className="m-0 font-brand font-medium leading-none text-[40px] md:text-[56px] xl:text-[88px]"
          >
            {titleNodes}
          </h1>
          <p className="text-[#ABABBA] text-lg md:text-2xl mt-6 mb-0 max-w-xl">
            {subtitle}
          </p>

          {emailCta && onEmailClick && (
            <div className="mt-[32px] xl:mt-[64px]">
              <Button
                className="rounded-full text-base md:text-lg px-5 bg-white text-black hover:!bg-white/90"
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
        {(stats.length > 0 || (emailCta && onEmailClick)) && (
          <div
            ref={statsRef}
            className="w-full flex flex-col xl:flex-row xl:pb-10"
          >
            {/* Stats */}
            <div
              className={cn("grid grid-cols-2 xl:grid-cols-4 w-full", {
                "xl:w-2/3": Boolean(emailCta),
                "xl:grid-cols-2": stats.length === 2,
                "xl:grid-cols-3": stats.length === 3,
                "xl:grid-cols-4": stats.length > 3,
              })}
            >
              {stats.map((stat, index) => (
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
                    <div className="mt-[4px] md:mt-[8px] text-[16px] md:text-[18px] leading-none font-medium">
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Download Section */}
            {emailCta && onEmailClick && (
              <div className="overflow-hidden w-full xl:w-1/3 p-[0_12px_12px] md:p-[12px] xl:p-[0_24px_0_0]">
                <div className="flex flex-row items-stretch p-4 md:p-6 bg-white text-black rounded-xl">
                  {reportImgSrc && (
                    <div className="grow-0 shrink-0 mr-4">
                      <Image
                        src={reportImgSrc}
                        alt=""
                        width={114}
                        height={152}
                        className="!h-auto w-[80px] md:w-[70px] xl:w-[114px]"
                      />
                    </div>
                  )}
                  <div className="grow flex flex-col justify-between gap-4">
                    <div>
                      {reportEyebrow && (
                        <p className="font-bold text-base md:text-lg m-0">
                          {reportEyebrow}
                        </p>
                      )}
                      {reportDescription && (
                        <p className="text-sm md:text-base opacity-70 m-0 mt-2">
                          {reportDescription}
                        </p>
                      )}
                    </div>
                    <div>
                      <Button
                        className="rounded-full text-base px-4 h-8 bg-black text-white hover:!bg-black/90"
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
