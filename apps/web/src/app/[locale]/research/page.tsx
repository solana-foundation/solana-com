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
    validatorButtonLabel: t("sections.validator.buttonLabel"),
    validatorStats: t.raw("sections.validator.stats") as {
      stat: string;
      description: string;
    }[],
    validatorCards: t.raw("cardDecks.validator.cards"),
    energyHeadline: t("sections.energy.headline"),
    energyBody: t.raw("sections.energy.body") as string,
    energyButtonLabel: t("sections.energy.buttonLabel"),
    energyStats: t.raw("sections.energy.stats") as {
      stat: string;
      description: string;
    }[],
    energyCards: t.raw("cardDecks.energy.cards"),
    performanceHeadline: t("sections.performance.headline"),
    performanceBody: t.raw("sections.performance.body") as string,
    performanceButtonLabel: t("sections.performance.buttonLabel"),
    performanceStats: t.raw("sections.performance.stats") as {
      stat: string;
      description: string;
    }[],
    performanceCards: t.raw("cardDecks.performance.cards"),
    additionalCards: t.raw("cardDecks.additional.cards"),
    additionalResearchEyebrow: t("additionalResearch.eyebrow"),
    additionalResearchHeadline: t("additionalResearch.headline"),
    additionalResearchBody: t("additionalResearch.body"),
    conversionPanelHeading: t("conversionPanel.heading"),
    conversionPanelBody: t("conversionPanel.body"),
    conversionPanelButtons: t.raw("conversionPanel.buttons"),
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
