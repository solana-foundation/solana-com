import type { Metadata } from "next";
import FinalFormExperience from "@/components/alpenglow/FinalFormExperience";
import { getAlternates } from "@workspace/i18n/routing";
import { getTranslations } from "@workspace/i18n/server";
import { fetchAlpenglowNews } from "@/lib/media/alpenglow-news";
import {
  ALPENGLOW_PATH,
  ALPENGLOW_SOCIAL_IMAGE,
  buildAlpenglowJsonLd,
  serializeJsonLd,
} from "./structured-data";

type Props = {
  params: Promise<{ locale: string }>;
};

export const revalidate = 60;

export default async function AlpenglowPage({ params }: Props) {
  const [{ locale }, news] = await Promise.all([params, fetchAlpenglowNews()]);
  const t = await getTranslations({ locale, namespace: "alpenglow.metadata" });
  const alternates = getAlternates(ALPENGLOW_PATH, locale);
  const title = t("title");
  const description = t("description");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(
            buildAlpenglowJsonLd({
              title,
              description,
              locale,
              path: alternates.canonical,
            }),
          ),
        }}
      />
      <FinalFormExperience news={news} />
    </>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "alpenglow.metadata" });
  const title = t("title");
  const description = t("description");
  const alternates = getAlternates(ALPENGLOW_PATH, locale);
  const socialImage = {
    url: ALPENGLOW_SOCIAL_IMAGE,
    width: 1200,
    height: 630,
    alt: "Alpenglow consensus targeting 150ms finality on Solana",
  };

  return {
    title,
    description,
    keywords: [
      "Solana Alpenglow",
      "Alpenglow consensus",
      "Solana finality",
      "150ms finality",
      "Votor",
    ],
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates,
    openGraph: {
      title,
      description,
      type: "website",
      url: alternates.canonical,
      siteName: "Solana",
      locale,
      images: [socialImage],
    },
    twitter: {
      card: "summary_large_image",
      site: "@solana",
      creator: "@solana",
      title,
      description,
      images: [socialImage],
    },
  };
}
