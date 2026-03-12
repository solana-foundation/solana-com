#!/usr/bin/env tsx
/**
 * Convert Content References to Decap CMS Format
 *
 * Converts Keystatic-style full path references (e.g., "content/authors/jon-wong.mdx")
 * to Decap CMS slug-only references (e.g., "jon-wong") across all content collections.
 *
 * Affected fields:
 *   - posts:       author, categories[].category, tags[].tag, cta, switchback
 *   - podcasts:    category, hosts[].host
 *   - links:       categories[].category, tags[].tag
 *
 * Usage: npx tsx scripts/convert-refs-to-decap.tsx [--dry-run]
 */

import { readdir, readFile, writeFile } from "fs/promises";
import { join, relative } from "path";

const CONTENT_DIR = join(process.cwd(), "content");
const DRY_RUN = process.argv.includes("--dry-run");

// Pattern matching Keystatic collection references: content/{collection}/{slug}.mdx
const REF_PATTERN = /^content\/[a-z]+\/(.+)\.mdx$/;

interface Replacement {
  line: number;
  before: string;
  after: string;
}

interface FileResult {
  file: string;
  replacements: Replacement[];
  error?: string;
}

const report = {
  totalFiles: 0,
  modifiedFiles: 0,
  totalReplacements: 0,
  skippedFiles: 0,
  errors: [] as { file: string; error: string }[],
};

/**
 * Extract slug from a Keystatic collection reference path.
 * "content/authors/jon-wong.mdx" -> "jon-wong"
 * Already a plain slug -> returns as-is
 */
function extractSlug(ref: string): string {
  const match = ref.match(REF_PATTERN);
  if (match) {
    return match[1];
  }
  return ref;
}

/**
 * Check if a string value is a Keystatic-style reference that needs conversion.
 */
function isKestaticRef(value: string): boolean {
  return REF_PATTERN.test(value);
}

/**
 * Process frontmatter lines and convert references.
 * Works line-by-line to preserve formatting, comments, and multiline strings.
 */
function convertFrontmatter(frontmatter: string): {
  converted: string;
  replacements: Replacement[];
} {
  const lines = frontmatter.split("\n");
  const replacements: Replacement[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Match YAML key-value pairs where the value is a Keystatic ref
    // Handles: `key: content/collection/slug.mdx`
    // Handles: `key: "content/collection/slug.mdx"`
    // Handles: `  - category: content/categories/finance.mdx`
    // Handles: `  - host: content/authors/name.mdx`

    // Pattern: any key followed by a Keystatic ref (with optional quotes)
    const kvMatch = line.match(
      /^(\s*[-]?\s*\w+:\s*)"?(content\/[a-z]+\/[^\s"]+\.mdx)"?\s*$/
    );
    if (kvMatch) {
      const prefix = kvMatch[1];
      const refValue = kvMatch[2];
      const slug = extractSlug(refValue);
      const newLine = `${prefix}${slug}`;

      if (newLine !== line) {
        replacements.push({
          line: i + 1,
          before: line.trimStart(),
          after: newLine.trimStart(),
        });
        lines[i] = newLine;
      }
      continue;
    }

    // Also handle the case where the ref is on a line by itself after a key
    // e.g., `author: >-\n  content/authors/name.mdx`
    // This is less common but possible with YAML multiline scalars
    const bareRefMatch = line.match(
      /^(\s+)(content\/[a-z]+\/[^\s"]+\.mdx)\s*$/
    );
    if (bareRefMatch) {
      const indent = bareRefMatch[1];
      const refValue = bareRefMatch[2];
      const slug = extractSlug(refValue);
      const newLine = `${indent}${slug}`;

      if (newLine !== line) {
        replacements.push({
          line: i + 1,
          before: line.trimStart(),
          after: newLine.trimStart(),
        });
        lines[i] = newLine;
      }
    }
  }

  return { converted: lines.join("\n"), replacements };
}

/**
 * Parse frontmatter and body from an MDX file.
 */
