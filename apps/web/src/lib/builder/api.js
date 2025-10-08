import { Builder, builder } from "@builder.io/react";
import { BUILDER_CONFIG } from "./builderConstants";

import uniqBy from "lodash/uniqBy";
import take from "lodash/take";

builder.init(BUILDER_CONFIG.apiKey);
builder.apiVersion = "v3";
Builder.isStatic = true;

const builderLimit = 100; // This seems to be the builder limit

// Enhanced retry logic with exponential backoff
const withRetry = async (fn, maxRetries = 3, baseDelay = 1000) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      console.warn(
        `Builder.io request attempt ${attempt} failed:`,
        error.message,
      );

      if (attempt === maxRetries) {
        throw error;
      }

      // Exponential backoff
      const delay = baseDelay * Math.pow(2, attempt - 1);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

// Enhanced timeout with retry
const withTimeoutAndRetry = async (promise, ms = 10000, maxRetries = 2) => {
  return withRetry(async () => {
    return Promise.race([
      promise,
      new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error(`Builder.io request timeout after ${ms}ms`)),
          ms,
        ),
      ),
    ]);
  }, maxRetries);
};

export function getPostSlugs(offset = 0, builderModel) {
  return withTimeoutAndRetry(
    builder.getAll(builderModel, {
      fields: "data.slug", // only request the `data.slug` field
      options: { noTargeting: true, offset: offset },
      apiKey: BUILDER_CONFIG.apiKey,
      limit: builderLimit,
    }),
  ).catch((error) => {
    console.error("[getPostSlugs] Failed after retries:", error);
    return []; // Return empty array as fallback
  });
}

export async function getAllPostSlugs() {
  let postCount = 0;
  let Post = [];

  const getAllPosts = async (offset = 0, builderModel) => {
    const posts = (await getPostSlugs(offset, builderModel))?.map(
      (p) => `/news/${p?.data?.slug}`,
    );

    Post = Post.concat(posts);
    postCount = postCount + posts.length;

    if (builderLimit > posts.length) {
      return postCount;
    } else {
      await getAllPosts(postCount);
    }

    return Post;
  };

  return getAllPosts();
}

export async function getPostPagination(page, builderModel) {
  let postCount = 0;
  const totalPostCount = async (offset = 0) => {
    const builderLimit = 100;
    const posts = await getPostSlugs(offset, builderModel);

    postCount = postCount + posts.length;

    if (builderLimit > posts.length) {
      return postCount;
    } else {
      await totalPostCount(postCount);
    }

    return postCount;
  };

  const limit = BUILDER_CONFIG.listingLimit;
  const pageCount = await totalPostCount();
  const pages = Math.ceil(pageCount / limit);

  return {
    limit,
    next: page + 1,
    page,
    pages,
    prev: page - 1,
    total: pageCount,
  };
}

export async function searchPosts(
  query,
  offset = 0,
  limit = 3,
  builderModel,
  omit = "data.blocks",
) {
  let posts = await withTimeoutAndRetry(
    builder.getAll(builderModel, {
      includeRefs: true,
      limit,
      staleCacheSeconds: 200,
      omit,
      options: {
        noTargeting: true,
        offset,
        sort: {
          "data.datePublished": -1,
        },
      },
      query,
    }),
  ).catch((error) => {
    console.error("[searchPosts] Failed after retries:", error);
    return []; // Return empty array as fallback
  });

  return posts;
}

export function getPostsPage(
  builderModel,
  page,
  limit = BUILDER_CONFIG.listingLimit,
  omit = "data.blocks",
) {
  return searchPosts(
    {
      "data.slug": { $exists: true },
      "data.author": { $exists: true },
    },
    (page - 1) * BUILDER_CONFIG.listingLimit,
    limit,
    builderModel,
    omit,
  );
}

export async function getPost(mongoQuery, locale, builderModel, options = {}) {
  try {
    const post = await withTimeoutAndRetry(
      builder
        .get(builderModel, {
          includeRefs: true,
          staleCacheSeconds: 20,
          options: {
            noTargeting: true,
            locale,
            ...options,
          },
          query: mongoQuery,
        })
        .toPromise(),
      8000,
    );

    return post || null;
  } catch (error) {
    console.error("[getPost] Error:", {
      mongoQuery,
      locale,
      error: error.message,
    });
    return null;
  }
}

export async function getPostAndMorePosts(builderModel, slug, locale) {
  const post = await getPost(
    {
      "data.slug": { $eq: slug },
    },
    locale,
    builderModel,
    { includeUnpublished: true }, // Add this option to include unpublished content so that the Builder preview page shows the title before publishing
  );

  const morePosts = await searchPosts({
    "data.slug": { $ne: slug, $exists: true },
    "data.author": { $exists: true },
  });

  return {
    post,
    morePosts,
  };
}

