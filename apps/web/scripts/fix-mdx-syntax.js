#!/usr/bin/env node
/**
 * Script to fix MDX syntax issues:
 * 1. Fix object props: image={ src: -> image={{ src:
 * 2. Fix numeric props: space=30 -> space={30}
 * 3. Fix boolean props without value: featured -> featured={true}
 */

const fs = require("fs");
const path = require("path");

const MDX_DIR = path.join(__dirname, "..", "content", "landings");

function fixMdxSyntax(content) {
  let fixed = content;

  // Fix object props that are missing the outer braces
  // Pattern: prop={ key: "value" } -> prop={{ key: "value" }}
  // Match: ={\s*\w+:\s* (object literal start)
  fixed = fixed.replace(/=\{\s*([a-zA-Z_][a-zA-Z0-9_]*):/g, (match, key) => {
    // Check if it's already double braced or is a template literal
    if (match.startsWith("={{") || match.includes("`")) {
      return match;
    }
    return `={{ ${key}:`;
  });

  // Fix closing braces for object props - find } followed by newline or prop end
  // This is tricky, so let's be more specific
  // Look for patterns like: alt: "" } -> alt: "" }}
  fixed = fixed.replace(/(""\s*)\}(\s*\n)/g, "$1}}$2");
  fixed = fixed.replace(/(""\s*)\}(\s*\/?>)/g, "$1}}$2");

  // Fix numeric props: space=30 -> space={30}, numCols=3 -> numCols={3}
  fixed = fixed.replace(/(\s)(\w+)=(\d+)(\s|\/?>|\n)/g, "$1$2={$3}$4");

  // Fix boolean props without value: featured -> featured={true}
  // Be careful not to match props that have values
  fixed = fixed.replace(/(\s)(featured)(\s*\n|\s*\/?>)/g, "$1$2={true}$3");
  fixed = fixed.replace(/(\s)(hideBackground)(\s*\n|\s+\w)/g, "$1$2={true}$3");
  fixed = fixed.replace(/(\s)(centered)(\s*\n|\s*\/?>)/g, "$1$2={true}$3");

  return fixed;
}

function processFile(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  const fixed = fixMdxSyntax(content);

  if (content !== fixed) {
    fs.writeFileSync(filePath, fixed, "utf-8");
    console.log(`Fixed: ${path.relative(MDX_DIR, filePath)}`);
    return true;
  }
  console.log(`No changes: ${path.relative(MDX_DIR, filePath)}`);
  return false;
}

function walkDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let fixedCount = 0;

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      fixedCount += walkDir(fullPath);
    } else if (entry.name.endsWith(".mdx")) {
      if (processFile(fullPath)) {
        fixedCount++;
      }
    }
  }

  return fixedCount;
}

console.log("Fixing MDX syntax in", MDX_DIR);
const count = walkDir(MDX_DIR);
console.log(`\nFixed ${count} files`);
