import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { ReportItem } from "@/lib/report-types";
import { cn } from "@/lib/utils";

interface ReportCardProps {
  report: ReportItem;
}

export function ReportCard({ report }: ReportCardProps) {
  return (
    <Link
      href={report.url}
      className={cn(
        "group flex h-full flex-col gap-4 overflow-hidden border border-border/70 bg-background/70 p-4 transition hover:border-foreground/20 hover:bg-accent/20"
      )}
    >
      {report.heroImage && (
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
          <Image
            src={report.heroImage}
            alt={report.headline || report.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
          {report.published}
        </span>
        {report.categories.map((category) => (
          <Badge key={`${report.id}-${category}`} variant="outline">
            {category}
          </Badge>
        ))}
      </div>

      <div className="flex flex-1 flex-col gap-3">
        <h3 className="text-2xl font-semibold leading-tight group-hover:underline">
          {report.headline || report.title}
        </h3>
        {report.description && (
          <p className="text-sm leading-6 text-muted-foreground">
            {report.description}
          </p>
        )}
      </div>

      <span className="inline-flex items-center gap-2 text-sm font-medium">
        View Report
        <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </span>
    </Link>
  );
}
