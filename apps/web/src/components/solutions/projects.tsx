import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import styles from "./projects.module.scss";
import { Logos, LogosProps } from "./logos";

export type Project = {
  key: string;
  src: string;
  bg?: string;
};

type EcoProjectsProps = {
  projects: Project[];
  translationBase: string;
  headingType?: "icon" | "logo";
  maxCols?: number;
  hideStats?: boolean;
} & Partial<LogosProps>;

/**
 * Displays a grid of eco-friendly projects with stats and a scrolling marquee of project logos.
 *
 * @component
 * @param {EcoProjectsProps} props - The props for the component.
 * @param {Project[]} props.projects - Array of project objects to display in the grid. Each project includes a key, icon, and background color.
 * @param {Logo[]} props.logos - Array of logo objects to display in the marquee. Each logo includes a source URL and background color.
 * @param {string} [props.translationBase] - Base key for translations eg. translationBase = "depin.ecoProjects"".
 * @param {number} [props.maxCols] - Maximum number of columns to display in the grid.
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
  maxCols,
  hideStats = false,
}: EcoProjectsProps) => {
  const t = useTranslations();

  return (
    <div className="col-span-full md:col-span-2">
      <div className="mx-auto">
        <div
          className={`grid gap-3 w-full grid-cols-1 ${styles["custom-md-cols"]}`}
          style={
            {
              "--custom-cols": maxCols || projects.length,
            } as React.CSSProperties
          }
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
                {!hideStats && (
                  <>
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
                  </>
                )}
              </article>
            );
          })}
        </div>
        {logos && logos.length > 0 && (
          <div className="mt-8">
            <Logos logos={logos} />
          </div>
        )}
      </div>
    </div>
  );
};
