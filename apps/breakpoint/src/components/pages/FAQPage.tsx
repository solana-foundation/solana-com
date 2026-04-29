import FAQAccordionList from "@/components/FAQAccordionList";
import PageShell from "@/components/PageShell";
import Footer from "@/components/sections/Footer";
import SubpageHero from "@/components/SubpageHero";
import FAQSubnav from "@/components/pages/FAQSubnav";
import { faqPageSections } from "@/content/faq-page";

export default function FAQPage() {
  return (
    <PageShell
      contentId="faq-content"
      navigation={{
        ctaAlwaysVisible: true,
        ctaHref: "/registration",
        ctaLabel: "Register",
        showMenuButton: true,
      }}
    >
      <SubpageHero image={false} title="FAQs" />
      <FAQSubnav sections={faqPageSections} />
      <FAQAccordionList sections={faqPageSections} />
      <Footer backgroundColor="green" />
    </PageShell>
  );
}
