import { Builder, builder } from "@builder.io/react";
import { PAGE_BUILDER_CONFIG } from "./constants";

builder.init(PAGE_BUILDER_CONFIG.apiKey);
builder.apiVersion = "v3";
Builder.isStatic = true;

// Enhanced retry with exponential backoff
const withRetry = async (fn, maxRetries = 3, baseDelay = 1000) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      console.warn(
        `Builder.io page request attempt ${attempt} failed:`,
        error.message,
      );

      if (attempt === maxRetries) {
        throw error;
      }

      const delay = baseDelay * Math.pow(2, attempt - 1);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

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
    return await withRetry(async () => {
      return await withTimeout(
        builder.getAll(PAGE_BUILDER_CONFIG.pagesModel, {
          options: {
            noTargeting: true,
            cache: "force-cache",
          },
          apiKey: PAGE_BUILDER_CONFIG.apiKey,
          fields: "data",
        }),
        10000, // Increased timeout
      );
    });
  } catch (error) {
    console.error("[getAllPagesWithSlug] Error:", error.message);
    return []; // Return empty array as fallback
  }
}

export async function getPage(slug, locale) {
  try {
    const slugs = slug === "/" ? "/" : { $in: [slug, `/${slug}`] };

    const page = await withRetry(async () => {
      return await withTimeout(
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
        10000, // Increased timeout
      );
    });

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
