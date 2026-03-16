import type { Metadata } from "next";
import { config } from "@/config";
import { SeoJsonLd } from "@/components/SeoJsonLd";
import { getPageMetadata } from "../../../metadata";
import { buildEventStructuredData } from "../../../seo";
import { HongKongAgendaPageContent } from "./HongKongAgendaPageContent";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;

  return getPageMetadata({
    locale,
    path: "/hong-kong/agenda",
    title: "Solana Accelerate APAC Hong Kong Agenda 2026",
    description:
      "See the full Solana Accelerate APAC Hong Kong agenda, with sessions on payments, institutional finance, tokenization, DeFi, and AI infrastructure.",
    keywords: [
      "Solana Accelerate APAC Hong Kong agenda",
      "Hong Kong Solana conference schedule",
      "APAC blockchain event agenda",
    ],
  });
}

export default function HongKongAgendaPage() {
  return (
    <>
      <SeoJsonLd
        data={buildEventStructuredData(
          config.events.hongKong,
          "/hong-kong/agenda",
        )}
      />
      <HongKongAgendaPageContent />
    </>
  );
}
