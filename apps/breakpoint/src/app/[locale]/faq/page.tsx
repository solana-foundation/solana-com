import type { Metadata } from "next";
import FAQPage from "@/components/pages/FAQPage";
import { faqPageMetadata } from "@/content/faq-page";
import { getPageMetadata } from "@/app/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return getPageMetadata(locale, faqPageMetadata);
}

export default function LocaleFAQPage() {
  return <FAQPage />;
}
