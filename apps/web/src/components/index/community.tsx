import React, { useCallback } from "react";
import { Container } from "@/component-library/container";
import { cn } from "@/app/components/utils";
import dynamic from "next/dynamic";
import { useViewportVisibility } from "@/hooks/useViewportVisibility";

const EarthAnimation = dynamic(
  () =>
    import("@/components/index/earth-animation").then(
      (mod) => mod.EarthAnimation,
    ),
  {
    ssr: false,
  },
);

export type CommunityProps = {
  title?: React.ReactNode;
  subtitle?: string;
  bgVideoSrc?: string;
  bgVideoPoster?: string;
  links?: {
    title: string;
    description?: string;
    href?: string;
    Icon?: React.ComponentType<{
      className?: string;
      "aria-hidden"?: boolean | "true" | "false";
    }>;
  }[];
};

export const Community: React.FC<CommunityProps> = ({
  title,
  subtitle,
  bgVideoSrc,
  bgVideoPoster,
  links = [],
}) => {
  const handler = useCallback((node: HTMLVideoElement | null) => {
    if (!node) return;
    if (node.paused) {
      node.play();
    }
  }, []);
  const { ref } = useViewportVisibility<HTMLVideoElement>(handler, {
    topOffset: 100,
    bottomOffset: 100,
  });

  return (
    <section className="relative overflow-hidden bg-nd-inverse text-nd-high-em-text text-left m-twd-0 px-2 transform-gpu">
      <div className="max-w-[1828px] mx-auto rounded-xl overflow-hidden relative transform-gpu">
        {bgVideoSrc && (
          <video
            src={bgVideoSrc}
            autoPlay={false}
            preload="none"
            loop
            muted
            playsInline
            controls={false}
            poster={bgVideoPoster}
            className="absolute inset-0 w-full h-[101%] object-cover"
            ref={ref}
          />
        )}
        <Container className="pt-[32px] pb-[12px] md:pt-[40px] md:pb-[20px] xl:py-[128px] flex flex-col justify-between">
          <EarthAnimation className="absolute bottom-0 left-[-20%] md:left-[-10%] xl:left-0 w-[140%] md:w-[120%] xl:w-full" />
          <div className="xl:flex xl:justify-between xl:items-center relative">
            {title && <h2 className="nd-heading-l xl:max-w-[50%]">{title}</h2>}
            {subtitle && (
              <p
                className={cn(
                  "nd-body-xl max-xl:mt-twd-3 xl:py-twd-3 xl:pl-twd-6 xl:max-w-[40%] relative ",
                  "xl:before:absolute xl:before:top-0 xl:before:left-0 xl:before:w-px xl:before:h-full xl:before:bg-gradient-to-b xl:before:from-[#D884F0] xl:before:to-[#44EBA6]",
                )}
              >
                {subtitle}
              </p>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-1 mt-twd-10 relative">
            {links?.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="flex max-md:flex-row md:flex-col items-start gap-twd-3 md:gap-twd-12 px-twd-4 py-twd-5 md:px-twd-6 md:py-twd-8 rounded-xl bg-nd-border-light hover:bg-nd-mid-em-text-alpha/20 backdrop-blur-[8px] text-inherit"
                rel="noopener noreferrer"
                target="_blank"
              >
                <div className="shrink-0 grow-0">
                  {item.Icon && (
                    <item.Icon className="block w-5 h-5 md:w-10 md:h-10" />
                  )}
                </div>
                <div className="">
                  <h4 className="font-medium nd-body-xl">{item.title}</h4>
                  <p className="nd-body-m text-nd-mid-em-text !mt-twd-1">
                    {item.description}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </Container>
      </div>
    </section>
  );
};
