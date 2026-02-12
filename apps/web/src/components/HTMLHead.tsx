import Head from "next/head";
import { NextSeo } from "next-seo";
import { config } from "@@/src/config";
import { usePathname } from "@workspace/i18n/routing";
import { useLocale } from "next-intl";
import MetaLinks from "./MetaLinks";
import { prependSiteUrl } from "@@/src/utils/general";

type HTMLHeadProps = {
  title: string;
  description?: string;
  meta?: Array<any>;
  addDefaultMeta?: boolean;
  socialShare?: string;
  twitterShare?: string;
};

/**
 * Adds metadata, classNames, scripts and others to head & body via Helmet.
 *
 * @param {string}    description               The meta description.
 * @param {Object}    meta                      Custom meta-tag object (default: []).
 * @param {string}    title                     The site title.
 * @param {boolean}   addDefaultMeta            If the default meta-tags should be added if "meta" present (default: true).
 * @param {string}    socialShare               URl to social share image (default: https://solana.com/social/solana.jpg).
 * @returns {JSX.Element}
 * @constructor
 */
export default function HTMLHead({
  description = "",
  meta = [],
  title,
  addDefaultMeta = true,
  socialShare,
}: HTMLHeadProps) {
  const locale = useLocale();
  const asPath = usePathname();
  const asPathNoRedirect = asPath === "/" ? "" : asPath;
  const localeNoEnDefault = locale === "en" ? "" : "/" + locale;
  const metaDescription = description || config.siteMetadata.description;
  const metaSocialShare = prependSiteUrl(
    socialShare || config.siteMetadata.socialShare,
  );

  // Build canonical URL
  const canonicalUrl = `${config.siteUrl}${localeNoEnDefault}${asPathNoRedirect}`;
  // Check if title already ends with site name suffix to avoid duplication
  const siteSuffix = ` | ${config.siteMetadata.title}`;
  const titleAlreadyHasSuffix = title?.endsWith(siteSuffix);
  const fullTitle = title
    ? titleAlreadyHasSuffix
      ? title
      : `${title}${siteSuffix}`
    : config.siteMetadata.title;

  if (addDefaultMeta) {
    meta.unshift(
      {
        name: `description`,
        content: metaDescription,
      },
      {
        property: `og:title`,
        content: fullTitle,
      },
      {
        property: `og:description`,
        content: metaDescription,
      },
      {
        property: `og:image`,
        content: metaSocialShare,
      },
      {
        property: `og:image:width`,
        content: String(config.shareImageWidth),
      },
      {
        property: `og:image:height`,
        content: String(config.shareImageHeight),
      },
      {
        property: `og:type`,
        content: `website`,
      },
      {
        property: `og:url`,
        content: canonicalUrl,
      },
      {
        property: `og:site_name`,
        content: config.siteMetadata.title,
      },
      {
        name: `twitter:card`,
        content: `summary_large_image`,
      },
      {
        name: `twitter:title`,
        content: fullTitle,
      },
      {
        name: `twitter:description`,
        content: metaDescription,
      },
      {
        name: `twitter:image`,
        content: metaSocialShare,
      },
      {
        name: `twitter:creator`,
        content: config.siteMetadata.author,
      },
    );
  }

  // always add these metatags to the start of the array
  meta.unshift({
    name: "language",
    content: locale,
  });

  // Structured data for Organization/WebSite schema
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: config.siteMetadata.title,
    url: config.siteUrl,
    description: metaDescription,
    publisher: {
      "@type": "Organization",
      name: config.siteMetadata.title,
      logo: {
        "@type": "ImageObject",
        url: config.siteIcon.startsWith("http")
          ? config.siteIcon
          : prependSiteUrl(config.siteIcon),
        width: 512,
        height: 512,
      },
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${config.siteUrl}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <NextSeo
        title={addDefaultMeta ? title : undefined}
        titleTemplate={
          titleAlreadyHasSuffix ? "%s" : `%s | ${config.siteMetadata.title}`
        }
        additionalMetaTags={meta}
      />

      {/* @ts-ignore */}
      <Head title={{ ...(addDefaultMeta && { title }) }}>
        {addDefaultMeta && (
          <>
            <MetaLinks
              localeNoEnDefault={localeNoEnDefault}
              asPathNoRedirect={asPathNoRedirect}
            />
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify(structuredData, null, 2),
              }}
            />
          </>
        )}
      </Head>
    </>
  );
}
