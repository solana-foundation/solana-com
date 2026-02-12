import {
  Hero,
  EventDetails,
  AgendaBanner,
  Speakers,
  Sponsors,
  FAQ,
  GettingThere,
  FooterCTA,
  HashScroll,
} from "@/components";

export default function HomePage() {
  return (
    <>
      <HashScroll />
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
