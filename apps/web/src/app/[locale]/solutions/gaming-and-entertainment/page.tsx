import { SolutionsGamingAndEntertainmentPage } from "./solutions-gaming-and-entertainment";
import { getAlternates } from "@workspace/i18n/routing";
import { getTranslations } from "next-intl/server";
import { getDisplayMetrics } from "@/lib/metrics/present";
import { STATS_METRICS } from "@/data/solutions/gaming-and-entertainment";

type Props = { params: Promise<{ locale: string }> };

export const revalidate = 60;

export default async function Page(_props: Props) {
  const metrics = await getDisplayMetrics(STATS_METRICS);

  return (
    <SolutionsGamingAndEntertainmentPage
      statsMetrics={STATS_METRICS.map((key) => metrics[key])}
    />
  );
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations("gaming-and-entertainment-solution");
  return {
    title: t("meta.title"),
    description: t("meta.description"),
    alternates: getAlternates("/solutions/gaming-and-entertainment", locale),
  };
}
