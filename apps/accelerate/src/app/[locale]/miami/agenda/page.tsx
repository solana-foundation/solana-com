import type { Metadata } from "next";
import { config } from "@/config";
import { SeoJsonLd } from "@/components/SeoJsonLd";
import { getPageMetadata } from "../../../metadata";
import { buildEventStructuredData } from "../../../seo";
import { getMiamiAgenda } from "@/lib/miami-agenda";
import { EventAgendaPage } from "@/components/EventAgendaPage";
import { accelerateEvents } from "@/data/events";
import { getTranslations } from "@workspace/i18n/server";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export const dynamic = "force-dynamic";

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
    path: "/miami/agenda",
    title: t("miamiAgenda.title"),
    description: t("miamiAgenda.description"),
    siteTitle: t("site.title"),
    siteDescription: t("site.description"),
    keywords: [
      "Solana Accelerate Miami agenda",
      "Miami Solana conference schedule",
      "USA blockchain event agenda",
    ],
  });
}

export default async function MiamiAgendaPage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "accelerate.metadata",
  });
  const data = await getMiamiAgenda();

  return (
    <>
      <SeoJsonLd
        data={buildEventStructuredData(
          {
            ...config.events.miami,
            name: t("miami.eventName"),
            description: t("miami.eventDescription"),
          },
          "/miami/agenda",
        )}
      />
      <EventAgendaPage data={data} event={accelerateEvents.miami} />
    </>
  );
}
