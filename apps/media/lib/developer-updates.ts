import { contentDocumentToPlainText } from "@/lib/content-renderer";
import { fetchLatestPosts } from "@/lib/keystatic/post-data";
import {
  isPublishedAtOrBefore,
  parsePublishedAt,
} from "@/lib/keystatic/publishing";
import { isPublishedUpgrade } from "@/lib/keystatic/upgrade-status";
import { reader } from "@/lib/reader";
import type { PostItem } from "@/lib/post-types";

export type DeveloperUpdateKind = "News" | "Changelog" | "Upgrade" | "Release";

export type DeveloperUpdate = {
  kind: DeveloperUpdateKind;
  title: string;
  description: string;
  href: string;
  publishedAt?: string;
};

type ContentEntry = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  overview?: string;
};

function toStringValue(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function newest(entries: ContentEntry[]): ContentEntry | undefined {
  return [...entries].sort((left, right) => {
    const leftTime = parsePublishedAt(left.publishedAt)?.getTime() ?? 0;
    const rightTime = parsePublishedAt(right.publishedAt)?.getTime() ?? 0;

    return rightTime - leftTime;
  })[0];
}

function postDescription(post: PostItem | undefined): string {
  return post ? contentDocumentToPlainText(post.description) : "";
}

function postUpdate(
  post: PostItem | undefined,
  kind: Extract<DeveloperUpdateKind, "News" | "Changelog">,
  fallbackDescription: string,
): DeveloperUpdate | undefined {
  if (!post?.title) return undefined;

  return {
    kind,
    title: post.title,
    description: postDescription(post) || fallbackDescription,
    href: post.url,
    publishedAt: post.publishedAt ?? undefined,
  };
}

async function getLatestUpgrade(): Promise<ContentEntry | undefined> {
  const slugs = await reader.collections.upgrades.list();
  const entries = await Promise.all(
    slugs.map(async (slug: string): Promise<ContentEntry | undefined> => {
      const rawEntry = (await reader.collections.upgrades.read(slug)) as Record<
        string,
        unknown
      > | null;
      const entry = {
        status: toStringValue(rawEntry?.status),
        publishedAt: toStringValue(rawEntry?.publishedAt),
      };

      if (!isPublishedUpgrade(entry) || !rawEntry) {
        return undefined;
      }

      const title = toStringValue(rawEntry.title);
      if (!title) return undefined;

      return {
        slug,
        title,
        description: toStringValue(rawEntry.description),
        publishedAt: entry.publishedAt,
      };
    }),
  );

  return newest(
    entries.filter((entry): entry is ContentEntry => Boolean(entry)),
  );
}

async function getLatestRelease(): Promise<ContentEntry | undefined> {
  const slugs = await reader.collections.releases.list();
  const entries = await Promise.all(
    slugs.map(async (slug: string): Promise<ContentEntry | undefined> => {
      const rawEntry = (await reader.collections.releases.read(slug)) as Record<
        string,
        unknown
      > | null;
      const publishedAt = toStringValue(rawEntry?.expectedDate);

      if (
        !rawEntry ||
        rawEntry.status !== "shipped" ||
        !isPublishedAtOrBefore(publishedAt)
      ) {
        return undefined;
      }

      return {
        slug,
        title: toStringValue(rawEntry.name) || slug,
        description: "",
        publishedAt,
        overview: toStringValue(rawEntry.overview) || undefined,
      };
    }),
  );

  return newest(
    entries.filter((entry): entry is ContentEntry => Boolean(entry)),
  );
}

/**
 * Builds the small, stable feed used by the developer hub from Media-owned
 * content. The page can therefore update when Media content changes without a
 * Docs build or a second editorial feed.
 */
export async function fetchLatestDeveloperUpdates(): Promise<
  DeveloperUpdate[]
> {
  const [developerNews, changelog, upgrade, release] = await Promise.all([
    fetchLatestPosts({
      limit: 1,
      category: "developers",
      excludeCategory: "changelog",
    }),
    fetchLatestPosts({ limit: 1, category: "changelog" }),
    getLatestUpgrade(),
    getLatestRelease(),
  ]);

  return [
    postUpdate(
      developerNews.posts[0],
      "News",
      "Recent news for developers building on Solana.",
    ),
    postUpdate(
      changelog.posts[0],
      "Changelog",
      "Weekly engineering, tooling, and network updates.",
    ),
    upgrade
      ? {
          kind: "Upgrade",
          title: upgrade.title,
          description:
            upgrade.description ||
            "A current network improvement for Solana builders.",
          href: `/upgrades/${upgrade.slug}`,
          publishedAt: upgrade.publishedAt,
        }
      : undefined,
    release
      ? {
          kind: "Release",
          title: release.title,
          description:
            "The latest shipped software release for the Solana network.",
          href: `/upgrades/${release.overview ?? release.slug}`,
          publishedAt: release.publishedAt,
        }
      : undefined,
  ].filter((update): update is DeveloperUpdate => Boolean(update));
}
