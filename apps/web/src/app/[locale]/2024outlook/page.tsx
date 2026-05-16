import { Outlook2024Page } from "./outlook-2024";
import { getIndexMetadata } from "@/app/metadata";
import { getTranslations } from "next-intl/server";
import { META, SWITCHBACK } from "../../../data/2024outlook";

type Props = { params: Promise<{ locale: string }> };

export const revalidate = 60;

export default async function Page(_props: Props) {
  const t = await getTranslations("2024outlook");

  const translations = {
    heroEyebrow: t("hero.eyebrow"),
    heroHeadline: t("hero.headline"),
    heroBody: t.raw("hero.body") as string,
    heroButtonLabel: t("hero.buttonLabel"),
    featureHighlightHeadline: t("featureHighlight.headline"),
    featureHighlightBody: t("featureHighlight.body"),
    featureHighlightCards: t.raw("featureHighlight.cards") as string[],
    devEcosystemHeading: t("conversionPanels.developerEcosystem.heading"),
    devEcosystemBody: t("conversionPanels.developerEcosystem.body"),
    devEcosystemButtonLabel: t(
      "conversionPanels.developerEcosystem.buttonLabel",
    ),
    researchHeadings: t.raw("cardDecks.research.headings") as string[],
    researchBodies: (t.raw("cardDecks.research.headings") as string[]).map(
      (_, index) => t.raw(`cardDecks.research.bodies.${index}`) as string,
    ),
    ctaHeadings: t.raw("cardDecks.cta.headings") as string[],
    videoHeadings: t.raw("cardDecks.videos.headings") as string[],
    caseStudiesHeading: t("conversionPanels.caseStudies.heading"),
    caseStudiesBody: t("conversionPanels.caseStudies.body"),
    caseStudiesLabels: t.raw("conversionPanels.caseStudies.labels") as string[],
    headingEyebrow: t("heading.eyebrow"),
    headingHeadline: t("heading.headline"),
    headingBody: t("heading.body"),
    switchbackHeadline: t("switchback.headline"),
    switchbackBody: t.raw("switchback.body") as string,
    switchbackButtons: SWITCHBACK.buttons.map((_, index) =>
      t(`switchback.buttons.${index}`),
    ),
    buttonsRead: t("buttons.read"),
    buttonsReadUpper: t("buttons.readUpper"),
    buttonsWatch: t("buttons.watch"),
  };

  return <Outlook2024Page translations={translations} />;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const base = await getIndexMetadata({
    titleKey: "2024outlook.meta.seoTitle",
    descriptionKey: "2024outlook.meta.seoDescription",
    path: "/2024outlook",
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
