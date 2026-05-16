import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  accelerateRoutes,
  breakpointRoutes,
  dedupeEntries,
  docsRoutes,
  excludeRedirectSources,
  marketingRoutes,
  mediaRoutes,
  templatesRoutes,
  type SitemapEntry,
} from "../../../packages/sitemap/src/index";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(currentDir, "..", "public");
const sitemapOutputPath = path.join(publicDir, "sitemap.xml");

function formatLastModified(value: SitemapEntry["lastModified"]) {
  if (!value) {
    return null;
  }

  return value instanceof Date
    ? value.toISOString()
    : new Date(value).toISOString();
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function serializeEntry(entry: SitemapEntry) {
  const lastModified = formatLastModified(entry.lastModified);
  const lines = ["<url>", `<loc>${escapeXml(entry.url)}</loc>`];

  if (lastModified) {
    lines.push(`<lastmod>${escapeXml(lastModified)}</lastmod>`);
  }

  if (entry.changeFrequency) {
    lines.push(`<changefreq>${entry.changeFrequency}</changefreq>`);
  }

  if (typeof entry.priority === "number") {
    lines.push(`<priority>${entry.priority.toFixed(1)}</priority>`);
  }

  lines.push("</url>");

  return lines.join("\n");
}

async function generateSitemap() {
  const routeGroups = await Promise.all([
    marketingRoutes(),
    docsRoutes(),
    mediaRoutes(),
    templatesRoutes(),
    accelerateRoutes(),
    breakpointRoutes(),
  ]);

  const entries = excludeRedirectSources(
    dedupeEntries(routeGroups.flat()),
  ).sort((left, right) => left.url.localeCompare(right.url));

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries.map(serializeEntry),
    "</urlset>",
    "",
  ].join("\n");

  await fs.mkdir(publicDir, { recursive: true });
  await fs.writeFile(sitemapOutputPath, xml, "utf8");

  console.log(
    `Generated ${entries.length} sitemap entries at ${sitemapOutputPath}`,
  );
}

generateSitemap().catch((error) => {
  console.error("Failed to generate sitemap", error);
  process.exitCode = 1;
});
