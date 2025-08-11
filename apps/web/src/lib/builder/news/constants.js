import { BUILDER_CONFIG } from "../builderConstants";

export const NEWS_BUILDER_CONFIG = {
  apiKey: BUILDER_CONFIG.apiKey,
  postsModel: "post",
  tagsModel: "entity-blog-tags",
  previewSecret: "micky-mouse",
  listingPageModel: "news-listing-page",
  listingLimit: BUILDER_CONFIG.listingLimit,
  pressReleaseModel: "press-release",
};
