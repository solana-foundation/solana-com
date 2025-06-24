import React from "react";
import Image from "next/image";

const PROJECTS = [
  {
    name: "Helium",
    icon: (
      <Image
        src="/img/solutions/depin/helium.png"
        alt="Helium logo"
        fill
        className="object-contain"
        loading="lazy"
      />
    ),
    description:
      "Helium is a wireless network, deployed by 100k+ hotspot owners worldwide and used by telecom giants like T-Mobile and AT&T.",
    stat: "350K",
    statLabel: "Daily Subscribers",
  },
  {
    name: "Render",
    icon: (
      <Image
        src="/img/solutions/depin/render.png"
        alt="Render logo"
        fill
        className="object-contain"
        loading="lazy"
      />
    ),
    description:
      "GPU rendering platform designed to supercharge creative workflows. Harness idle GPU power worldwide.",
    stat: "40M",
    statLabel: "Frames Rendered",
  },
  {
    name: "Hivemapper",
    icon: (
      <Image
        src="/img/solutions/depin/hivemapper.png"
        alt="Hivemapper logo"
        fill
        className="object-contain"
        loading="lazy"
      />
    ),
    description:
      "Hivemapper is a crowdsourced map, built by a community of people who take images of the world while they drive.",
    stat: "30%",
    statLabel: "of the World's Roads Mapped",
  },
  {
    name: "Grass",
    icon: (
      <Image
        src="/img/solutions/depin/grass.png"
        alt="Grass logo"
        fill
        className="object-contain"
        loading="lazy"
      />
    ),
    description:
      "Grass is a network of millions of people who are earning rewards for sharing unused internet bandwidth with the Grass network.",
    stat: "1B GB",
    statLabel: "Data Scaped everyday",
  },
];

export const EcoProjects = () => (
  <div className="col-span-full md:col-span-2 py-6">
    <div className="mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {PROJECTS.map((project) => (
          <div
            key={project.name}
            className="flex flex-col h-full bg-[#181F24] rounded-2xl p-4 shadow-lg"
            style={{
              background: "linear-gradient(to top, #101520 0%, #202731 100%)",
            }}
          >
            <div
              className="mb-4 relative w-10 h-10 rounded-full overflow-hidden flex items-center justify-center"
              style={{
                background:
                  project.name === "Helium"
                    ? "#181F24"
                    : project.name === "Render"
                      ? "#FF2D2E"
                      : project.name === "Hivemapper"
                        ? "#4B6FFF"
                        : "#B6FF3A",
              }}
            >
              {project.icon}
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              {project.name}
            </h3>
            <p className="text-gray-300 text-base mb-3 flex-1">
              {project.description}
            </p>
            <hr className="border-[#FFFFFF] mb-4" />
            <div className="mb-4">
              <div className="text-3xl font-bold text-white">
                {project.stat}
              </div>
              <div className="text-gray-400 text-sm">{project.statLabel}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);
