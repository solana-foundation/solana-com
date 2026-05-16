import { AgentRegistryPage } from "./agent-registry";
import { getIndexMetadata } from "@/app/metadata";
import { getTranslations } from "next-intl/server";
import { SolutionHeroStat } from "@/components/solutions/hero.v2";

type Props = { params: Promise<{ locale: string }> };

export default async function Page(_props: Props) {
  const t = await getTranslations();

  const stats: SolutionHeroStat[] = [
    {
      value: t("agentRegistry.hero.stats.0.value"),
      label: t("agentRegistry.hero.stats.0.label"),
    },
    {
      value: t("agentRegistry.hero.stats.1.value"),
      label: t("agentRegistry.hero.stats.1.label"),
    },
    {
      value: t("agentRegistry.hero.stats.2.value"),
      label: t("agentRegistry.hero.stats.2.label"),
    },
  ];

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
