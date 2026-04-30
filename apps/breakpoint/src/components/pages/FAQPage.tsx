import FAQAccordionList from "@/components/FAQAccordionList";
import PageShell from "@/components/PageShell";
import Footer from "@/components/sections/Footer";
import SubpageHero from "@/components/SubpageHero";
import FAQSubnav from "@/components/pages/FAQSubnav";
import { faqPageSections } from "@/content/faq-page";
import { GENERAL_ADMISSION_HREF } from "@/content/links";

export default function FAQPage() {
  return (
    <PageShell
      contentId="faq-content"
      // navigation={{
      //   ctaAlwaysVisible: true,
      //   ctaHref: GENERAL_ADMISSION_HREF,
      //   ctaLabel: "Get tickets",
      //   showMenuButton: true,
      // }}
    >
      <SubpageHero image={false} title="FAQ" />
      <FAQSubnav sections={faqPageSections} />
      <FAQAccordionList sections={faqPageSections} />
      <Footer backgroundColor="green" />
    </PageShell>
  );
}
