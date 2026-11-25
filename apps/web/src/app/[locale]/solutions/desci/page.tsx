import { SolutionsDesciPage } from "./solutions-desci";
import { getAlternates } from "@workspace/i18n/routing";
import { getTranslations } from "next-intl/server";
import { getDisplayMetrics } from "@/lib/metrics/present";
import { PROJECTS } from "@/data/solutions/desci";

type Props = { params: Promise<{ locale: string }> };

export const revalidate = 60;

export default async function Page(_props: Props) {
  const metrics = await getDisplayMetrics(
    PROJECTS.flatMap((project) =>
      "metric" in project ? [project.metric] : [],
    ),
  );

  return (
    <SolutionsDesciPage
      projectMetrics={PROJECTS.map((project) =>
        "metric" in project ? metrics[project.metric] : undefined,
      )}
    />
  );
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations("desci");
  return {
    title: t("meta.title"),
    description: t("meta.description"),
    alternates: getAlternates("/solutions/desci", locale),
  };
}
