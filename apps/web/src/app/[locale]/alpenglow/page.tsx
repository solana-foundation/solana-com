import type { Metadata } from "next";
import FinalFormExperience from "@/components/alpenglow/FinalFormExperience";
import { getAlternates } from "@workspace/i18n/routing";
import { getTranslations } from "@workspace/i18n/server";
import { buildAlpenglowJsonLd, serializeJsonLd } from "./structured-data";

type Props = {
  params: Promise<{ locale: string }>;
};

const PAGE_PATH = "/alpenglow";

export default async function AlpenglowPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "alpenglow.metadata" });
  const alternates = getAlternates(PAGE_PATH, locale);
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
      <FinalFormExperience />
    </>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "alpenglow.metadata" });
  const title = t("title");
  const description = t("description");
  const alternates = getAlternates(PAGE_PATH, locale);

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
    },
    twitter: {
      card: "summary",
      creator: "@solana",
      title,
      description,
    },
  };
}
