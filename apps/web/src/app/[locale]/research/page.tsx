import { ResearchPage } from "./research";
import { getIndexMetadata } from "@/app/metadata";
import { getTranslations } from "next-intl/server";
import { META } from "@/data/research";

type Props = { params: Promise<{ locale: string }> };

export const revalidate = 60;

export default async function Page(_props: Props) {
  const t = await getTranslations("research");

  const translations = {
    heroHeadline: t("hero.headline"),
    heroBody: t.raw("hero.body") as string,
    heroButtons: t.raw("hero.buttons"),
    validatorHeadline: t("sections.validator.headline"),
    validatorBody: t.raw("sections.validator.body") as string,
    validatorCards: t.raw("cardDecks.validator.cards"),
    energyHeadline: t("sections.energy.headline"),
    energyBody: t.raw("sections.energy.body") as string,
    energyCards: t.raw("cardDecks.energy.cards"),
    performanceHeadline: t("sections.performance.headline"),
    performanceBody: t.raw("sections.performance.body") as string,
    performanceCards: t.raw("cardDecks.performance.cards"),
    additionalCards: t.raw("cardDecks.additional.cards"),
    conversionPanelHeading: t("conversionPanel.heading"),
    conversionPanelBody: t("conversionPanel.body"),
    conversionPanelButtons: t.raw("conversionPanel.buttons"),
    evidence: {
      eyebrow: t("evidence.eyebrow"),
      latestAnalysis: t("evidence.latestAnalysis"),
      source: t("evidence.source"),
      readReport: t("evidence.readReport"),
      liveDashboard: t("evidence.liveDashboard"),
      relatedReading: t("evidence.relatedReading"),
      archiveDescription: t("evidence.archiveDescription"),
      snapshotNote: t("evidence.snapshotNote"),
      metrics: {
        validators: t("evidence.metrics.validators"),
        nakamoto: t("evidence.metrics.nakamoto"),
        countries: t("evidence.metrics.countries"),
        voteParticipation: t("evidence.metrics.voteParticipation"),
        energyPerTransaction: t("evidence.metrics.energyPerTransaction"),
        annualizedEnergy: t("evidence.metrics.annualizedEnergy"),
        slotTarget: t("evidence.metrics.slotTarget"),
        uptime: t("evidence.metrics.uptime"),
      },
    },
  };

  return <ResearchPage translations={translations} />;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const base = await getIndexMetadata({
    titleKey: "research.meta.seoTitle",
    descriptionKey: "research.meta.seoDescription",
    path: "/research",
    locale,
  });
  return {
    ...base,
    openGraph: {
      ...base.openGraph,
      images: [META.seoImage],
    },
  };
}
