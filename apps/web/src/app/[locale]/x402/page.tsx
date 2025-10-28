import { X402Page } from "./x402";
import { getIndexMetadata } from "@/app/metadata";
import { getTranslations } from "next-intl/server";

type Props = { params: Promise<{ locale: string }> };

export default async function Page(_props: Props) {
  const t = await getTranslations();

  const translations = {
    heroTitle: t("x402.hero.title"),
    heroSubtitle: t("x402.hero.subtitle"),
    intro: t("x402.hero.intro"),
    build: t("x402.hero.build"),
    textSectionTitle: t("x402.textSection.title"),
    textSectionContent: t("x402.textSection.content"),
    toolsTitle: t("x402.tools.title"),
    toolsDescription: t("x402.tools.description"),
  };

  return <X402Page translations={translations} />;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return await getIndexMetadata({
    titleKey: "x402.title",
    descriptionKey: "x402.description",
    path: "/x402",
    locale,
  });
}
