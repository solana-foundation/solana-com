import type { Metadata } from "next";
import {
  Hero,
  EventDetails,
  AgendaBanner,
  Sponsors,
  FAQ,
  GettingThere,
  FooterCTA,
  HashScroll,
  MiamiSpeakers,
} from "@/components";
import { EventLineup } from "@/components/homepage";
import sponsorsData from "@/data/miami/sponsors.json";
import { composeSponsors, type SponsorAugmentation } from "@/lib/sponsor-data";
import type { Sponsor } from "@/types/sponsors";
import { MiamiHeroSymbols } from "./MiamiHeroSymbols";
import { config } from "@/config";
import { SeoJsonLd } from "@/components/SeoJsonLd";
import { getPageMetadata } from "../../metadata";
import { buildEventStructuredData } from "../../seo";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;

  return getPageMetadata({
    locale,
    path: "/miami",
    title: "Solana Accelerate Miami 2026",
    description:
      "Attend Solana Accelerate Miami on May 5, 2026 at the Miami Beach Convention Center and connect with builders, sponsors, media, and the wider Solana ecosystem.",
    keywords: [
      "Solana Accelerate Miami",
      "Miami blockchain conference",
      "Solana Miami 2026",
      "Solana USA event",
    ],
  });
}

export default async function MiamiPage({ params }: PageProps) {
  await params;
  const sponsors = composeSponsors(
    sponsorsData.sponsors as SponsorAugmentation[],
  );

  return (
    <>
      <SeoJsonLd
        data={buildEventStructuredData(config.events.miami, "/miami")}
      />
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
      <AgendaBanner
        translationPrefix="accelerate.miami.agendaBanner"
        agendaPath="/accelerate/miami/agenda"
      />
      <MiamiSpeakers />
      <EventLineup futureOnly />
      <Sponsors sponsors={sponsors as Sponsor[]} />
      <FAQ
        faqKeys={["q1", "q2", "q3", "q4"]}
        translationPrefix="accelerate.miami.faq"
      />
      <GettingThere
        translationPrefix="accelerate.miami.gettingThere"
        hotelDealsLink={{
          text: "View hotel deals on Nomadz (sign up required).",
          href: "https://nomadz.xyz/stays?locationInputValue=Miami%20Beach%2C%20United%20States&destination.latitude=25.7947559&destination.longitude=-80.13378639999999&destination.radius=5000&guests.rooms%5B0%5D.adults=1&guests.rooms[0].children[]&checkIn=2026-05-03T23%3A00%3A00.000Z&checkOut=2026-05-06T21%3A00%3A00.000Z&filters.stars%5B0%5D=2&filters.stars%5B1%5D=3&filters.stars%5B2%5D=4&filters.stars%5B3%5D=5&filters.hideSoldOut=true&filters.distanceToPointMax=5000&sort.property=Discount&sort.direction=desc&event=10128847-d607-439e-8619-a70118d80090",
        }}
      />
      <FooterCTA
        translationPrefix="accelerate.miami.footerCta"
        backgroundImage="/images/palm-trees.svg"
        lumaId="accelerate-miami"
      />
    </>
  );
}
