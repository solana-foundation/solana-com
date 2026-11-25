import type { Metadata } from "next";
import { getBaseMetadata } from "@/app/metadata";
import { getAlternates } from "@workspace/i18n/routing";
import { getTranslations } from "@workspace/i18n/server";
import { getDisplayMetrics } from "@/lib/metrics/present";
import { PRIVACY_METRICS } from "@/data/solutions/privacy";
import { PrivacyPage } from "./privacy-page";

type Props = { params: Promise<{ locale: string }> };

export const revalidate = 60;

export default async function Page() {
  const metrics = await getDisplayMetrics(PRIVACY_METRICS);
  return <PrivacyPage metrics={metrics} />;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "privacy.metadata" });
  const title = t("title");
  const description = t("description");
  const alternates = getAlternates("/privacy", locale);
  const base = getBaseMetadata(locale);

  return {
    ...base,
    title,
    description,
    alternates,
    openGraph: {
      ...base.openGraph,
      type: "website",
      title,
      description,
      url: alternates.canonical,
      siteName: "Solana",
    },
    twitter: {
      ...base.twitter,
      card: "summary_large_image",
      title,
      description,
    },
  };
}
