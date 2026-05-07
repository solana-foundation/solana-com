import type { Metadata } from "next";
import { config } from "@/config";
import { SeoJsonLd } from "@/components/SeoJsonLd";
import { getPageMetadata } from "../../../metadata";
import { buildEventStructuredData } from "../../../seo";
import { getMiamiAgenda } from "@/lib/miami-agenda";
import { MiamiAgendaPageContent } from "./MiamiAgendaPageContent";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;

  return getPageMetadata({
    locale,
    path: "/miami/agenda",
    title: "Solana Accelerate Miami Agenda 2026",
    description:
      "See the full Solana Accelerate Miami agenda, with sessions on payments, institutional finance, tokenization, DeFi, and AI infrastructure.",
    keywords: [
      "Solana Accelerate Miami agenda",
      "Miami Solana conference schedule",
      "USA blockchain event agenda",
    ],
  });
}

export default async function MiamiAgendaPage() {
  const data = await getMiamiAgenda();

  return (
    <>
      <SeoJsonLd
        data={buildEventStructuredData(config.events.miami, "/miami/agenda")}
      />
      <MiamiAgendaPageContent data={data} />
    </>
  );
}
