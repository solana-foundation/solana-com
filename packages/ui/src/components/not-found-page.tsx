"use client";

import { type ReactNode } from "react";
import { cn } from "../lib/utils";

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
  const linkClassName =
    "nf-cta relative inline-block rounded-full bg-[#14F195] text-black px-8 py-3 font-medium text-sm md:text-base";

  const link = renderLink ? (
    renderLink({ href: ctaHref, children: ctaLabel, className: linkClassName })
  ) : (
    <a href={ctaHref} className={linkClassName}>
      {ctaLabel}
    </a>
  );

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
@keyframes nf-fade-in-up {
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
}
.nf-animate {
  opacity: 0;
  animation: nf-fade-in-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
.nf-delay-0 { animation-delay: 0s; }
.nf-delay-1 { animation-delay: 0.12s; }
.nf-delay-2 { animation-delay: 0.24s; }
.nf-delay-3 { animation-delay: 0.4s; }

.nf-grid {
  background-image:
    linear-gradient(rgba(153,69,255,0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(153,69,255,0.04) 1px, transparent 1px);
  background-size: 60px 60px;
  mask-image: radial-gradient(ellipse 60% 50% at 50% 40%, black 10%, transparent 70%);
  -webkit-mask-image: radial-gradient(ellipse 60% 50% at 50% 40%, black 10%, transparent 70%);
}

.nf-scanline {
  position: absolute;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(20,241,149,0.2) 30%, rgba(20,241,149,0.35) 50%, rgba(20,241,149,0.2) 70%, transparent);
  animation: nf-scan 5s linear infinite;
  pointer-events: none;
  z-index: 1;
}
@keyframes nf-scan {
  0% { top: -1px; opacity: 0; }
  3% { opacity: 1; }
  97% { opacity: 1; }
  100% { top: 100%; opacity: 0; }
}

.nf-404-base { color: rgba(255,255,255,0.08); }
.nf-404-green {
  color: rgba(20,241,149,0.05);
  mix-blend-mode: screen;
  animation: nf-shift-green 8s ease-in-out infinite;
}
.nf-404-purple {
  color: rgba(153,69,255,0.05);
  mix-blend-mode: screen;
  animation: nf-shift-purple 8s ease-in-out infinite;
}

@keyframes nf-shift-green {
  0%, 87%, 95%, 100% { transform: translate(-2px, -1px); clip-path: none; }
  89% { transform: translate(6px, -4px); clip-path: none; }
  90% { transform: translate(-8px, 2px); clip-path: inset(15% 0 55% 0); }
  91% { transform: translate(4px, 1px); clip-path: inset(40% 0 20% 0); }
  92% { transform: translate(-2px, -1px); clip-path: none; }
}
@keyframes nf-shift-purple {
  0%, 87%, 95%, 100% { transform: translate(2px, 1px); clip-path: none; }
  89% { transform: translate(-5px, 3px); clip-path: none; }
  90% { transform: translate(7px, -2px); clip-path: inset(50% 0 10% 0); }
  91% { transform: translate(-4px, -1px); clip-path: inset(10% 0 50% 0); }
  92% { transform: translate(2px, 1px); clip-path: none; }
}

.nf-cta {
  transition: transform 0.2s ease, box-shadow 0.3s ease;
  box-shadow: 0 0 0 rgba(20,241,149,0);
}
.nf-cta:hover {
  transform: translateY(-1px);
  box-shadow: 0 0 24px rgba(20,241,149,0.3), 0 0 60px rgba(20,241,149,0.1);
}
.nf-cta:active {
  transform: translateY(0);
}

@media (prefers-reduced-motion: reduce) {
  .nf-animate { animation: none; opacity: 1; }
  .nf-404-green, .nf-404-purple { animation: none; }
  .nf-scanline { display: none; }
}
`,
        }}
      />
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
        <div className="nf-scanline" aria-hidden="true" />

        <div className="max-w-[1440px] w-full mx-auto px-[20px] md:px-[32px] xl:px-[40px] flex flex-col items-center text-center relative z-10">
          {/* Chromatic 404 */}
          <div
            className="nf-animate nf-delay-0 relative select-none"
            aria-hidden="true"
          >
            <span className="nf-404-base font-brand font-bold text-[120px] md:text-[200px] xl:text-[280px] leading-none">
              404
            </span>
            <span className="nf-404-green font-brand font-bold text-[120px] md:text-[200px] xl:text-[280px] leading-none absolute inset-0">
              404
            </span>
            <span className="nf-404-purple font-brand font-bold text-[120px] md:text-[200px] xl:text-[280px] leading-none absolute inset-0">
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
    </>
  );
}
