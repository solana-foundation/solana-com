import React, { useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Logos, LogosProps } from "./logos.v2";
import { cn } from "@/app/components/utils";
import Carousel, { CarouselControls } from "@/component-library/carousel";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const NAV_BUTTON_CLASSNAME =
  "backdrop-blur-xs !bg-black/80 [&&&]:!shadow-[0_2px_4px_1px_rgba(0,0,0,0.17),0_-4px_12px_0_rgba(255,255,255,0.08)_inset,0_1px_0_0_rgba(255,255,255,0.20)_inset,0_-1px_0_0_rgba(255,255,255,0.12)_inset]";

export type Project = {
  key: string;
  src: string;
  statIcon?: string;
};

type EcoProjectsProps = {
  title: React.ReactNode;
  projects: Project[];
  translationBase: string;
  hideStats?: boolean;
  statType?: "text" | "icon";
  bgSrc?: string;
} & Partial<LogosProps>;

/**
 * Displays a carousel of eco-friendly projects with stats and an optional logos bar.
 *
 * @component
 * @param {EcoProjectsProps} props - The props for the component.
 * @param {React.ReactNode} props.title - The title of the section.
 * @param {Project[]} props.projects - Array of project objects to display in the grid. Each project includes a key, icon, and background color.
 * @param {Logo[]} props.logos - Array of logo objects to display in the marquee. Each logo includes a source URL and background color.
 * @param {string} [props.translationBase] - Base key for translations eg. translationBase = "depin.ecoProjects".
 * @param {number} [props.maxCols] - Maximum number of columns to display in the grid.
 * @param {string} [props.bgSrc] - The source of the background image.
 * @param {string} [props.statType] - The type of stat to display, either "text" or "icon".
 * @returns {JSX.Element} The rendered EcoProjects section.
 *
 * @example
 * <EcoProjects
 *   title="Ecosystem"
 *   projects={[{ key: "foo", icon: <IconFoo />, bg: "#123" }]}
 *   logos={[{ src: "/logo.png", bg: "#fff" }]}
 * />
 */
