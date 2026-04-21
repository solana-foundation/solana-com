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

export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-black text-white">
      <Navigation />
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
    </main>
  );
}
