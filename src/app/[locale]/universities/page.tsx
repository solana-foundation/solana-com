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
    subjectsTitle: t("universities.subjects.title"),
    subjectsDescription: t("universities.subjects.description"),
    subjectsEmailButtonLabel: t("universities.subjects.emailButtonLabel"),
    subjectsLearnMore: t("universities.subjects.learnMore"),
    subjectsCards: {
      finance: {
        title: t("universities.subjects.cards.finance.title"),
        description: t("universities.subjects.cards.finance.description"),
      },
      legal: {
        title: t("universities.subjects.cards.legal.title"),
        description: t("universities.subjects.cards.legal.description"),
      },
      technology: {
        title: t("universities.subjects.cards.technology.title"),
        description: t("universities.subjects.cards.technology.description"),
      },
      business: {
        title: t("universities.subjects.cards.business.title"),
        description: t("universities.subjects.cards.business.description"),
      },
      economics: {
        title: t("universities.subjects.cards.economics.title"),
        description: t("universities.subjects.cards.economics.description"),
      },
      engineering: {
        title: t("universities.subjects.cards.engineering.title"),
        description: t("universities.subjects.cards.engineering.description"),
      },
    },
    inquiryEyebrowText: t("universities.inquiry.eyebrowText"),
    inquiryTitle: t("universities.inquiry.title"),
    inquiryDescription: t("universities.inquiry.description"),
    inquiryEmailPlaceholder: t("universities.inquiry.emailPlaceholder"),
    inquirySubmitButton: t("universities.inquiry.submitButton"),
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
