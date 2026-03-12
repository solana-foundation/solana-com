#!/usr/bin/env node

/**
 * Script to replace Builder.io CDN URLs with local file paths in MDX files
 * based on the manifest.json mapping
 */

const fs = require("fs");
const path = require("path");

const MANIFEST_PATH = path.join(__dirname, "../builder/assets/manifest.json");
const MDX_DIR = path.join(__dirname, "../content/landings");

// Load the manifest
const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf-8"));

// Build a lookup map for faster searching
// We need to handle URLs that might have query params in the MDX but not in manifest (or vice versa)
const urlToLocalPath = new Map();

for (const [url, data] of Object.entries(manifest)) {
  if (data.status === "success") {
    urlToLocalPath.set(url, data.localPath);

    // Also add version without query params for matching
    const urlWithoutParams = url.split("?")[0];
    if (!urlToLocalPath.has(urlWithoutParams)) {
      urlToLocalPath.set(urlWithoutParams, data.localPath);
    }
  }
}

// Function to find all MDX files recursively
function findMdxFiles(dir) {
  const files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...findMdxFiles(fullPath));
    } else if (entry.name.endsWith(".mdx")) {
      files.push(fullPath);
    }
  }

  return files;
}

// Function to replace Builder URLs in content
function replaceBuilderUrls(content) {
  let modified = content;
  let replacementCount = 0;

  // Pattern to match Builder CDN URLs
  // Matches both cdn.builder.io/api/v1/image/assets and cdn.builder.io/o/assets patterns
  const builderUrlPattern =
    /https:\/\/cdn\.builder\.io\/(?:api\/v1\/(?:image\/)?|o\/)assets[^\s"'\)>]*/g;

  const matches = content.match(builderUrlPattern) || [];

  for (const match of matches) {
    // Try to find in manifest with full URL first
    let localPath = urlToLocalPath.get(match);

    // If not found, try without query params
    if (!localPath) {
      const urlWithoutParams = match.split("?")[0];
      localPath = urlToLocalPath.get(urlWithoutParams);
    }

    // If still not found, try to find a partial match (the asset ID)
    if (!localPath) {
      // Extract the asset ID from the URL
      const assetIdMatch = match.match(
        /([a-f0-9]{32}|[a-f0-9-]{36})(?:\?|$|\/)/,
      );
      if (assetIdMatch) {
        const assetId = assetIdMatch[1];
        // Search through manifest for matching asset ID
        for (const [url, data] of Object.entries(manifest)) {
          if (url.includes(assetId) && data.status === "success") {
            localPath = data.localPath;
            break;
          }
        }
      }
    }

    if (localPath) {
      modified = modified.split(match).join(localPath);
      replacementCount++;
    }
  }

  return { content: modified, replacementCount };
}

// Main execution
console.log("Starting Builder URL replacement...\n");

const mdxFiles = findMdxFiles(MDX_DIR);
console.log(`Found ${mdxFiles.length} MDX files\n`);

let totalReplacements = 0;

for (const file of mdxFiles) {
  const content = fs.readFileSync(file, "utf-8");
  const { content: newContent, replacementCount } = replaceBuilderUrls(content);

  if (replacementCount > 0) {
    fs.writeFileSync(file, newContent, "utf-8");
    const relativePath = path.relative(process.cwd(), file);
    console.log(`✓ ${relativePath}: ${replacementCount} replacement(s)`);
    totalReplacements += replacementCount;
  }
}

console.log(`\nDone! Total replacements: ${totalReplacements}`);
