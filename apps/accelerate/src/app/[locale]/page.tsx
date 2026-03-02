import {
  HomepageNav,
  HomepageHero,
  AuroraWave,
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
      <HomepageHero />
      <AuroraWave />
      <EventLineup />
      <Highlights />
      <VideoCarousel />
      <StayUpdated />
      <HomepageFooter />
    </>
  );
}
