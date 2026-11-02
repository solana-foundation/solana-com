import type { Metadata } from "next";
import { getTranslations } from "@workspace/i18n/server";
import HereForSubpage from "@/components/pages/here-for/HereForSubpage";
import AddYour3 from "@/components/pages/here-for/AddYour3";
import { getPageMetadata } from "@/app/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "breakpoint.hereFor" });
  return getPageMetadata(locale, {
    path: "/mutuals/add",
    title: t("add.metadataTitle"),
    description: t("add.metadataDescription"),
  });
}

export default async function LocaleHereForAddYour3Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <HereForSubpage locale={locale}>
      <AddYour3 locale={locale} />
    </HereForSubpage>
  );
}
