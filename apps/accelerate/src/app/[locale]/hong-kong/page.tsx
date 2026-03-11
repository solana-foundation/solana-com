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
import sponsorsData from "@/data/hong-kong/sponsors.json";
import type { Sponsor } from "@/types/sponsors";

export default function HongKongPage() {
  return (
    <>
      <HashScroll />
      <Hero />
      <EventDetails />
      <AgendaBanner />
      <Speakers />
      <Sponsors sponsors={sponsorsData.sponsors as Sponsor[]} />
      <FAQ />
      <GettingThere />
      <FooterCTA />
    </>
  );
}
