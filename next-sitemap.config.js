module.exports = {
  siteUrl: "https://solana.com/",
  transform: (config, path) => {
    // Remove the "en" locale from the path
    const loc = path.startsWith("/en/") ? path.replace("/en/", "/") : path === "/en" ? "/" : path;
    return {
      loc,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    };
  },
};
