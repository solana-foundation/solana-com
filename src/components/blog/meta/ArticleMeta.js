import Head from "next/head";
import _ from "lodash";
import url from "url";
import { extractTags } from "@/lib/builder/api";
import MetaLinks from "../../MetaLinks";
import ImageMeta from "./ImageMeta";
import { config } from "src/config";
import { useRouter } from "next/router";

const ArticleMetaBuilder = ({
  data: builderPost,
  settings,
  canonical,
  locale,
}) => {
  const author = builderPost?.data?.author?.value || null;

  const _tags = extractTags([builderPost], 3);
  const publicTags = _tags.map((tag) => tag?.name || null);

  const getShareImage = () => {
    if (builderPost?.data?.seo?.seoImage)
      return builderPost?.data?.seo?.seoImage;
    if (builderPost?.data?.openGraph?.ogImage)
      return builderPost.data.openGraph.ogImage;
    if (builderPost?.data?.image) return builderPost.data.image;
    return _.get(settings, "cover_image", null);
  };
  const shareImage = getShareImage();

  const publisherLogo =
    settings.logo || config.siteIcon
      ? url.resolve(config.siteUrl, settings.logo || config.siteIcon)
      : null;

  const datePublished = new Date(
    builderPost?.firstPublished,
  ).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const dateModified = new Date(builderPost?.lastUpdated).toLocaleDateString(
    "en-GB",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  );

  const jsonLd = {
    "@context": `https://schema.org/`,
    "@type": `Article`,
    author: {
      "@type": `Person`,
      name: author?.name || "Solana Foundation",
      image: author?.data?.image ? author.data.image : undefined,
    },
    keywords: publicTags.length ? publicTags.join(`, `) : undefined,
    headline: builderPost?.data?.seo?.seoTitle || builderPost?.data?.title,
    url: canonical,
    datePublished: datePublished,
    dateModified: dateModified,
    image: shareImage
      ? {
          "@type": `ImageObject`,
          url: shareImage,
          width: config.shareImageWidth,
          height: config.shareImageHeight,
        }
      : undefined,
    publisher: {
      "@type": `Organization`,
      name: `Solana Foundation`,
      logo: {
        "@type": `ImageObject`,
        url: publisherLogo,
        width: 60,
        height: 60,
      },
    },
    description:
      builderPost?.data?.seo?.seoDescription || builderPost?.data?.intro,
    mainEntityOfPage: {
      "@type": `WebPage`,
      "@id": config.siteUrl,
    },
  };

  // Check if the title contains "| Solana" and remove it if it does.
  // Regardless, add "| Solana" to the end of the title.
  // We can remove the replace() method once we've updated all the titles.
  const titleRegex = /(\s\|\sSolana|Solana\s\|\s)/g;
  const title = builderPost?.data?.seo?.seoTitle
    ? `${builderPost?.data?.seo?.seoTitle.replace(titleRegex, "")} | Solana`
    : `${builderPost?.data?.title} | Solana`;

  const { asPath } = useRouter();
  const asPathNoRedirect = asPath === "/" ? "" : asPath;
  const localeNoEnDefault = locale === "en" ? "" : "/" + locale;

  return (
    <>
      <Head>
        <MetaLinks
          localeNoEnDefault={localeNoEnDefault}
          asPathNoRedirect={asPathNoRedirect}
        />
        <title>{title}</title>
        <meta
          name="description"
          content={
            builderPost?.data?.seo?.seoDescription || builderPost?.data?.intro
          }
        />
        <meta property="language" content={locale} />
        <meta property="docsearch:language" content={locale} />

        <meta property="og:site_name" content={`Solana`} />
        <meta property="og:type" content="article" />
        <meta
          property="og:title"
          content={
            builderPost?.data?.seo?.seoTitle ||
            builderPost?.data?.openGraph?.ogTitle ||
            builderPost?.data?.title
          }
        />
        <meta
          property="og:description"
          content={
            builderPost?.data?.seo?.seoDescription ||
            builderPost?.data?.openGraph?.ogDescription ||
            builderPost?.data?.intro
          }
        />
        <meta property="og:url" content={canonical} />
        {datePublished && (
          <meta property="article:published_time" content={datePublished} />
        )}
        {dateModified && (
          <meta property="article:modified_time" content={dateModified} />
        )}
        {publicTags.map((keyword, i) => (
          <meta property="article:tag" content={keyword} key={i} />
        ))}
        {author?.data?.facebook && (
          <meta property="article:author" content={author?.data?.facebook} />
        )}

        <meta
          name="twitter:title"
          content={
            builderPost?.data?.seo?.seoTitle ||
            builderPost?.data?.twitterMeta?.twitterTitle ||
            builderPost?.data?.title
          }
        />
        <meta
          name="twitter:description"
          content={
            builderPost?.data?.seo?.seoDescription ||
            builderPost?.data?.twitterMeta?.twitterDescription ||
            builderPost?.data?.intro
          }
        />
        <meta name="twitter:url" content={canonical} />
        <meta
          name="twitter:data1"
          content={author?.name || "Solana Foundation"}
        />

        {settings.twitter && (
          <meta
            name="twitter:site"
            content={`https://twitter.com/${settings.twitter.replace(
              /^@/,
              ``,
            )}/`}
          />
        )}
        {settings.twitter && (
          <meta name="twitter:creator" content={settings.twitter} />
        )}
        <script type="application/ld+json">
          {JSON.stringify(jsonLd, undefined, 4)}
        </script>
      </Head>
      <ImageMeta image={shareImage} />
    </>
  );
};

const ArticleMetaQuery = ({ settings, ...rest }) => (
  <ArticleMetaBuilder settings={settings} {...rest} />
);

export default ArticleMetaQuery;
