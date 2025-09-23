import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Logos, LogosProps } from "./logos";
import { cn } from "@/app/components/utils";

export type Project = {
  key: string;
  src: string;
  bg?: string;
};

type EcoProjectsProps = {
  title: React.ReactNode;
  projects: Project[];
  translationBase: string;
  headingType?: "icon" | "logo";
  hideStats?: boolean;
} & Partial<LogosProps>;

/**
 * Displays a grid of eco-friendly projects with stats and a scrolling marquee of project logos.
 *
 * @component
 * @param {EcoProjectsProps} props - The props for the component.
 * @param {React.ReactNode} props.title - The title of the section.
 * @param {Project[]} props.projects - Array of project objects to display in the grid. Each project includes a key, icon, and background color.
 * @param {Logo[]} props.logos - Array of logo objects to display in the marquee. Each logo includes a source URL and background color.
 * @param {string} [props.translationBase] - Base key for translations eg. translationBase = "depin.ecoProjects"".
 * @param {number} [props.maxCols] - Maximum number of columns to display in the grid.
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
}: EcoProjectsProps) => {
  const t = useTranslations();

  return (
    <section className="relative overflow-hidden bg-black text-white text-left">
      <div className="py-[64px] md:py-[112px] xl:py-[160px]">
        <div className="max-w-sm md:max-w-3xl xl:max-w-[1440px] mx-auto px-5 md:px-[32px] xl:px-[40px]">
          <h2 className="font-brand font-medium leading-none text-[32px] md:text-[40px] xl:text-[64px] max-w-xl mb-[32px] xl:mb-[64px] mx-auto">
            {title}
          </h2>
        </div>
        <div>
          <div className="overflow-auto">
            <div className="flex flex-row justify-stretch">
              <div className="w-5 md:w-[32px] xl:w-[40px] shrink-0"></div>
              {projects.map((project, index) => {
                const base = `${translationBase}.${project.key}`;
                return (
                  <article
                    key={project.key}
                    className={cn(
                      "shrink-0 border-white/10 border-t border-b bg-gradient-to-t from-[#0E0E18] to-[#020104]",
                      "p-[24px_20px_32px] xl:p-[24px_32px_32px] w-[340px] md:w-[420px] min-h-[520px] xl:min-h-[680px]",
                      "flex flex-col justify-between",
                      {
                        "rounded-tl-2xl rounded-bl-2xl border-l": index === 0,
                        "rounded-tr-2xl rounded-br-2xl border-r":
                          index === projects.length - 1,
                      },
                    )}
                    aria-labelledby={`${project.key}-title`}
                  >
                    <div>
                      <Image
                        src={project.src}
                        alt={project.key}
                        width={120}
                        height={60}
                        className="object-contain min-h-12 max-h-12"
                        loading="lazy"
                      />
                      <hr className="border-white/10 border-t opacity-100 mt-[24px] mb-[32px]" />
                      <p className="text-[#ABABBA] text-base md:text-lg xl:text-xl">
                        {t(`${base}.description`)}
                      </p>
                    </div>
                    {!hideStats && (
                      <dl className="mt-[32px] mb-0">
                        <dt className="sr-only">{t(`${base}.statLabel`)}</dt>
                        <dd className="text-[52px] leading-none mb-1">
                          {t(`${base}.stat`)}
                        </dd>
                        <div className="text-base md:text-lg xl:text-xl">
                          {t(`${base}.statLabel`)}
                        </div>
                      </dl>
                    )}
                  </article>
                );
              })}
              <div className="w-5 md:w-[32px] xl:w-[40px] shrink-0"></div>
            </div>
          </div>
          {logos && logos.length > 0 && (
            <div className="mt-8">
              <Logos logos={logos} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
