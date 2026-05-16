import React from "react";
import Marquee from "@/component-library/marquee";
import { cn } from "@/app/components/utils";
import { twMerge } from "tailwind-merge";

export type Logo = {
  src: string;
  alt: string;
  height?: string;
};

export type LogosProps = {
  logos?: Logo[];
  className?: string;
  itemClassName?: string;
  fadeColor?: string;
  animation?: boolean;
};

export const Logos: React.FC<LogosProps> = ({
  logos = [],
  className,
  itemClassName,
  fadeColor = "#000",
  animation = true,
}) => {
  const items = logos.map((logo, i) => (
    <div
      key={`${logo.alt}-${i}`}
      className={cn(
        "flex items-center justify-center relative mr-8 md:mr-12 xl:mr-32 self-center h-[40px]",
        itemClassName,
      )}
      style={{
        height: logo.height ?? "",
      }}
    >
      <img
        className="block h-full max-h-full max-w-none !w-auto"
        src={logo.src}
        alt={logo.alt}
        loading="lazy"
      />
    </div>
  ));

  if (!animation) {
    return (
      <div
        className={twMerge(
          "relative w-full flex whitespace-nowrap items-center justify-center scrollbar-hidden overflow-auto",
          className,
        )}
      >
        {items}
      </div>
    );
  }

  return (
    <div
      className={cn("relative w-full", className)}
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
