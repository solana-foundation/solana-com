import {
  Hero,
  EventDetails,
  AgendaBanner,
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
      <AgendaBanner />
      <Speakers />
      <Sponsors />
      <FAQ />
      <GettingThere />
      <FooterCTA />
    </>
  );
}
