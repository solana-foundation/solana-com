import type { Metadata } from "next";
import { getTranslations } from "@workspace/i18n/server";
import SpeakersPage from "@/components/pages/speakers/SpeakersPage";
import { getPageMetadata } from "@/app/metadata";

// Next requires this export to be a literal; 1800 seconds = 30 minutes.
export const revalidate = 1800;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "breakpoint.pages" });
  return getPageMetadata(locale, {
    path: "/speakers",
    title: t("speakers.title"),
    description: t("speakers.metadataDescription"),
  });
}

export default async function LocaleSpeakersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "breakpoint.pages",
  });

  return (
    <SpeakersPage
      applyToSpeakLabel={t("speakers.cta")}
      title={t("speakers.title")}
    />
  );
}
