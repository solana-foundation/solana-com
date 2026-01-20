import {
  Hero,
  EventDetails,
  Tickets,
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
      <Tickets />
      <Speakers />
      <Sponsors />
      <FAQ />
      <GettingThere />
      <FooterCTA />
    </>
  );
}
