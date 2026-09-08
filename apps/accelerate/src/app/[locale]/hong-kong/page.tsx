import type { Metadata } from "next";
import {
  Hero,
  EventDetails,
  AgendaBanner,
  Sponsors,
  FAQ,
  GettingThere,
  FooterCTA,
  HashScroll,
} from "@/components";
import sponsorsData from "@/data/hong-kong/sponsors.json";
import { composeSponsors, type SponsorAugmentation } from "@/lib/sponsor-data";
import type { Sponsor } from "@/types/sponsors";
import { config } from "@/config";
import { SeoJsonLd } from "@/components/SeoJsonLd";
import { getPageMetadata } from "../../metadata";
import { buildEventStructuredData } from "../../seo";
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
    path: "/hong-kong",
    title: t("hongKong.title"),
    description: t("hongKong.description"),
    siteTitle: t("site.title"),
    siteDescription: t("site.description"),
    keywords: [
      "Solana Accelerate APAC",
      "Solana Hong Kong 2026",
      "Hong Kong blockchain conference",
      "Solana APAC event",
    ],
  });
}

export default async function HongKongPage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "accelerate.metadata",
  });
  const sponsors = composeSponsors(
    sponsorsData.sponsors as SponsorAugmentation[],
  );

  return (
    <>
      <SeoJsonLd
        data={buildEventStructuredData(
          {
            ...config.events.hongKong,
            name: t("hongKong.eventName"),
            description: t("hongKong.eventDescription"),
          },
          "/hong-kong",
        )}
      />
      <HashScroll />
      <Hero
        homePath={accelerateEvents.hongKong.homePath}
        showSpeakersNav={false}
      />
      <EventDetails />
      <AgendaBanner showSpeakersCount={false} />
      <Sponsors sponsors={sponsors as Sponsor[]} />
      <FAQ />
      <GettingThere />
      <FooterCTA />
    </>
  );
}
