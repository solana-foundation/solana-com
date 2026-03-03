import React from "react";
import Image from "next/image";
import { cn } from "@/app/components/utils";

export type CompanyStatsCardProps = {
  className?: string;
  stat?: string;
  statLabel?: string;
  statIcon?: string;
  name: string;
  hideStats?: boolean;
  src?: string;
  statType?: "text" | "icon";
};

export const CompanyStatsCard: React.FC<CompanyStatsCardProps> = ({
  className,
  stat,
  statLabel,
  name,
  hideStats = false,
  statType = "text",
  statIcon,
  src,
}) => {
  return (
    <article
      className={cn(
        "relative group shrink-0",
        "p-[24px_20px] xl:p-8",
        "flex flex-col justify-between",
        className,
      )}
      aria-label={name}
    >
      {src && (
        <div className="relative">
          <div className="relative h-6 xl:h-8">
            <Image
              src={src}
              alt={name || ""}
              fill
              sizes="(max-width: 768px) 340px, 420px"
              className="object-contain w-auto"
              loading="lazy"
            />
          </div>
        </div>
      )}
      {!hideStats && (
        <div className="mt-8 mb-0 relative">
          {statType === "icon" ? (
            <div className="relative h-10 overflow-hidden">
              {statIcon && (
                <Image
                  src={statIcon}
                  alt=""
                  fill
                  className="object-contain w-auto"
                  loading="lazy"
                />
              )}
            </div>
          ) : (
            <>
              <div className="sr-only">{statLabel}</div>
              <div className="text-[24px] xl:text-[40px] leading-[1.33] xl:leading-[1.2] mb-1 uppercase">
                {stat}
              </div>
              <div className="nd-body-m font-medium">{statLabel}</div>
            </>
          )}
        </div>
      )}
    </article>
  );
};
