import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { defaultLocale, locales } from "@workspace/i18n/config";
import { pokerGuideChapters } from "./poker-guide-chapters";

export { pokerGuideChapters, pokerGuideSlug } from "./poker-guide-chapters";

const guideContentRoot = path.join(process.cwd(), "content", "poker-guide");
const guideFilename = "poker-players-guide-to-crypto.mdx";

type PokerGuideData = {
  title: string;
  h1?: string;
  seoTitle?: string;
  description?: string;
};

function getGuideFilePath(locale: string) {
  if (!locales.includes(locale)) return null;

  const localizedPath = path.join(guideContentRoot, locale, guideFilename);
  if (fs.existsSync(localizedPath)) return localizedPath;

  if (locale === defaultLocale) return null;

  const fallbackPath = path.join(
    guideContentRoot,
    defaultLocale,
    guideFilename,
  );

  return fs.existsSync(fallbackPath) ? fallbackPath : null;
}

export function getPokerGuide(locale: string) {
  const filePath = getGuideFilePath(locale);
  if (!filePath) return null;

  const { data, content } = matter(fs.readFileSync(filePath, "utf8"));

  return { data: data as PokerGuideData, content };
}

export function getPokerGuideChapter(chapterSlug: string, locale: string) {
  const guide = getPokerGuide(locale);
  const chapter = pokerGuideChapters.find(({ slug }) => slug === chapterSlug);
  if (!guide || !chapter) return null;

  const sectionPattern = new RegExp(
    `<section id="${chapter.id}"[\\s\\S]*?<\\/section>`,
  );
  const content = guide.content.match(sectionPattern)?.[0];

  return content ? { chapter, content, data: guide.data } : null;
}
