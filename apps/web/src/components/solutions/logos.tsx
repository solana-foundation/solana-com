import React from "react";
import Marquee from "@/component-library/marquee";

export type Logo = {
  src: string;
  alt: string;
  bg: string;
};

export type LogosProps = {
  logos: Logo[];
};

/**
 * Displays ascrolling marquee of project logos.
 *
 * @component
 * @param {LogosProps} props - The props for the component.
 * @param {Logo[]} props.logos - Array of logo objects to display in the marquee. Each logo includes a source URL and background color.
 * @returns {JSX.Element} The rendered Logos section.
 *
 * @example
 * <Logos
 *   logos={[{ src: "/logo.png", bg: "#fff" }]}
 * />
 */
export const Logos = ({ logos }: LogosProps) => {
  const items = logos.map((logo, i) => (
    <div
      key={`${logo.alt}-${i}`}
      className={`flex items-center justify-center mr-4 max-w-[200px] aspect-video relative rounded-sm p-[5px] min-w-[100px] min-h-[70px] ${logo.bg}`}
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
    <div className="relative w-full">
      {/* Left Blur */}
      <div className="pointer-events-none absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-[#090d17] to-transparent z-10" />
      {/* Right Blur */}
      <div className="pointer-events-none absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-[#090d17] to-transparent z-10" />
      <Marquee className="w-full">{items}</Marquee>
    </div>
  );
};
