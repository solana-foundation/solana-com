/**
 * Builder.io Paths Fetcher Script
 *
 * Fetches all page paths from Builder.io and outputs them.
 * Run with: npx tsx scripts/get-builder-paths.ts
 */

import { builder } from "@builder.io/react";

// Configuration
const BUILDER_API_KEY =
  process.env.NEXT_PUBLIC_BUILDER_API_KEY || "ce0c7323a97a4d91bd0baa7490ec9139";
const BUILDER_MODEL = "section-page";

// Initialize Builder
builder.init(BUILDER_API_KEY);
builder.apiVersion = "v3";

async function getAllPaths(): Promise<string[]> {
  try {
    const pages = await builder.getAll(BUILDER_MODEL, {
      options: {
        noTargeting: true,
      },
      apiKey: BUILDER_API_KEY,
      fields: "data.slug,data.url",
      limit: 100, // Fetch up to 100 pages
      includeUnpublished: true,
    });

    const paths = pages
      .map((page) => {
        const slug = page.data?.slug || page.data?.url;
        if (!slug) return null;
        // Ensure path starts with /
        return slug.startsWith("/") ? slug : `/${slug}`;
      })
      .filter((path): path is string => path !== null)
      .sort();

    return paths;
  } catch (error) {
    console.error("Error fetching paths:", (error as Error).message);
    return [];
  }
}

async function main() {
  console.log("Fetching all paths from Builder.io...\n");
  console.log(`API Key: ${BUILDER_API_KEY.substring(0, 8)}...`);
  console.log(`Model: ${BUILDER_MODEL}\n`);

  const paths = await getAllPaths();

  console.log(`Found ${paths.length} paths:\n`);

  // Output as array format for easy copy-paste
  console.log("const ROUTES = [");
  for (const path of paths) {
    console.log(`  "${path}",`);
  }
  console.log("];");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Failed:", error);
    process.exit(1);
  });
