import type { Metadata } from "next";
import { defaultLocale } from "@workspace/i18n/config";
import { DocsPageView, docsMetadata } from "@/components/docs/docs-page";
import { englishPages } from "@/lib/docs/page-data";

/**
 * /developers/docs pages (Fumadocs; content in apps/docs). English is
 * prerendered; translations render on first request and are then cached.
 */
const PREFIX = ["developers", "docs"];

type Props = { params: Promise<{ locale: string; slug?: string[] }> };

// Static: English at build time, translations on first request, then
// cached (the site's locale routing otherwise renders every request).
export const dynamic = "force-static";
export const dynamicParams = true;
export const revalidate = false;

export default async function Page({ params }: Props) {
  const { locale, slug = [] } = await params;
  return <DocsPageView locale={locale} slugs={[...PREFIX, ...slug]} />;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug = [] } = await params;
  return docsMetadata(locale, [...PREFIX, ...slug]);
}

export async function generateStaticParams({
  params,
}: {
  params: Promise<{ locale: string }> | { locale: string };
}) {
  const { locale } = await params;
  if (locale !== defaultLocale) return [];
  return englishPages(PREFIX).map((slug) => ({ slug }));
}
