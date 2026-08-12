import type { Metadata } from "next";
import { getTranslations } from "@workspace/i18n/server";
import TravelPage from "@/components/pages/travel/TravelPage";
import { getPageMetadata } from "@/app/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "breakpoint.travel.metadata",
  });

  return getPageMetadata(locale, {
    path: "/travel",
    title: t("title"),
    description: t("description"),
  });
}

export default function LocaleTravelPage() {
  return <TravelPage />;
}
