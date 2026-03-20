import React from "react";
import Image from "next/image";
import { RotatingArc } from "./rotating-arc";

const bgSrc = "/src/img/solutions/sdp/infrastructure-bg.png";

export interface InfraChecklistItem {
  label: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

export interface InfrastructureProps {
  title?: string;
  description?: string;
  testimonialQuote?: string;
  testimonialName?: string;
  testimonialRole?: string;
  checklistItems?: InfraChecklistItem[];
}

export const Infrastructure = ({
  title,
  description,
  testimonialQuote,
  testimonialName,
  testimonialRole,
  checklistItems = [],
}: InfrastructureProps): React.ReactElement => {
  return (
    <section className="flex flex-col items-center w-full bg-[#0C0C0E]">
      <div className="w-full max-w-[1440px] xl:border-x xl:border-white/[0.08] relative">
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

              {/* Testimonial */}
              <div className="flex flex-col gap-10 xl:max-w-[707px]">
                <p className="nd-heading-s text-white max-w-[674px]">
                  {testimonialQuote}
                </p>
                <div className="flex flex-col-reverse xl:flex-row xl:items-center gap-8">
                  {/* Worldpay logo */}
                  <div className="shrink-0 w-28 h-10 relative">
                    <Image
                      src="/src/img/solutions/sdp/worldpay-logo.svg"
                      alt="Worldpay"
                      fill
                      className="object-contain object-left"
                    />
                  </div>

                  {/* Vertical divider */}
                  <div className="w-full xl:w-px h-px xl:h-14 bg-white/[0.08] shrink-0" />

                  {/* Profile */}
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 xl:w-14 xl:h-14 rounded-sm overflow-hidden shrink-0 relative">
                      <Image
                        src="/src/img/solutions/sdp/profile.png"
                        alt={testimonialName ?? ""}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-white font-medium nd-body-m">
                        {testimonialName}
                      </span>
                      <span className="text-white/[0.64] nd-body-s">
                        {testimonialRole}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
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
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right column: visual */}
          <div className="relative flex xl:w-1/3 overflow-hidden">
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
