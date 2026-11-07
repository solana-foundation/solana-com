import { SolutionsBtcfiPage } from "./solutions-btcfi";
import { getAlternates } from "@workspace/i18n/routing";
import { getTranslations } from "next-intl/server";
import { fetchSolutionNews } from "@/lib/media/solution-news";
import { getDisplayMetrics } from "@/lib/metrics/present";
import { HERO_METRICS, LATEST_NEWS_QUERY } from "@/data/solutions/btcfi";

type Props = { params: Promise<{ locale: string }> };

export const revalidate = 60;

export default async function Page(_props: Props) {
  const [news, metrics] = await Promise.all([
    fetchSolutionNews(LATEST_NEWS_QUERY),
    getDisplayMetrics(HERO_METRICS),
  ]);

  return (
    <SolutionsBtcfiPage
      news={news}
      heroMetrics={HERO_METRICS.map((key) => metrics[key])}
    />
  );
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations("btcfi");
  return {
    title: t("meta.title"),
    description: t("meta.description"),
    alternates: getAlternates("/solutions/btcfi", locale),
  };
}
