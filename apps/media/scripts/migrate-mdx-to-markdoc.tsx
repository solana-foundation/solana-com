#!/usr/bin/env tsx
/**
 * MDX to Markdoc Migration Script
 *
 * This script converts TinaCMS MDX content files to Keystatic Markdoc format.
 * It handles:
 * - YAML frontmatter preservation and path updates
 * - JSX component to Markdoc tag conversion
 * - Image path reorganization
 * - Reference path format conversion
 */

import { readdir, readFile, writeFile } from "fs/promises";
import { join, basename, extname } from "path";
import { existsSync } from "fs";

// Configuration
const CONTENT_DIR = join(process.cwd(), "content");
const COLLECTIONS = [
  "posts",
  "podcasts",
  "authors",
  "categories",
  "tags",
  "ctas",
  "switchbacks",
  "links",
];

// Report data
interface ConversionReport {
  totalFiles: number;
  convertedFiles: string[];
  skippedFiles: string[];
  errors: { file: string; error: string }[];
  imagePathChanges: { oldPath: string; newPath: string }[];
  warnings: string[];
}

const report: ConversionReport = {
  totalFiles: 0,
  convertedFiles: [],
  skippedFiles: [],
  errors: [],
  imagePathChanges: [],
  warnings: [],
};

/**
 * Convert JSX component syntax to Markdoc tag syntax
 */
function convertJsxToMarkdoc(content: string): string {
  let result = content;

  // Convert self-closing JSX components
  // <ComponentName prop1="value1" prop2={value2} />
  // -> {% componentname prop1="value1" prop2={value2} /%}

  // Handle <tweet id="..." />
  result = result.replace(/<tweet\s+id="([^"]+)"\s*\/>/gi, (_, id) => {
    return `{% tweet id="${id}" /%}`;
  });

  // Handle <iframe src="..." width="..." height="..." allow="..." />
  result = result.replace(
    /<iframe\s+([^>]+)\/>/gi,
    (_, attrs) => {
      const attrStr = attrs.trim();
      return `{% iframe ${attrStr} /%}`;
    }
  );

  // Handle <DateTime format="..." />
  result = result.replace(
    /<DateTime\s+format="([^"]+)"\s*\/>/gi,
    (_, format) => {
      return `{% datetime format="${format}" /%}`;
    }
  );

  // Handle <sup>...</sup> (inline)
  result = result.replace(/<sup>([^<]+)<\/sup>/gi, (_, content) => {
    return `{% sup %}${content}{% /sup %}`;
  });

  // Handle <footnotes footnotes="..." />
  result = result.replace(
    /<footnotes\s+footnotes="([^"]+)"\s*\/>/gi,
    (_, footnotes) => {
      return `{% footnotes footnotes="${footnotes}" /%}`;
    }
  );

  // Handle <BlockQuote authorName="...">...</BlockQuote>
  result = result.replace(
    /<BlockQuote(\s+authorName="([^"]*)")?>([\s\S]*?)<\/BlockQuote>/gi,
    (_, _authorAttr, authorName, content) => {
      const cleanContent = content.trim();
      if (authorName) {
        return `{% blockquote authorName="${authorName}" %}\n${cleanContent}\n{% /blockquote %}`;
      }
      return `{% blockquote %}\n${cleanContent}\n{% /blockquote %}`;
    }
  );

  // Handle <NewsletterSignup placeholder="..." buttonText="...">...</NewsletterSignup>
  result = result.replace(
    /<NewsletterSignup([^>]*)>([\s\S]*?)<\/NewsletterSignup>/gi,
    (_, attrs, content) => {
      const attrStr = attrs.trim();
      const cleanContent = content.trim();
      return `{% newslettersignup ${attrStr} %}\n${cleanContent}\n{% /newslettersignup %}`;
    }
  );

  // Handle <video ... /> (self-closing)
  result = result.replace(/<video\s+([^>]+)\/>/gi, (_, attrs) => {
    return `{% video ${attrs.trim()} /%}`;
  });

  // Handle <video ...>...</video> (with children)
  result = result.replace(
    /<video([^>]*)>([\s\S]*?)<\/video>/gi,
    (_, attrs, _content) => {
      const attrStr = attrs.trim();
      return `{% video ${attrStr} /%}`;
    }
  );

  // Handle <stats title="..." stats={[...]} /> with complex JSON
  result = result.replace(
    /<stats\s+([\s\S]*?)\/>/gi,
    (_match, attrs) => {
      // Parse the attributes
      const titleMatch = attrs.match(/title="([^"]*)"/);
      const descMatch = attrs.match(/description="([^"]*)"/);
      const backgroundMatch = attrs.match(/background="([^"]*)"/);
      const statsMatch = attrs.match(/stats=\{(\[[\s\S]*?\])\}/);

      let markdocAttrs = "";
      if (titleMatch) markdocAttrs += ` title="${titleMatch[1]}"`;
      if (descMatch) markdocAttrs += ` description="${descMatch[1]}"`;
      if (backgroundMatch) markdocAttrs += ` background="${backgroundMatch[1]}"`;
      if (statsMatch) {
        // Convert the JS array syntax to JSON-like format
        const statsJson = statsMatch[1]
          .replace(/(\w+):/g, '"$1":')
          .replace(/'/g, '"');
        markdocAttrs += ` stats='${statsJson}'`;
      }

      return `{% stats${markdocAttrs} /%}`;
    }
  );

  // Handle <gallery background="..." images={[...]} /> with complex JSON
  result = result.replace(
    /<gallery\s+([\s\S]*?)\/>/gi,
    (_match, attrs) => {
      const backgroundMatch = attrs.match(/background="([^"]*)"/);
      const imagesMatch = attrs.match(/images=\{(\[[\s\S]*?\])\}/);

      let markdocAttrs = "";
      if (backgroundMatch) markdocAttrs += ` background="${backgroundMatch[1]}"`;
      if (imagesMatch) {
        const imagesJson = imagesMatch[1]
          .replace(/(\w+):/g, '"$1":')
          .replace(/'/g, '"');
        markdocAttrs += ` images='${imagesJson}'`;
      }

      return `{% gallery${markdocAttrs} /%}`;
    }
  );

  return result;
}

