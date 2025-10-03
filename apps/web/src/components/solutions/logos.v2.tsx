import React from "react";
import Marquee from "@/component-library/marquee";
import { cn } from "@/app/components/utils";

export type Logo = {
  src: string;
  alt: string;
};

export type LogosProps = {
  logos: Logo[];
  className?: string;
  fadeColor?: string;
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
export const Logos = ({ logos, className, fadeColor = "#000" }: LogosProps) => {
  const items = logos.map((logo, i) => (
    <div
      key={`${logo.alt}-${i}`}
      className={cn(
        "flex items-center justify-center relative h-[40px] mr-8 md:mr-12 xl:mr-32",
        className,
      )}
    >
      <img
        className="block h-full max-h-full max-w-none !w-auto"
        src={logo.src}
        alt={logo.alt}
        loading="lazy"
      />
    </div>
  ));

  return (
    <div
      className="relative w-full"
      style={
        {
          "--fade-color": fadeColor,
        } as React.CSSProperties
      }
    >
      {/* Left Blur */}
      <div className="pointer-events-none absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-[var(--fade-color)] to-transparent z-10" />
      {/* Right Blur */}
      <div className="pointer-events-none absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-[var(--fade-color)] to-transparent z-10" />
      {/* Content */}
      <Marquee className="w-full">{items}</Marquee>
    </div>
  );
};
