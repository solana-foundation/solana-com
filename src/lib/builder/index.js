import { builder } from "@builder.io/react";
import { BUILDER_CONFIG } from "./builderConstants";

builder.init(BUILDER_CONFIG.apiKey);
builder.apiVersion = "v3";

export async function getBuilderSinglePost(postSlug) {
  return builder
    .get("article", {
      includeRefs: true,
      userAttributes: {
        urlPath: "/news/" + postSlug,
      },
    })
    .toPromise();
}

//
export async function getBuilderPostsPage(pageNumber = 1) {
  return builder.getAll("article", {
    options: { includeRefs: true, noTargeting: true },
    omit: "data.blocks",
    limit: 3,
    offset: pageNumber - 1,
  });
}

//
export async function getBuilderFeaturedPosts() {
  return builder.getAll("article", {
    options: { includeRefs: true, noTargeting: true },
    omit: "data.blocks",
    limit: 3,
  });
}

//
export async function getBuilderSingleTag(tagSlug) {
  return builder
    .get("entity-blog-tags", {
      query: {
        "data.slug": tagSlug,
      },
    })
    .toPromise();
}

//
export async function getBuilderPostsByTag(tag) {
  return builder.getAll("article", {
    options: { includeRefs: true, noTargeting: true },
    query: {
      "data.tags.$in": [tag],
    },
    omit: "data.blocks",
  });
}

//
export async function getBuilderPostSlugs({ limit = 0 }) {
  const posts = await builder.getAll("article", {
    fields: "data.url", // only request the `data.url` field
    options: { noTargeting: true },
    limit: limit,
  });

  return posts;
}
