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

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;

  return getPageMetadata({
    locale,
    path: "/china",
    title: "Solana Accelerate China 2026",
    description:
      "Solana Accelerate China brings the Solana community to Shanghai, Hangzhou, Shenzhen, and Beijing in October 2026.",
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

export default function ChinaPage() {
  return (
    <>
      <SeoJsonLd
        data={buildEventStructuredData(config.events.china, "/china")}
      />
      <ChinaRoadshow />
      <Highlights />
      <VideoCarousel
        heading="Accelerate China 2026"
        videos={[
          {
            id: "mIGoTSdkEww",
            title: "Welcome to Solana Accelerate APAC",
            thumbnail: getImagePath("/images/china/video-1.png"),
          },
          {
            id: "rmSoC2H4-64",
            title: "Accelerate APAC Opening",
            thumbnail: getImagePath("/images/china/video-2.png"),
          },
          {
            id: "HBLEqLRpSiA",
            title: "Accelerate APAC Opening Fireside",
            thumbnail: getImagePath("/images/china/video-3.png"),
          },
        ]}
      />
      <KeyStats />
      <StayUpdated />
      <ChinaFooter />
    </>
  );
}
