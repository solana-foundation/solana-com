import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
import { getPageMetadata } from "../../metadata";

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

export default async function AgendaPage({ params }: PageProps) {
  const { locale } = await params;
  permanentRedirect(
    locale === "en" ? "/hong-kong/agenda" : `/${locale}/hong-kong/agenda`,
  );
}
