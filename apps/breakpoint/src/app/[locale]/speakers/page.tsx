import type { Metadata } from "next";
import { getTranslations } from "@workspace/i18n/server";
import SpeakersPage from "@/components/pages/speakers/SpeakersPage";
import { getPageMetadata } from "@/app/metadata";

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
    description:
      "Meet the speakers joining Breakpoint 2026 in London for keynotes, firesides, debates, and product demos.",
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
