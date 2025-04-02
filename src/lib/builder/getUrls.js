const https = require("https");

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

module.exports = { getBuilderUrls };
