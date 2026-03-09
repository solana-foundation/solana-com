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
    <>
      <HomepageNav />
      <HeroWaveWrapper>
        <HomepageHero />
      </HeroWaveWrapper>
      <EventLineup />
      <Highlights />
      <VideoCarousel />
      <StayUpdated />
      <HomepageFooter />
    </>
  );
}
