import { AgentRegistryPage } from "./agent-registry";
import { getIndexMetadata } from "@/app/metadata";
import { getTranslations } from "next-intl/server";
import { SolutionHeroStat } from "@/components/solutions/hero.v2";
import { getDisplayMetrics } from "@/lib/metrics/present";
import { HERO_METRICS } from "@/data/solutions/agent-registry";

type Props = { params: Promise<{ locale: string }> };

export const revalidate = 60;

export default async function Page(_props: Props) {
  const [t, metrics] = await Promise.all([
    getTranslations(),
    getDisplayMetrics(HERO_METRICS),
  ]);

  const stats: SolutionHeroStat[] = HERO_METRICS.map((key, index) => ({
    value: metrics[key].value,
    label: t(`agentRegistry.hero.stats.${index}.label`),
    source: metrics[key].source,
    localized: true,
  }));

  const translations = {
    heroTitle: t("agentRegistry.hero.title"),
    heroSubtitle: t("agentRegistry.hero.subtitle"),
    extraCta: t("agentRegistry.hero.intro"),
    extraCtaHref: "/agent-registry/what-is-agent-registry",
    stats,
    featuresTitle: t("agentRegistry.features.title"),
    featuresDescription: t("agentRegistry.features.description"),
    featuresCtaButton: t("agentRegistry.features.ctaButton"),
    featuresCtaButtonHref: "https://8004.qnt.sh/skill.md",
    ecoProjectsTitle: t("agentRegistry.ecoProjects.title"),
    toolsTitle: t("agentRegistry.tools.title"),
    toolsDescription: t("agentRegistry.tools.description"),
  };

  return <AgentRegistryPage translations={translations} />;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return await getIndexMetadata({
    titleKey: "agentRegistry.title",
    descriptionKey: "agentRegistry.description",
    path: "/agent-registry",
    locale,
  });
}
