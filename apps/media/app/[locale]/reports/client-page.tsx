"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import uniqBy from "lodash/uniqBy";
import { Section } from "@/components/layout/section";
import ErrorBoundary from "@/components/error-boundary";
import LoadMoreStatus from "@/components/ui/load-more-status";
import { Button } from "@/components/ui/button";
import type { PageInfo, ReportItem } from "@/lib/report-types";
import { ReportCard } from "@/components/report/report-card";

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
      <Section>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 py-10 md:px-6 lg:px-8">
          <div className="relative overflow-hidden bg-[#08101d] px-6 py-10 text-white shadow-[0_60px_120px_-60px_rgba(7,12,28,0.9)] md:px-10 md:py-14">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_120%_at_0%_0%,rgba(82,158,255,0.28),transparent_55%),radial-gradient(80%_80%_at_100%_0%,rgba(25,237,152,0.14),transparent_60%),linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0))]" />
            <div className="relative z-10 flex max-w-3xl flex-col gap-5">
              <span className="text-xs uppercase tracking-[0.35em] text-sky-300/80">
                Solana Reports
              </span>
              <h1 className="text-4xl font-bold leading-[0.98] md:text-6xl">
                Research and reports from across the ecosystem.
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-white/70 md:text-base">
                Long-form analysis, market context, and ecosystem research
                published through the Solana media stack.
              </p>
            </div>
          </div>

          {allCategories.length > 0 && (
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium text-muted-foreground">
                Filter by category:
              </span>
              <Button
                variant={selectedCategory === null ? "default" : "secondary"}
                size="sm"
                onClick={() => setSelectedCategory(null)}
              >
                All
              </Button>
              {allCategories.map((category) => (
                <Button
                  key={category}
                  variant={
                    selectedCategory === category ? "default" : "secondary"
                  }
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          )}

          {filteredReports.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredReports.map((report) => (
                <ReportCard key={report.id} report={report} />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-muted-foreground">
              No reports found
              {selectedCategory ? ` for "${selectedCategory}"` : ""}.
            </div>
          )}

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
      </Section>
    </ErrorBoundary>
  );
}
