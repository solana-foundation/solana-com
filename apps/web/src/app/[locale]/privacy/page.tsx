import { PrivacyPage } from "./privacy-page";
import { getIndexMetadata } from "@/app/metadata";
import { getTranslations } from "next-intl/server";

type Props = { params: Promise<{ locale: string }> };

export default async function Page(_props: Props) {
  const t = await getTranslations();

  const translations = {
    heroTitle: t("privacy.hero.title"),
    heroSubtitle: t("privacy.hero.subtitle"),
    heroSupportingText: t("privacy.hero.supportingText"),
    // Spectrum
    spectrumTitle: t("privacy.spectrum.title"),
    spectrumDescription: t("privacy.spectrum.description"),
    // Quadrants — merged spectrum overview + mode detail
    pseudonymity: {
      title: t("privacy.modes.pseudonymity.title"),
      description: t("privacy.modes.pseudonymity.description"),
      items: t.raw("privacy.modes.pseudonymity.items") as string[],
    },
    confidentiality: {
      title: t("privacy.modes.confidentiality.title"),
      description: t("privacy.modes.confidentiality.description"),
      items: t.raw("privacy.modes.confidentiality.items") as string[],
    },
    anonymity: {
      title: t("privacy.modes.anonymity.title"),
      description: t("privacy.modes.anonymity.description"),
      items: t.raw("privacy.modes.anonymity.items") as string[],
    },
    fullyPrivate: {
      title: t("privacy.modes.fullyPrivate.title"),
      description: t("privacy.modes.fullyPrivate.description"),
      items: t.raw("privacy.modes.fullyPrivate.items") as string[],
    },
    // Design principles
    principlesTitle: t("privacy.principles.title"),
    principle1Title: t("privacy.principles.programmable.title"),
    principle1Description: t("privacy.principles.programmable.description"),
    principle2Title: t("privacy.principles.coexist.title"),
    principle2Description: t("privacy.principles.coexist.description"),
    principle3Title: t("privacy.principles.performance.title"),
    principle3Description: t("privacy.principles.performance.description"),
    // Ecosystem
    ecosystemTitle: t("privacy.ecosystem.title"),
    // Use cases
    useCasesTitle: t("privacy.useCases.title"),
    useCasesDescription: t("privacy.useCases.description"),
    useCasesList: t.raw("privacy.useCases.items") as Array<{
      title: string;
      description: string;
      privacyType: string;
    }>,
    // CTA
    ctaTitle: t("privacy.cta.title"),
    ctaDescription: t("privacy.cta.description"),
    ctaButton: t("privacy.cta.button"),
    ctaButtonHref: t("privacy.cta.buttonHref"),
  };

  return <PrivacyPage translations={translations} />;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return await getIndexMetadata({
    titleKey: "privacy.title",
    descriptionKey: "privacy.description",
    path: "/privacy",
    locale,
  });
}
