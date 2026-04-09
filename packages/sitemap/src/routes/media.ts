import fs from "node:fs";
import path from "node:path";
import { repoRoot } from "../constants";
import type { RouteGenerator } from "../types";
import {
  createLocalizedEntries,
  dedupeEntries,
  getFileLastModified,
} from "../utils";

const mediaContentRoot = path.join(repoRoot, "apps", "media", "content");

function parseScalar(value: string) {
  const trimmed = value.trim();

  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }

  if (trimmed === "true") return true;
  if (trimmed === "false") return false;
  if (trimmed === "null") return null;

  return trimmed;
}

function parseYamlLines(yamlContent: string) {
  const data: Record<string, unknown> = {};
  let currentArrayKey: string | null = null;

  for (const rawLine of yamlContent.split("\n")) {
    const line = rawLine.replace(/\r$/, "");
    const trimmedLine = line.trim();

    if (!trimmedLine) {
      continue;
    }

    const arrayItemMatch = trimmedLine.match(/^-\s+([A-Za-z0-9_]+):\s*(.*)$/);
    if (arrayItemMatch && currentArrayKey) {
      const arrayKey = currentArrayKey;
      const key = arrayItemMatch[1];
      const value = arrayItemMatch[2] ?? "";

      if (!key) {
        continue;
      }

      if (!Array.isArray(data[arrayKey])) {
        data[arrayKey] = [];
      }

      (data[arrayKey] as Array<Record<string, unknown>>).push({
        [key]: parseScalar(value),
      });
      continue;
    }

    const keyMatch = trimmedLine.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (!keyMatch) {
      continue;
    }

    const key = keyMatch[1];
    const value = keyMatch[2] ?? "";

    if (!key) {
      continue;
    }

    if (!value) {
      data[key] = [];
      currentArrayKey = key;
      continue;
    }

    data[key] = parseScalar(value);
    currentArrayKey = null;
  }

  return data;
}

function parseFrontmatter(fileContents: string) {
  if (!fileContents.startsWith("---\n")) {
    return {};
  }

  const endIndex = fileContents.indexOf("\n---", 4);
  if (endIndex === -1) {
    return {};
  }

  return parseYamlLines(fileContents.slice(4, endIndex));
}

function readContentEntries<T>(
  relativeDir: string,
  options: {
    filter?: (entry: {
      data: Record<string, unknown>;
      content: string;
      fileName: string;
      filePath: string;
    }) => boolean;
    mapEntry: (entry: {
      data: Record<string, unknown>;
      content: string;
      fileName: string;
      filePath: string;
    }) => T;
  },
) {
  const contentDir = path.join(mediaContentRoot, relativeDir);

  if (!fs.existsSync(contentDir)) {
    return [];
  }

  return fs
    .readdirSync(contentDir)
    .filter(
      (fileName) => fileName.endsWith(".mdx") || fileName.endsWith(".yaml"),
    )
    .flatMap((fileName) => {
      const filePath = path.join(contentDir, fileName);

      try {
        const fileContents = fs.readFileSync(filePath, "utf8");
        const parsed = fileName.endsWith(".mdx")
          ? { data: parseFrontmatter(fileContents), content: fileContents }
          : { data: parseYamlLines(fileContents), content: fileContents };

        if (
          options.filter &&
          !options.filter({ ...parsed, fileName, filePath })
        ) {
          return [];
        }

        return options.mapEntry({ ...parsed, fileName, filePath });
      } catch (error) {
        console.error(
          `Error processing media sitemap source ${filePath}`,
          error,
        );
        return [];
      }
    });
}

function getMediaPostEntries() {
  const categoryPaths = new Set<string>();
  const entries = [
    ...createLocalizedEntries("/news", {
      changeFrequency: "daily",
      priority: 0.8,
    }),
  ];

  const postEntries = readContentEntries("posts", {
    filter: ({ data }) => data.status === "published",
    mapEntry: ({ data, fileName }) => {
      const slug = String(data.slug || fileName.replace(/\.(mdx|yaml)$/, ""));
      const lastModified = data.publishedAt
        ? new Date(String(data.publishedAt)).toISOString()
        : undefined;

      for (const categoryItem of (data.categories as Array<
        string | { category?: string }
      >) || []) {
        const categorySlug =
          typeof categoryItem === "string"
            ? categoryItem
            : categoryItem?.category || null;

        if (categorySlug) {
          categoryPaths.add(`/news/category/${categorySlug}`);
        }
      }

      return createLocalizedEntries(`/news/${slug}`, {
        lastModified,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    },
  });

  for (const categoryPath of categoryPaths) {
    entries.push(
      ...createLocalizedEntries(categoryPath, {
        changeFrequency: "weekly",
        priority: 0.6,
      }),
    );
  }

  return dedupeEntries([...entries, ...postEntries.flat()]);
}

function getMediaPodcastEntries() {
  const entries = [
    ...createLocalizedEntries("/podcasts", {
      changeFrequency: "weekly",
      priority: 0.8,
    }),
  ];

  const podcastEntries = readContentEntries("podcasts", {
    filter: ({ data }) => data.status !== "inactive",
    mapEntry: ({ data, fileName }) => {
      const slug = String(data.slug || fileName.replace(/\.(mdx|yaml)$/, ""));
      const lastModified = data.firstEpisodeDate
        ? new Date(String(data.firstEpisodeDate)).toISOString()
        : undefined;

      return createLocalizedEntries(`/podcasts/${slug}`, {
        lastModified,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    },
  });

  return dedupeEntries([...entries, ...podcastEntries.flat()]);
}

function getMediaReportEntries() {
  const entries = [
    ...createLocalizedEntries("/reports", {
      changeFrequency: "weekly",
      priority: 0.8,
    }),
  ];

  const reportEntries = readContentEntries("switchbacks", {
    filter: ({ data }) => Boolean(data.isReport) && data.status === "published",
    mapEntry: ({ data, fileName }) => {
      const slug = String(data.slug || fileName.replace(/\.(mdx|yaml)$/, ""));
      const lastModified = data.publishedAt
        ? new Date(String(data.publishedAt)).toISOString()
        : undefined;

      return createLocalizedEntries(`/reports/${slug}`, {
        lastModified,
        changeFrequency: "monthly",
        priority: 0.7,
      });
    },
  });

  return dedupeEntries([...entries, ...reportEntries.flat()]);
}

function getUpgradeEntries() {
  const upgradesDir = path.join(mediaContentRoot, "upgrades");

  if (!fs.existsSync(upgradesDir)) {
    return [];
  }

  const entries = [
    ...createLocalizedEntries("/upgrades", {
      changeFrequency: "weekly",
      priority: 0.8,
    }),
  ];

  for (const fileName of fs.readdirSync(upgradesDir)) {
    if (!fileName.endsWith(".yaml")) {
      continue;
    }

    const slug = fileName.replace(/\.yaml$/, "");
    const filePath = path.join(upgradesDir, fileName);

    entries.push(
      ...createLocalizedEntries(`/upgrades/${slug}`, {
        lastModified: getFileLastModified(filePath),
        changeFrequency: "weekly",
        priority: 0.7,
      }),
    );
  }

  return dedupeEntries(entries);
}

export const mediaRoutes: RouteGenerator = () => {
  try {
    return dedupeEntries([
      ...getMediaPostEntries(),
      ...getMediaPodcastEntries(),
      ...getMediaReportEntries(),
      ...getUpgradeEntries(),
    ]);
  } catch (error) {
    console.error("Failed to build media sitemap routes", error);
    return [];
  }
};
