import matter from "gray-matter";
import fs from "fs";
import path from "path";
import { serialize } from "next-mdx-remote/serialize";

const MDX_DIR = path.join(process.cwd(), "content", "landings");

/**
 * Get MDX content for a given slug and locale
 * Falls back to English if locale-specific content doesn't exist
 */
export function getMdxContent(slug, locale = "en") {
  // Normalize slug
  const normalizedSlug = slug.startsWith("/") ? slug.slice(1) : slug;

  // Build file path
  const mdxFile = normalizedSlug.endsWith(".mdx")
    ? normalizedSlug
    : `${normalizedSlug}.mdx`;

  // Try locale-specific path first
  let filePath = path.join(MDX_DIR, locale, mdxFile);

  // Check for index.mdx in directory
  if (!fs.existsSync(filePath)) {
    const indexPath = path.join(MDX_DIR, locale, normalizedSlug, "index.mdx");
    if (fs.existsSync(indexPath)) {
      filePath = indexPath;
    }
  }

  // Fall back to English if locale file doesn't exist
  if (!fs.existsSync(filePath) && locale !== "en") {
    filePath = path.join(MDX_DIR, "en", mdxFile);
    if (!fs.existsSync(filePath)) {
      const indexPath = path.join(MDX_DIR, "en", normalizedSlug, "index.mdx");
      if (fs.existsSync(indexPath)) {
        filePath = indexPath;
      }
    }
  }

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContents = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContents);

  return {
    frontmatter: data,
    content,
    slug: normalizedSlug,
  };
}

/**
 * Get serialized MDX content for rendering
 * Returns frontmatter as SEO-compatible format and serialized MDX source
 */
export async function getSerializedMdxContent(slug, locale = "en") {
  const mdxData = getMdxContent(slug, locale);

  if (!mdxData) {
    return null;
  }

  const { frontmatter, content, slug: normalizedSlug } = mdxData;

  // Serialize the MDX content
  const mdxSource = await serialize(content, {
    parseFrontmatter: false,
  });

  // Convert frontmatter to SEO format expected by HTMLHead
  const seo = {
    seoTitle: frontmatter.seoTitle || frontmatter.title,
    seoDescription: frontmatter.seoDescription || "",
    seoImage: frontmatter.seoImage || "",
    noIndex: frontmatter.noIndex || false,
    noFollow: frontmatter.noFollow || false,
  };

  return {
    id: `mdx-${normalizedSlug}`,
    data: {
      slug: normalizedSlug,
      seo,
      openGraph: {},
    },
    mdxSource,
    frontmatter,
  };
}

/**
 * Get all available MDX slugs for static path generation
 */
export function getAllMdxSlugs() {
  const slugs = [];

  function walkDir(dir, basePath = "") {
    if (!fs.existsSync(dir)) return;

    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const entryPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        // Check for index.mdx in directory
        const indexPath = path.join(entryPath, "index.mdx");
        if (fs.existsSync(indexPath)) {
          const slug = basePath ? `${basePath}/${entry.name}` : entry.name;
          slugs.push(slug);
        }
        // Recurse into subdirectory
        walkDir(entryPath, basePath ? `${basePath}/${entry.name}` : entry.name);
      } else if (entry.name.endsWith(".mdx") && entry.name !== "index.mdx") {
        const slug = basePath
          ? `${basePath}/${entry.name.replace(".mdx", "")}`
          : entry.name.replace(".mdx", "");
        slugs.push(slug);
      }
    }
  }

  // Walk English directory (all pages should exist there)
  const enDir = path.join(MDX_DIR, "en");
  walkDir(enDir);

  return slugs;
}

/**
 * Check if MDX content exists for a slug
 */
export function mdxExists(slug, locale = "en") {
  return getMdxContent(slug, locale) !== null;
}
