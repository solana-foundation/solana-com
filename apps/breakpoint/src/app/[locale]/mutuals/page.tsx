import type { Metadata } from "next";
import { getTranslations } from "@workspace/i18n/server";
import HereForPage from "@/components/pages/here-for/HereForPage";
import { getPageMetadata } from "@/app/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "breakpoint.hereFor" });
  return getPageMetadata(locale, {
    path: "/mutuals",
    title: t("metadata.title"),
    description: t("metadata.description"),
  });
}

export default async function LocaleHereForPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <HereForPage locale={locale} />;
}
