"use client";

import { type ReactNode } from "react";
import { cn } from "../lib/utils";
import "./not-found-page.css";

export interface NotFoundPageProps {
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
  renderLink?: (props: {
    href: string;
    children: ReactNode;
    className: string;
  }) => ReactNode;
  className?: string;
}

export function NotFoundPage({
  title = "This page doesn\u2019t exist.",
  subtitle = "It may have been moved or is no longer available. There\u2019s plenty to explore.",
  ctaLabel = "Back to homepage",
  ctaHref = "/",
  renderLink,
  className,
}: NotFoundPageProps) {
  const linkClassName = cn(
    "relative inline-block rounded-full bg-[#14F195] text-black px-8 py-3 font-medium text-sm md:text-base",
    "transition-[transform,box-shadow] duration-200 ease-out",
    "hover:-translate-y-px hover:shadow-[0_0_24px_rgba(20,241,149,0.3),0_0_60px_rgba(20,241,149,0.1)]",
    "active:translate-y-0",
  );

  const link = renderLink ? (
    renderLink({ href: ctaHref, children: ctaLabel, className: linkClassName })
  ) : (
    <a href={ctaHref} className={linkClassName}>
      {ctaLabel}
    </a>
  );

  return (
    <section
      className={cn(
        "bg-black text-white min-h-[60vh] flex flex-col items-center justify-center relative overflow-hidden",
        className,
      )}
    >
      {/* Ambient purple glow */}
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_50%_40%,rgba(153,69,255,0.08),transparent)]"
        aria-hidden="true"
      />

      {/* Grid */}
      <div className="nf-grid absolute inset-0" aria-hidden="true" />

      {/* Scan line */}
      <div
        className="nf-scanline absolute inset-x-0 h-px pointer-events-none z-[1]"
        aria-hidden="true"
      />

      <div className="max-w-[1440px] w-full mx-auto px-[20px] md:px-[32px] xl:px-[40px] flex flex-col items-center text-center relative z-10">
        {/* Chromatic 404 */}
        <div className="nf-animate relative select-none" aria-hidden="true">
          <span className="font-brand font-bold text-[120px] md:text-[200px] xl:text-[280px] leading-none text-white/[0.08]">
            404
          </span>
          <span className="nf-404-green font-brand font-bold text-[120px] md:text-[200px] xl:text-[280px] leading-none absolute inset-0 text-[rgba(20,241,149,0.05)]">
            404
          </span>
          <span className="nf-404-purple font-brand font-bold text-[120px] md:text-[200px] xl:text-[280px] leading-none absolute inset-0 text-[rgba(153,69,255,0.05)]">
            404
          </span>
        </div>

        {/* Title */}
        <h1 className="nf-animate nf-delay-1 font-brand font-medium text-[40px] md:text-[56px] xl:text-[88px] tracking-[-1.6px] md:tracking-[-2.24px] xl:tracking-[-3.52px] leading-[1.1] -mt-4 md:-mt-8 xl:-mt-14">
          {title}
        </h1>

        {/* Subtitle */}
        <p className="nf-animate nf-delay-2 text-[#ABABBA] text-lg md:text-2xl tracking-[-0.36px] leading-[1.33] max-w-[600px] mt-4 md:mt-6">
          {subtitle}
        </p>

        {/* CTA */}
        <div className="nf-animate nf-delay-3 mt-8 md:mt-10">{link}</div>
      </div>
    </section>
  );
}
