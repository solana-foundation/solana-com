import Head from "next/head";
import { usePathname, useLocale } from "@/i18n/routing";
import { config } from "src/config";
import MetaLinks from "../MetaLinks";

const HTMLHead = ({ seo = {}, openGraph = {}, twitterMeta = {} }) => {
  const locale = useLocale();
  const asPath = usePathname();
  const asPathNoRedirect = asPath === "/" ? "" : asPath;
  const localeNoEnDefault = locale === "en" ? "" : "/" + locale;

  const {
    noFollow,
    noIndex,
    seoDescription,
    seoTitle,
    seoImage,
    metaType,
    metaUrl,
  } = seo;
  const { ogUrl, ogImage, ogType } = openGraph;
  const { twitterImage } = twitterMeta;

  // Check if the title contains "| Solana" or "Solana | " and remove it if it does.
  // Regardless, add "| Solana" to the end of the title.
  // We can remove the replace() method once we've updated all the titles.
  const titleRegex = /(\s\|\sSolana|Solana\s\|\s)/g;
  const title = seoTitle
    ? `${seoTitle.replace(titleRegex, "")} | Solana`
    : config.siteMetadata.title;
  const description = seoDescription
    ? seoDescription
    : config.siteMetadata.description;

  return (
    <>
      <Head>
        <title>{title}</title>
        {description && <meta name="description" content={description} />}
        <meta name="application-name" content={title} />
        <meta property="language" content={locale} />
        <meta property="docsearch:language" content={locale} />
        <meta
          name="robots"
          content={`${noIndex ? "no" : ""}index, ${noFollow ? "no" : ""}follow`}
        />

        {/* Use seo.metaType if it exists, otherwise fallback to openGraph.ogType */}
        {/* Conditional can be removed once all OG content has been updates to SEO */}
        {(metaType || ogType) && (
          <meta property="og:type" content={metaType ? metaType : ogType} />
        )}

        {/* Use seo.metaUrl if it exists, otherwise fallback to openGraph.ogUrl */}
        {/* Conditional can be removed once all OG content has been updates to SEO */}
        {(metaUrl || ogUrl) && (
          <meta property="og:url" content={metaUrl ? metaUrl : ogUrl} />
        )}

        <meta property="og:title" content={seoTitle || title} />
        {description && (
          <meta property="og:description" content={description} />
        )}

        {/* Use seo.seoImage if it exists, otherwise fallback to openGraph.ogImage */}
        {/* Conditional can be removed once all OG content has been updates to SEO */}
        {(seoImage || ogImage) && (
          <meta property="og:image" content={seoImage ? seoImage : ogImage} />
        )}

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content={seoTitle || title} />
        {seoDescription && (
          <meta property="twitter:description" content={seoDescription} />
        )}

        {/* Use seo.seoImage if it exists, otherwise fallback to openGraph.twitterImage */}
        {/* Conditional can be removed once all twitter/OG content has been updates to SEO */}
        {(seoImage || twitterImage) && (
          <meta
            name="twitter:image"
            content={seoImage ? seoImage : twitterImage}
          />
        )}
        <MetaLinks
          localeNoEnDefault={localeNoEnDefault}
          asPathNoRedirect={asPathNoRedirect}
        />
      </Head>
    </>
  );
};

export default HTMLHead;
