import type { Metadata } from "next";
import { config } from "@/config";
import {
  HomepageNav,
  HomepageHero,
  HeroWaveWrapper,
  // LiveBanner,
  EventLineup,
  Highlights,
  VideoCarousel,
  KeyStats,
  StayUpdated,
  HomepageFooter,
} from "@/components/homepage";
import { SeoJsonLd } from "@/components/SeoJsonLd";
import { buildEventSeriesStructuredData } from "../seo";
import { getPageMetadata } from "../metadata";
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
    path: "/",
    title: t("home.title"),
    description: t("home.description"),
    siteTitle: t("site.title"),
    siteDescription: t("site.description"),
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

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "accelerate.metadata",
  });

  return (
    <main className="relative overflow-x-clip bg-black text-white">
      <SeoJsonLd
        data={buildEventSeriesStructuredData({
          name: t("site.title"),
          description: t("site.description"),
          events: [
            {
              event: {
                ...config.events.hongKong,
                name: t("hongKong.eventName"),
                description: t("hongKong.eventDescription"),
              },
              path: "/hong-kong",
            },
            {
              event: {
                ...config.events.miami,
                name: t("miami.eventName"),
                description: t("miami.eventDescription"),
              },
              path: "/miami",
            },
            {
              event: {
                ...config.events.china,
                name: t("china.eventName"),
                description: t("china.eventDescription"),
              },
              path: "/china",
            },
          ],
        })}
      />
      {/* <LiveBanner /> */}
      <HomepageNav />
      <HeroWaveWrapper>
        <HomepageHero />
      </HeroWaveWrapper>
      <EventLineup />
      <Highlights />
      <VideoCarousel />
      <KeyStats />
      <StayUpdated />
      <HomepageFooter />
    </main>
  );
}
