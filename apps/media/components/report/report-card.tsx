import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import type { ReportItem } from "@/lib/report-types";
import { cn } from "@/lib/utils";

interface ReportCardProps {
  report: ReportItem;
  index?: number;
}

export function ReportCard({ report, index = 0 }: ReportCardProps) {
  return (
    <Link
      href={report.url}
      className={cn(
        "group relative flex h-full flex-col rounded-xl bg-white/10 backdrop-blur-sm p-4 md:p-6 transition-all duration-300 hover:bg-white/15",
      )}
      style={{
        animationDelay: `${index * 0.06}s`,
      }}
    >
      {report.heroImage && (
        <div className="relative mx-auto mb-6 md:mb-8 aspect-[1062/1500] w-full max-w-[200px] overflow-hidden rounded-md transition-transform duration-500 group-hover:-translate-y-1">
          <Image
            src={report.heroImage}
            alt={report.headline || report.title}
            fill
            sizes="(min-width: 1280px) 200px, (min-width: 768px) 200px, 200px"
            className="object-cover"
          />
        </div>
      )}

      <div className="flex flex-1 flex-col gap-3">
        {(report.published || report.categories.length > 0) && (
          <div className="flex flex-wrap items-center gap-2">
            {report.published && (
              <span className="text-[13px] font-medium tracking-[-0.13px] text-white opacity-[0.64]">
                {report.published}
              </span>
            )}
            {report.categories.map((category) => (
              <span
                key={`${report.id}-${category}`}
                className="rounded-full border border-white/20 px-2.5 py-0.5 text-[11px] capitalize tracking-[-0.11px] text-white/80"
              >
                {category}
              </span>
            ))}
          </div>
        )}

        <h3 className="m-0 font-medium text-xl md:text-2xl leading-[1.25] tracking-[-0.6px] md:tracking-[-0.72px] text-white">
          {report.headline || report.title}
        </h3>

        {report.description && (
          <p className="m-0 line-clamp-3 text-base leading-[1.44] tracking-[-0.16px] text-white opacity-[0.64]">
            {report.description}
          </p>
        )}

        <div className="mt-auto flex items-center gap-1.5 pt-4 text-base font-medium tracking-[-0.16px] text-white transition-opacity duration-300 opacity-70 group-hover:opacity-100">
          View Report
          <ChevronRight
            aria-hidden
            className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
            strokeWidth={2}
          />
        </div>
      </div>
    </Link>
  );
}
