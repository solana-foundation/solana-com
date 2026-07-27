import type { Metadata } from "next";
import { ChangelogPage } from "@/components/changelog/changelog-page";
import { CHANGELOG_CATEGORY, CHANGELOG_PAGE_SIZE } from "@/lib/changelog";
import { changelogListingMetadata } from "@/lib/metadata";
import { fetchLatestPosts } from "@/lib/post-data";

export const revalidate = 300;

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return changelogListingMetadata(locale);
}

export default async function Page() {
  const { posts, pageInfo } = await fetchLatestPosts({
    category: CHANGELOG_CATEGORY,
    limit: CHANGELOG_PAGE_SIZE,
  });

  return <ChangelogPage initialPageInfo={pageInfo} initialPosts={posts} />;
}
