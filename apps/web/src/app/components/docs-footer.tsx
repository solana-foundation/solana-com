"use client";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useI18n } from "fumadocs-ui/provider";
import { ReactNode } from "react";

type DocsLink = { name: ReactNode; url: string };
export function DocsFooter({
  previous,
  next,
}: {
  previous: DocsLink | undefined;
  next: DocsLink | undefined;
}) {
  const { text } = useI18n();
  return (
    <div className="grid grid-cols-2 gap-4 pb-6">
      {previous ? (
        <Link
          href={previous.url}
          className="flex w-full flex-col gap-2 rounded-lg border bg-fd-card p-4 text-sm transition-colors hover:bg-fd-accent/80 hover:text-fd-accent-foreground"
        >
          <div className="inline-flex items-center gap-0.5 text-fd-muted-foreground">
            <ChevronLeft className="-ms-1 size-4 shrink-0 rtl:rotate-180" />
            <p>{text?.previousPage}</p>
          </div>
          <p className="font-medium">{previous.name}</p>
        </Link>
      ) : null}
      {next ? (
        <Link
          href={next.url}
          className="flex w-full flex-col gap-2 rounded-lg border bg-fd-card p-4 text-sm transition-colors hover:bg-fd-accent/80 hover:text-fd-accent-foreground col-start-2 text-end"
        >
          <div className="inline-flex items-center gap-0.5 text-fd-muted-foreground flex-row-reverse">
            <ChevronRight className="-me-1 size-4 shrink-0 rtl:rotate-180" />
            <p>{text?.nextPage}</p>
          </div>
          <p className="font-medium">{next.name}</p>
        </Link>
      ) : null}
    </div>
  );
}
