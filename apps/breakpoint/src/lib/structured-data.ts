import { getTranslations } from "@workspace/i18n/server";
import { config } from "@/config";

const FAQ_KEYS = ["q1", "q2", "q3", "q4"] as const;

type JsonLd = Record<string, unknown>;

type OfferSeed = {
  name: string;
  price: number;
  url: string;
};

function asPlainTextMessage(value: unknown) {
  return typeof value === "string" ? value.replace(/<[^>]+>/g, "") : "";
}

const TICKET_OFFERS: OfferSeed[] = [
  {
    name: "General Admission",
    price: 500,
    url: "https://luma.com/breakpoint2026",
  },
];

export async function buildBreakpointJsonLd(locale: string): Promise<JsonLd> {
  const t = await getTranslations({ locale, namespace: "breakpoint" });

  const { siteUrl, siteMetadata, event } = config;
  const pageUrl = locale === "en" ? siteUrl : `${siteUrl}/${locale}`;
  const socialImage = new URL(siteMetadata.socialShare, siteUrl).toString();

  const eventNode: JsonLd = {
    "@type": "Event",
    "@id": `${siteUrl}#event`,
    name: event.name,
    description: event.description,
    startDate: event.startDate,
    endDate: event.endDate,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    image: [socialImage],
    url: pageUrl,
    location: {
      "@type": "Place",
      name: event.venue,
      address: {
        "@type": "PostalAddress",
        streetAddress: "Hammersmith Road",
        addressLocality: event.city,
        postalCode: "W14 8UX",
        addressCountry: "GB",
      },
    },
    organizer: {
      "@id": `${siteUrl}#organization`,
    },
    offers: TICKET_OFFERS.map((offer) => ({
      "@type": "Offer",
      name: offer.name,
      price: offer.price,
      priceCurrency: "USD",
      url: offer.url,
      availability: "https://schema.org/InStock",
      validFrom: "2026-01-01",
    })),
  };

  const organizationNode: JsonLd = {
    "@type": "Organization",
    "@id": `${siteUrl}#organization`,
    name: siteMetadata.author,
    url: "https://solana.com",
    logo: "https://solana.com/src/img/branding/solanaLogo.svg",
    sameAs: [
      "https://x.com/solana",
      "https://www.youtube.com/@SolanaFndn",
      "https://github.com/solana-foundation",
      "https://www.reddit.com/r/solana/",
      "https://t.me/solana",
    ],
  };

  const faqNode: JsonLd = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: FAQ_KEYS.map((key) => ({
      "@type": "Question",
      name: asPlainTextMessage(t.raw(`faq.items.${key}.question`)),
      acceptedAnswer: {
        "@type": "Answer",
        text: asPlainTextMessage(t.raw(`faq.items.${key}.answer`)),
      },
    })),
  };

  return {
    "@context": "https://schema.org",
    "@graph": [eventNode, organizationNode, faqNode],
  };
}
