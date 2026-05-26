import React from "react";
import Image from "next/image";

const Checkmark = ({ className }: { className?: string }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden
  >
    <path
      d="M2.5 8.5L6 12L13.5 4"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export interface AdvantagesProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  items?: string[];
  visualSrc?: string;
  visualBgSrc?: string;
}

export const Advantages = (props: AdvantagesProps): React.ReactElement => {
  const { title, description, items, visualSrc, visualBgSrc } = props;
  return (
    <section className="flex flex-col items-center w-full bg-[#0C0C0E]">
      <div className="w-full max-w-[1440px] xl:border-x xl:border-white/[0.08]">
        <div className="flex flex-col xl:flex-row">
          {/* Left column: heading + checklist */}
          <div className="flex-1 flex flex-col xl:border-r xl:border-white/[0.08]">
            {/* Heading */}
            <div className="px-5 md:px-8 xl:px-12 py-10 md:py-20 grow">
              <div className="flex flex-col gap-5 xl:gap-6">
                <h2 className="nd-heading-l-a text-white xl:max-w-[514px]">
                  {title}
                </h2>
                {description && (
                  <p className="nd-body-l max-w-[558px] text-white/[0.64]">
                    {description}
                  </p>
                )}
              </div>
            </div>

            {/* Checklist */}
            {items && (
              <div className="px-3 xl:px-0 border-t border-b xl:border-b-0 border-white/[0.08] grow-0">
                {items.map((item, i) => {
                  const isLast = i === items.length - 1;
                  return (
                    <div
                      key={item}
                      className={[
                        "flex items-center",
                        "h-10 md:h-16 xl:h-20",
                        "border-x xl:border-x-0 border-white/[0.08]",
                        !isLast
                          ? "border-b"
                          : "border-b border-b-transparent mb-[-1px]",
                      ].join(" ")}
                    >
                      {/* Checkmark box */}
                      <div className="shrink-0 grow-0 aspect-square xl:w-[11%] h-full flex items-center justify-center border-r border-white/[0.08]">
                        <Checkmark className="w-3 h-3 xl:w-4 xl:h-4" />
                      </div>
                      {/* Label */}
                      <span className="nd-body-l text-white px-5">{item}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right column: visual */}
          <div className="relative flex-1 xl:h-[620px] overflow-hidden aspect-[36/31]">
            {visualBgSrc && (
              <img
                src={visualBgSrc}
                alt=""
                aria-hidden
                className="w-full xl:h-full max-xl:aspect-[1440/1240] object-cover pointer-events-none"
              />
            )}
            {visualSrc && (
              <Image
                className="absolute bottom-0 right-0 max-h-auto max-w-auto"
                src={visualSrc}
                alt=""
                width={1440}
                height={1240}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
