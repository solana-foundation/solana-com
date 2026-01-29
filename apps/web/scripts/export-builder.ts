/**
 * Builder.io Content Export Script
 *
 * Exports all Builder.io section-page content to local JSON files.
 * Run with: npx tsx scripts/export-builder.ts
 */

import { Builder, builder } from "@builder.io/react";
import * as fs from "fs";
import * as path from "path";
import * as https from "https";

// Configuration
const BUILDER_API_KEY =
  process.env.NEXT_PUBLIC_BUILDER_API_KEY || "ce0c7323a97a4d91bd0baa7490ec9139";
const BUILDER_MODEL = "section-page";

// Initialize Builder
builder.init(BUILDER_API_KEY);
builder.apiVersion = "v3";
Builder.isStatic = true;

// All routes to export (unpublished routes only)
const ROUTES = [
  "/case-studies",
  "/developers/evm-to-svm/erc-X",
  "/developers/moving-to-svm",
  "/developers/moving-to-svm/cosmwasm",
  "/solutions/defi",
  "/solutions/depin",
  "/solutions/loyalty",
  "/solutions/payments-and-commerce",
  "/translation-testing",
  // Previously exported (published) routes:
  // "/",
  // "/2024outlook",
  // "/analytics/topledger",
  // "/art-basel",
  // "/community/foundation-fellows",
  // "/community/report-2024-newsletter-sign-up",
  // "/demo-page",
  // "/developers/dao",
  // "/developers/defi",
  // "/developers/evm-to-svm",
  // "/developers/evm-to-svm/accounts",
  // "/developers/evm-to-svm/client-differences",
  // "/developers/evm-to-svm/complete-guide",
  // "/developers/evm-to-svm/consensus",
  // "/developers/evm-to-svm/eip2612",
  // "/developers/evm-to-svm/erc20",
  // "/developers/evm-to-svm/erc3643",
  // "/developers/evm-to-svm/erc4337",
  // "/developers/evm-to-svm/erc4626",
  // "/developers/evm-to-svm/erc721",
  // "/developers/evm-to-svm/smart-contracts",
  // "/developers/gaming",
  // "/developers/nfts",
  // "/developers/payments",
  // "/local-sandbox",
  // "/privacy-policy",
  // "/pyusd",
  // "/research",
  // "/rpc",
  // "/solutions",
  // "/solutions/actions",
  // "/solutions/actions/shhh",
  // "/solutions/artists-creators",
  // "/solutions/commerce-tooling",
  // "/solutions/digital-assets",
  // "/solutions/enterprise",
  // "/solutions/enterprise-2",
  // "/solutions/financial-infrastructure",
  // "/solutions/financial-institutions",
  // "/solutions/games-tooling",
  // "/solutions/gaming-and-entertainment",
  // "/solutions/payments-tooling",
  // "/solutions/payments-tooling-old",
  // "/solutions/real-world-assets",
  // "/solutions/request-for-startups",
  // "/solutions/solana-permissioned-environments",
  // "/solutions/token-extensions",
  // "/staking",
  // "/tokenized-equities",
  // "/tos",
  // "/wallets",
];

// Supported locales
const LOCALES = [
  "en",
  "ar",
  "de",
  "el",
  "es",
  "fi",
  "fr",
  "id",
  "it",
  "ja",
  "ko",
  "nl",
  "pl",
  "pt",
  "ru",
  "tr",
  "uk",
  "vi",
  "zh",
];

// Output directories
const OUTPUT_DIR = path.join(process.cwd(), "builder", "section-page");
const ASSETS_DIR = path.join(process.cwd(), "public", "src", "img", "landings");
const MANIFEST_PATH = path.join(
  process.cwd(),
  "builder",
  "assets",
  "manifest.json",
);

// Asset manifest to track downloaded files
const assetManifest: Record<
  string,
  { localPath: string; status: "success" | "failed" }
> = {};

// Retry with exponential backoff
async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000,
): Promise<T> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }
      const delay = baseDelay * Math.pow(2, attempt - 1);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw new Error("Max retries exceeded");
}

// Timeout wrapper
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`Request timeout after ${ms}ms`)), ms),
    ),
  ]);
}

