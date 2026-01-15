const https = require("https");
const fs = require("fs");
const path = require("path");
const { uniqBy } = require("lodash");
const { locales } = require("@workspace/i18n/config");
// const { runDiffSitemaps } = require("./diffSitemaps");

// TODO: remove this once we consoloidate to app-router (multiple routers in nextjs is suboptimal)

function httpsGet(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let data = "";

        // A chunk of data has been received
        res.on("data", (chunk) => {
          data += chunk;
        });

        // The whole response has been received
        res.on("end", () => {
          try {
            const jsonData = JSON.parse(data);
            resolve(jsonData);
          } catch (error) {
            reject(new Error(`Error parsing JSON: ${error.message}`));
          }
        });
      })
      .on("error", (error) => {
        reject(error);
      });
  });
}

// Models to fetch slugs from and their corresponding URL paths
// NOTE: "post" model removed - news URLs are now generated from @apps/media/content/posts
const MODELS = [
  { name: "section-page", slugField: "data.slug", urlPrefix: "/" },
  {
    name: "breakpoint",
    slugField: "data.slug",
    urlPrefix: "/breakpoint/",
  },
];

const CONTENT_ROOT = path.join(__dirname, "../../../../docs/content");
const currentDate = new Date().toISOString();

function isTranslationDir(dirPath) {
  if (!fs.existsSync(dirPath)) return false;
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  const subdirs = entries.filter((e) => e.isDirectory()).map((e) => e.name);
  // If at least half of the subdirs are translation folders, treat as translation dir
  const count = subdirs.filter((name) => locales.includes(name)).length;
  return count > 0;
}

function scanContentRecursive(baseDir, urlPrefix = "", urls = []) {
  if (!fs.existsSync(baseDir)) return urls;

  // If this dir contains translation folders, scan all locales
  if (isTranslationDir(baseDir)) {
    locales.forEach((locale) => {
      const localeDir = path.join(baseDir, locale);
      if (fs.existsSync(localeDir)) {
        const localePrefix =
          locale === "en" ? urlPrefix : `/${locale}${urlPrefix || ""}`;
        scanContentRecursive(localeDir, localePrefix, urls);
      }
    });
    return urls;
  }

  // Detect if we're at /content/cookbook or /content/guides
  const isCookbookOrGuides =
    baseDir.endsWith(`${path.sep}guides`) ||
    baseDir.endsWith(`${path.sep}cookbook`);

  // If so, prepend /developers to the urlPrefix
  const effectiveUrlPrefix =
    isCookbookOrGuides && !urlPrefix.startsWith("/developers")
      ? `/developers${urlPrefix}`
      : urlPrefix;

  const entries = fs.readdirSync(baseDir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(baseDir, entry.name);
    if (entry.isDirectory()) {
      scanContentRecursive(
        fullPath,
        `${effectiveUrlPrefix}/${entry.name}`,
        urls,
      );
    } else if (entry.name.endsWith(".mdx") || entry.name.endsWith(".json")) {
      // Remove /content and file extension
      let url = `${effectiveUrlPrefix}/${entry.name}`.replace(
        /\/index\.(mdx|json)$/,
        "",
      );
      url = url.replace(/\.(mdx|json)$/, "");
      url = url.replace(/\/+/g, "/"); // Remove duplicate slashes
      urls.push({
        loc: url,
        lastmod: currentDate,
        changefreq: "weekly",
        priority: 0.7,
      });
    }
  }
  return urls;
}

function getContentUrls() {
  return scanContentRecursive(CONTENT_ROOT, "");
}

async function getBuilderUrls() {
  const result = [];

  try {
    const BUILDER_API_KEY = process.env.NEXT_PUBLIC_BUILDER_API_KEY;

    if (BUILDER_API_KEY) {
      // Fetch all builder URLs directly during sitemap generation
      let allFetchedUrls = [];

      for (const model of MODELS) {
        try {
          // Get all entries for this model
          const apiUrl = `https://cdn.builder.io/api/v3/content/${model.name}?apiKey=${BUILDER_API_KEY}&fields=${model.slugField}&limit=100&offset=0&noTargeting=true&sort.createdDate=-1`;

          const response = await httpsGet(apiUrl);
          const entries = response.results || [];

          // Extract data from entries
          const modelUrls = entries
            .filter((entry) => {
              const slugParts = model.slugField.split(".");
              let value = entry;
              for (const part of slugParts) {
                if (!value || !value[part]) return false;
                value = value[part];
              }
              return Boolean(value);
            })
            .map((entry) => {
              const slugParts = model.slugField.split(".");
              let value = entry;
              for (const part of slugParts) {
                value = value[part];
              }
              return {
                url: `${model.urlPrefix}${value}`,
                lastModified:
                  entry.lastUpdatedDate ||
                  entry.createdDate ||
                  new Date().toISOString(),
                changeFrequency: "weekly",
                priority: 0.7,
              };
            });

          allFetchedUrls = [...allFetchedUrls, ...modelUrls];
        } catch (error) {
          console.error(`Error fetching ${model.name} URLs:`, error.message);
        }
      }

      console.log(
        `Loaded ${allFetchedUrls.length} URLs from Builder for sitemap`,
      );

      // Add URLs to result
      for (const item of allFetchedUrls) {
        result.push({
          loc: item.url,
          lastmod: item.lastModified,
          changefreq: item.changeFrequency,
          priority: item.priority,
        });
      }
    } else {
      console.warn(
        "NEXT_PUBLIC_BUILDER_API_KEY not found, skipping Builder URLs",
      );
    }
  } catch (error) {
    console.warn("Error fetching Builder URLs:", error.message);
  }

  return result;
}

const EXCLUDE_URLS = ["//solutions/enterprise-2"];

async function getAllUrls() {
  const builderUrls = await getBuilderUrls();
  const contentUrls = getContentUrls();
  const allUrls = [
    ...builderUrls,
    ...contentUrls.map((item) => {
      const cleanUrl = item.loc.replace(/\/index$/, "");
      return {
        loc: cleanUrl,
        lastmod: item.lastmod,
        changefreq: item.changefreq,
        priority: item.priority,
      };
    }),
  ]
    .filter((item) => !EXCLUDE_URLS.includes(item.loc))
    .filter((item) => !item.loc.endsWith("/meta"));

  const dedupedUrls = uniqBy(allUrls, "loc");
  const sortedUrls = dedupedUrls.sort((a, b) => a.loc.localeCompare(b.loc));

  // Run the diff script at the end
  // runDiffSitemaps();

  return sortedUrls;
}

module.exports = { getAllUrls };
