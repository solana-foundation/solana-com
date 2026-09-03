import "server-only";

import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

export type DeveloperUpdate = {
  kind: "News" | "Changelog" | "Upgrade" | "Release";
  title: string;
  description: string;
  href: string;
  publishedAt?: string;
};

type ContentEntry = {
  slug: string;
  title: string;
  description: string;
  publishedAt?: string;
  categories: string[];
  status: string;
  overview?: string;
};

const MEDIA_CONTENT_DIRECTORY = path.join(process.cwd(), "../media/content");

function toString(value: unknown): string {
  if (typeof value === "string") return value;
  if (value instanceof Date) return value.toISOString();
  return "";
}

function taxonomyValues(value: unknown, key: string): string[] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((item) => {
    if (typeof item !== "object" || item === null) return [];
    const entry = item as Record<string, unknown>;
    const taxonomyValue = entry[key];
    return typeof taxonomyValue === "string" ? [taxonomyValue] : [];
  });
}

async function getCollection(name: "posts" | "upgrades" | "releases") {
  const directory = path.join(MEDIA_CONTENT_DIRECTORY, name);

  try {
    const files = await readdir(directory);
    const entries = await Promise.all(
      files
        .filter((file) => file.endsWith(".mdx"))
        .map(async (file): Promise<ContentEntry> => {
          const source = await readFile(path.join(directory, file), "utf8");
          const { data } = matter(source);
          const frontmatter = data as Record<string, unknown>;

          return {
            slug: file.replace(/\.mdx$/, ""),
            title: toString(frontmatter.title) || toString(frontmatter.name),
            description: toString(frontmatter.description),
            publishedAt:
              toString(frontmatter.publishedAt) ||
              toString(frontmatter.expectedDate) ||
              undefined,
            categories: taxonomyValues(frontmatter.categories, "category"),
            status: toString(frontmatter.status),
            overview: toString(frontmatter.overview) || undefined,
          };
        }),
    );

    return entries;
  } catch (error) {
    console.error(`Unable to load developer ${name} content`, error);
    return [];
  }
}

function newest(entries: ContentEntry[]) {
  return [...entries].sort((left, right) => {
    const leftTime = left.publishedAt ? Date.parse(left.publishedAt) : 0;
    const rightTime = right.publishedAt ? Date.parse(right.publishedAt) : 0;
    return rightTime - leftTime;
  })[0];
}

function toUpdate(
  entry: ContentEntry | undefined,
  kind: DeveloperUpdate["kind"],
  href: string,
  fallbackDescription: string,
): DeveloperUpdate | undefined {
  if (!entry || !entry.title) return undefined;

  return {
    kind,
    title: entry.title,
    description: entry.description || fallbackDescription,
    href,
    publishedAt: entry.publishedAt,
  };
}

/**
 * Reads the media app's published content directly, keeping the hub's signal
 * current without maintaining another editorial feed or network dependency.
 */
export async function getLatestDeveloperUpdates(): Promise<DeveloperUpdate[]> {
  const [posts, upgrades, releases] = await Promise.all([
    getCollection("posts"),
    getCollection("upgrades"),
    getCollection("releases"),
  ]);

  const developerNews = newest(
    posts.filter(
      (entry) =>
        entry.status === "published" &&
        entry.categories.includes("developers") &&
        !entry.categories.includes("changelog"),
    ),
  );
  const changelog = newest(
    posts.filter(
      (entry) =>
        entry.status === "published" && entry.categories.includes("changelog"),
    ),
  );
  const upgrade = newest(
    upgrades.filter((entry) => entry.status === "published"),
  );
  const release = newest(
    releases.filter((entry) => entry.status === "shipped"),
  );

  return [
    toUpdate(
      developerNews,
      "News",
      `/news/${developerNews?.slug}`,
      "Recent news for developers building on Solana.",
    ),
    toUpdate(
      changelog,
      "Changelog",
      `/news/${changelog?.slug}`,
      "Weekly engineering, tooling, and network updates.",
    ),
    toUpdate(
      upgrade,
      "Upgrade",
      `/upgrades/${upgrade?.slug}`,
      "A current network improvement for Solana builders.",
    ),
    toUpdate(
      release,
      "Release",
      `/upgrades/${release?.overview ?? release?.slug}`,
      "The latest shipped software release for the Solana network.",
    ),
  ].filter((update): update is DeveloperUpdate => Boolean(update));
}
