import { WhatIsAgentRegistryPage } from "./what-is-agent-registry-page";
import { getTranslations } from "next-intl/server";
import { getIndexMetadata } from "@/app/metadata";

type Props = { params: Promise<{ locale: string }> };

export default async function Page(_props: Props) {
  const t = await getTranslations();

  const translations = {
    title: t("agentRegistry.whatIs.title"),
    description: t("agentRegistry.whatIs.description"),
    identitySectionTitle: t("agentRegistry.whatIs.identitySection.title"),
    identitySectionContent: t("agentRegistry.whatIs.identitySection.content"),
    reputationSectionTitle: t("agentRegistry.whatIs.reputationSection.title"),
    reputationSectionContent: t(
      "agentRegistry.whatIs.reputationSection.content",
    ),
    validationSectionTitle: t("agentRegistry.whatIs.validationSection.title"),
    validationSectionContent: t(
      "agentRegistry.whatIs.validationSection.content",
    ),
    whySolanaSectionTitle: t("agentRegistry.whatIs.whySolanaSection.title"),
    whySolanaSectionContent: t("agentRegistry.whatIs.whySolanaSection.content"),
    useCasesTitle: t("agentRegistry.whatIs.useCases.title"),
    useCasesList: t.raw("agentRegistry.whatIs.useCases.items") as string[],
    ctaText: t("agentRegistry.whatIs.cta.text"),
    ctaButton: t("agentRegistry.whatIs.cta.button"),
  };

  return <WhatIsAgentRegistryPage translations={translations} />;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return await getIndexMetadata({
    titleKey: "agentRegistry.whatIs.title",
    descriptionKey: "agentRegistry.whatIs.description",
    path: "/agent-registry/what-is-agent-registry",
    locale,
  });
}
