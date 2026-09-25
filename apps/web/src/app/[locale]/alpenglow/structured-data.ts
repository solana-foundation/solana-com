import { config } from "@/config";

export const ALPENGLOW_PATH = "/alpenglow";
export const ALPENGLOW_SOCIAL_IMAGE = "/social/alpenglow.webp";

export function buildAlpenglowJsonLd({
  description,
  locale,
  path,
  title,
}: {
  description: string;
  locale: string;
  path: string;
  title: string;
}) {
  const pageUrl = new URL(path, config.publicUrl).toString();
  const imageUrl = new URL(ALPENGLOW_SOCIAL_IMAGE, config.publicUrl).toString();

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
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
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: imageUrl,
          width: 1200,
          height: 630,
        },
        about: {
          "@type": "Thing",
          name: "Alpenglow consensus",
          description:
            "Solana's consensus upgrade targeting roughly 150 millisecond finality.",
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
            name: "Alpenglow",
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
