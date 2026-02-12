/**
 * Builder JSON to MDX migration helper.
 *
 * Generates MDX files from exported Builder JSON for a fixed list of routes.
 * Run with: npx tsx scripts/migrate-builder-to-mdx.ts [--force]
 */

import fs from "fs";
import path from "path";

const ROOT_DIR = path.join(__dirname, "..");
const BUILDER_DIR = path.join(ROOT_DIR, "builder", "section-page", "en");
const MANIFEST_PATH = path.join(ROOT_DIR, "builder", "assets", "manifest.json");
const OUTPUT_DIR = path.join(ROOT_DIR, "content", "landings", "en");

const ROUTES = [
  "/2024outlook",
  "/art-basel",
  "/community/report-2024-newsletter-sign-up",
  "/developers/dao",
  "/developers/defi",
  "/developers/evm-to-svm",
  "/developers/evm-to-svm/accounts",
  "/developers/evm-to-svm/client-differences",
  "/developers/evm-to-svm/complete-guide",
  "/developers/evm-to-svm/consensus",
  "/developers/evm-to-svm/eip2612",
  "/developers/evm-to-svm/erc20",
  "/developers/evm-to-svm/erc3643",
  "/developers/evm-to-svm/erc4337",
  "/developers/evm-to-svm/erc4626",
  "/developers/evm-to-svm/erc721",
  "/developers/evm-to-svm/smart-contracts",
  "/developers/gaming",
  "/developers/nfts",
  "/developers/payments",
  "/pyusd",
  "/research",
  "/solutions/request-for-startups",
  "/solutions/financial-institutions",
  "/staking",
  "/wallets",
];

const COMPONENT_MAP: Record<string, string> = {
  Accordion: "Accordion",
  "Announcement Bar": "AnnouncementBar",
  "Card Deck": "CardDeck",
  Carousel: "Carousel",
  CommunityGallery: "CommunityGallery",
  "Content Editor": "ContentEditor",
  "Conversion Panel": "ConversionPanel",
  "Feature Highlight": "FeatureHighlight",
  Heading: "Heading",
  Hero: "Hero",
  "Section Molecule": "Section",
  "Newsletter Form": "NewsletterForm",
  "Newsletter Multiple Lists Form": "NewsletterMultipleListsForm",
  Slider: "Slider",
  Stats: "Stats",
  Switchback: "Switchback",
  "Switchback Chain": "SwitchbackChain",
  Switcher: "Switcher",
  Trustbar: "Trustbar",
  Quote: "Quote",
  "Quote Slider": "QuoteSlider",
  "Details Hero": "DetailsHero",
  Button: "Button",
  Copy: "HtmlParser",
  Tip: "Tip",
  Youtube: "YoutubeVideo",
  "Rich Text Stats": "RichTextStat",
  "Rich Text Quote": "RichTextQuote",
  "Code Block": "CodeBlock",
  "Breakpoint Speakers": "BreakpointSpeakers",
  "Breakpoint Title": "BreakpointTitle",
  "Breakpoint Hero": "BreakpointHero",
  "Breakpoint Card": "BreakpointCard",
  "Accelerate Stories": "AccelerateStories",
  "Accelerate Accordion": "AccelerateAccordion",
  "Accelerate Speakers": "AccelerateSpeakers",
  "Accelerate Hero": "AccelerateHero",
  "Accelerate Apply Button": "AccelerateApplyButton",
  "Accelerate Link Button": "AccelerateLinkButton",
  "Info Item": "AccelerateInfoItem",
  "Info Section": "AccelerateInfoSection",
  Attendance: "AccelerateAttendance",
  "Secondary button": "AccelerateSecondaryButton",
  "Event description": "AccelerateEventDescription",
  Pricing: "AcceleratePricing",
  "Star Container": "AccelerateStarContainer",
};

type ManifestMap = Record<string, { localPath: string }>;

const forceWrite = process.argv.includes("--force");
const manifest: ManifestMap = JSON.parse(
  fs.readFileSync(MANIFEST_PATH, "utf-8"),
);

const replaceAssets = (value: unknown): unknown => {
  if (typeof value === "string") {
    return manifest[value]?.localPath ?? value;
  }

  if (Array.isArray(value)) {
    return value.map(replaceAssets);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, replaceAssets(entry)]),
    );
  }

  return value;
};

const formatJsxLiteral = (value: unknown): string => {
  return JSON.stringify(value, null, 2);
};

const wrapWithResponsiveBox = (
  responsiveStyles: unknown,
  content: string,
): string => {
  if (!responsiveStyles) {
    return content;
  }

  return [
    "<ResponsiveBox",
    `  responsiveStyles={${formatJsxLiteral(responsiveStyles)}}`,
    ">",
    `  ${content}`,
    "</ResponsiveBox>",
  ].join("\n");
};

const renderBlock = (block: any): string => {
  if (block?.component?.name && COMPONENT_MAP[block.component.name]) {
    const componentName = COMPONENT_MAP[block.component.name];
    const options = replaceAssets(block.component.options ?? {});
    const element = `<${componentName} {...${formatJsxLiteral(options)}} />`;
    return wrapWithResponsiveBox(block.responsiveStyles, element);
  }

  if (block?.tagName === "img") {
    const props = replaceAssets(block.properties ?? {});
    const element = `<img {...${formatJsxLiteral(props)}} />`;
    return wrapWithResponsiveBox(block.responsiveStyles, element);
  }

  return `<!-- Unsupported block: ${block?.component?.name ?? block?.tagName ?? "unknown"} -->`;
};

const routeToInputFile = (route: string): string => {
  const slug = route.replace(/^\//, "");
  const filename = slug.length ? slug.replace(/\//g, "-") : "index";
  return path.join(BUILDER_DIR, `${filename}.json`);
};

const routeToOutputFile = (route: string): string => {
  const slug = route.replace(/^\//, "");
  return path.join(OUTPUT_DIR, `${slug}.mdx`);
};

const ensureDir = (filePath: string) => {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
};

const renderMdx = (route: string, data: any): string => {
  const seo = replaceAssets(data?.seo ?? {}) as Record<string, string>;
  const title = seo.seoTitle || seo.title || route.replace(/^\//, "");
  const frontmatter = [
    "---",
    `title: "${title}"`,
    `seoTitle: "${seo.seoTitle ?? title}"`,
    `seoDescription: "${seo.seoDescription ?? ""}"`,
    seo.seoImage ? `seoImage: "${seo.seoImage}"` : 'seoImage: ""',
    "---",
    "",
  ].join("\n");

  const blocks = (data?.blocks ?? []).map(renderBlock).join("\n\n");

  return `${frontmatter}${blocks}\n`;
};

const migrateRoute = (route: string) => {
  const inputPath = routeToInputFile(route);
  const outputPath = routeToOutputFile(route);

  if (!fs.existsSync(inputPath)) {
    console.warn(`Missing builder export: ${inputPath}`);
    return;
  }

  if (fs.existsSync(outputPath) && !forceWrite) {
    console.log(`Skipping existing MDX: ${outputPath}`);
    return;
  }

  const raw = fs.readFileSync(inputPath, "utf-8");
  const json = JSON.parse(raw);
  const mdx = renderMdx(route, json?.data);

  ensureDir(outputPath);
  fs.writeFileSync(outputPath, mdx, "utf-8");
  console.log(`Wrote ${outputPath}`);
};

const run = () => {
  console.log(`Migrating ${ROUTES.length} routes...`);
  ROUTES.forEach(migrateRoute);
};

run();
