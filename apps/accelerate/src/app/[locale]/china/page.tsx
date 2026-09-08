import type { Metadata } from "next";
import { ChinaFooter, ChinaRoadshow } from "@/components/china/ChinaRoadshow";
import {
  Highlights,
  KeyStats,
  StayUpdated,
  VideoCarousel,
} from "@/components/homepage";
import { SeoJsonLd } from "@/components/SeoJsonLd";
import { config, getImagePath } from "@/config";
import { getPageMetadata } from "../../metadata";
import { buildEventStructuredData } from "../../seo";
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
    path: "/china",
    title: t("china.title"),
    description: t("china.description"),
    siteTitle: t("site.title"),
    siteDescription: t("site.description"),
    keywords: [
      "Solana Accelerate China",
      "Solana China 2026",
      "Shanghai blockchain conference",
      "Hangzhou blockchain event",
      "Shenzhen blockchain event",
      "Beijing blockchain event",
    ],
  });
}

export default async function ChinaPage({ params }: PageProps) {
  const { locale } = await params;
  const metadataT = await getTranslations({
    locale,
    namespace: "accelerate.metadata",
  });
  const chinaT = await getTranslations({
    locale,
    namespace: "accelerate.china",
  });

  return (
    <>
      <SeoJsonLd
        data={buildEventStructuredData(
          {
            ...config.events.china,
            name: metadataT("china.eventName"),
            description: metadataT("china.eventDescription"),
          },
          "/china",
        )}
      />
      <ChinaRoadshow />
      <Highlights />
      <VideoCarousel
        heading={chinaT("videoHeading")}
        videos={[
          {
            id: "mIGoTSdkEww",
            title: chinaT("videos.welcome"),
            thumbnail: getImagePath("/images/china/video-1.webp"),
          },
          {
            id: "rmSoC2H4-64",
            title: chinaT("videos.opening"),
            thumbnail: getImagePath("/images/china/video-2.webp"),
          },
          {
            id: "HBLEqLRpSiA",
            title: chinaT("videos.openingFireside"),
            thumbnail: getImagePath("/images/china/video-3.webp"),
          },
        ]}
      />
      <KeyStats />
      <StayUpdated />
      <ChinaFooter />
    </>
  );
}
