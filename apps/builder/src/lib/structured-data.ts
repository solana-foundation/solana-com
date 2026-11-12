import { getTranslations } from "@workspace/i18n/server";
import { config } from "@@/src/config";
import { links } from "@@/src/content/links";
import { FAQ_ITEMS } from "@@/src/components/Faq";

type JsonLd = Record<string, unknown>;

/**
 * JSON-LD is inlined in a <script>, where "</script>" or "<!--" inside a string
 * would break out of the element. Escaping "<" keeps the JSON valid for parsers
 * and inert for the HTML tokenizer.
 */
export function serializeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

/**
 * Event, organizer and FAQ as one graph. The FAQ node reads the same strings
 * the page renders, so the markup cannot drift from the visible answers.
 */
export async function buildBuilderJsonLd(locale: string): Promise<JsonLd> {
  const t = await getTranslations({ locale, namespace: "builder" });
  const { publicUrl, event } = config;

  const eventNode: JsonLd = {
    "@type": "Event",
    "@id": `${publicUrl}#event`,
    name: event.name,
    alternateName: event.alternateName,
    description: t("metadata.description"),
    startDate: event.startDate,
    endDate: event.endDate,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    url: publicUrl,
    image: [config.socialShare],
    location: {
      "@type": "Place",
      name: event.city,
      address: {
        "@type": "PostalAddress",
        addressLocality: event.city,
        addressRegion: event.region,
        addressCountry: event.country,
      },
    },
    organizer: { "@id": `${publicUrl}#organization` },
    ...(links.register
      ? { offers: { "@type": "Offer", url: links.register } }
      : {}),
  };

  const organizationNode: JsonLd = {
    "@type": "Organization",
    "@id": `${publicUrl}#organization`,
    name: "Solana Foundation",
    url: "https://solana.com",
    logo: "https://solana.com/src/img/branding/solanaLogo.svg",
    sameAs: [
      "https://x.com/solana",
      "https://www.youtube.com/@SolanaFndn",
      "https://github.com/solana-foundation",
    ],
  };

  const faqNode: JsonLd = {
    "@type": "FAQPage",
    "@id": `${publicUrl}#faq`,
    mainEntity: FAQ_ITEMS.map((key) => ({
      "@type": "Question",
      name: t(`faq.items.${key}.question`),
      acceptedAnswer: {
        "@type": "Answer",
        // Plain text: the <link> tag some answers carry is dropped.
        text: t.markup(`faq.items.${key}.answer`, {
          link: (chunks) => chunks,
        }),
      },
    })),
  };

  return {
    "@context": "https://schema.org",
    "@graph": [eventNode, organizationNode, faqNode],
  };
}
