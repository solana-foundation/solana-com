import type { Metadata } from "next";
import { getTranslations } from "@workspace/i18n/server";
import ComingSoonPage from "@/components/pages/ComingSoonPage";
import { getPageMetadata } from "@/app/metadata";
import { APPLY_TO_SPEAK_HREF } from "@/content/links";

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

export default async function LocaleSpeakersPage() {
  const t = await getTranslations("breakpoint.pages.speakers");

  return (
    <ComingSoonPage
      title={t("title")}
      description={t("description")}
      cta={{
        href: APPLY_TO_SPEAK_HREF,
        label: t("cta"),
      }}
    />
  );
}
