import { ResearchPage } from "./research";
import { getIndexMetadata } from "@/app/metadata";
import { getTranslations } from "next-intl/server";
import { CONVERSION_PANEL, HERO_SWITCHBACK, META } from "@/data/research";

type Props = { params: Promise<{ locale: string }> };

export const revalidate = 60;

export default async function Page(_props: Props) {
  const t = await getTranslations("research");

  const translations = {
    heroHeadline: t("hero.headline"),
    heroBody: t.raw("hero.body") as string,
    heroButtons: HERO_SWITCHBACK.buttons.map((_, index) =>
      t(`hero.buttons.${index}`),
    ),
    validatorHeadline: t("sections.validator.headline"),
    validatorBody: t.raw("sections.validator.body") as string,
    validatorButtonLabel: t("sections.validator.buttonLabel"),
    validatorStats: t.raw("sections.validator.stats") as {
      stat: string;
      description: string;
    }[],
    validatorCards: t.raw("cardDecks.validator.cards") as {
      eyebrow: string;
      heading: string;
      body: string;
      ctaLabel: string;
    }[],
    energyHeadline: t("sections.energy.headline"),
    energyBody: t.raw("sections.energy.body") as string,
    energyButtonLabel: t("sections.energy.buttonLabel"),
    energyStats: t.raw("sections.energy.stats") as {
      stat: string;
      description: string;
    }[],
    energyCards: t.raw("cardDecks.energy.cards") as {
      eyebrow: string;
      heading: string;
      body: string;
      ctaLabel: string;
    }[],
    performanceHeadline: t("sections.performance.headline"),
    performanceBody: t.raw("sections.performance.body") as string,
    performanceButtonLabel: t("sections.performance.buttonLabel"),
    performanceStats: t.raw("sections.performance.stats") as {
      stat: string;
      description: string;
    }[],
    performanceCards: t.raw("cardDecks.performance.cards") as {
      eyebrow: string;
      heading: string;
      body: string;
      ctaLabel: string;
    }[],
    additionalCards: t.raw("cardDecks.additional.cards") as {
      eyebrow: string;
      heading: string;
      ctaLabel: string;
    }[],
    additionalResearchEyebrow: t("additionalResearch.eyebrow"),
    additionalResearchHeadline: t("additionalResearch.headline"),
    additionalResearchBody: t("additionalResearch.body"),
    conversionPanelHeading: t("conversionPanel.heading"),
    conversionPanelBody: t("conversionPanel.body"),
    conversionPanelButtons: CONVERSION_PANEL.buttons.map((_, index) =>
      t(`conversionPanel.buttons.${index}`),
    ),
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
