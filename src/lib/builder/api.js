import { Builder, builder } from "@builder.io/react";
import { BUILDER_CONFIG } from "./builderConstants";

import uniqBy from "lodash/uniqBy";
import take from "lodash/take";

builder.init(BUILDER_CONFIG.apiKey);
builder.apiVersion = "v3";
Builder.isStatic = true;

const builderLimit = 100; // This seems to be the builder limit

export function getPostSlugs(offset = 0, builderModel) {
  return builder.getAll(builderModel, {
    fields: "data.slug", // only request the `data.slug` field
    options: { noTargeting: true },
    apiKey: BUILDER_CONFIG.apiKey,
    limit: builderLimit,
    options: {
      offset: offset,
    },
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
  let posts = await builder.getAll(builderModel, {
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
  let post = await builder
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
    .toPromise();

  return post || null;
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
  return builder.getAll(BUILDER_CONFIG.tagsModel, {
    fields: "data.slug", // only request the `data.slug` field
    options: { noTargeting: true },
    apiKey: BUILDER_CONFIG.apiKey,
    limit: builderLimit,
    options: {
      offset: offset,
    },
  });
}

export async function searchTags(query, offset = 0, limit = 100) {
  let tags = await builder.getAll(BUILDER_CONFIG.tagsModel, {
    limit,
    staleCacheSeconds: 200,
    omit: "data.blocks",
    options: {
      noTargeting: true,
      offset,
      includeRefs: true,
    },
    query,
  });

  return tags;
}

export async function getSingleTag(tag) {
  let post = await builder
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
    .toPromise();

  return post || null;
}

export async function getPostsByTag(tag, builderModel) {
  const tagId = (await searchTags({})).find((t) => tag === t.data.slug)?.id;

  if (!tagId) {
    return null;
  }

  let posts = await builder.getAll(builderModel, {
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
  });

  return posts || null;
}

export async function getPageSettings() {
  const id = BUILDER_CONFIG.pageId;

  // Get news page settings
  const newsPageSettings = await builder
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
    .toPromise();

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
  const author = await builder
    .get("author", {
      includeRefs: true,
      options: {
        noTargeting: true,
      },
      query: {
        id: id,
      },
    })
    .toPromise();

  return author.data || null;
}

export async function getBreakpointPage(builderModel, slug, locale) {
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

export async function getAllBreakpointSlugs() {
  let postCount = 0;
  let Post = [];

  const getAllPosts = async (offset = 0, builderModel) => {
    const posts = (await getPostSlugs(offset, builderModel))?.map(
      (p) => `/breakpoint/${p?.data?.slug}`,
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
