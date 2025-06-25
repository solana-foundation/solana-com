import React, { useRef } from "react";
import Image from "next/image";
import { useTranslation } from "next-i18next";
import Carousel, { CarouselHandle } from "@/component-library/carousel";

import logo1 from "assets/solutions/depin/logo-1.svg";
import logo2 from "assets/solutions/depin/logo-2.svg";
import logo3 from "assets/solutions/depin/logo-3.svg";
import logo4 from "assets/solutions/depin/logo-4.svg";
import logo5 from "assets/solutions/depin/logo-5.svg";
import logo6 from "assets/solutions/depin/logo-6.svg";

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
  {
    key: "geodnet",
    icon: (
      <Image
        src="/src/img/solutions/depin/geodnet.png"
        alt="Geodnet logo"
        fill
        className="object-contain"
        loading="lazy"
      />
    ),
    bg: "#000000",
  },
];

const LOGOS = [logo1, logo2, logo3, logo4, logo5, logo6];

export const EcoProjects = () => {
  const { t } = useTranslation("common");
  const carouselRef = useRef<CarouselHandle>(null);

  const items = LOGOS.map((logo, i) => (
    <div
      key={i}
      className="flex items-center justify-center mr-4 max-w-[200px] aspect-video relative"
    >
      <Image
        src={logo}
        alt={`DePIN Logo ${i + 1}`}
        fill
        style={{ objectFit: "contain", maxHeight: "20px", maxWidth: "120px" }}
        loading="lazy"
      />
    </div>
  ));

  return (
    <div className="col-span-full md:col-span-2 py-6">
      <div className="mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 w-full">
          {PROJECTS.map((project) => {
            const base = `depin.ecoProjects.${project.key}`;
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
                <div
                  className="mb-4 relative w-10 h-10 rounded-full overflow-hidden flex items-center justify-center"
                  style={{ background: project.bg }}
                >
                  {project.icon}
                </div>
                <h3
                  id={`${project.key}-title`}
                  className="text-2xl font-bold text-white mb-2"
                >
                  {t(`${base}.name`)}
                </h3>
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
        {/* <div className="mt-4 flex justify-end">
          <CarouselControls carouselRef={carouselRef} />
        </div> */}
        <div className="hidden md:flex justify-center min-h-[100px] mt-8">
          <Carousel panels={6} ref={carouselRef} controlsInline={false}>
            {items}
          </Carousel>
        </div>
      </div>
    </div>
  );
};
