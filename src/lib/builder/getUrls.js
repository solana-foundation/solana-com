const https = require("https");
const fs = require("fs");
const path = require("path");
const { uniqBy } = require("lodash");

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
const MODELS = [
  { name: "section-page", slugField: "data.slug", urlPrefix: "/" },
  { name: "post", slugField: "data.slug", urlPrefix: "/news/" },
  {
    name: "breakpoint",
    slugField: "data.slug",
    urlPrefix: "/breakpoint/",
  },
];

// Helper to get current ISO date for lastModified
const currentDate = new Date().toISOString();

// Helper to add a URL to the urls array
function addUrl(
  urls,
  {
    url,
    lastModified = currentDate,
    changeFrequency = "daily",
    priority = 0.7,
  },
) {
  urls.push({
    url,
    lastModified,
    changeFrequency,
    priority,
  });
}

/**
 * Scans a directory for subdirectories or files and adds URLs based on the provided options.
 * @param {string} baseDir - The absolute path to the directory to scan.
 * @param {object} options
 *   - subDirAsSlug: if true, each subdirectory is a slug (e.g. for courses, guides, cookbook)
 *   - fileExt: file extension to match (e.g. '.mdx')
 *   - urlPrefix: prefix for the generated URL
 *   - addRoot: if true, add the root URL as well
 *   - skipNames: array of directory or file names to skip
 *   - urlBuilder: optional custom function (dirent, file) => url
 */
function scanAndAddUrls(
  urls,
  baseDir,
  {
    subDirAsSlug = false,
    fileExt = ".mdx",
    urlPrefix = "",
    addRoot = false,
    skipNames = [],
    urlBuilder,
  },
) {
  if (!fs.existsSync(baseDir)) return;

  if (subDirAsSlug) {
    fs.readdirSync(baseDir, { withFileTypes: true }).forEach((dirent) => {
      if (dirent.isDirectory() && !skipNames.includes(dirent.name)) {
        const subDir = path.join(baseDir, dirent.name);
        fs.readdirSync(subDir).forEach((file) => {
          if (file.endsWith(fileExt)) {
            const slug = file.replace(fileExt, "");
            const url = urlBuilder
              ? urlBuilder(dirent.name, slug)
              : `${urlPrefix}/${dirent.name}/${slug}`;
            addUrl(urls, { url });
          }
        });
      }
    });
    if (addRoot) addUrl(urls, { url: urlPrefix });
  } else {
    fs.readdirSync(baseDir).forEach((file) => {
      if (file.endsWith(fileExt) && !skipNames.includes(file)) {
        const slug = file.replace(fileExt, "");
        const url = urlBuilder
          ? urlBuilder(null, slug)
          : `${urlPrefix}/${slug}`;
        addUrl(urls, { url });
      }
    });
    if (addRoot) addUrl(urls, { url: urlPrefix });
  }
}

// Recursive scan for deeply nested .mdx files (for courses)
function scanAndAddUrlsRecursive(urls, baseDir, urlPrefix, skipNames = []) {
  if (!fs.existsSync(baseDir)) return;

  fs.readdirSync(baseDir, { withFileTypes: true }).forEach((dirent) => {
    const fullPath = path.join(baseDir, dirent.name);
    if (skipNames.includes(dirent.name)) return;

    if (dirent.isDirectory()) {
      scanAndAddUrlsRecursive(
        urls,
        fullPath,
        `${urlPrefix}/${dirent.name}`,
        skipNames,
      );
    } else if (dirent.name.endsWith(".mdx")) {
      const slug = dirent.name.replace(".mdx", "");
      const url = `${urlPrefix}/${slug}`;
      addUrl(urls, { url });
    }
  });
}

// Function to scan content directories and generate root URLs (without locales)
function getContentUrls() {
  const urls = [];

  scanAndAddUrlsRecursive(
    urls,
    path.join(__dirname, "../../../content/courses"),
    "/developers/courses",
    ["meta.json"],
  );
  const coursesDir = path.join(__dirname, "../../../content/courses");
  if (fs.existsSync(coursesDir)) {
    fs.readdirSync(coursesDir, { withFileTypes: true }).forEach((dirent) => {
      if (dirent.isDirectory()) {
        addUrl(urls, { url: `/developers/courses/${dirent.name}` });
      }
    });
  }
  addUrl(urls, { url: "/developers/courses" });

  scanAndAddUrls(urls, path.join(__dirname, "../../../content/learn/en"), {
    subDirAsSlug: false,
    fileExt: ".mdx",
    urlPrefix: "/learn",
    addRoot: true,
  });

  scanAndAddUrls(urls, path.join(__dirname, "../../../content/cookbook"), {
    subDirAsSlug: true,
    fileExt: ".mdx",
    urlPrefix: "/developers/cookbook",
    addRoot: true,
    urlBuilder: (dirName, slug) => `/developers/cookbook/${dirName}/${slug}`,
  });

  // Guides
  scanAndAddUrls(urls, path.join(__dirname, "../../../content/guides"), {
    subDirAsSlug: true,
    fileExt: ".mdx",
    urlPrefix: "/developers/guides",
    addRoot: true,
    urlBuilder: (dirName, slug) => `/developers/guides/${dirName}/${slug}`,
  });

  // Example for docs (scan /content/docs/en and subdirs recursively)
  const docsDir = path.join(__dirname, "../../../content/docs/en");
  function scanDocs(dir, basePath = "/docs") {
    fs.readdirSync(dir, { withFileTypes: true }).forEach((dirent) => {
      const fullPath = path.join(dir, dirent.name);
      if (dirent.isDirectory()) {
        scanDocs(fullPath, `${basePath}/${dirent.name}`);
      } else if (
        dirent.name.endsWith(".mdx") ||
        dirent.name.endsWith(".json")
      ) {
        // Include index-like files
        const slug = dirent.name.replace(/\.mdx|\.json$/, "");
        const urlPath =
          slug === "index" || slug === "meta"
            ? basePath
            : `${basePath}/${slug}`;
        addUrl(urls, { url: urlPath });
      }
    });
  }
  if (fs.existsSync(docsDir)) {
    scanDocs(docsDir);
  }

  const staticPages = [
    "/",
    "/404",
    "/news",
    "/developers",
    "/community",
    "/events",
    "/staking",
    "/wallets",
    "/rpc",
    "/tos",
    "/privacy-policy",
  ];
  staticPages.forEach((p) => addUrl(urls, { url: p }));

  return urls;
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
      const cleanUrl = item.url.replace(/\/index$/, "");
      return {
        loc: cleanUrl,
        lastmod: item.lastModified,
        changefreq: item.changeFrequency,
        priority: item.priority,
      };
    }),
  ].filter((item) => !EXCLUDE_URLS.includes(item.loc));

  const dedupedUrls = uniqBy(allUrls, "loc");
  const sortedUrls = dedupedUrls.sort((a, b) => a.loc.localeCompare(b.loc));
  return sortedUrls;
}

module.exports = { getAllUrls };
