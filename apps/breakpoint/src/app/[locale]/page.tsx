import { getTranslations } from "@workspace/i18n/server";
import HeroSection from "@/components/sections/HeroSection";
import PageShell from "@/components/PageShell";
import Marquee from "@/components/Marquee";
import NarrativeSection from "@/components/sections/NarrativeSection";
import TicketsSection from "@/components/sections/TicketsSection";
import ParticipateSection from "@/components/sections/ParticipateSection";
import WhyAttendSection from "@/components/sections/WhyAttendSection";
import GallerySection from "@/components/sections/GallerySection";
import StatsSection from "@/components/sections/StatsSection";
import SponsorsSection from "@/components/sections/SponsorsSection";
import EventsSection from "@/components/sections/EventsSection";
import HighlightsSection from "@/components/sections/HighlightsSection";
import AnnouncementsSection from "@/components/sections/AnnouncementsSection";
import FAQSection from "@/components/sections/FAQSection";
import Footer from "@/components/sections/Footer";
import { GENERAL_ADMISSION_HREF } from "@/content/links";
import { buildBreakpointJsonLd, serializeJsonLd } from "@/lib/structured-data";

export const dynamic = "force-dynamic";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "breakpoint" });
  const initialNow = Date.now();
  const jsonLd = await buildBreakpointJsonLd(locale);

  return (
    <PageShell
      contentId="breakpoint-content"
      navigation={{
        ctaHref: GENERAL_ADMISSION_HREF,
        ctaLabel: t("menu.items.register"),
      }}
      beforeNavigation={
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
        />
      }
    >
      <HeroSection />
      <NarrativeSection />
      <Marquee />
      <TicketsSection initialNow={initialNow} />
      <ParticipateSection />
      <WhyAttendSection />
      <SponsorsSection />
      <GallerySection />
      <StatsSection />
      <Marquee />
      <EventsSection />
      <HighlightsSection />
      <AnnouncementsSection />
      <FAQSection />
      <Footer />
    </PageShell>
  );
}
