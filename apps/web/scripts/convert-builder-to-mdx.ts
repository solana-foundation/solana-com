/**
 * Builder.io to MDX Conversion Script
 *
 * Converts exported Builder JSON files to MDX format.
 * Run with: npx tsx scripts/convert-builder-to-mdx.ts
 */

import * as fs from "fs";
import * as path from "path";

// Priority routes to convert
const PRIORITY_ROUTES = [
  "solutions",
  "solutions-token-extensions",
  "solutions-actions",
  "solutions-solana-permissioned-environments",
  "solutions-games-tooling",
  "solutions-payments-tooling",
  "solutions-commerce-tooling",
  "solutions-financial-infrastructure",
  "solutions-digital-assets",
  "solutions-real-world-assets",
  "solutions-gaming-and-entertainment",
  "solutions-artists-creators",
  "rpc",
  "tos",
  "privacy-policy",
];

// Directories
const BUILDER_DIR = path.join(process.cwd(), "builder", "section-page");
const MDX_DIR = path.join(process.cwd(), "content", "landings");

// Component name mapping (Builder -> MDX)
const COMPONENT_MAP: Record<string, string> = {
  Hero: "Hero",
  Switchback: "Switchback",
  SwitchbackChain: "SwitchbackChain",
  CardDeck: "CardDeck",
  Stats: "Stats",
  Accordion: "Accordion",
  ConversionPanel: "ConversionPanel",
  Trustbar: "Trustbar",
  FeatureHighlight: "FeatureHighlight",
  Quote: "Quote",
  QuoteSlider: "QuoteSlider",
  Heading: "Heading",
  Slider: "Slider",
  Carousel: "Carousel",
  CommunityGallery: "CommunityGallery",
  Switcher: "Switcher",
  ContentEditor: "ContentEditor",
  Section: "Section",
  NewsletterForm: "NewsletterForm",
  Text: "Text",
  Button: "Button",
  HtmlParser: "HtmlParser",
};

interface BuilderContent {
  data: {
    seo?: {
      seoTitle?: string;
      seoDescription?: string;
      seoImage?: string;
      noIndex?: boolean;
      noFollow?: boolean;
    };
    slug: string;
    blocks: BuilderBlock[];
    state?: {
      translation?: Record<string, any>;
    };
  };
  name?: string;
}

interface BuilderBlock {
  "@type": string;
  id: string;
  component?: {
    name: string;
    options: Record<string, any>;
  };
  children?: BuilderBlock[];
  responsiveStyles?: Record<string, any>;
}

// Escape special characters for JSX strings
function escapeJsx(str: string): string {
  if (typeof str !== "string") return String(str);
  return str
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "\\r")
    .replace(/{/g, "&#123;")
    .replace(/}/g, "&#125;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// Format a value for JSX prop
function formatPropValue(value: any, depth = 0): string {
  if (value === null || value === undefined) return "null";
  if (typeof value === "boolean") return String(value);
  if (typeof value === "number") return String(value);
  if (typeof value === "string") {
    // Check if it's HTML content
    if (
      value.includes("<p>") ||
      value.includes("<a ") ||
      value.includes("<strong>")
    ) {
      return `{\`${value.replace(/`/g, "\\`").replace(/\$/g, "\\$")}\`}`;
    }
    return `"${escapeJsx(value)}"`;
  }
  if (Array.isArray(value)) {
    if (value.length === 0) return "{[]}";
    const items = value.map((v) => formatPropValue(v, depth + 1)).join(", ");
    return `{[${items}]}`;
  }
  if (typeof value === "object") {
    const entries = Object.entries(value)
      .filter(([_, v]) => v !== undefined && v !== null)
      .map(([k, v]) => {
        const key = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(k) ? k : `"${k}"`;
        return `${key}: ${formatPropValue(v, depth + 1).replace(/^{|}$/g, "")}`;
      });
    if (entries.length === 0) return "{{}}";
    return `{{ ${entries.join(", ")} }}`;
  }
  return String(value);
}

// Convert Builder block to MDX component
function blockToMdx(block: BuilderBlock, indent = ""): string {
  if (!block.component) {
    // Skip non-component blocks (like tracking pixels)
    return "";
  }

  const componentName =
    COMPONENT_MAP[block.component.name] || block.component.name;
  const options = block.component.options || {};

  // Skip certain component options that aren't useful
  const propsToSkip = ["isRSC", "builderBlock", "builderState"];

  const props = Object.entries(options)
    .filter(([key, value]) => {
      if (propsToSkip.includes(key)) return false;
      if (value === undefined || value === null || value === "") return false;
      if (typeof value === "object" && Object.keys(value).length === 0)
        return false;
      return true;
    })
    .map(([key, value]) => {
      const propValue = formatPropValue(value);
      if (propValue === "true") return key;
      if (propValue === "false") return `${key}={false}`;
      return `${key}=${propValue}`;
    });

  // Handle children if present
  const children = block.children
    ?.map((child) => blockToMdx(child, indent + "  "))
    .filter(Boolean)
    .join("\n");

  if (props.length === 0 && !children) {
    return `${indent}<${componentName} />`;
  }

  if (!children) {
    if (props.length <= 2) {
      return `${indent}<${componentName} ${props.join(" ")} />`;
    }
    return `${indent}<${componentName}\n${indent}  ${props.join(`\n${indent}  `)}\n${indent}/>`;
  }

  return `${indent}<${componentName} ${props.join(" ")}>\n${children}\n${indent}</${componentName}>`;
}

