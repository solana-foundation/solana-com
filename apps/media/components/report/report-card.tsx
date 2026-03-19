import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
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
        "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[rgba(236,228,253,0.12)] bg-[#0D0C11] transition-all duration-300 hover:border-[rgba(236,228,253,0.32)]"
      )}
      style={{
        animationDelay: `${index * 0.06}s`,
      }}
    >
      {report.heroImage && (
        <div className="relative aspect-[16/10] w-full overflow-hidden">
          <Image
            src={report.heroImage}
            alt={report.headline || report.title}
            fill
            sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0D0C11] via-transparent to-transparent opacity-60" />
        </div>
      )}

      <div className="flex flex-1 flex-col gap-4 p-5 xl:p-6">
        <div className="flex flex-wrap items-center gap-2">
          {report.published && (
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#ABABBA]">
              {report.published}
            </span>
          )}
          {report.categories.map((category) => (
            <span
              key={`${report.id}-${category}`}
              className="rounded-full border border-[rgba(236,228,253,0.12)] px-2.5 py-0.5 text-[11px] capitalize text-[#CA9FF5]"
            >
              {category}
            </span>
          ))}
        </div>

        <div className="flex flex-1 flex-col gap-3">
          <h3 className="text-xl font-medium leading-tight tracking-[-0.01em] text-white xl:text-2xl">
            {report.headline || report.title}
          </h3>
          {report.description && (
            <p className="line-clamp-3 text-sm leading-relaxed text-[#ABABBA]">
              {report.description}
            </p>
          )}
        </div>

        <span className="mt-auto inline-flex items-center gap-2 text-sm font-medium text-white/80 transition-colors group-hover:text-white">
          View Report
          <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  );
}
