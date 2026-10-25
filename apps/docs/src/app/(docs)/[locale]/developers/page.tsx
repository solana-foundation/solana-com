import type { Metadata } from "next";
import { getAlternates } from "@workspace/i18n/routing";
import { getTranslations } from "@workspace/i18n/server";
import { getIndexMetadata } from "@/app/metadata";
import { JOB_PATHS, LEARN_ROUTES } from "@/data/developers/hub";
import { getLatestDeveloperUpdates } from "@/lib/developer-media";
import { DevelopersHub } from "./developers-hub";
import {
  buildDeveloperHubJsonLd,
  DEVELOPERS_PATH,
  DEVELOPERS_SOCIAL_IMAGE,
  serializeJsonLd,
} from "./structured-data";
import { DocsFooter } from "./docs-footer";
import { DocsHeader } from "./docs-header";
import { DeveloperSpeculationRules } from "./speculation-rules";
import { DocsThemePrepaint } from "./theme-prepaint";
import "./docs-chrome.css";

type Props = { params: Promise<{ locale: string }> };

// Static, refreshed every five minutes (the updates feed): nothing here
// reads the request, and the site's locale routing would otherwise render it
// on every request.
export const dynamic = "force-static";
export const revalidate = 300;

export default async function Page({ params }: Props) {
  const { locale } = await params;
  const [updates, t] = await Promise.all([
    getLatestDeveloperUpdates(),
    getTranslations({ locale, namespace: "developers.landing" }),
  ]);
  const alternates = getAlternates(DEVELOPERS_PATH, locale);
  const structuredData = buildDeveloperHubJsonLd({
    title: t("meta.title"),
    description: t("meta.description"),
    locale,
    path: alternates.canonical,
    aboutName: t("schema.about"),
    resourcesName: t("schema.resources"),
    homeName: t("schema.home"),
    resources: [
      ...JOB_PATHS.map((job) => ({
        name: t(`picker.cards.${job.id}.title`),
        description: t(`picker.cards.${job.id}.body`),
        path: job.href,
      })),
      // Coming-soon routes (no href yet) are not listed.
      ...LEARN_ROUTES.flatMap((route) =>
        route.href
          ? [
              {
                name: t(`routes.items.${route.id}.title`),
                description: t(`routes.items.${route.id}.body`),
                path: route.href,
              },
            ]
          : [],
      ),
    ],
  });

  // The docs chrome replaces the solana.com Header/Footer here
  // (ChromeWrapper skips them on this route).
  return (
    <>
      <DocsThemePrepaint />
      <DeveloperSpeculationRules locale={locale} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }}
      />
      <div data-dev-landing="docs">
        <DocsHeader locale={locale} />
        <DevelopersHub locale={locale} updates={updates} />
        <DocsFooter locale={locale} />
      </div>
    </>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const canonical = getAlternates(DEVELOPERS_PATH, locale).canonical;
  const base = await getIndexMetadata({
    titleKey: "developers.landing.meta.title",
    descriptionKey: "developers.landing.meta.description",
    path: DEVELOPERS_PATH,
    locale,
  });
  const title = base.title as string;
  const description = base.description as string;
  const image = {
    url: DEVELOPERS_SOCIAL_IMAGE,
    width: 1200,
    height: 630,
    alt: description,
  };

  return {
    ...base,
    // The landing title already names Solana, so skip the "%s | Solana" template.
    title: { absolute: title },
    openGraph: {
      type: "website",
      url: canonical,
      siteName: "Solana",
      locale,
      title,
      description,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      creator: "@solana",
      title,
      description,
      images: [DEVELOPERS_SOCIAL_IMAGE],
    },
  };
}
