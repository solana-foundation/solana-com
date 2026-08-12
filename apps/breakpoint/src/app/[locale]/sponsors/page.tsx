import type { Metadata } from "next";
import { getTranslations } from "@workspace/i18n/server";
import SponsorsPage from "@/components/pages/sponsors/SponsorsPage";
import { getPageMetadata } from "@/app/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "breakpoint.pages" });
  return getPageMetadata(locale, {
    path: "/sponsors",
    title: t("sponsors.title"),
    description: t("sponsors.metadataDescription"),
  });
}

export default function LocaleSponsorsPage() {
  return <SponsorsPage />;
}
