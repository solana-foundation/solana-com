import type { Metadata } from "next";
import { config } from "@/config";
import {
  HomepageNav,
  HomepageHero,
  HeroWaveWrapper,
  // LiveBanner,
  EventLineup,
  TicketsSection,
  Highlights,
  VideoCarousel,
  KeyStats,
  StayUpdated,
  HomepageFooter,
} from "@/components/homepage";
import { SeoJsonLd } from "@/components/SeoJsonLd";
import { buildEventSeriesStructuredData } from "../seo";
import { getPageMetadata } from "../metadata";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;

  return getPageMetadata({
    locale,
    path: "/",
    title: "Solana Accelerate 2026: Hong Kong and Miami Events",
    description:
      "Explore Solana Accelerate 2026, featuring flagship Solana community events in Hong Kong and Miami with speakers, sponsors, event details, and ticket information.",
    keywords: [
      ...new Set([
        ...config.siteMetadata.keywords,
        "Solana Accelerate 2026",
        "Solana events",
        "Hong Kong blockchain event",
        "Miami blockchain event",
      ]),
    ],
  });
}

export default function HomePage() {
  return (
    <main className="relative overflow-x-clip bg-black text-white">
      <SeoJsonLd data={buildEventSeriesStructuredData()} />
      {/* <LiveBanner /> */}
      <HomepageNav />
      <HeroWaveWrapper>
        <HomepageHero />
      </HeroWaveWrapper>
      <EventLineup />
      <TicketsSection />
      <Highlights />
      <VideoCarousel />
      <KeyStats />
      <StayUpdated />
      <HomepageFooter />
    </main>
  );
}
