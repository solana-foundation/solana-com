"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import uniqBy from "lodash/uniqBy";
import ErrorBoundary from "@/components/error-boundary";
import LoadMoreStatus from "@/components/ui/load-more-status";
import type { PageInfo, ReportItem } from "@/lib/report-types";
import { ReportCard } from "@/components/report/report-card";
import { cn } from "@/lib/utils";

const DEFAULT_PAGE_INFO: PageInfo = {
  hasPreviousPage: false,
  hasNextPage: false,
  startCursor: null,
  endCursor: null,
};

interface ReportsClientPageProps {
  latestReports: ReportItem[];
  initialPageInfo?: PageInfo;
}

export default function ReportsClientPage({
  latestReports,
  initialPageInfo,
}: ReportsClientPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [reports, setReports] = useState<ReportItem[]>(latestReports);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [pageInfo, setPageInfo] = useState(
    initialPageInfo ?? DEFAULT_PAGE_INFO
  );
  const [currentCursor, setCurrentCursor] = useState<string | null>(null);

  const handleLoadMore = useCallback(async () => {
    if (!pageInfo.hasNextPage || isLoadingMore || selectedCategory) {
      return;
    }

    setIsLoadingMore(true);

    try {
      const cursor = currentCursor || pageInfo.endCursor;
      const params = new URLSearchParams({ limit: "12" });

      if (cursor) {
        params.set("cursor", cursor);
      }

      const res = await fetch(`/api/reports/latest?${params.toString()}`);
      if (!res.ok) {
        throw new Error("Failed to fetch reports");
      }

      const response = await res.json();
      const newReports = (response.reports || []) as ReportItem[];

      if (newReports.length > 0) {
        setReports((prev) => uniqBy([...prev, ...newReports], "id"));
        const lastReport = newReports[newReports.length - 1];
        if (lastReport?.cursor) {
          setCurrentCursor(lastReport.cursor);
        }
      }

      setPageInfo(response.pageInfo ?? DEFAULT_PAGE_INFO);
    } catch (error) {
      console.error("Failed to load more reports:", error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [
    currentCursor,
    isLoadingMore,
    pageInfo.endCursor,
    pageInfo.hasNextPage,
    selectedCategory,
  ]);

  useEffect(() => {
    setReports(latestReports || []);

    const lastReport = latestReports[latestReports.length - 1];
    if (lastReport?.cursor) {
      setCurrentCursor(lastReport.cursor);
    }
  }, [latestReports]);

  const allCategories = useMemo(() => {
    const categories = new Set<string>();

    for (const report of reports) {
      for (const category of report.categories || []) {
        if (category) {
          categories.add(category);
        }
      }
    }

    return Array.from(categories).sort();
  }, [reports]);

  const filteredReports = useMemo(() => {
    if (!selectedCategory) {
      return reports;
    }

    return reports.filter((report) =>
      report.categories.includes(selectedCategory)
    );
  }, [reports, selectedCategory]);

  return (
    <ErrorBoundary>
      <section className="relative min-h-screen bg-background">
        {/* Hero */}
        <div className="relative overflow-hidden border-b border-[rgba(236,228,253,0.12)]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_0%_0%,rgba(153,69,255,0.14),transparent_60%),radial-gradient(ellipse_60%_50%_at_100%_0%,rgba(20,241,149,0.08),transparent_50%)]" />
          <div className="relative mx-auto w-full max-w-[1440px] px-5 md:px-8 xl:px-10">
            <div className="flex flex-col gap-5 pb-10 pt-12 md:pb-14 md:pt-16 xl:pb-16 xl:pt-[120px]">
              <span className="text-[11px] font-medium uppercase tracking-[0.35em] text-[#CA9FF5]">
                Solana Reports
              </span>
              <h1 className="max-w-4xl text-[clamp(2rem,5vw,3.5rem)] font-medium leading-[1.05] tracking-[-0.02em] text-white">
                Research and reports from across the ecosystem.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-[#ABABBA] md:text-lg">
                Long-form analysis, market context, and ecosystem research
                published through the Solana media stack.
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mx-auto w-full max-w-[1440px] px-5 md:px-8 xl:px-10">
          {/* Category filters */}
          {allCategories.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 border-b border-[rgba(236,228,253,0.12)] py-6">
              <button
                type="button"
                onClick={() => setSelectedCategory(null)}
                className={cn(
                  "rounded-full border px-4 py-1.5 text-sm transition-colors",
                  selectedCategory === null
                    ? "border-white bg-white text-black"
                    : "border-[rgba(236,228,253,0.12)] text-[#ABABBA] hover:border-[rgba(236,228,253,0.32)] hover:text-white"
                )}
              >
                All
              </button>
              {allCategories.map((category) => (
                <button
                  type="button"
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={cn(
                    "rounded-full border px-4 py-1.5 text-sm capitalize transition-colors",
                    selectedCategory === category
                      ? "border-white bg-white text-black"
                      : "border-[rgba(236,228,253,0.12)] text-[#ABABBA] hover:border-[rgba(236,228,253,0.32)] hover:text-white"
                  )}
                >
                  {category}
                </button>
              ))}
            </div>
          )}

          {/* Reports grid */}
          <div className="py-10">
            {filteredReports.length > 0 ? (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {filteredReports.map((report, index) => (
                  <ReportCard key={report.id} report={report} index={index} />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center text-[#ABABBA]">
                No reports found
                {selectedCategory ? ` for "${selectedCategory}"` : ""}.
              </div>
            )}
          </div>

          {!selectedCategory && reports.length > 0 && (
            <LoadMoreStatus
              isLoading={isLoadingMore}
              hasMore={pageInfo.hasNextPage}
              onLoadMore={handleLoadMore}
              loadingText="Loading more reports..."
              noMoreText="No more reports to load"
            />
          )}
        </div>
      </section>
    </ErrorBoundary>
  );
}
