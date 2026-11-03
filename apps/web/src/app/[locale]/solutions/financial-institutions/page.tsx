import { SolutionsFinancialInstitutionsPage } from "./solutions-financial-institutions";
import { getAlternates } from "@workspace/i18n/routing";
import { getTranslations } from "next-intl/server";
import { fetchSolutionNews } from "@/lib/media/solution-news";
import {
  LATEST_NEWS_QUERY,
  PROJECTS,
} from "@/data/solutions/financial-institutions";
import { getDisplayMetrics } from "@/lib/metrics/present";
import type { MetricKey } from "@/lib/metrics/registry";

type Props = { params: Promise<{ locale: string }> };

export const revalidate = 60;

export default async function Page(_props: Props) {
  const [news, metrics] = await Promise.all([
    fetchSolutionNews(LATEST_NEWS_QUERY),
    getDisplayMetrics(
      PROJECTS.flatMap((project) =>
        project.metric ? [project.metric] : [],
      ) as MetricKey[],
    ),
  ]);

  return (
    <SolutionsFinancialInstitutionsPage
      news={news}
      projectMetrics={PROJECTS.map((project) =>
        project.metric ? metrics[project.metric] : undefined,
      )}
    />
  );
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations("financial-institutions-solution");
  return {
    title: t("meta.title"),
    description: t("meta.description"),
    alternates: getAlternates("/solutions/financial-institutions", locale),
  };
}
