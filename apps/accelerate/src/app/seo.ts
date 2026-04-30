import { config } from "@/config";

type EventConfig = {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  location: {
    name: string;
    address: string;
  };
};

function getAbsoluteUrl(path: string = "/") {
  if (!path || path === "/") {
    return config.siteUrl;
  }

  return `${config.siteUrl}${path}`;
}

export function buildEventStructuredData(event: EventConfig, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.name,
    description: event.description,
    startDate: event.startDate,
    endDate: event.endDate,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    image: [config.siteMetadata.socialShare],
    url: getAbsoluteUrl(path),
    organizer: {
      "@type": "Organization",
      name: "Solana Foundation",
      url: "https://solana.com",
    },
    location: {
      "@type": "Place",
      name: event.location.name,
      address: {
        "@type": "PostalAddress",
        streetAddress: event.location.address,
        addressLocality: event.location.name,
      },
    },
  };
}

export function buildEventSeriesStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "EventSeries",
    name: config.siteMetadata.title,
    description: config.siteMetadata.description,
    url: config.siteUrl,
    image: [config.siteMetadata.socialShare],
    organizer: {
      "@type": "Organization",
      name: "Solana Foundation",
      url: "https://solana.com",
    },
    subEvent: [
      buildEventStructuredData(config.events.hongKong, "/hong-kong"),
      buildEventStructuredData(config.events.miami, "/miami"),
    ],
  };
}
