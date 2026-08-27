import type { Metadata } from "next";
import ReportsClientPage from "./client-page";
import { fetchLatestReports } from "@/lib/report-data";
import {
  REPORTS_SEO_DESCRIPTION,
  REPORTS_SEO_TITLE,
  reportsListingMetadata,
} from "@/lib/metadata";
import { JsonLd } from "@/components/seo/json-ld";
import { buildReportCollectionJsonLd } from "@/lib/content-structured-data";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return reportsListingMetadata(locale);
}

export default async function ReportsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const latestReports = await fetchLatestReports({ limit: 12 });
  const structuredData = buildReportCollectionJsonLd({
    reports: latestReports.reports,
    locale,
    title: REPORTS_SEO_TITLE,
    description: REPORTS_SEO_DESCRIPTION,
  });

  return (
    <>
      <JsonLd data={structuredData} />
      <ReportsClientPage
        latestReports={latestReports.reports}
        initialPageInfo={latestReports.pageInfo}
      />
    </>
  );
}
