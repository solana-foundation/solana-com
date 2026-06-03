import { SolutionsTokenizationPage } from "./solutions-tokenization";
import { getAlternates } from "@workspace/i18n/routing";
import { getTranslations } from "next-intl/server";
import { fetchSolutionNews } from "@/lib/media/solution-news";
import { fetchTokenizedAssets } from "@/lib/tokens/assets";
import { LATEST_NEWS_QUERY } from "@/data/solutions/tokenization";

type Props = { params: Promise<{ locale: string }> };

export const revalidate = 60;

export default async function Page(_props: Props) {
  const [news, assets] = await Promise.all([
    fetchSolutionNews(LATEST_NEWS_QUERY),
    fetchTokenizedAssets(),
  ]);

  return <SolutionsTokenizationPage news={news} assets={assets} />;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations("icm");
  return {
    title: t("meta.title"),
    description: t("meta.description"),
    alternates: getAlternates("/solutions/tokenization", locale),
  };
}
