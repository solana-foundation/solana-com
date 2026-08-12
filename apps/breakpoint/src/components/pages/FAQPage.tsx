import FAQAccordionList from "@/components/FAQAccordionList";
import PageShell from "@/components/PageShell";
import Footer from "@/components/sections/Footer";
import SubpageHero from "@/components/SubpageHero";
import FAQSubnav from "@/components/pages/FAQSubnav";
import type { FAQPageSection } from "@/content/faq-page";
import { GENERAL_ADMISSION_HREF } from "@/content/links";

export default async function FAQPage() {
  const t = await getTranslations("breakpoint.pages.faq");
  const sections = t.raw("sections") as FAQPageSection[];

  return (
    <PageShell
      contentId="faq-content"
      navigation={{
        ctaAlwaysVisible: true,
        ctaHref: GENERAL_ADMISSION_HREF,
        ctaLabel: t("ticketsCta"),
        showMenuButton: true,
      }}
    >
      <SubpageHero heroImage={false} title={t("title")} />
      <FAQSubnav sections={sections} />
      <FAQAccordionList sections={sections} />
      <Footer backgroundColor="green" />
    </PageShell>
  );
}
import { getTranslations } from "@workspace/i18n/server";
