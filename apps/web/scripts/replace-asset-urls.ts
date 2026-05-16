/**
 * Replace Builder CDN URLs in JSON files with local asset paths
 *
 * Usage: npx tsx scripts/replace-asset-urls.ts
 */

import fs from "fs";
import path from "path";

const BUILDER_DIR = path.join(process.cwd(), "builder");
const MANIFEST_PATH = path.join(BUILDER_DIR, "assets", "manifest.json");
const SECTION_PAGE_DIR = path.join(BUILDER_DIR, "section-page");

interface ManifestEntry {
  localPath: string;
  status: string;
}

type Manifest = Record<string, ManifestEntry>;

function loadManifest(): Manifest {
  const content = fs.readFileSync(MANIFEST_PATH, "utf-8");
  return JSON.parse(content);
}

function replaceUrlsInObject(
  obj: unknown,
  manifest: Manifest,
  stats: { replaced: number; notFound: string[] },
): unknown {
  if (typeof obj === "string") {
    // Check if this string contains a Builder CDN URL
    if (obj.includes("cdn.builder.io")) {
      // Try exact match first
      if (manifest[obj]) {
        if (manifest[obj].status === "success") {
          stats.replaced++;
          return manifest[obj].localPath;
        }
      }

      // Try matching without query params
      const urlWithoutQuery = obj.split("?")[0];
      if (manifest[urlWithoutQuery]) {
        if (manifest[urlWithoutQuery].status === "success") {
          stats.replaced++;
          return manifest[urlWithoutQuery].localPath;
        }
      }

      // Try finding a partial match (URL might have different query params)
      for (const [cdnUrl, entry] of Object.entries(manifest)) {
        const cdnUrlWithoutQuery = cdnUrl.split("?")[0];
        if (
          cdnUrlWithoutQuery === urlWithoutQuery &&
          entry.status === "success"
        ) {
          stats.replaced++;
          return entry.localPath;
        }
      }

      // URL not in manifest
      if (!stats.notFound.includes(obj)) {
        stats.notFound.push(obj);
      }
    }
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => replaceUrlsInObject(item, manifest, stats));
  }

  if (obj !== null && typeof obj === "object") {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      result[key] = replaceUrlsInObject(value, manifest, stats);
    }
    return result;
  }

  return obj;
}

function processJsonFile(
  filePath: string,
  manifest: Manifest,
  stats: { replaced: number; notFound: string[] },
): void {
  const content = fs.readFileSync(filePath, "utf-8");
  const json = JSON.parse(content);

  const updatedJson = replaceUrlsInObject(json, manifest, stats);

  fs.writeFileSync(filePath, JSON.stringify(updatedJson, null, 2));
}

async function main(): Promise<void> {
  console.log("Loading asset manifest...");
  const manifest = loadManifest();
  const manifestSize = Object.keys(manifest).length;
  console.log(`Loaded ${manifestSize} asset mappings`);

  const stats = {
    replaced: 0,
    notFound: [] as string[],
  };

  // Process all JSON files in section-page directory
  const locales = fs.readdirSync(SECTION_PAGE_DIR);
  let filesProcessed = 0;

  for (const locale of locales) {
    const localeDir = path.join(SECTION_PAGE_DIR, locale);
    const stat = fs.statSync(localeDir);

    if (!stat.isDirectory()) continue;

    const jsonFiles = fs
      .readdirSync(localeDir)
      .filter((f) => f.endsWith(".json"));

    for (const jsonFile of jsonFiles) {
      const filePath = path.join(localeDir, jsonFile);
      processJsonFile(filePath, manifest, stats);
      filesProcessed++;
    }
  }

  console.log("\n=== URL Replacement Complete ===");
  console.log(`Files processed: ${filesProcessed}`);
  console.log(`URLs replaced: ${stats.replaced}`);

  if (stats.notFound.length > 0) {
    console.log(`\nURLs not found in manifest (${stats.notFound.length}):`);
    // Only show first 10
    stats.notFound.slice(0, 10).forEach((url) => {
      console.log(`  - ${url.substring(0, 80)}...`);
    });
    if (stats.notFound.length > 10) {
      console.log(`  ... and ${stats.notFound.length - 10} more`);
    }
  }
}

main().catch(console.error);
