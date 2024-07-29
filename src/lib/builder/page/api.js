import { Builder, builder } from "@builder.io/react";
import { PAGE_BUILDER_CONFIG } from "./constants";

builder.init(PAGE_BUILDER_CONFIG.apiKey);
Builder.isStatic = true;

export async function getAllPagesWithSlug() {
  return builder.getAll(PAGE_BUILDER_CONFIG.pagesModel, {
    options: { noTargeting: true },
    apiKey: PAGE_BUILDER_CONFIG.apiKey,
    fields: "data",
  });
}

export async function getPage(slug, locale) {
  const slugs = slug === "/" ? "/" : { $in: [slug, `/${slug}`] };

  let page = await builder
    .get(PAGE_BUILDER_CONFIG.pagesModel, {
      includeRefs: true,
      staleCacheSeconds: 20,
      userAttributes: {
        urlPath: slug,
        locale,
      },
      options: {
        locale: locale,
      },
      query: {
        data: {
          slug: slugs,
        },
      },
    })
    .toPromise();

  return page || null;
}
