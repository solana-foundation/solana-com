import { getAlternates } from "@workspace/i18n/routing";
import { config } from "@@/src/config";
import type { CalendarEvent } from "./fetchCalendarEvents";

export const EVENTS_PATH = "/events";
export const EVENTS_SOCIAL_IMAGE = "/social/solana-events.webp";

const MAX_STRUCTURED_EVENTS = 20;

function toAbsoluteUrl(value?: string | null) {
  if (!value) return undefined;

  try {
    const url = new URL(value, config.publicUrl);
    return url.protocol === "http:" || url.protocol === "https:"
      ? url.toString()
      : undefined;
  } catch {
    return undefined;
  }
}

function getEventUrl(event: CalendarEvent) {
  return toAbsoluteUrl(
    event.platform === "external" ? event.key : event.rsvp || event.lumaUrl,
  );
}

function hasPhysicalLocation(event: CalendarEvent) {
  const venue = event.venue;

  return Boolean(
    venue.address ||
    venue.city ||
    venue.city_state ||
    venue.country ||
    venue.region,
  );
}

function getEventLocationSchema(event: CalendarEvent, eventUrl: string) {
  if (!hasPhysicalLocation(event)) {
    return {
      "@type": "VirtualLocation",
      url: eventUrl,
    };
  }

  const venue = event.venue;

  return {
    "@type": "Place",
    name:
      venue.city_state ||
      venue.city ||
      venue.address ||
      venue.country ||
      "Solana event venue",
    address: {
      "@type": "PostalAddress",
      streetAddress: venue.address || undefined,
      addressLocality: venue.city || undefined,
      addressRegion: venue.region || undefined,
      addressCountry: venue.country || undefined,
    },
  };
}

function getEventSchema(event: CalendarEvent) {
  const eventUrl = getEventUrl(event) || `${config.publicUrl}${EVENTS_PATH}`;
  const imageUrl =
    toAbsoluteUrl(event.img.primary) || toAbsoluteUrl(EVENTS_SOCIAL_IMAGE);

  return {
    "@type": "Event",
    "@id": `${eventUrl}#event`,
    name: event.title,
    description: event.description || event.title,
    url: eventUrl,
    image: imageUrl ? [imageUrl] : undefined,
    startDate: event.schedule.from,
    endDate: event.schedule.to || undefined,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: hasPhysicalLocation(event)
      ? "https://schema.org/OfflineEventAttendanceMode"
      : "https://schema.org/OnlineEventAttendanceMode",
    location: getEventLocationSchema(event, eventUrl),
    organizer: {
      "@type": "Organization",
      name: "Solana",
      url: config.publicUrl,
    },
  };
}

export function buildEventsJsonLd({
  events,
  locale,
  title,
  description,
}: {
  events: CalendarEvent[];
  locale: string;
  title: string;
  description: string;
}) {
  const canonicalPath = getAlternates(EVENTS_PATH, locale).canonical;
  const pageUrl = toAbsoluteUrl(canonicalPath) || `${config.publicUrl}/events`;
  const eventSchemas = events
    .filter((event) => event.schedule.from)
    .slice(0, MAX_STRUCTURED_EVENTS)
    .map(getEventSchema);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: title,
        description,
        inLanguage: locale,
        isPartOf: {
          "@type": "WebSite",
          "@id": `${config.publicUrl}/#website`,
          name: "Solana",
          url: config.publicUrl,
        },
        mainEntity: {
          "@id": `${pageUrl}#events`,
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Solana",
            item: config.publicUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: title,
            item: pageUrl,
          },
        ],
      },
      {
        "@type": "ItemList",
        "@id": `${pageUrl}#events`,
        itemListElement: eventSchemas.map((event, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@id": event["@id"],
          },
        })),
      },
      ...eventSchemas,
    ],
  };
}

export function serializeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