/**
 * Convert TinaCMS reference paths to Keystatic format
 * e.g., "content/authors/john.md" -> "john"
 */
function _convertReferencePath(path: string): string {
  if (!path) return "";
  // Remove "content/<collection>/" prefix and file extension
  return basename(path, extname(path));
}

/**
 * Update frontmatter reference paths
 */
function updateFrontmatterReferences(frontmatter: string): string {
  let result = frontmatter;

  // Update author references
  result = result.replace(
    /^(author:\s*)content\/authors\/(.+)\.(md|mdx)$/gm,
    "$1$2"
  );

  // Update category references in list format
  result = result.replace(
    /^(\s*-\s*category:\s*)content\/categories\/(.+)\.(md|mdx)$/gm,
    "$1$2"
  );

  // Update tag references in list format
  result = result.replace(
    /^(\s*-\s*tag:\s*)content\/tags\/(.+)\.(md|mdx)$/gm,
    "$1$2"
  );

  // Update cta references
  result = result.replace(
    /^(cta:\s*)content\/ctas\/(.+)\.(md|mdx)$/gm,
    "$1$2"
  );
  result = result.replace(/^(cta:\s*)""$/gm, "cta:");

  // Update switchback references
  result = result.replace(
    /^(switchback:\s*)content\/switchbacks\/(.+)\.(md|mdx)$/gm,
    "$1$2"
  );
  result = result.replace(/^(switchback:\s*)""$/gm, "switchback:");

  // Update host references (for podcasts)
  result = result.replace(
    /^(\s*-\s*host:\s*)content\/authors\/(.+)\.(md|mdx)$/gm,
    "$1$2"
  );

  return result;
}

/**
 * Update image paths in frontmatter and content
 */
function updateImagePaths(
  content: string,
  _collection: string
): string {
  let result = content;

  // Image paths are already using /uploads/ format
  // No path changes needed - Keystatic will use the same public path

  return result;
}

/**
 * Parse frontmatter and body from file content
 */
