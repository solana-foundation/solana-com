// The Builder Public API Key is public
// https://www.builder.io/c/docs/using-your-api-key

export const BUILDER_CONFIG = {
  apiKey:
    process.env.NEXT_PUBLIC_BUILDER_API_KEY ||
    "ce0c7323a97a4d91bd0baa7490ec9139",
  pageId:
    process.env.NEXT_PUBLIC_BUILDER_NEWS_SETTINGS_ID ||
    "de254e309a264d9ebe965dc894715005",
  pageModel: "page",
  tagsModel: "entity-blog-tags",
  listingLimit: 10,
};
