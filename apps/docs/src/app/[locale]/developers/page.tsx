import type { Metadata } from "next";
import { getAlternates } from "@workspace/i18n/routing";
import { getTranslations } from "@workspace/i18n/server";
import { DeveloperHub } from "@/components/developers/DeveloperHub/DeveloperHub";
import { getLatestDeveloperUpdates } from "@/lib/developer-media";
import {
  buildDeveloperHubJsonLd,
  DEVELOPERS_PATH,
  DEVELOPERS_SOCIAL_IMAGE,
  serializeJsonLd,
} from "./structured-data";

type Props = { params: Promise<{ locale: string }> };

export const dynamic = "force-dynamic";

export default async function Page({ params }: Props) {
  const { locale } = await params;
  const [updates, t] = await Promise.all([
    getLatestDeveloperUpdates(),
    getTranslations({ locale, namespace: "developers.hub" }),
  ]);
  const title = t("metadata.title");
  const description = t("metadata.description");
  const alternates = getAlternates(DEVELOPERS_PATH, locale);
  const structuredData = buildDeveloperHubJsonLd({
    title,
    description,
    locale,
    path: alternates.canonical,
    aboutName: t("schema.about"),
    resourcesName: t("schema.resources"),
    homeName: t("schema.home"),
    resources: [
      {
        name: t("pathways.items.learnStack.title"),
        description: t("pathways.items.learnStack.description"),
        path: "/docs",
      },
      {
        name: t("pathways.items.buildByExample.title"),
        description: t("pathways.items.buildByExample.description"),
        path: "/developers/templates",
      },
      {
        name: t("pathways.items.moveToSolana.title"),
        description: t("pathways.items.moveToSolana.description"),
        path: "/developers/migrate-to-solana",
      },
      {
        name: t("buildAreas.items.payments.title"),
        description: t("buildAreas.items.payments.description"),
        path: "/docs/payments",
      },
      {
        name: t("buildAreas.items.tools.title"),
        description: t("buildAreas.items.tools.description"),
        path: "/docs/tools",
      },
    ],
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }}
      />
      <DeveloperHub updates={updates} />
    </>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "developers.hub" });
  const title = t("metadata.title");
  const description = t("metadata.description");
  const alternates = getAlternates(DEVELOPERS_PATH, locale);

  return {
    title,
    description,
    alternates,
    openGraph: {
      type: "website",
      url: alternates.canonical,
      siteName: "Solana",
      locale,
      title,
      description,
      images: [
        {
          url: DEVELOPERS_SOCIAL_IMAGE,
          width: 1200,
          height: 630,
          alt: description,
        },
      ],
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
