import React from "react";
import Image from "next/image";
import { cn } from "@/app/components/utils";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import {
  MetricSourcesFootnote,
  type MetricSourceNoteProps,
} from "@/component-library/metric-source-note";

export type StatsGridItem = {
  value: React.ReactNode;
  label: string;
  source?: MetricSourceNoteProps;
  Icon?:
    | string
    | React.ElementType<{
        className?: string;
        "aria-hidden"?: boolean;
      }>;
};

export interface StatsGridProps {
  className?: string;
  items?: StatsGridItem[];
}

export const StatsGrid: React.FC<StatsGridProps> = ({
  className,
  items = [],
}) => {
  const { ref: statsRef, isIntersecting } =
    useIntersectionObserver<HTMLDivElement>({
      threshold: 0.2,
      triggerOnce: true,
    });

  const sources = items.flatMap(({ label, source }) =>
    source ? [{ label, source }] : [],
  );

  return (
    <div className="w-full">
      <div
        className={cn(
          "grid grid-cols-2 xl:grid-cols-4 w-full",
          {
            "xl:grid-cols-2": items.length === 2,
            "xl:grid-cols-3": items.length === 3,
            "xl:grid-cols-4": items.length > 3,
          },
          className,
        )}
        ref={statsRef}
      >
        {items?.map((stat, index) => (
          <div
            key={stat.label}
            className={cn(
              "p-4 md:p-8 xl:px-10 flex flex-col justify-between gap-4 max-xl:border-b border-nd-border-light",
              {
                "xl:pl-0": index === 0,
                "border-l": index % 2,
                "max-xl:border-t": index < 2,
                "xl:border-l ": index,
                "animate-fade-in-up": isIntersecting,
              },
            )}
            style={
              isIntersecting
                ? { animationDelay: `${0.1 + index * 0.1}s` }
                : { opacity: 0 }
            }
          >
            {stat.Icon && typeof stat.Icon === "string" ? (
              <div className="max-md:hidden">
                <Image
                  src={stat.Icon}
                  alt=""
                  width={32}
                  height={32}
                  className="xl:size-8 md:size-5"
                />
              </div>
            ) : stat.Icon ? (
              <div className="max-md:hidden">
                <stat.Icon className="xl:size-8 md:size-5" />
              </div>
            ) : null}
            <div>
              <div
                className={cn(
                  "text-[20px] xl:text-[40px] leading-none font-light",
                  // Registry values arrive locale-formatted (e.g. "200ms",
                  // "15 Mrd. $"); only uppercase hand-written values.
                  !stat.source && "uppercase",
                )}
              >
                {stat.value}
              </div>
              <div className="mt-1.5 md:mt-1 xl:mt-3 text-[14px] md:text-[18px] leading-[1.33] font-medium">
                {stat.label}
              </div>
            </div>
          </div>
        ))}
        {items.length % 2 !== 0 && (
          <div
            className={cn(
              "p-4 md:p-8 xl:px-10 flex flex-col justify-between gap-4 border-l max-xl:border-t border-nd-border-light xl:hidden",
              {
                "animate-fade-in-up": isIntersecting,
              },
            )}
            style={
              isIntersecting
                ? { animationDelay: `${0.1 + items.length * 0.1}s` }
                : { opacity: 0 }
            }
          />
        )}
      </div>
      {sources.length > 0 && (
        <MetricSourcesFootnote
          items={sources}
          className="mt-3 px-4 md:px-8 xl:px-0"
        />
      )}
    </div>
  );
};
