#!/usr/bin/env node
/**
 * Script to fix missing closing braces in MDX object props
 * Pattern: prop={{ ... } (missing second })
 */

const fs = require("fs");
const path = require("path");

const MDX_DIR = path.join(__dirname, "..", "content", "landings");

function fixMissingClosingBraces(content) {
  const lines = content.split("\n");
  const fixedLines = [];

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // Pattern: prop={{ value: "..." } at end of line (missing second })
    // Look for lines ending with } that have unbalanced {{ in them
    if (line.includes("={{") && line.trimEnd().endsWith("}")) {
      // Count opening {{ and closing }}
      const doubleOpen = (line.match(/\{\{/g) || []).length;
      const doubleClose = (line.match(/\}\}/g) || []).length;

      if (doubleOpen > doubleClose) {
        // Missing closing braces
        const missing = doubleOpen - doubleClose;
        // Add the missing closing braces
        line = line.trimEnd() + "}".repeat(missing);
        console.log(`  Fixed line ${i + 1}: added ${missing} closing brace(s)`);
      }
    }

    fixedLines.push(line);
  }

  return fixedLines.join("\n");
}

function processFile(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  const fixed = fixMissingClosingBraces(content);

  if (content !== fixed) {
    fs.writeFileSync(filePath, fixed, "utf-8");
    console.log(`Fixed: ${path.relative(MDX_DIR, filePath)}`);
    return true;
  }
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

console.log("Fixing missing closing braces in MDX files...\n");
const count = walkDir(MDX_DIR);
console.log(`\nFixed ${count} files`);
