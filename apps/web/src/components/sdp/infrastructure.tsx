"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { RotatingArc } from "./rotating-arc";
import { Badge } from "@/component-library/badge";

const bgSrc = "/src/img/solutions/sdp/infrastructure-bg.png";

export interface InfraChecklistItem {
  label: string;
  badge?: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

export interface TestimonialItem {
  quote: string;
  name: string;
  role: string;
  logoSrc?: string;
  logoAlt?: string;
  profileSrc?: string;
}

export interface InfrastructureProps {
  title?: string;
  description?: string;
  testimonials?: TestimonialItem[];
  checklistItems?: InfraChecklistItem[];
}

const CYCLE_INTERVAL = 5000;
const FADE_DURATION = 400;

export const Infrastructure = ({
  title,
  description,
  testimonials = [],
  checklistItems = [],
}: InfrastructureProps): React.ReactElement => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (testimonials.length <= 1) return;
    const timer = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setActiveIndex((i) => (i + 1) % testimonials.length);
        setVisible(true);
      }, FADE_DURATION);
    }, CYCLE_INTERVAL);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  return (
    <section className="flex flex-col items-center w-full bg-[#0C0C0E]">
      <div className="w-full max-w-[1440px] xl:border-x xl:border-white/[0.08] relative overflow-hidden">
        <img
          src={bgSrc}
          alt=""
          aria-hidden
          className="hidden xl:block w-full h-full object-cover pointer-events-none absolute inset-0"
        />
        <div className="flex flex-col xl:flex-row relative">
          {/* Left column: heading + checklist */}
          <div className="xl:w-2/3 flex flex-col xl:border-r xl:border-white/[0.08]">
            <div className="px-5 md:px-8 xl:px-12 py-10 md:py-20 grow">
              {/* Heading */}
              <div className="flex flex-col gap-5 xl:gap-6">
                <h2 className="nd-heading-l-a text-white">{title}</h2>
                <p className="nd-body-l max-w-[558px] text-white/[0.64]">
                  {description}
                </p>
              </div>

              {/* Divider */}
              <div
                className="h-px w-full my-10 md:my-20"
                style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
              />

              {/* Testimonials — CSS grid stacking so container = tallest slide */}
              {testimonials.length > 0 && (
                <div id="quotes" style={{ display: "grid" }}>
                  {testimonials.map((item, i) => {
                    const isActive = i === activeIndex;
                    return (
                      <div
                        key={i}
                        aria-hidden={!isActive}
                        style={{
                          gridArea: "1 / 1",
                          opacity: isActive && visible ? 1 : 0,
                          transition: `opacity ${FADE_DURATION}ms ease-in-out`,
                        }}
                      >
                        <div className="flex flex-col gap-10 xl:max-w-[707px]">
                          <p className="nd-heading-s text-white max-w-[674px] italic">
                            &ldquo;{item.quote}&rdquo;
                          </p>
                          <div className="flex flex-col-reverse xl:flex-row xl:items-center gap-8">
                            {/* Logo */}
                            {item.logoSrc && (
                              <div className="shrink-0 min-w-10 h-10 relative">
                                <img
                                  src={item.logoSrc}
                                  alt={item.logoAlt ?? ""}
                                  className="object-contain object-left"
                                />
                              </div>
                            )}

                            {/* Vertical divider */}
                            <div className="w-full xl:w-px h-px xl:h-14 bg-white/[0.08] shrink-0" />

                            {/* Profile */}
                            <div className="flex items-center gap-4">
                              {item.profileSrc && (
                                <div className="w-11 h-11 xl:w-14 xl:h-14 rounded-sm overflow-hidden shrink-0 relative">
                                  <Image
                                    src={item.profileSrc}
                                    alt={item.name}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              )}
                              <div className="flex flex-col gap-1">
                                <span className="text-white font-medium nd-body-m">
                                  {item.name}
                                </span>
                                <span className="text-white/[0.64] nd-body-s">
                                  {item.role}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Checklist */}
            <div className="px-3 xl:px-0 border-t border-b xl:border-b-0 border-white/[0.08] grow-0">
              {checklistItems.map((item, i) => {
                const isLast = i === checklistItems.length - 1;
                return (
                  <div
                    key={item.label}
                    className={[
                      "flex items-center",
                      "h-10 md:h-16 xl:h-20",
                      "border-x xl:border-x-0 border-white/[0.08]",
                      !isLast
                        ? "border-b"
                        : "border-b border-b-transparent mb-[-1px]",
                    ].join(" ")}
                  >
                    {/* Icon */}
                    <div className="shrink-0 grow-0 aspect-square xl:w-[8.25%] h-full flex items-center justify-center border-r border-white/[0.08]">
                      <item.Icon className="w-5 h-5 xl:w-6 xl:h-6" />
                    </div>
                    {/* Label */}
                    <span className="nd-body-l text-white px-5">
                      {item.label}
                      {item.badge && (
                        <Badge title={item.badge} className="ml-2" />
                      )}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right column: visual */}
          <div className="max-xl:relative max-xl:overflow-hidden flex xl:w-1/3">
            <img
              src={bgSrc}
              alt=""
              aria-hidden
              className="xl:hidden w-full xl:h-full max-xl:h-[568px] object-cover pointer-events-none"
            />
            <div className="max-xl:absolute max-xl:inset-0 flex w-full h-full items-center justify-center">
              <RotatingArc />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
