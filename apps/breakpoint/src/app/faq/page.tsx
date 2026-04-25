import type { Metadata } from "next";
import DefaultLocaleShell from "@/app/DefaultLocaleShell";
import FAQPage from "@/components/pages/FAQPage";
import { faqPageMetadata } from "@/content/faq-page";

export const metadata: Metadata = faqPageMetadata;

export default function DefaultLocaleFAQPage() {
  return (
    <DefaultLocaleShell includeFabMenu>
      <FAQPage />
    </DefaultLocaleShell>
  );
}
