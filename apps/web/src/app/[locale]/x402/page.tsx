import { X402Page } from "./x402";
import { getIndexMetadata } from "@/app/metadata";
import { getTranslations } from "next-intl/server";
import { SolutionHeroStat } from "@/components/solutions/hero.v2";

type Props = { params: Promise<{ locale: string }> };

export default async function Page(_props: Props) {
  const t = await getTranslations();

  const stats: SolutionHeroStat[] = [
    {
      value: t("x402.hero.stats.0.value"),
      label: t("x402.hero.stats.0.label"),
    },
    {
      value: t("x402.hero.stats.1.value"),
      label: t("x402.hero.stats.1.label"),
    },
    {
      value: t("x402.hero.stats.2.value"),
      label: t("x402.hero.stats.2.label"),
    },
  ];

  const translations = {
    heroTitle: t("x402.hero.title"),
    heroSubtitle: t("x402.hero.subtitle"),
    extraCta: t("x402.hero.intro"),
    extraCtaHref: "/x402/what-is-x402",
    stats,
    featuresTitle: t("x402.features.title"),
    featuresDescription: t("x402.features.description"),
    ecoProjectsTitle: t("x402.ecoProjects.title"),
    toolsTitle: t("x402.tools.title"),
    toolsDescription: t("x402.tools.description"),
  };

  return <X402Page translations={translations} />;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return await getIndexMetadata({
    titleKey: "x402.title",
    descriptionKey: "x402.description",
    path: "/x402",
    locale,
  });
}
