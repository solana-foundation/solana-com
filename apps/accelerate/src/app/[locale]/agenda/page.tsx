import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
import { getPageMetadata } from "../../metadata";
import { getTranslations } from "@workspace/i18n/server";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "accelerate.metadata",
  });

  return getPageMetadata({
    locale,
    path: "/hong-kong/agenda",
    title: t("hongKongAgenda.title"),
    description: t("hongKongAgenda.description"),
    siteTitle: t("site.title"),
    siteDescription: t("site.description"),
    keywords: [
      "Solana Accelerate APAC Hong Kong agenda",
      "Hong Kong Solana conference schedule",
      "APAC blockchain event agenda",
    ],
  });
}

export default async function AgendaPage({ params }: PageProps) {
  const { locale } = await params;
  permanentRedirect(
    locale === "en" ? "/hong-kong/agenda" : `/${locale}/hong-kong/agenda`,
  );
}
