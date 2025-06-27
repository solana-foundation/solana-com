import React, { useRef } from "react";
import Image from "next/image";
import { useTranslation } from "next-i18next";
import Carousel, {
  CarouselControls,
  CarouselHandle,
} from "@/component-library/carousel";

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

const LOGOS = [
  { src: "/src/img/solutions/depin/ecosystem/375ai.png", bg: "bg-white" },
  { src: "/src/img/solutions/depin/ecosystem/blockcast.png", bg: "bg-white" },
  { src: "/src/img/solutions/depin/ecosystem/cudis.png", bg: "bg-white" },
  { src: "/src/img/solutions/depin/ecosystem/dawn.png", bg: "bg-white" },
  { src: "/src/img/solutions/depin/ecosystem/decharge.png", bg: "bg-white" },
  { src: "/src/img/solutions/depin/ecosystem/dephy.png", bg: "bg-white" },
  { src: "/src/img/solutions/depin/ecosystem/geodnet.png", bg: "bg-white" },
  { src: "/src/img/solutions/depin/ecosystem/hivemapper.png", bg: "bg-white" },
  { src: "/src/img/solutions/depin/ecosystem/inference.png", bg: "bg-black" },
  { src: "/src/img/solutions/depin/ecosystem/jambo.png", bg: "bg-black" },
  { src: "/src/img/solutions/depin/ecosystem/onocoy.png", bg: "bg-black" },
  { src: "/src/img/solutions/depin/ecosystem/pipenetwork.png", bg: "bg-black" },
  { src: "/src/img/solutions/depin/ecosystem/roam.png", bg: "bg-white" },
  { src: "/src/img/solutions/depin/ecosystem/shaga.png", bg: "bg-[#f1ff61]" },
  { src: "/src/img/solutions/depin/ecosystem/wayru.png", bg: "bg-white" },
  {
    src: "/src/img/solutions/depin/ecosystem/wingbits-seo.png",
    bg: "bg-[#201c1c]",
  },
  { src: "/src/img/solutions/depin/ecosystem/xnet.png", bg: "bg-white" },
];

export const EcoProjects = () => {
  const { t } = useTranslation("common");
  const carouselRef = useRef<CarouselHandle>(null);

  const items = LOGOS.map((logo, i) => (
    <div
      key={i}
      className={`flex items-center justify-center mr-4 max-w-[200px] aspect-video relative rounded-sm p-[5px] min-w-[100px] min-h-[50px] ${logo.bg}`}
    >
      <img
        src={logo.src}
        alt={`DePIN Logo ${i + 1}`}
        className="object-contain w-4/5 h-4/5"
        loading="lazy"
        style={{ display: "block" }}
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
        <div className="mt-4 flex justify-end">
          <CarouselControls carouselRef={carouselRef} />
        </div>
        <div className="relative w-full mt-4">
          {/* Left Blur */}
          <div className="pointer-events-none absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-[#090d17] to-transparent z-10" />
          {/* Right Blur */}
          <div className="pointer-events-none absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-[#090d17] to-transparent z-10" />
          <Carousel panels={6} ref={carouselRef} controlsInline={false} autoPlay={3000}>
            {items}
          </Carousel>
        </div>
      </div>
    </div>
  );
};
