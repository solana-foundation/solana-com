#!/usr/bin/env tsx
/**
 * Remove SEO Fields Migration Script
 *
 * This script removes the `seo` field from all post content files.
 * SEO metadata is now automatically derived from post title, description, and hero image.
 *
 * Usage: npx tsx scripts/remove-seo-fields.tsx
 */

import { readdir, readFile, writeFile } from "fs/promises";
import { join } from "path";

// Configuration
const POSTS_DIR = join(process.cwd(), "content/posts");

// Report data
interface MigrationReport {
  totalFiles: number;
  modifiedFiles: string[];
  skippedFiles: string[];
  errors: { file: string; error: string }[];
}

const report: MigrationReport = {
  totalFiles: 0,
  modifiedFiles: [],
  skippedFiles: [],
  errors: [],
};

/**
 * Parse YAML frontmatter from a markdoc file
 */
function parseFrontmatter(content: string): {
  frontmatter: string;
  body: string;
} {
  const match = content.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) {
    return { frontmatter: "", body: content };
  }
  return { frontmatter: match[1], body: match[2] };
}

/**
 * Remove SEO field from YAML frontmatter
 * Handles multi-line YAML values and nested objects
 */
function removeSeoField(frontmatter: string): string {
  const lines = frontmatter.split("\n");
  const result: string[] = [];
  let inSeoBlock = false;
  let seoIndent = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check if this line starts the seo field
    if (line.match(/^seo:/)) {
      inSeoBlock = true;
      // Find the indentation level of seo
      seoIndent = line.search(/\S/);
      continue; // Skip this line
    }

    // If we're in the seo block, check if we should exit
    if (inSeoBlock) {
      // Empty lines within seo block should be skipped
      if (line.trim() === "") {
        continue;
      }

      // Get current line's indentation
      const currentIndent = line.search(/\S/);

      // If line is indented more than seo, it's part of the seo block
      if (currentIndent === -1 || currentIndent > seoIndent) {
        continue; // Skip this line (part of seo block)
      }

      // We've exited the seo block
      inSeoBlock = false;
    }

    result.push(line);
  }

  return result.join("\n");
}

/**
 * Process a single markdoc file
 */
async function processFile(filePath: string): Promise<boolean> {
  try {
    const content = await readFile(filePath, "utf-8");
    const { frontmatter, body } = parseFrontmatter(content);

    if (!frontmatter) {
      report.skippedFiles.push(filePath);
      return false;
    }

    // Check if file has seo field
    if (!frontmatter.includes("\nseo:") && !frontmatter.startsWith("seo:")) {
      report.skippedFiles.push(filePath);
      return false;
    }

    // Remove seo field
    const newFrontmatter = removeSeoField(frontmatter);

    // Clean up any trailing empty lines in frontmatter
    const cleanedFrontmatter = newFrontmatter.replace(/\n+$/, "");

    // Reconstruct the file
    const newContent = `---\n${cleanedFrontmatter}\n---\n${body}`;

    // Write the file
    await writeFile(filePath, newContent, "utf-8");
    report.modifiedFiles.push(filePath);
    return true;
  } catch (error) {
    report.errors.push({
      file: filePath,
      error: error instanceof Error ? error.message : String(error),
    });
    return false;
  }
}

/**
 * Get all markdoc files in the posts directory
 */
async function getMarkdocFiles(dir: string): Promise<string[]> {
  const files: string[] = [];

  try {
    const entries = await readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = join(dir, entry.name);

      if (entry.isDirectory()) {
        // Recursively process subdirectories
        const subFiles = await getMarkdocFiles(fullPath);
        files.push(...subFiles);
      } else if (entry.name.endsWith(".mdoc")) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error);
  }

  return files;
}

/**
 * Main migration function
 */
async function migrate() {
  console.log("🚀 Starting SEO field removal migration...\n");
  console.log(`📁 Posts directory: ${POSTS_DIR}\n`);

  // Get all markdoc files
  const files = await getMarkdocFiles(POSTS_DIR);
  report.totalFiles = files.length;

  console.log(`Found ${files.length} markdoc files\n`);

  // Process each file
  for (const file of files) {
    const fileName = file.replace(POSTS_DIR + "/", "");
    process.stdout.write(`Processing: ${fileName}...`);

    const modified = await processFile(file);

    if (modified) {
      console.log(" ✅ Modified");
    } else if (report.errors.some((e) => e.file === file)) {
      console.log(" ❌ Error");
    } else {
      console.log(" ⏭️  Skipped (no seo field)");
    }
  }

  // Print report
  console.log("\n" + "=".repeat(60));
  console.log("📊 Migration Report");
  console.log("=".repeat(60));
  console.log(`Total files scanned: ${report.totalFiles}`);
  console.log(`Files modified: ${report.modifiedFiles.length}`);
  console.log(`Files skipped: ${report.skippedFiles.length}`);
  console.log(`Errors: ${report.errors.length}`);

  if (report.errors.length > 0) {
    console.log("\n❌ Errors:");
    for (const error of report.errors) {
      console.log(`  - ${error.file}: ${error.error}`);
    }
  }

  if (report.modifiedFiles.length > 0) {
    console.log("\n✅ Modified files:");
    for (const file of report.modifiedFiles) {
      console.log(`  - ${file.replace(POSTS_DIR + "/", "")}`);
    }
  }

  console.log("\n🎉 Migration complete!");
}

// Run the migration
migrate().catch(console.error);
