import type { Metadata } from "next";
import ReportsClientPage from "./client-page";
import { fetchLatestReports } from "@/lib/report-data";
import { reportsListingMetadata } from "@/lib/metadata";

export const revalidate = 300;

export function generateMetadata(): Metadata {
  return reportsListingMetadata();
}

export default async function ReportsPage() {
  const latestReports = await fetchLatestReports({ limit: 12 });

  return (
    <ReportsClientPage
      latestReports={latestReports.reports}
      initialPageInfo={latestReports.pageInfo}
    />
  );
}