function parseFrontmatter(content: string): {
  frontmatter: string;
  body: string;
  hasFrontmatter: boolean;
} {
  const match = content.match(/^---\n([\s\S]*?)\n---(\n[\s\S]*)?$/);
  if (!match) {
    return { frontmatter: "", body: content, hasFrontmatter: false };
  }
  return {
    frontmatter: match[1],
    body: match[2] ?? "",
    hasFrontmatter: true,
  };
}

/**
 * Process a single MDX file.
 */
async function processFile(filePath: string): Promise<FileResult> {
  const relPath = relative(CONTENT_DIR, filePath);
  try {
    const content = await readFile(filePath, "utf-8");
    const { frontmatter, body, hasFrontmatter } = parseFrontmatter(content);

    if (!hasFrontmatter) {
      return { file: relPath, replacements: [] };
    }

    // Check if there are any refs to convert
    if (!frontmatter.includes("content/")) {
      return { file: relPath, replacements: [] };
    }

    const { converted, replacements } = convertFrontmatter(frontmatter);

    if (replacements.length > 0 && !DRY_RUN) {
      const newContent = `---\n${converted}\n---${body}`;
      await writeFile(filePath, newContent, "utf-8");
    }

    return { file: relPath, replacements };
  } catch (error) {
    return {
      file: relPath,
      replacements: [],
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Recursively collect all .mdx files from a directory.
 */
async function collectMdxFiles(dir: string): Promise<string[]> {
  const files: string[] = [];
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        files.push(...(await collectMdxFiles(fullPath)));
      } else if (entry.name.endsWith(".mdx")) {
        files.push(fullPath);
      }
    }
  } catch {
    // Directory doesn't exist or can't be read
  }
  return files;
}

async function main() {
  console.log(
    DRY_RUN
      ? "🔍 DRY RUN — no files will be modified\n"
      : "🚀 Converting Keystatic refs to Decap CMS format...\n"
  );
  console.log(`📁 Content directory: ${CONTENT_DIR}\n`);

  // Collect files from all content subdirectories
  const contentDirs = ["posts", "podcasts", "links", "switchbacks", "ctas"];
  const allFiles: string[] = [];

  for (const dir of contentDirs) {
    const dirPath = join(CONTENT_DIR, dir);
    const files = await collectMdxFiles(dirPath);
    allFiles.push(...files);
    console.log(`  ${dir}/: ${files.length} files`);
  }

  console.log(`\nTotal: ${allFiles.length} files to scan\n`);
  console.log("─".repeat(70));

  report.totalFiles = allFiles.length;

  for (const filePath of allFiles) {
    const result = await processFile(filePath);

    if (result.error) {
      report.errors.push({ file: result.file, error: result.error });
      console.log(`❌ ${result.file}: ${result.error}`);
      continue;
    }

    if (result.replacements.length === 0) {
      report.skippedFiles++;
      continue;
    }

    report.modifiedFiles++;
    report.totalReplacements += result.replacements.length;

    console.log(
      `\n${DRY_RUN ? "📝" : "✅"} ${result.file} (${result.replacements.length} ref${result.replacements.length > 1 ? "s" : ""})`
    );
    for (const r of result.replacements) {
      console.log(`   L${r.line}: ${r.before}`);
      console.log(`      → ${r.after}`);
    }
  }

  // Summary
  console.log("\n" + "═".repeat(70));
  console.log("📊 Summary");
  console.log("═".repeat(70));
  console.log(`Files scanned:    ${report.totalFiles}`);
  console.log(`Files modified:   ${report.modifiedFiles}`);
  console.log(`Files skipped:    ${report.skippedFiles}`);
  console.log(`Total references: ${report.totalReplacements}`);
  console.log(`Errors:           ${report.errors.length}`);

  if (report.errors.length > 0) {
    console.log("\n❌ Errors:");
    for (const e of report.errors) {
      console.log(`  ${e.file}: ${e.error}`);
    }
  }

  if (DRY_RUN) {
    console.log(
      "\n🔍 This was a dry run. Run without --dry-run to apply changes."
    );
  } else {
    console.log("\n🎉 Done!");
  }
}

main().catch(console.error);