// Generate frontmatter from Builder data
function generateFrontmatter(content: BuilderContent): string {
  const seo = content.data.seo || {};
  const title = content.name || seo.seoTitle || content.data.slug;

  const frontmatter: Record<string, any> = {
    title,
  };

  if (seo.seoTitle) frontmatter.seoTitle = seo.seoTitle;
  if (seo.seoDescription) frontmatter.seoDescription = seo.seoDescription;
  if (seo.seoImage) frontmatter.seoImage = seo.seoImage;
  if (seo.noIndex) frontmatter.noIndex = seo.noIndex;
  if (seo.noFollow) frontmatter.noFollow = seo.noFollow;

  const lines = ["---"];
  for (const [key, value] of Object.entries(frontmatter)) {
    if (typeof value === "string") {
      // Escape quotes in YAML strings
      lines.push(`${key}: "${value.replace(/"/g, '\\"')}"`);
    } else {
      lines.push(`${key}: ${value}`);
    }
  }
  lines.push("---");

  return lines.join("\n");
}

// Generate imports for used components
function generateImports(blocks: BuilderBlock[]): string {
  const usedComponents = new Set<string>();

  function collectComponents(block: BuilderBlock) {
    if (block.component?.name) {
      const mappedName =
        COMPONENT_MAP[block.component.name] || block.component.name;
      usedComponents.add(mappedName);
    }
    block.children?.forEach(collectComponents);
  }

  blocks.forEach(collectComponents);

  if (usedComponents.size === 0) return "";

  // Components come from solana-lib
  const components = Array.from(usedComponents).sort();
  return `import { ${components.join(", ")} } from "@solana-foundation/solana-lib";\n`;
}

// Convert a single Builder JSON to MDX
function convertToMdx(content: BuilderContent): string {
  const blocks = content.data.blocks || [];

  const frontmatter = generateFrontmatter(content);
  const imports = generateImports(blocks);
  const components = blocks
    .map((block) => blockToMdx(block))
    .filter(Boolean)
    .join("\n\n");

  return `${frontmatter}\n\n${imports}\n${components}\n`;
}

// Convert filename to MDX path
function filenameToMdxPath(filename: string): string {
  // Remove .json extension
  const base = filename.replace(".json", "");

  // Convert dash-separated to nested path for solutions
  if (base.startsWith("solutions-")) {
    const rest = base.replace("solutions-", "");
    return `solutions/${rest}.mdx`;
  }

  if (base === "solutions") {
    return "solutions/index.mdx";
  }

  return `${base}.mdx`;
}

// Ensure directory exists
function ensureDir(dir: string): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Main conversion function
async function convertBuilderToMdx(): Promise<void> {
  console.log("=== Builder to MDX Conversion ===\n");

  let converted = 0;
  let errors = 0;

  // Process English content first
  const enDir = path.join(BUILDER_DIR, "en");
  if (!fs.existsSync(enDir)) {
    console.error("English content directory not found:", enDir);
    return;
  }

  for (const filename of PRIORITY_ROUTES) {
    const jsonFile = `${filename}.json`;
    const jsonPath = path.join(enDir, jsonFile);

    if (!fs.existsSync(jsonPath)) {
      console.log(`Skipping ${filename} - JSON not found`);
      continue;
    }

    try {
      const content: BuilderContent = JSON.parse(
        fs.readFileSync(jsonPath, "utf-8"),
      );
      const mdx = convertToMdx(content);

      const mdxRelPath = filenameToMdxPath(jsonFile);
      const mdxPath = path.join(MDX_DIR, "en", mdxRelPath);

      ensureDir(path.dirname(mdxPath));
      fs.writeFileSync(mdxPath, mdx);

      console.log(`Converted: en/${mdxRelPath}`);
      converted++;
    } catch (error) {
      console.error(`Error converting ${filename}:`, (error as Error).message);
      errors++;
    }
  }

  // Process other locales (only if they have locale-specific content)
  const locales = fs.readdirSync(BUILDER_DIR).filter((l) => l !== "en");

  for (const locale of locales) {
    const localeDir = path.join(BUILDER_DIR, locale);
    if (!fs.statSync(localeDir).isDirectory()) continue;

    for (const filename of PRIORITY_ROUTES) {
      const jsonFile = `${filename}.json`;
      const jsonPath = path.join(localeDir, jsonFile);

      if (!fs.existsSync(jsonPath)) continue;

      try {
        const content: BuilderContent = JSON.parse(
          fs.readFileSync(jsonPath, "utf-8"),
        );

        // Check if this has actual locale-specific content
        // Builder might return same content for all locales
        const hasTranslations =
          content.data.state?.translation &&
          Object.keys(content.data.state.translation).length > 0;

        if (!hasTranslations) {
          // Skip if no translations
          continue;
        }

        const mdx = convertToMdx(content);

        const mdxRelPath = filenameToMdxPath(jsonFile);
        const mdxPath = path.join(MDX_DIR, locale, mdxRelPath);

        ensureDir(path.dirname(mdxPath));
        fs.writeFileSync(mdxPath, mdx);

        console.log(`Converted: ${locale}/${mdxRelPath}`);
        converted++;
      } catch {
        // Silent fail for locales
      }
    }
  }

  console.log("\n=== Conversion Summary ===");
  console.log(`Converted: ${converted} files`);
  console.log(`Errors: ${errors}`);
}

// Run conversion
convertBuilderToMdx()
  .then(() => {
    console.log("\nConversion complete!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\nConversion failed:", error);
    process.exit(1);
  });
