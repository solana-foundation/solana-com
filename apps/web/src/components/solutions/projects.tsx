import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import Marquee from "@/component-library/marquee";
import styles from "./projects.module.scss";

type Project = {
  key: string;
  src: string;
  bg?: string;
};

type Logo = {
  src: string;
  alt: string;
  bg: string;
};

type EcoProjectsProps = {
  projects: Project[];
  logos: Logo[];
  translationBase: string;
  headingType?: "icon" | "logo";
};

/**
 * Displays a grid of eco-friendly projects with stats and a scrolling marquee of project logos.
 *
 * @component
 * @param {EcoProjectsProps} props - The props for the component.
 * @param {Project[]} props.projects - Array of project objects to display in the grid. Each project includes a key, icon, and background color.
 * @param {Logo[]} props.logos - Array of logo objects to display in the marquee. Each logo includes a source URL and background color.
 * @param {string} [props.translationBase] - Base key for translations eg. translationBase = "depin.ecoProjects"".
 * @returns {JSX.Element} The rendered EcoProjects section.
 *
 * @example
 * <EcoProjects
 *   projects={[{ key: "foo", icon: <IconFoo />, bg: "#123" }]}
 *   logos={[{ src: "/logo.png", bg: "#fff" }]}
 * />
 */
export const Projects = ({
  projects,
  logos,
  translationBase,
  headingType = "icon",
}: EcoProjectsProps) => {
  const t = useTranslations();

  const items = logos.map((logo, i) => (
    <div
      key={`${logo.alt}-${i}`}
      className={`flex items-center justify-center mr-4 mt-6 max-w-[200px] aspect-video relative rounded-sm p-[5px] min-w-[100px] min-h-[70px] ${logo.bg}`}
    >
      <img
        src={logo.src}
        alt={logo.alt}
        className="object-contain w-4/5 h-4/5"
        loading="lazy"
        style={{ display: "block" }}
      />
    </div>
  ));

  return (
    <div className="col-span-full md:col-span-2">
      <div className="mx-auto">
        <div
          className={`grid gap-3 w-full grid-cols-1 ${styles["custom-md-cols"]}`}
          style={{ "--custom-cols": projects.length } as React.CSSProperties}
        >
          {projects.map((project) => {
            const base = `${translationBase}.${project.key}`;
            return (
              <article
                key={project.key}
                className="flex flex-col bg-[#181F24] rounded-2xl p-4 shadow-lg w-full h-full"
                style={{
                  background:
                    "linear-gradient(to top, #101520 0%, #202731 100%)",
                }}
                aria-labelledby={`${project.key}-title`}
              >
                {headingType === "icon" ? (
                  <>
                    <div
                      className="mb-4 relative w-10 h-10 rounded-full overflow-hidden flex items-center justify-center"
                      style={{ background: project.bg }}
                    >
                      <Image
                        src={project.src}
                        alt={project.key}
                        fill
                        className="object-contain"
                        loading="lazy"
                      />
                    </div>
                    <h3
                      id={`${project.key}-title`}
                      className="text-2xl font-bold text-white mb-2"
                    >
                      {t(`${base}.name`)}
                    </h3>
                  </>
                ) : (
                  <div className="mb-4 w-full flex flex-col items-start">
                    <Image
                      src={project.src}
                      alt={project.key}
                      width={120}
                      height={60}
                      className="object-contain min-h-12 max-h-12"
                      loading="lazy"
                    />
                    <hr className="border-[#FFFFFF] mb-4 w-full" />
                  </div>
                )}
                <p className="text-gray-300 text-base mb-3 flex-1">
                  {t(`${base}.description`)}
                </p>
                <hr className="border-[#FFFFFF] mb-4" />
                <dl className="mb-4">
                  <dt className="sr-only">{t(`${base}.statLabel`)}</dt>
                  <dd className="text-3xl font-bold text-white">
                    {t(`${base}.stat`)}
                  </dd>
                  <div className="text-gray-400 text-sm">
                    {t(`${base}.statLabel`)}
                  </div>
                </dl>
              </article>
            );
          })}
        </div>
        <div className="relative w-full mt-4">
          {/* Left Blur */}
          <div className="pointer-events-none absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-[#090d17] to-transparent z-10" />
          {/* Right Blur */}
          <div className="pointer-events-none absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-[#090d17] to-transparent z-10" />
          <Marquee className="w-full">{items}</Marquee>
        </div>
      </div>
    </div>
  );
};
