import Head from "next/head";
import { NextSeo } from "next-seo";
import { config } from "@/config";
import { usePathname, useLocale } from "@/i18n/routing";
import MetaLinks from "./MetaLinks";
import { prependSiteUrl } from "@/utils/general";

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

  if (addDefaultMeta) {
    meta.unshift(
      {
        name: `description`,
        content: metaDescription,
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
        property: `og:type`,
        content: `website`,
      },
      {
        name: `twitter:card`,
        content: `summary_large_image`,
      },
      {
        name: `twitter:creator`,
        content: config.siteMetadata.author,
      },
    );
  }

  // always add these metatags to the start of the array
  meta.unshift(
    {
      name: "docsearch:language",
      content: locale,
    },
    {
      name: "language",
      content: locale,
    },
  );

  return (
    <>
      <NextSeo
        {...(addDefaultMeta && { title })}
        titleTemplate={`%s | ${config.siteMetadata.title}`}
        additionalMetaTags={meta}
      />

      {/* @ts-ignore */}
      <Head title={{ ...(addDefaultMeta && { title }) }}>
        {addDefaultMeta && (
          <MetaLinks
            localeNoEnDefault={localeNoEnDefault}
            asPathNoRedirect={asPathNoRedirect}
          />
        )}
      </Head>
    </>
  );
}
