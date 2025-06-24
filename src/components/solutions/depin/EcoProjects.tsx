import React from "react";
import Image from "next/image";
import { useTranslation } from "next-i18next";

const PROJECTS = [
  {
    key: "helium",
    icon: (
      <Image
        src="/src/img/solutions/depin/helium.png"
        alt="Helium logo"
        fill
        className="object-contain"
        loading="lazy"
      />
    ),
    bg: "#181F24",
  },
  {
    key: "render",
    icon: (
      <Image
        src="/src/img/solutions/depin/render.png"
        alt="Render logo"
        fill
        className="object-contain"
        loading="lazy"
      />
    ),
    bg: "#FF2D2E",
  },
  {
    key: "hivemapper",
    icon: (
      <Image
        src="/src/img/solutions/depin/hivemapper.png"
        alt="Hivemapper logo"
        fill
        className="object-contain"
        loading="lazy"
      />
    ),
    bg: "#4B6FFF",
  },
  {
    key: "grass",
    icon: (
      <Image
        src="/src/img/solutions/depin/grass.png"
        alt="Grass logo"
        fill
        className="object-contain"
        loading="lazy"
      />
    ),
    bg: "#B6FF3A",
  },
];

export const EcoProjects = () => {
  const { t } = useTranslation("common");

  return (
    <div className="col-span-full md:col-span-2 py-6">
      <div className="mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PROJECTS.map((project) => {
            const base = `depin.ecoProjects.${project.key}`;
            return (
              <div
                key={project.key}
                className="flex flex-col h-full bg-[#181F24] rounded-2xl p-4 shadow-lg"
                style={{
                  background:
                    "linear-gradient(to top, #101520 0%, #202731 100%)",
                }}
              >
                <div
                  className="mb-4 relative w-10 h-10 rounded-full overflow-hidden flex items-center justify-center"
                  style={{ background: project.bg }}
                >
                  {project.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  {t(`${base}.name`)}
                </h3>
                <p className="text-gray-300 text-base mb-3 flex-1">
                  {t(`${base}.description`)}
                </p>
                <hr className="border-[#FFFFFF] mb-4" />
                <div className="mb-4">
                  <div className="text-3xl font-bold text-white">
                    {t(`${base}.stat`)}
                  </div>
                  <div className="text-gray-400 text-sm">
                    {t(`${base}.statLabel`)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
