import {
  Hero,
  EventDetails,
  Speakers,
  Sponsors,
  FAQ,
  GettingThere,
  FooterCTA,
} from "@/components";

export default function HomePage() {
  return (
    <>
      <Hero />
      <EventDetails />
      <Speakers />
      <Sponsors />
      <FAQ />
      <GettingThere />
      <FooterCTA />
    </>
  );
}
