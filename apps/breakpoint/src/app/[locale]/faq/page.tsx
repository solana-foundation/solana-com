import type { Metadata } from "next";
import { getTranslations } from "@workspace/i18n/server";
import FAQPage from "@/components/pages/FAQPage";
import { getPageMetadata } from "@/app/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "breakpoint.pages" });
  return getPageMetadata(locale, {
    path: "/faq",
    title: t("faq.title"),
    description: t("faq.metadataDescription"),
  });
}

export default function LocaleFAQPage() {
  return <FAQPage />;
}
