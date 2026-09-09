import type { Metadata } from "next";
import { config } from "@/config";
import { SeoJsonLd } from "@/components/SeoJsonLd";
import { getPageMetadata } from "../../../metadata";
import { buildEventStructuredData } from "../../../seo";
import { EventAgendaPage } from "@/components/EventAgendaPage";
import { accelerateEvents } from "@/data/events";
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

export default async function HongKongAgendaPage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "accelerate.metadata",
  });

  return (
    <>
      <SeoJsonLd
        data={buildEventStructuredData(
          {
            ...config.events.hongKong,
            name: t("hongKong.eventName"),
            description: t("hongKong.eventDescription"),
          },
          "/hong-kong/agenda",
        )}
      />
      <EventAgendaPage event={accelerateEvents.hongKong} />
    </>
  );
}