export const Projects = ({
  title,
  projects,
  logos,
  translationBase,
  hideStats = false,
  statType = "text",
  bgSrc,
}: EcoProjectsProps) => {
  const t = useTranslations();
  const carouselRef = useRef(null);
  const isTablet = useMediaQuery("(min-width: 768px)");
  const isDesktop = useMediaQuery("(min-width: 1280px)");
  const lastPageOffset = isDesktop ? 3 : isTablet ? 1 : 1;

  return (
    <section className="relative overflow-hidden bg-black text-white text-left">
      <div className="py-[64px] md:py-[112px] xl:py-[160px]">
        <div className="max-w-[1440px] mx-auto px-[20px] md:px-[32px] xl:px-[40px]">
          <div className="flex flex-col xl:flex-row gap-4 xl:items-end mb-[32px] xl:mb-[64px] justify-start">
            <h2 className="font-brand font-medium leading-[1.25] md:leading-[1.1] xl:leading-[1.125] text-[32px] md:text-[40px] xl:text-[64px] max-w-xl mb-0 tracking-[-1.28px] md:tracking-[-1.6px] xl:tracking-[-2.56px]">
              {title}
            </h2>
            <CarouselControls
              className="shrink-0 grow-0"
              carouselRef={carouselRef}
              prevButtonClassName={cn(
                "max-md:!w-10 max-md:!h-10 md:!w-12 md:!h-12 xl:!w-14 xl:!h-14",
                NAV_BUTTON_CLASSNAME,
              )}
              nextButtonClassName={cn(
                "max-md:!w-10 max-md:!h-10 md:!w-12 md:!h-12 xl:!w-14 xl:!h-14",
                NAV_BUTTON_CLASSNAME,
              )}
            />
          </div>
        </div>
        <div className="max-w-[1440px] mx-auto px-[20px] md:px-[32px] xl:px-[40px]">
          <div className="w-[340px] md:w-[420px]">
            <Carousel
              lastPageOffset={lastPageOffset}
              ref={carouselRef}
              controlsInline={false}
              panels={1}
              enableSwipe={true}
              className="!m-0 [&>div]:!overflow-visible [&>div]:!p-0"
              trackClassName="rounded-2xl border-white/10 border-[1px] overflow-hidden"
              trackStyle={{
                backgroundImage: bgSrc ? `url(${bgSrc})` : undefined,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {projects.map((project, index) => {
                const base = `${translationBase}.${project.key}`;
                return (
                  <article
                    key={project.key}
                    className={cn(
                      "relative group shrink-0",
                      "p-[24px_20px_32px] xl:p-[24px_32px_32px] w-[340px] md:w-[420px] min-h-[520px] xl:min-h-[680px]",
                      "flex flex-col justify-between",
                      "backdrop-blur-xl",
                    )}
                    aria-label={project.key}
                  >
                    {index !== 0 && (
                      <div className="absolute top-[25%] bottom-0 left-0 w-0 h-auto [border-image:linear-gradient(to_bottom,rgba(255,255,255,0),rgba(255,255,255,0.15),rgba(255,255,255,0.1))_30] border-l border-transparent"></div>
                    )}
                    <div className="absolute top-[50%] bottom-0 left-0 right-0 opacity-0 group-hover:!opacity-50 bg-[url('/src/img/solutions/eco-pattern.svg')] bg-cover bg-center"></div>
                    <div className="absolute top-0 bottom-0 left-0 right-0 bg-gradient-to-b from-[rgba(0,0,0,0.95)] via-[rgba(0,0,0,0.8)] via-[50%] to-[rgba(0,0,0,0)] to-[80%]"></div>
                    <div className="relative">
                      <div className="relative h-8">
                        <Image
                          src={project.src}
                          alt={project.key}
                          fill
                          sizes="(max-width: 768px) 340px, 420px"
                          className="object-contain w-auto"
                          loading="lazy"
                        />
                      </div>
                      <div className="relative mt-[24px] mb-[32px]">
                        {index !== 0 && (
                          <Image
                            src={"/src/img/solutions/eco-icon.svg"}
                            alt=""
                            width={13}
                            height={13}
                            className="object-contain absolute -top-[6px] -left-[26px] xl:-left-[38px]"
                            loading="lazy"
                          />
                        )}
                        <hr className="border-white/10 border-t opacity-100" />
                      </div>
                      <p className="text-white opacity-[0.64] text-base md:text-lg xl:text-xl tracking-[-0.16px] md:tracking-[-0.18px] xl:tracking-[-0.2px] leading-[1.375] md:leading-[1.33] xl:leading-[1.4]">
                        {t(`${base}.description`)}
                      </p>
                    </div>
                    {!hideStats && (
                      <dl className="mt-[32px] mb-0 relative">
                        {statType === "icon" ? (
                          <div className="relative h-10 overflow-hidden">
                            {project.statIcon && (
                              <Image
                                src={project.statIcon}
                                alt=""
                                fill
                                className="object-contain w-auto"
                                loading="lazy"
                              />
                            )}
                          </div>
                        ) : (
                          <>
                            <dt className="sr-only">
                              {t(`${base}.statLabel`)}
                            </dt>
                            <dd className="text-[52px] leading-none mb-1">
                              {t(`${base}.stat`)}
                            </dd>
                            <div className="text-base md:text-lg xl:text-xl  tracking-[-0.16px] md:tracking-[-0.18px] xl:tracking-[-0.2px] leading-[1.375] md:leading-[1.33] xl:leading-[1.4]">
                              {t(`${base}.statLabel`)}
                            </div>
                          </>
                        )}
                      </dl>
                    )}
                  </article>
                );
              })}
            </Carousel>
          </div>
          {logos && logos.length > 0 && (
            <div className="mt-[32px] xl:mt-[64px]">
              <Logos logos={logos} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