export function getFeaturedPosts() {
  return searchPosts({
    "data.tags.tag.id": "8ba3601d7dcc45298400f71e12825230",
  });
}

export function getTagSlugs(offset = 0) {
  return withTimeoutAndRetry(
    builder.getAll(BUILDER_CONFIG.tagsModel, {
      fields: "data.slug", // only request the `data.slug` field
      options: { noTargeting: true, offset: offset },
      apiKey: BUILDER_CONFIG.apiKey,
      limit: builderLimit,
    }),
  ).catch((error) => {
    console.error("[getTagSlugs] Failed after retries:", error);
    return []; // Return empty array as fallback
  });
}

export async function searchTags(query, offset = 0, limit = 100) {
  let tags = await withTimeoutAndRetry(
    builder.getAll(BUILDER_CONFIG.tagsModel, {
      limit,
      staleCacheSeconds: 200,
      omit: "data.blocks",
      options: {
        noTargeting: true,
        offset,
        includeRefs: true,
      },
      query,
    }),
  ).catch((error) => {
    console.error("[searchTags] Failed after retries:", error);
    return []; // Return empty array as fallback
  });

  return tags;
}

export async function getSingleTag(tag) {
  let post = await withTimeoutAndRetry(
    builder
      .get(BUILDER_CONFIG.tagsModel, {
        includeRefs: true,
        staleCacheSeconds: 20,
        options: {
          noTargeting: true,
        },
        query: {
          "data.slug": { $eq: tag },
        },
      })
      .toPromise(),
    8000,
  ).catch((error) => {
    console.error("[getSingleTag] Failed after retries:", error);
    return null;
  });

  return post || null;
}

export async function getPostsByTag(tag, builderModel) {
  const tagId = (await searchTags({})).find((t) => tag === t.data.slug)?.id;

  if (!tagId) {
    return null;
  }

  let posts = await withTimeoutAndRetry(
    builder.getAll(builderModel, {
      limit: 100,
      staleCacheSeconds: 20,
      omit: "data.blocks",
      options: {
        noTargeting: true,
        includeRefs: true,
      },
      fields: "data",
      query: {
        "data.tags.tag.id": tagId,
      },
    }),
  ).catch((error) => {
    console.error("[getPostsByTag] Failed after retries:", error);
    return null;
  });

  return posts || null;
}

export async function getPageSettings() {
  const id = BUILDER_CONFIG.pageId;

  // Get news page settings
  const newsPageSettings = await withTimeoutAndRetry(
    builder
      .get(BUILDER_CONFIG.pageModel, {
        includeRefs: true,
        staleCacheSeconds: 20,
        options: {
          noTargeting: true,
        },
        query: {
          id: id,
        },
        fields: "data.title,data.description,data.logo,data.coverImage",
      })
      .toPromise(),
    8000,
  ).catch((error) => {
    console.error("[getPageSettings] Failed after retries:", error);
    return null;
  });

  return {
    title: newsPageSettings.data?.title,
    description: newsPageSettings.data?.description,
    logo: newsPageSettings.data?.logo || newsPageSettings.data?.coverImage,
    cover_image: newsPageSettings.data?.coverImage,
    twitter: "@solana",
    facebook: null,
  };
}

export const extractTags = (posts, limit = undefined) => {
  if (posts) {
    let tags = [];
    posts.forEach((p) => {
      const postTags = p?.data?.tags ? p?.data?.tags : null;
      if (postTags) {
        postTags.forEach((t) => {
          tags = [...tags, t?.tag?.value?.data];
        });
      }
    });
    tags = take(uniqBy(tags, "slug"), limit);
    return tags;
  } else return [];
};

export async function getAuthor(id) {
  const author = await withTimeoutAndRetry(
    builder
      .get("author", {
        includeRefs: true,
        options: {
          noTargeting: true,
        },
        query: {
          id: id,
        },
      })
      .toPromise(),
    8000,
  ).catch((error) => {
    console.error("[getAuthor] Failed after retries:", error);
    return null;
  });

  return author.data || null;
}

export async function getCustomPage(builderModel, slug, locale) {
  const page = await getPost(
    {
      "data.slug": { $eq: slug },
    },
    locale,
    builderModel,
  );

  return {
    page,
  };
}

export async function getAllCustomSlugs(path) {
  let postCount = 0;
  let Post = [];

  const getAllPosts = async (offset = 0, builderModel) => {
    const posts = (await getPostSlugs(offset, builderModel))?.map(
      (p) => `${path}/${p?.data?.slug}`,
    );

    Post = Post.concat(posts);
    postCount = postCount + posts.length;

    if (builderLimit > posts.length) {
      return postCount;
    } else {
      await getAllPosts(postCount);
    }

    return Post;
  };

  return getAllPosts();
}
