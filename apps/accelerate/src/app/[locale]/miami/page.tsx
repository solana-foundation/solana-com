import {
  Hero,
  EventDetails,
  Speakers,
  Sponsors,
  FAQ,
  GettingThere,
  FooterCTA,
  HashScroll,
  GetInvolved,
} from "@/components";
import { MiamiHeroSymbols } from "./MiamiHeroSymbols";

export default function MiamiPage() {
  return (
    <>
      <HashScroll />
      <Hero
        translationPrefix="accelerate.miami"
        logoImage="/images/accelerate-usa-logo.svg"
        agendaPath={null}
        showVideo={false}
        backgroundContent={<MiamiHeroSymbols />}
      />
      <EventDetails
        translationPrefix="accelerate.miami.eventDetails"
        mapEmbedUrl="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3592.8!2d-80.1373!3d25.7951!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88d9b4a40c939193%3A0x5731d9f48a2e7e6!2sMiami%20Beach%20Convention%20Center!5e0!3m2!1sen!2sus&maptype=roadmap&style=feature:all|element:geometry|color:0x242f3e&style=feature:all|element:labels.text.stroke|color:0x242f3e&style=feature:all|element:labels.text.fill|color:0x746855&style=feature:water|element:geometry|color:0x17263c&style=feature:water|element:labels.text.fill|color:0x515c6d"
        mapTitle="Miami Beach Convention Center - 1901 Convention Center Dr, Miami Beach, FL 33139"
        showFocusTopics={false}
        showTicketsRow={false}
      />
      <GetInvolved translationPrefix="accelerate.miami.getInvolved" />
      <Speakers />
      <Sponsors />
      <FAQ
        faqKeys={["q1", "q2", "q3", "q4"]}
        translationPrefix="accelerate.miami.faq"
      />
      <GettingThere
        translationPrefix="accelerate.miami.gettingThere"
        showHotelDeals
      />
      <FooterCTA
        translationPrefix="accelerate.miami.footerCta"
        backgroundImage="/images/palm-trees.svg"
        lumaId="accelerate-miami"
      />
    </>
  );
}
