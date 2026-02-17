import { PyusdPage } from "./pyusd";
import { getIndexMetadata } from "@/app/metadata";
import { getTranslations } from "next-intl/server";
import { HERO_BUTTONS, META } from "@/data/pyusd";

type Props = { params: Promise<{ locale: string }> };

export const revalidate = 60;

export default async function Page(_props: Props) {
  const t = await getTranslations("pyusd");

  const translations = {
    heroEyebrow: t("hero.eyebrow"),
    heroHeadline: t("hero.headline"),
    heroBody: t.raw("hero.body") as string,
    heroButtons: HERO_BUTTONS.map((_, index) => t(`hero.buttons.${index}`)),
    primaryCards: t.raw("primaryCardDeck.cards") as {
      eyebrow: string;
      heading: string;
      body: string;
      ctaLabel: string;
    }[],
    sliderCards: t.raw("slider.cards") as {
      title: string;
      body: string;
      ctaLabel: string;
    }[],
    learnSectionEyebrow: t("learnSection.eyebrow"),
    learnSectionHeadline: t("learnSection.headline"),
    learnSectionBody: t("learnSection.body"),
    secondaryCards: t.raw("secondaryCardDeck.cards") as {
      heading: string;
      ctaLabel: string;
    }[],
  };

  return <PyusdPage translations={translations} />;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const base = await getIndexMetadata({
    titleKey: "pyusd.meta.seoTitle",
    descriptionKey: "pyusd.meta.seoDescription",
    path: "/pyusd",
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
