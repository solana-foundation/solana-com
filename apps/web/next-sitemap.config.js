const {
  getMediaPostUrls,
  getMediaPodcastUrls,
} = require("./src/lib/sitemap/media-urls");
const https = require("https");

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
    // Fetch media app posts (replaces old Builder post model)
    const mediaPostUrls = getMediaPostUrls();

    // Fetch media app podcasts
    const mediaPodcastUrls = getMediaPodcastUrls();

    // Fetch templates and add to sitemap
    const templates = await fetchTemplates();
    const templateUrls = [
      {
        loc: "/templates",
        lastmod: new Date().toISOString(),
        changefreq: "weekly",
        priority: 0.8,
      },
      ...templates.map((template) => ({
        loc: `/templates/${template.name}`,
        lastmod: new Date().toISOString(),
        changefreq: "weekly",
        priority: 0.7,
      })),
    ];

    return [...mediaPostUrls, ...mediaPodcastUrls, ...templateUrls];
  },
};
