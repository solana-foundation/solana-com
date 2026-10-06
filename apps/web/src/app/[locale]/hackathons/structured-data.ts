import { getAlternates } from "@workspace/i18n/routing";
import { config } from "@/config";

type ArchiveItem = {
  name: string;
  description: string;
};

export function buildHackathonArchiveJsonLd({
  locale,
  title,
  description,
  events,
}: {
  locale: string;
  title: string;
  description: string;
  events: ArchiveItem[];
}) {
  const canonicalPath = getAlternates("/hackathons", locale).canonical;
  const pageUrl = new URL(canonicalPath, config.publicUrl).toString();

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${pageUrl}#webpage`,
    url: pageUrl,
    name: title,
    description,
    inLanguage: locale,
    isPartOf: {
      "@type": "WebSite",
      "@id": `${config.publicUrl}/#website`,
      name: config.siteMetadata.title,
      url: config.publicUrl,
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: events.length,
      itemListOrder: "https://schema.org/ItemListOrderDescending",
      itemListElement: events.map((event, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: event.name,
        description: event.description,
      })),
    },
  };
}

export function serializeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
