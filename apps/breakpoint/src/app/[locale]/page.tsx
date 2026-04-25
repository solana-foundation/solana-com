import HeroSection from "@/components/sections/HeroSection";
import PageShell from "@/components/PageShell";
import Marquee from "@/components/Marquee";
import NarrativeSection from "@/components/sections/NarrativeSection";
import TicketsSection from "@/components/sections/TicketsSection";
import GallerySection from "@/components/sections/GallerySection";
import StatsSection from "@/components/sections/StatsSection";
import HighlightsSection from "@/components/sections/HighlightsSection";
import AnnouncementsSection from "@/components/sections/AnnouncementsSection";
import FAQSection from "@/components/sections/FAQSection";
import Footer from "@/components/sections/Footer";
import { buildBreakpointJsonLd } from "@/lib/structured-data";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const jsonLd = await buildBreakpointJsonLd(locale);

  return (
    <PageShell
      contentId="breakpoint-content"
      beforeNavigation={
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      }
    >
      <HeroSection />
      <NarrativeSection />
      <Marquee />
      <TicketsSection />
      <GallerySection />
      <StatsSection />
      <Marquee />
      <HighlightsSection />
      <AnnouncementsSection />
      <FAQSection />
      <Footer />
    </PageShell>
  );
}