// Download a file
async function downloadFile(url: string, destPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);
    const request = https.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        const redirectUrl = response.headers.location;
        if (redirectUrl) {
          file.close();
          try {
            fs.unlinkSync(destPath);
          } catch {}
          downloadFile(redirectUrl, destPath).then(resolve).catch(reject);
          return;
        }
      }
      if (response.statusCode !== 200) {
        file.close();
        try {
          fs.unlinkSync(destPath);
        } catch {}
        reject(new Error(`HTTP ${response.statusCode}`));
        return;
      }
      response.pipe(file);
      file.on("finish", () => {
        file.close();
        resolve();
      });
    });
    request.on("error", (err) => {
      file.close();
      try {
        fs.unlinkSync(destPath);
      } catch {}
      reject(err);
    });
    request.setTimeout(30000, () => {
      request.destroy();
      reject(new Error("Download timeout"));
    });
  });
}

// Sanitize filename
function sanitizeFilename(url: string): string {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    let filename = pathname.split("/").pop() || "image";
    filename = filename.split("?")[0];
    if (!filename.includes(".")) {
      filename += ".png";
    }
    return filename.replace(/[^a-zA-Z0-9._-]/g, "_");
  } catch {
    return "image_" + Date.now() + ".png";
  }
}

// Extract CDN URLs from content
function extractCdnUrls(obj: any, urls: Set<string> = new Set()): Set<string> {
  if (!obj) return urls;
  if (typeof obj === "string") {
    if (obj.includes("cdn.builder.io")) {
      urls.add(obj);
    }
    return urls;
  }
  if (Array.isArray(obj)) {
    for (const item of obj) {
      extractCdnUrls(item, urls);
    }
    return urls;
  }
  if (typeof obj === "object") {
    for (const value of Object.values(obj)) {
      extractCdnUrls(value, urls);
    }
  }
  return urls;
}

// Fetch page content from Builder using SDK
async function fetchPage(slug: string, locale: string): Promise<any> {
  const builderLocale = locale === "en" ? "Default" : locale;
  const normalizedSlug = slug.startsWith("/") ? slug.slice(1) : slug;
  const querySlug =
    slug === "/" ? "/" : { $in: [normalizedSlug, `/${normalizedSlug}`, slug] };

  try {
    const page = await withRetry(async () => {
      return await withTimeout(
        builder
          .get(BUILDER_MODEL, {
            includeRefs: true,
            staleCacheSeconds: 60,
            userAttributes: {
              urlPath: slug,
              locale: builderLocale,
            },
            options: {
              locale: builderLocale,
              noTargeting: true,
            },
            query: {
              "data.slug": querySlug,
            },
            includeUnpublished: true,
          })
          .toPromise(),
        15000,
      );
    });

    return page || null;
  } catch {
    return null;
  }
}

// Get all pages from Builder
async function getAllPages(): Promise<any[]> {
  try {
    const pages = await withRetry(async () => {
      return await withTimeout(
        builder.getAll(BUILDER_MODEL, {
          options: {
            noTargeting: true,
          },
          apiKey: BUILDER_API_KEY,
          fields: "data.slug",
          limit: 100,
          includeUnpublished: true,
        }),
        30000,
      );
    });
    return pages || [];
  } catch (error) {
    console.error("Error fetching all pages:", (error as Error).message);
    return [];
  }
}

// Convert slug to filename
function slugToFilename(slug: string): string {
  if (slug === "/") return "index";
  return slug.replace(/^\//, "").replace(/\//g, "-");
}

// Ensure directory exists
function ensureDir(dir: string): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Download all assets from exported content
async function downloadAssets(): Promise<void> {
  console.log("\n=== Downloading Assets ===\n");

  ensureDir(ASSETS_DIR);
  ensureDir(path.dirname(MANIFEST_PATH));

  // Collect all CDN URLs from exported JSON files
  const allUrls = new Set<string>();

  if (!fs.existsSync(OUTPUT_DIR)) {
    console.log("No exported content found. Skipping asset download.");
    return;
  }

  const localesDirs = fs.readdirSync(OUTPUT_DIR);
  for (const locale of localesDirs) {
    const localeDir = path.join(OUTPUT_DIR, locale);
    if (!fs.statSync(localeDir).isDirectory()) continue;

    const files = fs.readdirSync(localeDir).filter((f) => f.endsWith(".json"));
    for (const file of files) {
      try {
        const content = JSON.parse(
          fs.readFileSync(path.join(localeDir, file), "utf-8"),
        );
        extractCdnUrls(content, allUrls);
      } catch (e) {
        console.error(`Error reading ${file}:`, (e as Error).message);
      }
    }
  }

  console.log(`Found ${allUrls.size} unique CDN URLs`);

  let downloaded = 0;
  let failed = 0;
  let skipped = 0;

  for (const url of allUrls) {
    const filename = sanitizeFilename(url);
    const destPath = path.join(ASSETS_DIR, filename);
    const relativePath = `/src/img/landings/${filename}`;

    // Skip if already downloaded
    if (fs.existsSync(destPath)) {
      assetManifest[url] = { localPath: relativePath, status: "success" };
      skipped++;
      continue;
    }

    try {
      await downloadFile(url, destPath);
      assetManifest[url] = { localPath: relativePath, status: "success" };
      downloaded++;
      process.stdout.write(".");
    } catch {
      assetManifest[url] = { localPath: relativePath, status: "failed" };
      failed++;
    }
  }

  // Save manifest
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(assetManifest, null, 2));
  console.log(
    `\n\nAssets: ${downloaded} downloaded, ${skipped} skipped (existing), ${failed} failed`,
  );
  console.log(`Manifest saved to: ${MANIFEST_PATH}`);
}

