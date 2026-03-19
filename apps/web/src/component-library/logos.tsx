"use client";

import React, { useLayoutEffect, useRef, useState } from "react";
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
  autoAnimation?: boolean;
  speed?: number;
  renderImage?: (_logo: Logo, _Image: React.ReactNode) => React.ReactNode;
};

export const Logos: React.FC<LogosProps> = ({
  logos = [],
  className,
  itemClassName,
  fadeColor = "#000",
  animation = true,
  autoAnimation = false,
  speed,
  renderImage,
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const measureContainerRef = useRef<HTMLDivElement>(null);
  const measureContentRef = useRef<HTMLDivElement>(null);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useLayoutEffect(() => {
    if (!autoAnimation) return;

    const checkOverflow = () => {
      if (!measureContainerRef.current || !measureContentRef.current) return;
      // Skip measurement while hidden (clientWidth === 0 means not yet visible)
      if (measureContainerRef.current.clientWidth === 0) return;
      setShouldAnimate(
        measureContentRef.current.scrollWidth >
          measureContainerRef.current.clientWidth,
      );
    };

    checkOverflow();

    const resizeObserver = new ResizeObserver(checkOverflow);
    if (measureContainerRef.current)
      resizeObserver.observe(measureContainerRef.current);
    if (measureContentRef.current)
      resizeObserver.observe(measureContentRef.current);

    // Watch the real visible wrapper — fires when accordion/tab reveals the component
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) checkOverflow();
      },
      { threshold: 0 },
    );
    if (wrapperRef.current) intersectionObserver.observe(wrapperRef.current);

    return () => {
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, [autoAnimation, logos]);

  const effectiveAnimation = autoAnimation ? shouldAnimate : animation;

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
      {renderImage ? (
        renderImage(
          logo,
          <img
            className="block h-full max-h-full max-w-none !w-auto"
            src={logo.src}
            alt={logo.alt}
            loading="lazy"
          />,
        )
      ) : (
        <img
          className="block h-full max-h-full max-w-none !w-auto"
          src={logo.src}
          alt={logo.alt}
          loading="lazy"
        />
      )}
    </div>
  ));

  return (
    <div
      ref={autoAnimation ? wrapperRef : undefined}
      className="relative w-full"
    >
      {/* Hidden measurement div — only rendered when autoAnimation is enabled */}
      {autoAnimation && (
        <div
          ref={measureContainerRef}
          className="invisible absolute inset-x-0 overflow-hidden h-0 pointer-events-none"
          aria-hidden="true"
        >
          <div ref={measureContentRef} className="flex whitespace-nowrap">
            {items}
          </div>
        </div>
      )}

      {!effectiveAnimation ? (
        <div
          className={twMerge(
            "flex whitespace-nowrap items-center justify-center scrollbar-hidden overflow-auto transform-gpu",
            className,
          )}
        >
          {items}
        </div>
      ) : (
        <div
          className={cn(className)}
          style={{ "--fade-color": fadeColor } as React.CSSProperties}
        >
          {/* Left Blur */}
          <div className="pointer-events-none absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-[var(--fade-color)] to-transparent z-10" />
          {/* Right Blur */}
          <div className="pointer-events-none absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-[var(--fade-color)] to-transparent z-10" />
          {/* Content */}
          <Marquee className="w-full" speed={speed}>
            {items}
          </Marquee>
        </div>
      )}
    </div>
  );
};
