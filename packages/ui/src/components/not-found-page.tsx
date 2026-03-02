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
  title = "gm. This page doesn\u2019t exist.",
  subtitle = "But while you\u2019re here \u2014 SOL is still faster than this 404 loaded.",
  ctaLabel = "Back to homepage",
  ctaHref = "/",
  renderLink,
  className,
}: NotFoundPageProps) {
  const linkClassName =
    "inline-block rounded-full bg-white text-black hover:bg-white/90 px-8 py-3 font-medium transition-colors text-sm md:text-base";

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
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.nf-animate {
  opacity: 0;
  animation: nf-fade-in-up 0.6s ease-out forwards;
}
.nf-delay-0 { animation-delay: 0s; }
.nf-delay-1 { animation-delay: 0.15s; }
.nf-delay-2 { animation-delay: 0.3s; }
.nf-delay-3 { animation-delay: 0.45s; }
`,
        }}
      />
      <section
        className={cn(
          "bg-black text-white min-h-[60vh] flex flex-col items-center justify-center relative overflow-hidden",
          className,
        )}
      >
        <div className="max-w-[1440px] w-full mx-auto px-[20px] md:px-[32px] xl:px-[40px] flex flex-col items-center text-center">
          {/* Ghost 404 */}
          <span
            aria-hidden="true"
            className="nf-animate nf-delay-0 font-brand font-bold text-[120px] md:text-[200px] xl:text-[280px] text-white/[0.03] leading-none select-none"
          >
            404
          </span>

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
