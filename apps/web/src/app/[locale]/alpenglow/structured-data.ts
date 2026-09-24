import { config } from "@/config";

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

  return {
    "@context": "https://schema.org",
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
  };
}

export function serializeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
