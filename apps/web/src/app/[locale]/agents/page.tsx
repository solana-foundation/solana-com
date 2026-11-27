import type { Metadata } from "next";
import { getAlternates } from "@workspace/i18n/routing";
import { getTranslations } from "@workspace/i18n/server";
import {
  AGENTS_PATH,
  AGENTS_SOCIAL_IMAGE,
  FAQ_ITEMS,
  LATEST_NEWS_QUERY,
} from "@/data/agents";
import { fetchSolutionNews } from "@/lib/media/solution-news";
import { AgentsPage } from "./agents";
import { buildAgentsFaqJsonLd, serializeJsonLd } from "./structured-data";

type Props = { params: Promise<{ locale: string }> };

export const revalidate = 300;

export default async function Page({ params }: Props) {
  const [{ locale }, news] = await Promise.all([
    params,
    fetchSolutionNews(LATEST_NEWS_QUERY),
  ]);
  const t = await getTranslations({ locale, namespace: "agents.faq.items" });
  const faq = FAQ_ITEMS.map((id) => ({
    question: t(`${id}.question`),
    answer: t(`${id}.answer`),
  }));
  const { canonical } = getAlternates(AGENTS_PATH, locale);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(
            buildAgentsFaqJsonLd({ canonicalPath: canonical, faq }),
          ),
        }}
      />
      <AgentsPage locale={locale} news={news} faq={faq} />
    </>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "agents.meta" });
  const title = t("title");
  const description = t("description");
  const alt = t("socialImageAlt");
  const alternates = getAlternates(AGENTS_PATH, locale);

  return {
    title,
    description,
    alternates,
    openGraph: {
      title,
      description,
      type: "website",
      url: alternates.canonical,
      images: [{ url: AGENTS_SOCIAL_IMAGE, width: 1200, height: 630, alt }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [{ url: AGENTS_SOCIAL_IMAGE, alt }],
    },
  };
}