function parseFile(content: string): { frontmatter: string; body: string } {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!frontmatterMatch) {
    return { frontmatter: "", body: content };
  }
  return {
    frontmatter: frontmatterMatch[1],
    body: frontmatterMatch[2],
  };
}

/**
 * Process a single MDX file
 */
async function processFile(
  filePath: string,
  collection: string
): Promise<void> {
  try {
    const content = await readFile(filePath, "utf-8");
    const { frontmatter, body } = parseFile(content);

    // Update frontmatter references
    let newFrontmatter = updateFrontmatterReferences(frontmatter);

    // Update image paths
    newFrontmatter = updateImagePaths(newFrontmatter, collection);

    // Convert JSX to Markdoc in body
    let newBody = convertJsxToMarkdoc(body);
    newBody = updateImagePaths(newBody, collection);

    // Build new content
    const newContent = `---\n${newFrontmatter}\n---\n${newBody}`;

    // Write .mdoc file
    const newFilePath = filePath.replace(/\.mdx?$/, ".mdoc");
    await writeFile(newFilePath, newContent, "utf-8");

    report.convertedFiles.push(filePath);
  } catch (error) {
    report.errors.push({
      file: filePath,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

/**
 * Process all files in a collection directory
 */
async function processCollection(collectionName: string): Promise<void> {
  const collectionPath = join(CONTENT_DIR, collectionName);

  if (!existsSync(collectionPath)) {
    report.warnings.push(`Collection directory not found: ${collectionPath}`);
    return;
  }

  const entries = await readdir(collectionPath, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isFile() && /\.(mdx?|md)$/.test(entry.name)) {
      const filePath = join(collectionPath, entry.name);
      report.totalFiles++;
      await processFile(filePath, collectionName);
    }
  }
}

/**
 * Generate and save the conversion report
 */
async function generateReport(): Promise<void> {
  const reportPath = join(process.cwd(), "migration-report.md");

  let reportContent = `# MDX to Markdoc Migration Report\n\n`;
  reportContent += `Generated: ${new Date().toISOString()}\n\n`;

  reportContent += `## Summary\n\n`;
  reportContent += `- Total files processed: ${report.totalFiles}\n`;
  reportContent += `- Files converted: ${report.convertedFiles.length}\n`;
  reportContent += `- Files skipped: ${report.skippedFiles.length}\n`;
  reportContent += `- Errors: ${report.errors.length}\n`;
  reportContent += `- Warnings: ${report.warnings.length}\n\n`;

  if (report.errors.length > 0) {
    reportContent += `## Errors\n\n`;
    for (const error of report.errors) {
      reportContent += `- **${error.file}**: ${error.error}\n`;
    }
    reportContent += `\n`;
  }

  if (report.warnings.length > 0) {
    reportContent += `## Warnings\n\n`;
    for (const warning of report.warnings) {
      reportContent += `- ${warning}\n`;
    }
    reportContent += `\n`;
  }

  if (report.imagePathChanges.length > 0) {
    reportContent += `## Image Path Changes\n\n`;
    for (const change of report.imagePathChanges) {
      reportContent += `- \`${change.oldPath}\` → \`${change.newPath}\`\n`;
    }
    reportContent += `\n`;
  }

  reportContent += `## Converted Files\n\n`;
  for (const file of report.convertedFiles) {
    reportContent += `- ${file}\n`;
  }

  await writeFile(reportPath, reportContent, "utf-8");
  console.log(`\nReport saved to: ${reportPath}`);
}

/**
 * Main migration function
 */
async function migrate(): Promise<void> {
  console.log("Starting MDX to Markdoc migration...\n");

  for (const collection of COLLECTIONS) {
    console.log(`Processing collection: ${collection}`);
    await processCollection(collection);
  }

  console.log("\nMigration complete!");
  console.log(`- Files processed: ${report.totalFiles}`);
  console.log(`- Files converted: ${report.convertedFiles.length}`);
  console.log(`- Errors: ${report.errors.length}`);

  await generateReport();
}

// Run the migration
migrate().catch((error) => {
  console.error("Migration failed:", error);
  process.exit(1);
});
