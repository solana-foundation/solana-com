import { Builder, builder } from "@builder.io/react";
import { PAGE_BUILDER_CONFIG } from "./constants";

builder.init(PAGE_BUILDER_CONFIG.apiKey);
builder.apiVersion = "v3";
Builder.isStatic = true;

const withTimeout = (promise, ms) =>
  Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(
        () => reject(new Error(`Builder.io request timeout after ${ms}ms`)),
        ms,
      ),
    ),
  ]);

export async function getAllPagesWithSlug() {
  try {
    return await withTimeout(
      builder.getAll(PAGE_BUILDER_CONFIG.pagesModel, {
        options: {
          noTargeting: true,
          cache: "force-cache",
        },
        apiKey: PAGE_BUILDER_CONFIG.apiKey,
        fields: "data",
      }),
      5000,
    );
  } catch (error) {
    console.error("[getAllPagesWithSlug] Error:", error.message);
    return [];
  }
}

export async function getPage(slug, locale) {
  try {
    const slugs = slug === "/" ? "/" : { $in: [slug, `/${slug}`] };

    const page = await withTimeout(
      builder
        .get(PAGE_BUILDER_CONFIG.pagesModel, {
          includeRefs: true,
          staleCacheSeconds: 60,
          userAttributes: {
            urlPath: slug,
            locale,
          },
          options: {
            locale: locale,
            noTargeting: true,
          },
          query: {
            "data.slug": slugs,
          },
        })
        .toPromise(),
      8000,
    );

    return page || null;
  } catch (error) {
    console.error("[getPage] Error:", {
      slug,
      locale,
      error: error.message,
    });
    return null;
  }
}
