import {
  HomepageNav,
  HomepageHero,
  HeroWaveWrapper,
  EventLineup,
  Highlights,
  VideoCarousel,
  StayUpdated,
  HomepageFooter,
} from "@/components/homepage";

export default function HomePage() {
  return (
    <main className="relative overflow-x-clip bg-black text-white">
      <HomepageNav />
      <HeroWaveWrapper>
        <HomepageHero />
      </HeroWaveWrapper>
      <EventLineup />
      <Highlights />
      <VideoCarousel />
      <StayUpdated />
      <HomepageFooter />
    </main>
  );
}
