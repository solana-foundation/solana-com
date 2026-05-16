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

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;

  return getPageMetadata({
    locale,
    path: "/hong-kong",
    title: "Solana Accelerate APAC 2026 in Hong Kong",
    description:
      "Join Solana Accelerate APAC in Hong Kong on February 11, 2026 for a full-day conference covering payments, institutional finance, tokenization, and blockchain infrastructure.",
    keywords: [
      "Solana Accelerate APAC",
      "Solana Hong Kong 2026",
      "Hong Kong blockchain conference",
      "Solana APAC event",
    ],
  });
}

export default function HongKongPage() {
  const sponsors = composeSponsors(
    sponsorsData.sponsors as SponsorAugmentation[],
  );

  return (
    <>
      <SeoJsonLd
        data={buildEventStructuredData(config.events.hongKong, "/hong-kong")}
      />
      <HashScroll />
      <Hero showSpeakersNav={false} />
      <EventDetails />
      <AgendaBanner showSpeakersCount={false} />
      <Sponsors sponsors={sponsors as Sponsor[]} />
      <FAQ />
      <GettingThere />
      <FooterCTA />
    </>
  );
}
