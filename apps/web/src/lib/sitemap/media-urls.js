const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

/**
 * Get all posts from the media app
 * Posts are stored in apps/media/content/posts/*.mdx
 */
function getMediaPostUrls() {
  const urls = [];
  const postsDir = path.join(__dirname, "../../../../media/content/posts");

  if (!fs.existsSync(postsDir)) {
    console.warn(`Posts directory not found: ${postsDir}`);
    return urls;
  }

  const files = fs.readdirSync(postsDir);

  for (const file of files) {
    if (!file.endsWith(".mdx")) continue;

    try {
      const filePath = path.join(postsDir, file);
      const fileContents = fs.readFileSync(filePath, "utf8");
      const { data } = matter(fileContents);

      // Skip unpublished posts
      if (data.status !== "published") continue;

      // Generate URL from slug
      const slug = data.slug || file.replace(/\.mdx$/, "");
      const url = `/news/${slug}`;

      urls.push({
        loc: url,
        lastmod: data.date
          ? new Date(data.date).toISOString()
          : new Date().toISOString(),
        changefreq: "weekly",
        priority: 0.7,
      });
    } catch (error) {
      console.error(`Error processing post ${file}:`, error.message);
    }
  }

  console.log(`Loaded ${urls.length} post URLs from media app`);
  return urls;
}

/**
 * Get all podcasts from the media app
 * Podcasts are stored in apps/media/content/podcasts/*.mdx
 */
function getMediaPodcastUrls() {
  const urls = [];
  const podcastsDir = path.join(
    __dirname,
    "../../../../media/content/podcasts",
  );

  if (!fs.existsSync(podcastsDir)) {
    console.warn(`Podcasts directory not found: ${podcastsDir}`);
    return urls;
  }

  // Add main podcasts index page
  urls.push({
    loc: "/podcasts",
    lastmod: new Date().toISOString(),
    changefreq: "weekly",
    priority: 0.8,
  });

  const files = fs.readdirSync(podcastsDir);

  for (const file of files) {
    if (!file.endsWith(".mdx")) continue;

    try {
      const filePath = path.join(podcastsDir, file);
      const fileContents = fs.readFileSync(filePath, "utf8");
      const { data } = matter(fileContents);

      // Skip inactive podcasts
      if (data.status === "inactive") continue;

      // Generate URL from slug
      const slug = data.slug || file.replace(/\.mdx$/, "");
      const url = `/podcasts/${slug}`;

      urls.push({
        loc: url,
        lastmod: data.firstEpisodeDate
          ? new Date(data.firstEpisodeDate).toISOString()
          : new Date().toISOString(),
        changefreq: "weekly",
        priority: 0.7,
      });
    } catch (error) {
      console.error(`Error processing podcast ${file}:`, error.message);
    }
  }

  console.log(`Loaded ${urls.length} podcast URLs from media app`);
  return urls;
}

module.exports = {
  getMediaPostUrls,
  getMediaPodcastUrls,
};
