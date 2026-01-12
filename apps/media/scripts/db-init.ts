#!/usr/bin/env node

/**
 * Database Initialization Script
 *
 * Indexes all content files into the Tina database.
 * In local mode: Uses filesystem-based storage
 * In production: Uses Upstash Redis for indexing
 *
 * Usage:
 *   pnpm db:init
 *   TINA_PUBLIC_IS_LOCAL=false pnpm db:init  # Force production mode
 */

import fs from "fs";
import path from "path";
import { Redis } from "@upstash/redis";
import { RedisLevel } from "upstash-redis-level";

const isLocalMode = process.env.TINA_PUBLIC_IS_LOCAL === "true";

// Content directories to index
const CONTENT_DIRS = [
  "content/authors",
  "content/categories",
  "content/ctas",
  "content/global",
  "content/links",
  "content/podcasts",
  "content/posts",
  "content/switchbacks",
  "content/tags",
];

// File extensions to index
const CONTENT_EXTENSIONS = [".md", ".mdx", ".json"];

interface ContentFile {
  path: string;
  relativePath: string;
  content: string;
  collection: string;
}

/**
 * Find all content files in a directory
 */
function findContentFiles(
  dir: string,
  basePath: string = ""
): { filePath: string; relativePath: string }[] {
  const results: { filePath: string; relativePath: string }[] = [];
  const fullPath = path.join(process.cwd(), dir);

  if (!fs.existsSync(fullPath)) {
    console.log(`  Skipping ${dir} (not found)`);
    return results;
  }

  const items = fs.readdirSync(fullPath, { withFileTypes: true });

  for (const item of items) {
    const itemPath = path.join(fullPath, item.name);
    const relPath = basePath ? `${basePath}/${item.name}` : item.name;

    if (item.isDirectory()) {
      results.push(...findContentFiles(path.join(dir, item.name), relPath));
    } else if (
      item.isFile() &&
      CONTENT_EXTENSIONS.some((ext) => item.name.endsWith(ext))
    ) {
      results.push({ filePath: itemPath, relativePath: relPath });
    }
  }

  return results;
}

/**
 * Read and parse a content file
 */
function readContentFile(
  filePath: string,
  relativePath: string,
  collection: string
): ContentFile {
  const content = fs.readFileSync(filePath, "utf-8");
  return {
    path: filePath,
    relativePath,
    content,
    collection,
  };
}

/**
 * Get collection name from directory path
 */
function getCollectionName(dir: string): string {
  const parts = dir.split("/");
  const name = parts[parts.length - 1];

  // Map directory names to collection names
  const collectionMap: Record<string, string> = {
    authors: "author",
    categories: "category",
    ctas: "cta",
    global: "global",
    links: "link",
    podcasts: "podcast",
    posts: "post",
    switchbacks: "switchback",
    tags: "tag",
  };

  return collectionMap[name] || name;
}

/**
 * Index content files to Redis
 */
async function indexToRedis(files: ContentFile[]): Promise<void> {
  console.log("\nConnecting to Redis...");

  const redis = new Redis({
    url: process.env.KV_REST_API_URL!,
    token: process.env.KV_REST_API_TOKEN!,
  });

  const level = new RedisLevel({
    redis,
    namespace: "tina",
  });

  console.log("Indexing files to Redis...\n");

  let indexed = 0;
  let errors = 0;

  for (const file of files) {
    try {
      // Create a key based on collection and file path
      const key = `content:${file.collection}:${file.relativePath}`;

      // Store the content
      await level.put(key, file.content);

      indexed++;
      process.stdout.write(`\r  Indexed: ${indexed}/${files.length}`);
    } catch (error) {
      errors++;
      console.error(`\n  Error indexing ${file.relativePath}:`, error);
    }
  }

  console.log(`\n\nIndexing complete!`);
  console.log(`  - Indexed: ${indexed} files`);
  console.log(`  - Errors: ${errors} files`);

  // Close the connection
  await level.close();
}

/**
 * Index content files to local filesystem database
 */
async function indexToLocal(files: ContentFile[]): Promise<void> {
  console.log("\nLocal mode: Content is read directly from filesystem.");
  console.log("No indexing required.\n");
  console.log(`Found ${files.length} content files ready for use.`);
}

/**
 * Main function
 */
async function main(): Promise<void> {
  console.log("╔══════════════════════════════════════════════════════════╗");
  console.log("║           Tina CMS Database Initialization               ║");
  console.log("╚══════════════════════════════════════════════════════════╝\n");

  console.log(
    `Mode: ${isLocalMode ? "Local (filesystem)" : "Production (Redis)"}\n`
  );

  // Collect all content files
  console.log("Scanning content directories...");
  const allFiles: ContentFile[] = [];

  for (const dir of CONTENT_DIRS) {
    const collection = getCollectionName(dir);
    const files = findContentFiles(dir);

    console.log(`  ${dir}: ${files.length} files`);

    for (const { filePath, relativePath } of files) {
      const file = readContentFile(filePath, relativePath, collection);
      allFiles.push(file);
    }
  }

  console.log(`\nTotal: ${allFiles.length} content files\n`);

  if (allFiles.length === 0) {
    console.log("No content files found. Nothing to index.");
    return;
  }

  // Index based on mode
  if (isLocalMode) {
    await indexToLocal(allFiles);
  } else {
    // Validate Redis configuration
    if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
      console.error(
        "Error: KV_REST_API_URL and KV_REST_API_TOKEN are required for production mode."
      );
      console.error(
        "Set TINA_PUBLIC_IS_LOCAL=true to use local filesystem mode."
      );
      process.exit(1);
    }

    await indexToRedis(allFiles);
  }

  console.log("\nDone!");
}

// Run the script
main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
