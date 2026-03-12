import type { Page } from "@playwright/test";

/**
 * Content extraction utilities for comparing Builder.io pages with migrated Next.js pages.
 */

export interface ExtractedHeading {
  level: number;
  text: string;
}

export interface ExtractedLink {
  text: string;
  href: string;
}

export interface ExtractedImage {
  src: string;
  alt: string;
}

export interface ExtractedButton {
  text: string;
  type: string | null;
}

export interface ExtractedMeta {
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
}

export interface ExtractedContent {
  meta: ExtractedMeta;
  headings: ExtractedHeading[];
  buttons: ExtractedButton[];
  links: ExtractedLink[];
  images: ExtractedImage[];
  textSections: string[];
  statistics: string[];
}

/**
 * Extract all relevant content from a page for comparison.
 */
export async function extractPageContent(
  page: Page,
): Promise<ExtractedContent> {
  // Wait for page to be fully loaded
  await page.waitForLoadState("networkidle");

  const content = await page.evaluate(() => {
    // Helper to clean text
    const cleanText = (text: string | null) =>
      (text || "").trim().replace(/\s+/g, " ");

    // Extract meta information
    const meta: ExtractedMeta = {
      title: document.title || "",
      description:
        document
          .querySelector('meta[name="description"]')
          ?.getAttribute("content") || "",
      ogTitle:
        document
          .querySelector('meta[property="og:title"]')
          ?.getAttribute("content") || "",
      ogDescription:
        document
          .querySelector('meta[property="og:description"]')
          ?.getAttribute("content") || "",
      ogImage:
        document
          .querySelector('meta[property="og:image"]')
          ?.getAttribute("content") || "",
    };

    // Extract headings
    const headings: ExtractedHeading[] = [];
    document.querySelectorAll("h1, h2, h3, h4, h5, h6").forEach((heading) => {
      const level = parseInt(heading.tagName.charAt(1));
      const text = cleanText(heading.textContent);
      if (text) {
        headings.push({ level, text });
      }
    });

    // Extract buttons (including styled links that act as buttons)
    const buttons: ExtractedButton[] = [];
    document
      .querySelectorAll(
        'button, a[role="button"], [class*="btn"], [class*="button"], [class*="Button"], [class*="cta"], [class*="Cta"], [class*="CTA"]',
      )
      .forEach((button) => {
        const text = cleanText(button.textContent);
        if (text && text.length < 100) {
          buttons.push({
            text,
            type: button.getAttribute("type"),
          });
        }
      });

    // Extract links (excluding navigation and footer)
    const links: ExtractedLink[] = [];
    document
      .querySelectorAll("main a, article a, section a")
      .forEach((link) => {
        const anchor = link as HTMLAnchorElement;
        const text = cleanText(anchor.textContent);
        const href = anchor.getAttribute("href") || "";
        if (text && href && !href.startsWith("#")) {
          links.push({ text, href });
        }
      });

    // Extract images
    const images: ExtractedImage[] = [];
    document
      .querySelectorAll("main img, article img, section img")
      .forEach((img) => {
        const image = img as HTMLImageElement;
        const src = image.src || image.getAttribute("data-src") || "";
        const alt = image.alt || "";
        if (src) {
          images.push({ src, alt });
        }
      });

    // Extract text sections from main content areas
    const textSections: string[] = [];
    document
      .querySelectorAll("main p, article p, section p, main li, article li")
      .forEach((el) => {
        const text = cleanText(el.textContent);
        if (text && text.length > 20) {
          textSections.push(text);
        }
      });

    // Extract statistics (numbers with context)
    const statistics: string[] = [];
    const statsPattern = /(\d[\d,.\s]*%?|\$[\d,.\s]+[MBK]?)/;
    document
      .querySelectorAll(
        '[class*="stat"], [class*="number"], [class*="metric"], h2, h3, span',
      )
      .forEach((el) => {
        const text = cleanText(el.textContent);
        if (text && statsPattern.test(text) && text.length < 50) {
          statistics.push(text);
        }
      });

    return {
      meta,
      headings,
      buttons,
      links,
      images,
      textSections,
      statistics: [...new Set(statistics)], // Remove duplicates
    };
  });

  return content;
}

/**
 * Compare two sets of extracted content and return differences.
 */
export interface ContentDifference {
  field: string;
  expected: string | number;
  actual: string | number;
  severity: "critical" | "major" | "minor";
}

