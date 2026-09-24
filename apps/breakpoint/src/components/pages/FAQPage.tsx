import FAQAccordionList from "@/components/FAQAccordionList";
import PageShell from "@/components/PageShell";
import Footer from "@/components/sections/Footer";
import SubpageHero from "@/components/SubpageHero";
import FAQSubnav from "@/components/pages/FAQSubnav";
import type { FAQPageSection } from "@/content/faq-page";
import { GENERAL_ADMISSION_HREF } from "@/content/links";
import { getTranslations } from "@workspace/i18n/server";

export default async function FAQPage({ locale }: { locale: string }) {
  const t = await getTranslations({
    locale,
    namespace: "breakpoint.pages.faq",
  });
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
