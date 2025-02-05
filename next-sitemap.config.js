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
};
