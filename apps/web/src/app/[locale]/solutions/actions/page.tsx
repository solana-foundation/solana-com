import { ActionsPage } from "./solutions-actions";
import { getAlternates } from "@workspace/i18n/routing";
import { getTranslations } from "next-intl/server";
import { getDisplayMetrics } from "@/lib/metrics/present";
import { FEATURE_METRICS } from "@/data/solutions/actions";

type Props = { params: Promise<{ locale: string }> };

export const revalidate = 60;

export default async function Page(_props: Props) {
  const metrics = await getDisplayMetrics(FEATURE_METRICS);

  return (
    <ActionsPage featureMetrics={FEATURE_METRICS.map((key) => metrics[key])} />
  );
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations("actions-solution");
  return {
    title: t("meta.title"),
    description: t("meta.description"),
    alternates: getAlternates("/solutions/actions", locale),
  };
}
