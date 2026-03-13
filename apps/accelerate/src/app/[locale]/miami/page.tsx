import type { Metadata } from "next";
import {
  Hero,
  EventDetails,
  Sponsors,
  FAQ,
  GettingThere,
  FooterCTA,
  HashScroll,
  GetInvolved,
  MiamiSpeakers,
} from "@/components";
import sponsorsData from "@/data/miami/sponsors.json";
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
  const { locale } = await params;

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
      <GetInvolved translationPrefix="accelerate.miami.getInvolved" />
      <MiamiSpeakers locale={locale} />
      <Sponsors sponsors={sponsorsData.sponsors as Sponsor[]} />
      <FAQ
        faqKeys={["q1", "q2", "q3", "q4"]}
        translationPrefix="accelerate.miami.faq"
      />
      <GettingThere
        translationPrefix="accelerate.miami.gettingThere"
        hotelDealsLink={{
          text: "View hotel deals on Nomadz (sign up required).",
          href: "https://nomadz.xyz/stays?locationInputValue=Miami,%20FL,%20USA&destination.location=Miami&destination.latitude=25.7949095&destination.longitude=-80.1358448&filters.stars[0]=2&filters.stars[1]=3&filters.stars[2]=4&filters.stars[3]=5&filters.hideSoldOut=true&filters.distanceToPointMax=5000&checkIn=2026-05-04T00:00:00.000Z&checkOut=2026-05-07T00:00:00.000Z&guests.rooms[0].adults=1&guests.rooms[0].children[]&sort.property=Discount&sort.direction=desc",
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
