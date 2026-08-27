import type { PostItem } from "@/lib/post-types";
import {
  buildCollectionJsonLd,
  createArticleEntity,
  getLatestDate,
  toPlainText,
} from "@/lib/structured-data";

const CHANGELOG_PATH = "/changelog";

export function buildChangelogJsonLd({
  posts,
  locale,
  title,
  description,
}: {
  posts: PostItem[];
  locale: string;
  title: string;
  description: string;
}) {
  const issueSchemas = posts.map((post) =>
    createArticleEntity({
      path: post.url,
      locale,
      title: post.title,
      description: toPlainText(post.description) || undefined,
      image: post.heroImage,
      datePublished: post.publishedAt,
      authorName: post.author?.name,
      section: "Changelog",
      keywords: post.tags,
    }),
  );

  return buildCollectionJsonLd({
    path: CHANGELOG_PATH,
    locale,
    title,
    description,
    listName: "Solana Changelog issues",
    listFragment: "issues",
    entities: issueSchemas,
    dateModified: getLatestDate(posts.map((post) => post.publishedAt)),
    aboutName: "Solana developer releases and protocol updates",
    breadcrumbs: [
      { name: "Solana", path: "/" },
      { name: "Changelog", path: CHANGELOG_PATH },
    ],
  });
}