// Main export function
async function exportBuilderContent(): Promise<void> {
  console.log("=== Builder.io Content Export ===\n");
  console.log(`API Key: ${BUILDER_API_KEY.substring(0, 8)}...`);
  console.log(`Model: ${BUILDER_MODEL}`);
  console.log(`Routes: ${ROUTES.length}`);
  console.log(`Locales: ${LOCALES.length}`);
  console.log(`Output: ${OUTPUT_DIR}\n`);

  ensureDir(OUTPUT_DIR);

  // First, get all pages to see what's actually available
  console.log("Fetching page list from Builder...");
  const allPages = await getAllPages();
  console.log(`Found ${allPages.length} pages in Builder\n`);

  // Create a set of available slugs
  const availableSlugs = new Set<string>();
  for (const p of allPages) {
    if (p.data?.slug) {
      availableSlugs.add(p.data.slug);
      // Also add normalized versions
      if (p.data.slug.startsWith("/")) {
        availableSlugs.add(p.data.slug.slice(1));
      } else {
        availableSlugs.add("/" + p.data.slug);
      }
    }
  }

  console.log(
    "Sample slugs:",
    Array.from(availableSlugs).slice(0, 15).join(", "),
    "...\n",
  );

  let exported = 0;
  let skipped = 0;
  let notFound = 0;

  // Process each route
  for (const route of ROUTES) {
    const normalizedRoute = route.startsWith("/") ? route.slice(1) : route;

    // Check if this route exists in Builder
    const routeExists =
      route === "/" ||
      availableSlugs.has(normalizedRoute) ||
      availableSlugs.has(route) ||
      availableSlugs.has("/" + normalizedRoute);

    if (!routeExists) {
      console.log(`Skipping ${route} - not found in Builder`);
      notFound++;
      continue;
    }

    process.stdout.write(`Processing: ${route}`);

    let foundAny = false;
    for (const locale of LOCALES) {
      const localeDir = path.join(OUTPUT_DIR, locale);
      ensureDir(localeDir);

      const filename = `${slugToFilename(route)}.json`;
      const filepath = path.join(localeDir, filename);

      // Fetch content
      const content = await fetchPage(route, locale);

      if (!content) {
        if (locale === "en") {
          // Try fetching without locale restriction for English
          const fallbackContent = await fetchPage(route, "Default");
          if (fallbackContent) {
            fs.writeFileSync(
              filepath,
              JSON.stringify(fallbackContent, null, 2),
            );
            exported++;
            foundAny = true;
            process.stdout.write(` [${locale}]`);
          }
        }
        continue;
      }

      // Save content
      fs.writeFileSync(filepath, JSON.stringify(content, null, 2));
      exported++;
      foundAny = true;
      process.stdout.write(` [${locale}]`);
    }

    if (!foundAny) {
      skipped++;
      process.stdout.write(" - no content");
    }
    console.log();
  }

  console.log("\n=== Export Summary ===");
  console.log(`Exported files: ${exported}`);
  console.log(`Routes not in Builder: ${notFound}`);
  console.log(`Routes with no content: ${skipped}`);

  // Download assets after export
  if (exported > 0) {
    await downloadAssets();
  }
}

// Run export
exportBuilderContent()
  .then(() => {
    console.log("\nExport complete!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\nExport failed:", error);
    process.exit(1);
  });
