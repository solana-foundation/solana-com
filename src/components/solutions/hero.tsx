import * as React from "react";
import Image from "next/image";
import { Button } from "@/app/components/ui/button";
import { ChevronRight, ArrowRightIcon } from "lucide-react";

export type SolutionHeroStat = { value: string; label: string };

export type SolutionHeroProps = {
  badge?: string;
  title: string;
  subtitle: string;
  reportEyebrow: string;
  emailCta: string;
  onEmailClick?: () => void;
  stats: SolutionHeroStat[];
  globeImgSrc: string;
  globeImgAlt: string;
  reportImgSrc?: string;
  variant?: "default" | "modern";
};

export const SolutionHero: React.FC<SolutionHeroProps> = ({
  badge,
  title,
  subtitle,
  reportEyebrow,
  emailCta,
  onEmailClick,
  stats,
  globeImgSrc,
  globeImgAlt,
  reportImgSrc,
  variant = "default",
}) => {
  // Split title on first period for line break
  const firstDotIdx = title.indexOf(".");
  const beforeDot =
    firstDotIdx !== -1 ? title.slice(0, firstDotIdx + 1) : title;
  const afterDot = firstDotIdx !== -1 ? title.slice(firstDotIdx + 1) : "";

  if (variant === "modern") {
    return (
      <section
        id="hero"
        className="relative min-h-[calc(100vh-75.4px)] overflow-hidden bg-[#0C1320]"
        aria-labelledby="hero-title"
      >
        <Image
          src="/src/img/solutions/hero-decoration.svg"
          alt=""
          width={37}
          height={181}
          className="absolute top-20 md:top-32 left-0 pointer-events-none max-lg:hidden"
          priority
        />

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-16 items-stretch px-4 sm:px-6 pt-12 md:pt-20">
          <div className="text-left flex flex-col justify-between">
            <h1
              id="hero-title"
              className="text-white font-display text-3xl !leading-[81%] md:text-6xl xl:text-8xl"
            >
              {beforeDot}
              {afterDot && <br />}
              {afterDot}
            </h1>

            {globeImgSrc && (
              <Image
                src={globeImgSrc}
                alt={globeImgAlt}
                width={650}
                height={480}
                className="mt-6 lg:-ml-[20%] max-w-[650px] md:max-w-[450px] w-[65%] md:w-[80%] lg:w-[120%] h-auto "
                priority
              />
            )}
          </div>

          <div className="pb-6 md:pb-12">
            {/* Description */}
            <p className="text-white/65 text-xl mb-6">{subtitle}</p>

            <div
              className="w-full h-px border-t border-white/15 mb-6"
              aria-hidden="true"
            />

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6 md:gap-8 mb-6">
              {stats.map((stat) => (
                <div key={stat.label} className="text-left">
                  <div className="text-2xl md:text-4xl lg:text-6xl leading-none font-bold uppercase text-white">
                    {stat.value}
                  </div>
                  <div className="text-xl leading-none text-white/65">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Download Section */}
            <div className="mt-10 flex flex-row items-end overflow-hidden">
              {reportImgSrc && (
                <Image
                  src={reportImgSrc}
                  alt=""
                  width={170}
                  height={260}
                  className="h-auto max-w-[170px] w-[80px] md:w-[170px] relative max-sm:hidden"
                />
              )}

              <div className="pl-[200px] -ml-[200px] bg-[#212B3E] grow">
                <div className="px-4 md:px-6 py-4">
                  {reportEyebrow && (
                    <p className="text-white font-bold text-lg md:text-2xl leading-none mb-4">
                      {reportEyebrow}
                    </p>
                  )}
                  {emailCta && (
                    <Button
                      size="lg"
                      variant="default"
                      aria-label={emailCta}
                      onClick={onEmailClick}
                      className="w-full sm:w-auto text-lg h-14 rounded-xl px-6 md:ml-4"
                    >
                      {emailCta}
                      <ArrowRightIcon aria-hidden="true" className="ml-1" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="hero"
      className="relative min-h-[calc(100vh-75.4px)] flex flex-col items-center justify-start text-center px-4 pt-12 overflow-hidden bg-[#080d17]
        bg-[radial-gradient(50%_30%_at_75%_70%,rgba(30,135,100,0.45)_0%,rgba(12,87,62,0.45)_40%,rgba(19,24,30,0)_80%),radial-gradient(50%_30%_at_20%_70%,rgba(59,35,212,0.45)_0%,rgba(28,14,113,0.65)_40%,rgba(94,69,255,0)_80%)]
        bg-cover bg-top bg-no-repeat md:px-6 md:pt-20"
      aria-labelledby="hero-title"
    >
      {badge && (
        <div className="mb-6 px-3 py-1.5 bg-white/10 border-2 border-white/10 backdrop-blur-sm rounded-full z-10 flex items-center gap-1.5 md:mb-8 md:px-4 md:py-2">
          <span className="text-gray-400 text-xs font-medium tracking-wider md:text-sm">
            {badge}
          </span>
          <ChevronRight
            className="text-white w-3 h-3 md:w-3.5 md:h-3.5"
            size={14}
          />
        </div>
      )}
      <div className="z-2 max-w-full mx-auto md:max-w-2xl">
        <h1
          id="hero-title"
          className="text-white font-display text-2xl mb-4 leading-tight md:text-4xl md:mb-6 lg:text-5xl xl:text-6xl"
        >
          {beforeDot}
          {afterDot && <br />}
          {afterDot}
        </h1>
        <p className="text-[#848895] text-base leading-snug mb-6 max-w-full mx-auto md:text-lg md:mb-8 md:max-w-xl lg:text-xl">
          {subtitle}
        </p>
        <div
          className="w-20 h-px border-t border-white/25 mx-auto"
          aria-hidden="true"
        />
      </div>

      {/* Report Eyebrow */}
      <p className="mt-4 mb-8 font-medium z-2 text-xs leading-tight text-center tracking-widest text-white uppercase">
        {reportEyebrow}
      </p>

      {/* Email CTA */}
      <div className="flex items-center justify-center z-10">
        <Button
          size="lg"
          variant="default"
          aria-label={emailCta}
          onClick={onEmailClick}
        >
          {emailCta} <ArrowRightIcon aria-hidden="true" className="ml-2" />
        </Button>
      </div>

      {/* Stats Bar */}
      <dl className="z-10 my-10 py-2 px-6 w-full max-w-3xl flex flex-col gap-6 bg-black/20 rounded-xl border-2 border-white/10 backdrop-blur-lg sm:flex-row sm:w-3/5 sm:min-w-[600px] sm:gap-0">
        {stats.map((s, idx) => (
          <React.Fragment key={s.label}>
            <div className="text-center flex-1 min-w-0 flex flex-col justify-center">
              <dt className="sr-only">{s.label}</dt>
              <dd className="text-3xl font-bold uppercase bg-gradient-to-tr from-[#2af8a7] to-[#9164ff] bg-clip-text text-transparent">
                {s.value}
              </dd>
              <span className="block text-sm text-white/65 mt-1">
                {s.label}
              </span>
            </div>
            {idx < stats.length - 1 && (
              <div className="w-12 h-px bg-white/25 my-6 self-center sm:w-px sm:h-20 sm:my-0 sm:mx-1" />
            )}
          </React.Fragment>
        ))}
      </dl>
      <Image
        src={globeImgSrc}
        alt={globeImgAlt}
        width={1400}
        height={800}
        className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 z-0 w-[220%] max-w-none opacity-90
          sm:w-[170%]
          md:w-[140%] md:max-w-[900px]
          lg:w-[120%] lg:max-w-[1000px]"
        priority
      />

      {/* Bottom gradient overlay */}
      <div className="pointer-events-none absolute left-0 right-0 bottom-0 h-32 z-1 bg-gradient-to-t from-[#080d17] to-transparent" />
    </section>
  );
};
