import { WhatIsX402Page } from "./what-is-x402-page";
import { getTranslations } from "next-intl/server";
import { getIndexMetadata } from "@/app/metadata";

type Props = { params: Promise<{ locale: string }> };

export default async function Page(_props: Props) {
  const t = await getTranslations();

  const translations = {
    title: t("x402.whatIs.title"),
    description: t("x402.whatIs.description"),
    httpSectionTitle: t("x402.whatIs.httpSection.title"),
    httpSectionContent: t("x402.whatIs.httpSection.content"),
    solanaSectionTitle: t("x402.whatIs.solanaSection.title"),
    solanaSectionContent: t("x402.whatIs.solanaSection.content"),
    agentEconomySectionTitle: t("x402.whatIs.agentEconomySection.title"),
    agentEconomySectionContent: t("x402.whatIs.agentEconomySection.content"),
    communitySectionTitle: t("x402.whatIs.communitySection.title"),
    communitySectionContent: t("x402.whatIs.communitySection.content"),
    useCasesTitle: t("x402.whatIs.useCases.title"),
    useCasesList: t.raw("x402.whatIs.useCases.items") as string[],
    ctaText: t("x402.whatIs.cta.text"),
    ctaButton: t("x402.whatIs.cta.button"),
  };

  return <WhatIsX402Page translations={translations} />;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return await getIndexMetadata({
    titleKey: "x402.whatIs.title",
    descriptionKey: "x402.whatIs.description",
    path: "/x402/what-is-x402",
    locale,
  });
}
