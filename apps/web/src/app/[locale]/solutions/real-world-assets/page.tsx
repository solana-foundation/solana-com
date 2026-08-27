import { SolutionsRealWorldAssetsPage } from "./solutions-real-world-assets";
import { getAlternates } from "@workspace/i18n/routing";
import { getTranslations } from "next-intl/server";
import { fetchSolutionNews } from "@/lib/media/solution-news";
import { LATEST_NEWS_QUERY } from "@/data/solutions/real-world-assets";
import { fetchRwaStats } from "@/lib/tokens/rwa-stats";

type Props = { params: Promise<{ locale: string }> };

export const revalidate = 60;

export default async function Page(_props: Props) {
  const [news, stats] = await Promise.all([
    fetchSolutionNews(LATEST_NEWS_QUERY),
    fetchRwaStats(),
  ]);

  return <SolutionsRealWorldAssetsPage news={news} stats={stats} />;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations("real-world-assets-solution");
  return {
    title: t("meta.title"),
    description: t("meta.description"),
    alternates: getAlternates("/solutions/real-world-assets", locale),
  };
}
