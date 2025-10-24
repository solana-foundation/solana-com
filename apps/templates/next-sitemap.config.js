module.exports = {
  siteUrl: process.env.SITE_URL || "https://solana.com",
  generateRobotsTxt: false, // Let main app handle robots.txt
  transform: (config, path) => {
    // Prefix all paths with /templates since this will be mounted there
    const loc = path === "/" ? "/templates" : `/templates${path}`;
    return {
      loc,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    };
  },
  additionalPaths: async () => {
    // Dynamic template paths will be generated from static params
    return [];
  },
};
