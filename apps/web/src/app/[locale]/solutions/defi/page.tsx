import { SolutionsDefiPage } from "./solutions-defi";
import { getAlternates } from "@workspace/i18n/routing";
import { getTranslations } from "next-intl/server";
import { getDisplayMetrics } from "@/lib/metrics/present";
import { HERO_METRICS, PROJECTS } from "@/data/solutions/defi";

type Props = { params: Promise<{ locale: string }> };

export const revalidate = 60;

export default async function Page(_props: Props) {
  const metrics = await getDisplayMetrics([
    ...HERO_METRICS,
    ...PROJECTS.map((project) => project.metric),
  ]);

  return (
    <SolutionsDefiPage
      heroMetrics={HERO_METRICS.map((key) => metrics[key])}
      projectMetrics={PROJECTS.map((project) => metrics[project.metric])}
    />
  );
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations("defi");
  return {
    title: t("meta.title"),
    description: t("meta.description"),
    alternates: getAlternates("/solutions/defi", locale),
  };
}
