import type { Metadata } from "next";
import FAQPage from "@/components/pages/FAQPage";
import { faqPageMetadata } from "@/content/faq-page";

export const metadata: Metadata = faqPageMetadata;

export default function LocaleFAQPage() {
  return <FAQPage />;
}
