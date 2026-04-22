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
    initialPageInfo ?? DEFAULT_PAGE_INFO,
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
      report.categories.includes(selectedCategory),
    );
  }, [reports, selectedCategory]);

  return (
    <ErrorBoundary>
      <section className="relative min-h-screen bg-black text-white text-left">
        {/* Hero */}
        <div className="relative mx-auto w-full max-w-[1440px] px-[20px] md:px-[32px] xl:px-[40px]">
          <div className="flex flex-col max-w-5xl py-[64px] md:py-[112px] xl:py-[160px]">
            <h1 className="m-0 font-medium leading-[1.1] md:leading-none text-[40px] md:text-[56px] xl:text-[88px] tracking-[-1.6px] md:tracking-[-2.24px] xl:tracking-[-3.52px]">
              Research and reports from across the ecosystem.
            </h1>
            <p className="text-[#ABABBA] text-lg md:text-2xl mt-[12px] xl:mt-[24px] mb-0 max-w-xl tracking-[-0.36px] md:tracking-[-0.48px] leading-[1.33]">
              Long-form analysis, market context, and ecosystem research
              published through the Solana media stack.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="mx-auto w-full max-w-[1440px] px-[20px] md:px-[32px] xl:px-[40px] pb-[64px] md:pb-[112px] xl:pb-[160px]">
          {/* Category filters */}
          {allCategories.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 border-t border-white/10 py-8 md:py-10">
              <button
                type="button"
                onClick={() => setSelectedCategory(null)}
                className={cn(
                  "rounded-full px-4 py-1.5 text-sm tracking-[-0.14px] transition-colors",
                  selectedCategory === null
                    ? "bg-white text-black"
                    : "bg-white/10 text-white/80 hover:bg-white/15 hover:text-white",
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
                    "rounded-full px-4 py-1.5 text-sm capitalize tracking-[-0.14px] transition-colors",
                    selectedCategory === category
                      ? "bg-white text-black"
                      : "bg-white/10 text-white/80 hover:bg-white/15 hover:text-white",
                  )}
                >
                  {category}
                </button>
              ))}
            </div>
          )}

          {/* Reports grid */}
          <div className={cn(allCategories.length > 0 ? "pt-2" : "pt-0")}>
            {filteredReports.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 md:gap-6 md:grid-cols-2 xl:grid-cols-3">
                {filteredReports.map((report, index) => (
                  <ReportCard key={report.id} report={report} index={index} />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center text-white opacity-[0.64] tracking-[-0.18px] text-lg">
                No reports found
                {selectedCategory ? ` for "${selectedCategory}"` : ""}.
              </div>
            )}
          </div>

          {!selectedCategory && reports.length > 0 && (
            <div className="pt-10">
              <LoadMoreStatus
                isLoading={isLoadingMore}
                hasMore={pageInfo.hasNextPage}
                onLoadMore={handleLoadMore}
                loadingText="Loading more reports..."
                noMoreText="No more reports to load"
              />
            </div>
          )}
        </div>
      </section>
    </ErrorBoundary>
  );
}
