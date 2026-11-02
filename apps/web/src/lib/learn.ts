import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { defaultLocale, locales } from "@workspace/i18n/config";

const learnContentRoot = path.join(process.cwd(), "content", "learn");
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export type LearnPageData = {
  title: string;
  h1?: string;
  seoTitle?: string;
  description?: string;
};

export type LearnPage = {
  data: LearnPageData;
  content: string;
  raw: string;
};

function getLearnFilePath(locale: string, slug: string[]) {
  if (
    !locales.includes(locale) ||
    slug.length !== 1 ||
    !slugPattern.test(slug[0])
  ) {
    return null;
  }

  const localizedPath = path.join(learnContentRoot, locale, `${slug[0]}.mdx`);

  if (fs.existsSync(localizedPath)) {
    return localizedPath;
  }

  if (locale === defaultLocale) {
    return null;
  }

  // Keep a localized URL usable while a newly published page is waiting for
  // its translated source. English-only pages are explicitly excluded from
  // Lingo coverage until those translations are ready.
  const fallbackPath = path.join(
    learnContentRoot,
    defaultLocale,
    `${slug[0]}.mdx`,
  );

  return fs.existsSync(fallbackPath) ? fallbackPath : null;
}

export function getLearnPage(slug: string[], locale: string): LearnPage | null {
  const filePath = getLearnFilePath(locale, slug);

  if (!filePath) {
    return null;
  }

  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);

  return {
    data: data as LearnPageData,
    content,
    raw,
  };
}

export function getLearnSlugs() {
  const defaultLocaleDir = path.join(learnContentRoot, defaultLocale);

  if (!fs.existsSync(defaultLocaleDir)) {
    return [];
  }

  return fs
    .readdirSync(defaultLocaleDir, { withFileTypes: true })
    .filter(
      (entry) =>
        entry.isFile() &&
        entry.name.endsWith(".mdx") &&
        slugPattern.test(entry.name.slice(0, -4)),
    )
    .map((entry) => entry.name.slice(0, -4))
    .sort();
}
