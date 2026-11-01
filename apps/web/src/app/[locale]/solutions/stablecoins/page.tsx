import { SolutionsStablecoinsPage } from "./solutions-stablecoins";
import { getAlternates } from "@workspace/i18n/routing";
import { getTranslations } from "next-intl/server";
import { getDisplayMetrics } from "@/lib/metrics/present";
import { HERO_METRICS } from "@/data/solutions/stablecoins";

type Props = { params: Promise<{ locale: string }> };

export const revalidate = 60;

export default async function Page(_props: Props) {
  const metrics = await getDisplayMetrics(HERO_METRICS);

  return (
    <SolutionsStablecoinsPage
      heroMetrics={HERO_METRICS.map((key) => metrics[key])}
    />
  );
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations("stablecoins");
  return {
    title: t("meta.title"),
    description: t("meta.description"),
    alternates: getAlternates("/solutions/stablecoins", locale),
  };
}
