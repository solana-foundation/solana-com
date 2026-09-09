import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPageMetadata } from "../../../metadata";
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
    path: "/china/travel",
    title: t("chinaTravel.title"),
    description: t("chinaTravel.description"),
    siteTitle: t("site.title"),
    siteDescription: t("site.description"),
    keywords: [
      "Solana Accelerate China travel guide",
      "Solana China 2026 venues",
      "Shanghai Hangzhou Shenzhen Beijing travel",
    ],
  });
}

export default function ChinaTravelPage() {
  notFound();
}
