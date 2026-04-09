const fs = require("fs");
const path = require("path");
const {
  createSitemapEntry,
  dedupeEntries,
  localizedPaths,
} = require("./shared");

const MEDIA_CONTENT_ROOT = path.join(__dirname, "../../../../media/content");

function parseScalar(value) {
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

function parseFrontmatter(fileContents) {
  if (!fileContents.startsWith("---\n")) {
    return {};
  }

  const endIndex = fileContents.indexOf("\n---", 4);
  if (endIndex === -1) {
    return {};
  }

  const frontmatter = fileContents.slice(4, endIndex);
  const data = {};
  let currentArrayKey = null;

  for (const rawLine of frontmatter.split("\n")) {
    const line = rawLine.replace(/\r$/, "");
    const trimmedLine = line.trim();

    if (!trimmedLine) {
      continue;
    }

    const arrayItemMatch = trimmedLine.match(/^-\s+([A-Za-z0-9_]+):\s*(.*)$/);
    if (arrayItemMatch && currentArrayKey) {
      const [, key, value] = arrayItemMatch;

      if (!Array.isArray(data[currentArrayKey])) {
        data[currentArrayKey] = [];
      }

      data[currentArrayKey].push({ [key]: parseScalar(value) });
      continue;
    }

    const keyMatch = trimmedLine.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (!keyMatch) {
      continue;
    }

    const [, key, value] = keyMatch;

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

function readContentEntries(relativeDir, { filter, mapEntry }) {
  const contentDir = path.join(MEDIA_CONTENT_ROOT, relativeDir);

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
          : { data: {}, content: fileContents };

        if (filter && !filter({ ...parsed, fileName, filePath })) {
          return [];
        }

        return mapEntry({ ...parsed, fileName, filePath });
      } catch (error) {
        console.error(`Error processing ${filePath}:`, error.message);
        return [];
      }
    });
}

function createLocalizedEntries(routePath, options = {}) {
  return localizedPaths(routePath).map((loc) =>
    createSitemapEntry(loc, options),
  );
}

function getMediaPostUrls() {
  const categoryPaths = new Set();
  const entries = [
    ...createLocalizedEntries("/news", {
      changefreq: "daily",
      priority: 0.8,
    }),
  ];

  const postEntries = readContentEntries("posts", {
    filter: ({ data }) => data.status === "published",
    mapEntry: ({ data, fileName }) => {
      const slug = data.slug || fileName.replace(/\.mdx$/, "");
      const lastmod = data.publishedAt
        ? new Date(data.publishedAt).toISOString()
        : undefined;

      for (const categoryItem of data.categories || []) {
        const categorySlug =
          typeof categoryItem === "string"
            ? categoryItem
            : categoryItem?.category || null;

        if (categorySlug) {
          categoryPaths.add(`/news/category/${categorySlug}`);
        }
      }

      return createLocalizedEntries(`/news/${slug}`, {
        lastmod,
        changefreq: "weekly",
        priority: 0.7,
      });
    },
  });

  for (const categoryPath of categoryPaths) {
    entries.push(
      ...createLocalizedEntries(categoryPath, {
        changefreq: "weekly",
        priority: 0.6,
      }),
    );
  }

  return dedupeEntries([...entries, ...postEntries.flat()]);
}

function getMediaPodcastUrls() {
  const entries = [
    ...createLocalizedEntries("/podcasts", {
      changefreq: "weekly",
      priority: 0.8,
    }),
  ];

  const podcastEntries = readContentEntries("podcasts", {
    filter: ({ data }) => data.status !== "inactive",
    mapEntry: ({ data, fileName }) => {
      const slug = data.slug || fileName.replace(/\.mdx$/, "");
      const lastmod = data.firstEpisodeDate
        ? new Date(data.firstEpisodeDate).toISOString()
        : undefined;

      return createLocalizedEntries(`/podcasts/${slug}`, {
        lastmod,
        changefreq: "weekly",
        priority: 0.7,
      });
    },
  });

  return dedupeEntries([...entries, ...podcastEntries.flat()]);
}

function getMediaReportUrls() {
  const entries = [
    ...createLocalizedEntries("/reports", {
      changefreq: "weekly",
      priority: 0.8,
    }),
  ];

  const reportEntries = readContentEntries("switchbacks", {
    filter: ({ data }) => Boolean(data.isReport) && data.status === "published",
    mapEntry: ({ data, fileName }) => {
      const slug = data.slug || fileName.replace(/\.mdx$/, "");
      const lastmod = data.publishedAt
        ? new Date(data.publishedAt).toISOString()
        : undefined;

      return createLocalizedEntries(`/reports/${slug}`, {
        lastmod,
        changefreq: "monthly",
        priority: 0.7,
      });
    },
  });

  return dedupeEntries([...entries, ...reportEntries.flat()]);
}

function getUpgradeUrls() {
  const upgradesDir = path.join(MEDIA_CONTENT_ROOT, "upgrades");

  if (!fs.existsSync(upgradesDir)) {
    return [];
  }

  const entries = [
    ...createLocalizedEntries("/upgrades", {
      changefreq: "weekly",
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
        lastmod: fs.statSync(filePath).mtime.toISOString(),
        changefreq: "weekly",
        priority: 0.7,
      }),
    );
  }

  return dedupeEntries(entries);
}

module.exports = {
  getMediaPodcastUrls,
  getMediaPostUrls,
  getMediaReportUrls,
  getUpgradeUrls,
};
