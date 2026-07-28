import type { Metadata } from "next";
import { ChangelogPage } from "@/components/changelog/changelog-page";
import { JsonLd } from "@/components/seo/json-ld";
import { CHANGELOG_CATEGORY, CHANGELOG_PAGE_SIZE } from "@/lib/changelog";
import {
  CHANGELOG_SEO_DESCRIPTION,
  CHANGELOG_SEO_TITLE,
  changelogListingMetadata,
} from "@/lib/metadata";
import { fetchLatestPosts } from "@/lib/post-data";
import { buildChangelogJsonLd } from "./structured-data";

export const revalidate = 300;

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return changelogListingMetadata(locale);
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  const { posts, pageInfo } = await fetchLatestPosts({
    category: CHANGELOG_CATEGORY,
    limit: CHANGELOG_PAGE_SIZE,
  });
  const structuredData = buildChangelogJsonLd({
    posts,
    locale,
    title: CHANGELOG_SEO_TITLE,
    description: CHANGELOG_SEO_DESCRIPTION,
  });

  return (
    <>
      <JsonLd id="changelog-structured-data" data={structuredData} />
      <ChangelogPage initialPageInfo={pageInfo} initialPosts={posts} />
    </>
  );
}
