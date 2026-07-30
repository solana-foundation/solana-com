import { config } from "@/config";

export const DATA_PATH = "/data";
export const DATA_SOCIAL_IMAGE = "/social/solana-data.webp";

const DATA_SOURCE_URLS = [
  "https://github.com/solana-foundation/solana-data-aggregator",
  "https://github.com/solana-foundation/rpc-latency-monitor",
] as const;

type DataTopic = {
  description: string;
  name: string;
};

export function buildDataDashboardJsonLd({
  description,
  locale,
  path,
  title,
  topics,
}: {
  description: string;
  locale: string;
  path: string;
  title: string;
  topics: DataTopic[];
}) {
  const pageUrl = new URL(path, config.publicUrl).toString();
  const pageId = `${pageUrl}#webpage`;
  const datasetId = `${pageUrl}#dataset`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": pageId,
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
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: new URL(DATA_SOCIAL_IMAGE, config.publicUrl).toString(),
          width: 1200,
          height: 630,
        },
        mainEntity: {
          "@id": datasetId,
        },
      },
      {
        "@type": "Dataset",
        "@id": datasetId,
        url: pageUrl,
        name: title,
        description,
        inLanguage: locale,
        creator: {
          "@type": "Organization",
          name: "Solana Foundation",
          url: config.publicUrl,
        },
        isAccessibleForFree: true,
        isBasedOn: DATA_SOURCE_URLS,
        keywords: topics.map((topic) => topic.name).join(", "),
        variableMeasured: topics.map((topic) => ({
          "@type": "PropertyValue",
          name: topic.name,
          description: topic.description,
        })),
        mainEntityOfPage: {
          "@id": pageId,
        },
      },
    ],
  };
}

export function serializeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
