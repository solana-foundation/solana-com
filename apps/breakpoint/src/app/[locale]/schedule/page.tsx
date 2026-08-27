import type { Metadata } from "next";
import { getTranslations } from "@workspace/i18n/server";
import ComingSoonPage from "@/components/pages/ComingSoonPage";
import { getPageMetadata } from "@/app/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "breakpoint.pages" });
  return getPageMetadata(locale, {
    path: "/schedule",
    title: t("schedule.title"),
    description: t("schedule.metadataDescription"),
  });
}

export default async function LocaleSchedulePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "breakpoint.pages.schedule",
  });

  return <ComingSoonPage title={t("title")} description={t("description")} />;
}
