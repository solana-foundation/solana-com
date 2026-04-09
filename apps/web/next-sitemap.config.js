const {
  getUpgradeUrls,
  getMediaReportUrls,
  getMediaPostUrls,
  getMediaPodcastUrls,
} = require("./src/lib/sitemap/media-urls");
const { getDocsUrls } = require("./src/lib/sitemap/docs-urls");
const {
  createSitemapEntry,
  dedupeEntries,
  localizedPaths,
} = require("./src/lib/sitemap/shared");
const https = require("https");
const accelerateSitemapRoutes = require("../accelerate/src/app/sitemap-routes.json");

async function fetchTemplates() {
  return new Promise((resolve) => {
    https
      .get(
        "https://raw.githubusercontent.com/solana-foundation/templates/main/templates.json",
        (res) => {
          let data = "";
          res.on("data", (chunk) => {
            data += chunk;
          });
          res.on("end", () => {
            try {
              const templates = JSON.parse(data);
              resolve(templates);
            } catch (error) {
              console.error("Error parsing templates JSON:", error);
              resolve([]);
            }
          });
        },
      )
      .on("error", (error) => {
        console.error("Error fetching templates:", error);
        resolve([]);
      });
  });
}

module.exports = {
  siteUrl: "https://solana.com/",
  transform: (config, path) => {
    // remove the "en" locale from the path
    const loc = path == "/en" ? "/" : path.replace("/en/", "/");
    return {
      loc,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    };
  },
  additionalPaths: async () => {
    const mediaPostUrls = getMediaPostUrls();
    const mediaPodcastUrls = getMediaPodcastUrls();
    const mediaReportUrls = getMediaReportUrls();
    const upgradeUrls = getUpgradeUrls();
    const docsUrls = getDocsUrls();

    const templates = await fetchTemplates();
    const templateUrls = [
      createSitemapEntry("/developers/templates", {
        lastmod: new Date().toISOString(),
        changefreq: "weekly",
        priority: 0.8,
      }),
      ...templates.map((template) =>
        createSitemapEntry(`/developers/templates/${template.name}`, {
          lastmod: new Date().toISOString(),
          changefreq: "weekly",
          priority: 0.7,
        }),
      ),
    ];

    const accelerateUrls = accelerateSitemapRoutes.flatMap((route) =>
      localizedPaths(`/accelerate${route.path}`).map((loc) =>
        createSitemapEntry(loc, {
          lastmod: new Date().toISOString(),
          changefreq: route.changeFrequency,
          priority: route.priority,
        }),
      ),
    );

    const breakpointUrls = localizedPaths("/breakpoint").map((loc) =>
      createSitemapEntry(loc, {
        lastmod: new Date().toISOString(),
        changefreq: "weekly",
        priority: 0.8,
      }),
    );

    return dedupeEntries([
      ...docsUrls,
      ...mediaPostUrls,
      ...mediaPodcastUrls,
      ...mediaReportUrls,
      ...upgradeUrls,
      ...templateUrls,
      ...accelerateUrls,
      ...breakpointUrls,
    ]);
  },
};
