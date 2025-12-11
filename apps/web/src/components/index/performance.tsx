import React from "react";
import { Container } from "@/component-library/container";
import { StatsGrid, StatsGridItem } from "@/component-library/stats-grid";
import { cn } from "@/app/components/utils";
import Image from "next/image";
import dynamic from "next/dynamic";

const UnicornScene = dynamic(
  () => import("unicornstudio-react").then((mod) => mod.default),
  {
    ssr: false,
  },
);

export type PerformanceProps = {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  bgJsonFilePath?: string;
  bgImageSrc?: string;
  stats?: StatsGridItem[];
  counters?: StatsGridItem[];
};

export const Performance: React.FC<PerformanceProps> = ({
  title,
  subtitle,
  bgJsonFilePath,
  bgImageSrc,
  stats,
  counters,
}) => {
  return (
    <section className="relative overflow-hidden bg-nd-inverse text-nd-high-em-text text-left m-twd-0">
      {bgJsonFilePath && (
        <UnicornScene
          projectId="performance"
          className="!absolute inset-0 z-0"
          jsonFilePath={bgJsonFilePath}
          width="100%"
          height="101%"
          scale={1}
          dpi={typeof window !== "undefined" ? window.devicePixelRatio : 2}
          fps={30}
          lazyLoad={true}
          production={true}
          onError={(error) => console.error("UnicornScene error:", error)}
          placeholder={
            bgImageSrc ? (
              <Image
                className="!absolute inset-0 z-0"
                src={bgImageSrc}
                alt="Hero background"
                fill
                sizes="150vw"
                priority
                style={{
                  objectFit: "cover",
                }}
              />
            ) : undefined
          }
          showPlaceholderOnError
          showPlaceholderWhileLoading
        />
      )}
      <Container className="py-10 flex flex-col justify-between relative">
        <div className="flex flex-col xl:flex-row gap-[52px] justify-between items-start">
          <div className="xl:max-w-[50%] grow-0">
            {title && <h2 className="nd-heading-l">{title}</h2>}
            {subtitle && (
              <p className="text-nd-mid-em-text nd-body-xl max-md:mt-twd-3 md:mt-[35px] xl:mt-twd-8">
                {subtitle}
              </p>
            )}
          </div>
          <div className="w-full xl:w-[35%] relative before:absolute before:top-0 before:left-0 before:w-px before:h-full before:bg-gradient-to-b before:from-[#D884F0] before:to-[#44EBA6]">
            {counters?.map((item, index) => (
              <div
                key={item.label}
                className={cn(
                  "py-twd-5 px-twd-3 md:px-twd-8 xl:py-twd-8 flex flex-row gap-twd-4 md:gap-twd-8 xl:gap-[28px] border-nd-border-light",
                  {
                    "border-t ": index,
                  },
                )}
              >
                {item.Icon && typeof item.Icon === "string" ? (
                  <div>
                    <Image
                      src={item.Icon}
                      alt=""
                      width={28}
                      height={28}
                      className="xl:size-10 md:size-7"
                    />
                  </div>
                ) : item.Icon ? (
                  <div>
                    <item.Icon className="xl:size-8 md:size-5" />
                  </div>
                ) : null}
                <div>
                  <div className="text-[28px] xl:text-[40px] leading-[1.14] xl:leading-[1] font-light uppercase">
                    {item.value}
                  </div>
                  <div className="mt-twd-1.5 md:mt-twd-1 xl:mt-twd-3 text-[16px] md:text-[18px] leading-[1.33] font-medium">
                    {item.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {stats && stats.length > 0 && (
          <div className="mt-[380px] md:mt-[350px] xl:mt-[560px] -mx-twd-5 md:-mx-twd-8 xl:mx-twd-0">
            <StatsGrid items={stats} />
          </div>
        )}
      </Container>
    </section>
  );
};
