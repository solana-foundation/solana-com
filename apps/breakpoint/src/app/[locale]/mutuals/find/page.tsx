import type { Metadata } from "next";
import { getTranslations } from "@workspace/i18n/server";
import HereForSubpage from "@/components/pages/here-for/HereForSubpage";
import FindMutuals from "@/components/pages/here-for/FindMutuals";
import { getPageMetadata } from "@/app/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "breakpoint.hereFor" });
  return getPageMetadata(locale, {
    path: "/mutuals/find",
    title: t("mutuals.metadataTitle"),
    description: t("mutuals.metadataDescription"),
    // Personal to the signed-in visitor; nothing here for search to index.
    noindex: true,
  });
}

export default async function LocaleHereForFindMutualsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <HereForSubpage locale={locale}>
      <FindMutuals locale={locale} />
    </HereForSubpage>
  );
}