export function compareContent(
  production: ExtractedContent,
  local: ExtractedContent,
): ContentDifference[] {
  const differences: ContentDifference[] = [];

  // Compare meta title
  if (
    normalizeText(production.meta.title) !== normalizeText(local.meta.title)
  ) {
    differences.push({
      field: "Page Title",
      expected: production.meta.title,
      actual: local.meta.title,
      severity: "critical",
    });
  }

  // Compare meta description
  if (
    normalizeText(production.meta.description) !==
    normalizeText(local.meta.description)
  ) {
    differences.push({
      field: "Meta Description",
      expected: production.meta.description,
      actual: local.meta.description,
      severity: "major",
    });
  }

  // Compare H1 headings
  const prodH1s = production.headings.filter((h) => h.level === 1);
  const localH1s = local.headings.filter((h) => h.level === 1);

  if (prodH1s.length !== localH1s.length) {
    differences.push({
      field: "H1 Heading Count",
      expected: prodH1s.length,
      actual: localH1s.length,
      severity: "critical",
    });
  } else {
    prodH1s.forEach((prodH1, index) => {
      if (
        localH1s[index] &&
        normalizeText(prodH1.text) !== normalizeText(localH1s[index].text)
      ) {
        differences.push({
          field: `H1 Heading #${index + 1}`,
          expected: prodH1.text,
          actual: localH1s[index].text,
          severity: "critical",
        });
      }
    });
  }

  // Compare H2 headings
  const prodH2s = production.headings.filter((h) => h.level === 2);
  const localH2s = local.headings.filter((h) => h.level === 2);

  if (Math.abs(prodH2s.length - localH2s.length) > 1) {
    differences.push({
      field: "H2 Heading Count",
      expected: prodH2s.length,
      actual: localH2s.length,
      severity: "major",
    });
  }

  // Compare button count
  const prodButtons = [...new Set(production.buttons.map((b) => b.text))];
  const localButtons = [...new Set(local.buttons.map((b) => b.text))];

  if (Math.abs(prodButtons.length - localButtons.length) > 2) {
    differences.push({
      field: "Button Count",
      expected: prodButtons.length,
      actual: localButtons.length,
      severity: "major",
    });
  }

  // Check for missing important buttons
  const importantKeywords = [
    "start",
    "get",
    "learn",
    "read",
    "view",
    "explore",
    "build",
  ];
  prodButtons.forEach((btnText) => {
    const isImportant = importantKeywords.some((kw) =>
      btnText.toLowerCase().includes(kw),
    );
    if (
      isImportant &&
      !localButtons.some((lb) => normalizeText(lb) === normalizeText(btnText))
    ) {
      differences.push({
        field: "Missing Button",
        expected: btnText,
        actual: "(not found)",
        severity: "major",
      });
    }
  });

  // Compare image count
  if (Math.abs(production.images.length - local.images.length) > 3) {
    differences.push({
      field: "Image Count",
      expected: production.images.length,
      actual: local.images.length,
      severity: "major",
    });
  }

  // Compare statistics
  production.statistics.forEach((stat) => {
    if (
      !local.statistics.some((ls) => normalizeText(ls) === normalizeText(stat))
    ) {
      differences.push({
        field: "Missing Statistic",
        expected: stat,
        actual: "(not found)",
        severity: "critical",
      });
    }
  });

  return differences;
}

/**
 * Normalize text for comparison (lowercase, remove extra whitespace, normalize special chars).
 */
function normalizeText(text: string): string {
  return (
    text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, " ")
      // Normalize various dash characters to regular hyphen
      // Em-dash (—), en-dash (–), non-breaking hyphen (‑), figure dash (‒), minus sign (−)
      // Box drawing horizontal (─, ━, ┄, ┅, ┈, ┉)
      .replace(/[—–‑‒−─━┄┅┈┉]/g, "-")
      // Normalize curly quotes and apostrophes to straight versions
      .replace(/['']/g, "'")
      .replace(/[""]/g, '"')
  );
}

/**
 * Check heading hierarchy for accessibility issues.
 */
export function checkHeadingHierarchy(headings: ExtractedHeading[]): string[] {
  const issues: string[] = [];

  if (headings.length === 0) {
    issues.push("No headings found on page");
    return issues;
  }

  // Check for H1
  const h1s = headings.filter((h) => h.level === 1);
  if (h1s.length === 0) {
    issues.push("Missing H1 heading");
  } else if (h1s.length > 1) {
    issues.push(`Multiple H1 headings found (${h1s.length})`);
  }

  // Check for skipped levels
  let prevLevel = 0;
  headings.forEach((heading) => {
    if (prevLevel > 0 && heading.level > prevLevel + 1) {
      issues.push(
        `Skipped heading level: H${prevLevel} to H${heading.level} at "${heading.text.substring(0, 30)}..."`,
      );
    }
    prevLevel = heading.level;
  });

  return issues;
}

/**
 * Check images for accessibility issues.
 */
export function checkImageAccessibility(images: ExtractedImage[]): string[] {
  const issues: string[] = [];

  images.forEach((img, index) => {
    if (!img.alt || img.alt.trim() === "") {
      issues.push(
        `Image #${index + 1} missing alt text: ${img.src.substring(0, 50)}...`,
      );
    }
  });

  return issues;
}

/**
 * Extract all internal links for validation.
 */
export async function extractInternalLinks(page: Page): Promise<string[]> {
  const links = await page.evaluate(() => {
    const allLinks: string[] = [];
    document.querySelectorAll("a[href]").forEach((link) => {
      const href = link.getAttribute("href") || "";
      if (
        href.startsWith("/") ||
        href.includes("solana.com") ||
        href.includes("localhost")
      ) {
        // Normalize the URL
        const url = new URL(href, window.location.origin);
        allLinks.push(url.pathname);
      }
    });
    return [...new Set(allLinks)]; // Remove duplicates
  });

  return links;
}
