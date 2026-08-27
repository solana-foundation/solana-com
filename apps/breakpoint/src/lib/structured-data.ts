import { getTranslations } from "@workspace/i18n/server";
import { config, publicLocalizedRouteUrl } from "@/config";
import { GENERAL_ADMISSION_HREF } from "@/content/links";
import { GENERAL_ADMISSION_PRICE_CHANGE } from "@/content/ticket-pricing";

type JsonLd = Record<string, unknown>;

export function serializeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

type OfferSeed = {
  price: number;
  priceValidUntil?: string;
  url: string;
  validFrom: string;
};

function asPlainTextMessage(value: unknown) {
  return typeof value === "string" ? value.replace(/<[^>]+>/g, "") : "";
}

const TICKET_OFFERS: OfferSeed[] = [
  {
    price: GENERAL_ADMISSION_PRICE_CHANGE.current.amount,
    priceValidUntil: "2026-08-01T08:59:59Z",
    url: GENERAL_ADMISSION_HREF,
    validFrom: "2026-01-01",
  },
  {
    price: GENERAL_ADMISSION_PRICE_CHANGE.increased.amount,
    url: GENERAL_ADMISSION_HREF,
    validFrom: GENERAL_ADMISSION_PRICE_CHANGE.increasesAt,
  },
];

export async function buildBreakpointJsonLd(locale: string): Promise<JsonLd> {
  const t = await getTranslations({ locale, namespace: "breakpoint" });
  const { publicUrl, siteMetadata, event } = config;
  const pageUrl = publicLocalizedRouteUrl(locale);
  const socialImage = new URL(siteMetadata.socialShare, publicUrl).toString();
  const eventName = t("metadata.siteName");
  const ticketName = t("tickets.categories.general.label");
  const localizedFaqItems = [
    {
      question: t("faq.items.q1.question"),
      answer: t("faq.items.q1.answer"),
    },
    {
      question: t("faq.items.q2.question"),
      answer: t("faq.items.q2.answer"),
    },
    {
      question: t("faq.items.q3.question"),
      answer: t("faq.items.q3.answer"),
    },
    {
      question: t("faq.items.q4.question"),
      answer: "",
      answerLinkLabel: t("faq.items.q4.answerLinkLabel"),
    },
    {
      question: t("faq.items.q5.question"),
      answer: t("faq.items.q5.answerPrefix"),
      answerLinkLabel: t("faq.items.q5.answerLinkLabel"),
    },
  ];

  const eventNode: JsonLd = {
    "@type": "Event",
    "@id": `${publicUrl}#event`,
    name: eventName,
    description: t("metadata.description"),
    startDate: event.startDate,
    endDate: event.endDate,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    image: [socialImage],
    url: pageUrl,
    location: {
      "@type": "Place",
      name: t("hero.venue"),
      address: {
        "@type": "PostalAddress",
        streetAddress: "Hammersmith Road",
        addressLocality: t("hero.location"),
        postalCode: "W14 8UX",
        addressCountry: "GB",
      },
    },
    organizer: {
      "@id": `${publicUrl}#organization`,
    },
    offers: TICKET_OFFERS.map((offer) => ({
      "@type": "Offer",
      name: ticketName,
      price: offer.price,
      priceCurrency: "USD",
      url: offer.url,
      availability: "https://schema.org/InStock",
      validFrom: offer.validFrom,
      ...(offer.priceValidUntil
        ? { priceValidUntil: offer.priceValidUntil }
        : {}),
    })),
  };

  const organizationNode: JsonLd = {
    "@type": "Organization",
    "@id": `${publicUrl}#organization`,
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
    mainEntity: localizedFaqItems.map((item) => ({
      "@type": "Question",
      name: asPlainTextMessage(item.question),
      acceptedAnswer: {
        "@type": "Answer",
        text: asPlainTextMessage(
          [item.answer, item.answerLinkLabel && `${item.answerLinkLabel}.`]
            .filter((part) => part?.trim().length)
            .join(" "),
        ),
      },
    })),
  };

  return {
    "@context": "https://schema.org",
    "@graph": [eventNode, organizationNode, faqNode],
  };
}
