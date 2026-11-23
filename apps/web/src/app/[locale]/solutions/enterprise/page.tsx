import { SolutionsEnterprisePage } from "./solutions-enterprise";
import { getAlternates } from "@workspace/i18n/routing";
import { getTranslations } from "next-intl/server";
import { getDisplayMetrics } from "@/lib/metrics/present";
import { HERO_METRICS } from "@/data/solutions/enterprise";

type Props = { params: Promise<{ locale: string }> };

export const revalidate = 60;

export default async function Page(_props: Props) {
  const metrics = await getDisplayMetrics(HERO_METRICS);

  return (
    <SolutionsEnterprisePage
      heroMetrics={HERO_METRICS.map((key) => metrics[key])}
    />
  );
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations("partners");
  return {
    title: t("meta.title"),
    description: t("meta.description"),
    alternates: getAlternates("/solutions/enterprise", locale),
  };
}
