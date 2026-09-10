import { getAlternates } from "@workspace/i18n/routing";
import { config } from "@@/src/config";

export const DEVELOPERS_PATH = "/developers";
export const DEVELOPERS_SOCIAL_IMAGE = "/opengraph/developers";

type DeveloperResource = {
  name: string;
  description: string;
  path: string;
};

export function buildDeveloperHubJsonLd({
  title,
  description,
  locale,
  path,
  aboutName,
  resourcesName,
  homeName,
  resources,
}: {
  title: string;
  description: string;
  locale: string;
  path: string;
  aboutName: string;
  resourcesName: string;
  homeName: string;
  resources: DeveloperResource[];
}) {
  const pageUrl = new URL(path, config.publicUrl).toString();
  const pageId = `${pageUrl}#webpage`;
  const resourcesId = `${pageUrl}#resources`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
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
        about: {
          "@type": "Thing",
          name: aboutName,
        },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: new URL(DEVELOPERS_SOCIAL_IMAGE, config.publicUrl).toString(),
          width: 1200,
          height: 630,
        },
        mainEntity: {
          "@id": resourcesId,
        },
      },
      {
        "@type": "ItemList",
        "@id": resourcesId,
        name: resourcesName,
        itemListOrder: "https://schema.org/ItemListUnordered",
        numberOfItems: resources.length,
        itemListElement: resources.map((resource, index) => {
          const resourceUrl = new URL(
            getAlternates(resource.path, locale).canonical,
            config.publicUrl,
          ).toString();

          return {
            "@type": "ListItem",
            position: index + 1,
            item: {
              "@type": "WebPage",
              name: resource.name,
              description: resource.description,
              url: resourceUrl,
            },
          };
        }),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: homeName,
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
    ],
  };
}

export function serializeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
