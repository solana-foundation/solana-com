import type { Metadata } from "next";
import { getAlternates } from "@workspace/i18n/routing";
import { getTranslations } from "@workspace/i18n/server";
import { SolanaDataDashboard } from "./solana-data-dashboard";
import {
  buildDataDashboardJsonLd,
  DATA_PATH,
  DATA_SOCIAL_IMAGE,
  serializeJsonLd,
} from "./structured-data";

type Props = {
  params: Promise<{ locale: string }>;
};

export const revalidate = 3600;

const DATA_TOPIC_KEYS = [
  "overview",
  "network",
  "stablecoins",
  "defi",
  "rpc",
  "senders",
] as const;

export default async function DataDashboard({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "dataDashboard" });
  const title = t("metadata.title");
  const description = t("metadata.description");
  const structuredData = buildDataDashboardJsonLd({
    title,
    description,
    locale,
    path: getAlternates(DATA_PATH, locale).canonical,
    topics: DATA_TOPIC_KEYS.map((topic) => ({
      name: t(`tabs.${topic}.label`),
      description: t(`tabs.${topic}.description`),
    })),
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }}
      />
      <SolanaDataDashboard />
    </>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "dataDashboard.metadata",
  });
  const title = t("title");
  const description = t("description");
  const alternates = getAlternates(DATA_PATH, locale);

  return {
    title,
    description,
    alternates,
    openGraph: {
      title,
      description,
      type: "website",
      url: alternates.canonical,
      siteName: "Solana",
      locale,
      images: [
        {
          url: DATA_SOCIAL_IMAGE,
          width: 1200,
          height: 630,
          alt: description,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      creator: "@solana",
      title,
      description,
      images: [
        {
          url: DATA_SOCIAL_IMAGE,
          alt: description,
        },
      ],
    },
  };
}
