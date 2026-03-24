import { Metadata } from "next";
import { config } from "@@/src/config";
import { getAlternates } from "@workspace/i18n/routing";
import { createSeoResolver } from "@workspace/seo";
import { getTranslations } from "next-intl/server";

const seo = createSeoResolver({
  siteName: config.siteMetadata.title,
  siteUrl: config.siteUrl,
  defaultTitle: config.siteMetadata.title,
  titleTemplate: "%s | Solana",
  description: config.siteMetadata.description,
  author: config.siteMetadata.author,
  twitterHandle: config.social.twitter.name,
  defaultImage: config.siteMetadata.socialShare,
  icons: {
    ico: "/favicon.ico",
    png: "/favicon.png",
    svg: "/favicon.svg",
    appleTouchIcon: "/apple-touch-icon.png",
    shortcut: "/favicon.ico",
  },
  manifest: "/site.webmanifest",
});

export function getBaseMetadata(locale: string) {
  return seo.getBaseMetadata({ locale });
}

export async function getIndexMetadata({
  titleKey,
  descriptionKey,
  locale,
  path,
}: {
  titleKey: string;
  descriptionKey: string;
  locale: string;
  path: string;
}): Promise<Metadata> {
  const t = await getTranslations();
  return seo.getPageMetadata({
    locale,
    path,
    title: t(titleKey),
    description: t(descriptionKey),
    alternates: getAlternates(path, locale),
  });
}
