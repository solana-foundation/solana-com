import HeroSection from "@/components/sections/HeroSection";
import Marquee from "@/components/Marquee";
import NarrativeSection from "@/components/sections/NarrativeSection";
import TicketsSection from "@/components/sections/TicketsSection";
import GallerySection from "@/components/sections/GallerySection";
import StatsSection from "@/components/sections/StatsSection";
import HighlightsSection from "@/components/sections/HighlightsSection";
import AnnouncementsSection from "@/components/sections/AnnouncementsSection";
import FAQSection from "@/components/sections/FAQSection";
import FooterSection from "@/components/sections/FooterSection";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <HeroSection />
      <NarrativeSection />
      <Marquee />
      <TicketsSection />
      <GallerySection />
      <StatsSection />
      <HighlightsSection />
      <AnnouncementsSection />
      <FAQSection />
      <FooterSection />
    </main>
  );
}
