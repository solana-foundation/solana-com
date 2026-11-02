import type { Metadata } from "next";
import { getBaseMetadata } from "@/app/metadata";
import { getAlternates } from "@workspace/i18n/routing";
import { getTranslations } from "@workspace/i18n/server";
import { PrivacyPage } from "./privacy-page";

type Props = { params: Promise<{ locale: string }> };

export default function Page() {
  return <PrivacyPage />;
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
