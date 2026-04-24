import HeroSection from "@/components/sections/HeroSection";
import Navigation from "@/components/Navigation";
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
    <main className="relative min-h-screen bg-black text-white">
      <a
        href="#breakpoint-content"
        className="sr-only absolute left-5 top-5 z-50 focus:not-sr-only focus:bg-white focus:px-4 focus:py-2 focus:font-mono focus:text-[14px] focus:font-bold focus:uppercase focus:tracking-[0.08em] focus:text-black"
      >
        Skip to content
      </a>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navigation />
      <div id="breakpoint-content">
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
      </div>
    </main>
  );
}
