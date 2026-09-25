import { notFound } from "next/navigation";
import { getAlternates } from "@workspace/i18n/routing";
import { locales } from "@workspace/i18n/config";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import PokerGuideChapterPage from "@/components/poker-guide/poker-guide-chapter-page";
import { learnMdxComponents } from "@/components/learn/learn-mdx-components";
import {
  getPokerGuideChapter,
  pokerGuideChapters,
  pokerGuideSlug,
} from "@/lib/poker-guide";

type Props = { params: Promise<{ locale: string; chapter: string }> };

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    pokerGuideChapters.map(({ slug: chapter }) => ({ locale, chapter })),
  );
}

export async function generateMetadata({ params }: Props) {
  const { locale, chapter } = await params;
  const page = getPokerGuideChapter(chapter, locale);

  if (!page) notFound();

  return {
    title: `${page.chapter.title} | ${page.data.title}`,
    description: page.data.description,
    alternates: getAlternates(`/${pokerGuideSlug}/${chapter}`, locale),
  };
}

export default async function PokerGuideChapter({ params }: Props) {
  const { locale, chapter } = await params;
  const page = getPokerGuideChapter(chapter, locale);

  if (!page) notFound();

  return (
    <PokerGuideChapterPage activeChapter={page.chapter.slug}>
      <MDXRemote
        source={page.content}
        components={learnMdxComponents}
        options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
      />
    </PokerGuideChapterPage>
  );
}
