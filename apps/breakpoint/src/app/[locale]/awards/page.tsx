import type { Metadata } from "next";
import { getTranslations } from "@workspace/i18n/server";
import AwardsPage from "@/components/pages/awards/AwardsPage";
import { getPageMetadata } from "@/app/metadata";
import { getAwardsCampaignStatus } from "@/lib/awards-campaign";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "breakpoint.awards" });
  const nominationsActive = getAwardsCampaignStatus() !== "closed";
  return getPageMetadata(locale, {
    path: "/awards",
    title: t("metadata.title"),
    description: t(
      nominationsActive ? "metadata.description" : "voting.metadataDescription",
    ),
  });
}

export default async function LocaleAwardsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <AwardsPage locale={locale} />;
}
