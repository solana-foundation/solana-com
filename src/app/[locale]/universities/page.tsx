import { UniversitiesPage } from "./universities";
import { getIndexMetadata } from "@/app/metadata";
import { getTranslations } from "next-intl/server";

type Props = { params: Promise<{ locale: string }> };

export default async function Page(_props: Props) {
  const t = await getTranslations();

  const translations = {
    heroTitle: t("universities.hero.title"),
    heroSubtitle: t("universities.hero.subtitle"),
    joinProgram: t("universities.hero.joinProgram"),
    learnMore: t("universities.hero.learnMore"),
    ctaEyebrowText: t("universities.cta.eyebrowText"),
    ctaTitle: t("universities.cta.title"),
    ctaDescription: t("universities.cta.description"),
    ctaLabel: t("universities.cta.ctaLabel"),
  };

  return <UniversitiesPage translations={translations} />;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return await getIndexMetadata({
    titleKey: "universities.title",
    descriptionKey: "universities.description",
    path: "/universities",
    locale,
  });
}
