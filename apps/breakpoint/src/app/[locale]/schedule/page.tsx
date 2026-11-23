import type { Metadata } from "next";
import { getTranslations } from "@workspace/i18n/server";
import AgendaPage from "@/components/pages/agenda/AgendaPage";
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

  return (
    <AgendaPage
      title={t("title")}
      communityEventsLabel={t("communityEventsCta")}
    />
  );
}
