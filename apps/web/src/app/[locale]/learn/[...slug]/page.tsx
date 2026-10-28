import { notFound } from "next/navigation";
import { getAlternates } from "@workspace/i18n/routing";
import { locales } from "@workspace/i18n/config";
import { getTranslations } from "next-intl/server";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { getLearnPage, getLearnSlugs } from "@/lib/learn";
import { tutorialOrder, learnTutorials } from "@/utils/learn-tutorials";
import ChapterIndicator from "@/components/learn/chapter-indicator";
import ChapterNavigation from "@/components/learn/chapter-navigation";
import MobileChapterNavigation from "@/components/learn/mobile-chapter-navigation";
import TutorialNavigation from "@/components/learn/tutorial-navigation";
import { learnMdxComponents } from "@/components/learn/learn-mdx-components";

type Props = {
  params: Promise<{ locale: string; slug: string[] }>;
};

export async function generateStaticParams() {
  return locales.flatMap((locale) =>
    getLearnSlugs().map((slug) => ({ locale, slug: [slug] })),
  );
}

export async function generateMetadata(props: Props) {
  const { locale, slug } = await props.params;
  const page = getLearnPage(slug, locale);

  if (!page) {
    notFound();
  }

  const { data } = page;

  return {
    title: data.seoTitle || data.title,
    description: data.description,
    alternates: getAlternates(`/learn/${slug.join("/")}`, locale),
  };
}

export default async function LearnContentPage(props: Props) {
  const { locale, slug } = await props.params;
  const t = await getTranslations();

  const page = getLearnPage(slug, locale);

  if (!page) {
    notFound();
  }

  const { data } = page;
  const mdx = (
    <MDXRemote
      source={page.content}
      components={learnMdxComponents}
      options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
    />
  );

  // Get current tutorial index and navigation info
  const currentSlug = slug[0];
  const currentIndex = tutorialOrder.indexOf(currentSlug);
  const prevSlug = currentIndex > 0 ? tutorialOrder[currentIndex - 1] : null;
  const nextSlug =
    currentIndex < tutorialOrder.length - 1
      ? tutorialOrder[currentIndex + 1]
      : null;

  // Get titles and categories for navigation links
  const prevTitle = prevSlug
    ? t(`learn.tutorials.items.${prevSlug}.title`)
    : null;
  const nextTitle = nextSlug
    ? t(`learn.tutorials.items.${nextSlug}.title`)
    : null;
  const prevCategory = prevSlug
    ? t(`learn.tutorials.items.${prevSlug}.category`)
    : null;
  const nextCategory = nextSlug
    ? t(`learn.tutorials.items.${nextSlug}.category`)
    : null;

  // Prepare all tutorial translations server-side
  const tutorialsWithTranslations = learnTutorials.map((tutorial) => ({
    ...tutorial,
    title: t(`learn.tutorials.items.${tutorial.slug}.title`),
    category: t(`learn.tutorials.items.${tutorial.slug}.category`),
  }));

  return (
    <div className="container-fluid py-12 md:py-12">
      <div className="container">
        <div className="relative flex justify-center">
          <main className="w-full max-w-4xl px-4">
            <article role="article" aria-labelledby="article-title">
              <ChapterIndicator
                currentIndex={currentIndex}
                nextSlug={nextSlug}
                nextTitle={nextTitle}
                translations={{
                  currentChapter: t("learn.navigation.currentChapter"),
                  chapter: t("learn.navigation.chapter"),
                  chapterCategory: t.raw(
                    "learn.navigation.chapterCategory",
                  ) as string,
                  goToNextChapter: t.raw(
                    "learn.navigation.goToNextChapter",
                  ) as string,
                  next: t("learn.navigation.next"),
                }}
                category={t(`learn.tutorials.items.${currentSlug}.category`)}
              />

              <MobileChapterNavigation
                currentSlug={currentSlug}
                tutorials={tutorialsWithTranslations}
                translations={{
                  toggleChapterNavigation: t(
                    "learn.navigation.toggleChapterNavigation",
                  ),
                  chapters: t("learn.navigation.chapters"),
                  chapterNavigationAriaLabel: t(
                    "learn.navigation.chapterNavigationAriaLabel",
                  ),
                  chapterNumber: t.raw(
                    "learn.navigation.chapterNumber",
                  ) as string,
                }}
              />

              <header className="mb-12">
                <h1 id="article-title" className="h1 mb-4">
                  {data.h1 || data.title}
                </h1>
                {data.description && (
                  <p className="lead text-white">{data.description}</p>
                )}
              </header>

              <div className="text-[1.125rem] leading-[1.75] text-zinc-300 [&_h1]:font-semibold [&_h1]:tracking-[-0.02em] [&_h1]:text-white [&_h1]:m-0 [&_h1]:mb-6 [&_h1]:text-[clamp(2.25rem,5vw,3.75rem)] [&_h1]:leading-[1.05] [&_h2]:font-semibold [&_h2]:tracking-[-0.02em] [&_h2]:text-white [&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:text-[clamp(1.75rem,4vw,2.5rem)] [&_h2]:leading-[1.15] [&_h3]:font-semibold [&_h3]:tracking-[-0.02em] [&_h3]:text-white [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:text-2xl [&_h3]:leading-[1.25] [&_h4]:font-semibold [&_h4]:tracking-[-0.02em] [&_h4]:text-white [&_h4]:mt-6 [&_h4]:mb-2 [&_h4]:text-xl [&_h4]:leading-[1.3] [&_p]:my-4 [&_ul]:my-4 [&_ol]:my-4 [&_ul]:pl-6 [&_ol]:pl-6 [&_ul]:list-disc [&_ol]:list-decimal [&_li]:my-2 [&_li]:pl-1 [&_a]:text-[#14f195] [&_a]:underline [&_a]:underline-offset-[0.15em] [&_strong]:font-semibold [&_strong]:text-white [&_blockquote]:my-6 [&_blockquote]:border-l-2 [&_blockquote]:border-l-[#14f195] [&_blockquote]:pl-4 [&_blockquote]:text-zinc-400 [&_hr]:my-10 [&_hr]:border-zinc-700 [&_code]:rounded [&_code]:bg-zinc-800 [&_code]:px-[0.35rem] [&_code]:py-[0.15rem] [&_code]:text-[0.9em] [&_pre]:my-6 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-zinc-900 [&_pre]:p-4 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_table]:my-6 [&_table]:block [&_table]:w-full [&_table]:overflow-x-auto [&_table]:border-collapse [&_th]:border [&_td]:border [&_th]:border-zinc-700 [&_td]:border-zinc-700 [&_th]:px-4 [&_td]:px-4 [&_th]:py-3 [&_td]:py-3 [&_th]:text-left [&_td]:text-left [&_th]:font-semibold [&_th]:text-white [&_img]:h-auto [&_img]:max-w-full">
                {mdx}
              </div>

              <TutorialNavigation
                prevSlug={prevSlug}
                nextSlug={nextSlug}
                prevTitle={prevTitle}
                nextTitle={nextTitle}
                prevCategory={prevCategory}
                nextCategory={nextCategory}
                currentIndex={currentIndex}
                translations={{
                  tutorialNavigationAriaLabel: t(
                    "learn.navigation.tutorialNavigationAriaLabel",
                  ),
                  previousChapterAriaLabel: t.raw(
                    "learn.navigation.previousChapterAriaLabel",
                  ) as string,
                  nextChapterAriaLabel: t.raw(
                    "learn.navigation.nextChapterAriaLabel",
                  ) as string,
                  previous: t("learn.navigation.previous"),
                  next: t("learn.navigation.next"),
                }}
              />
            </article>
          </main>

          <ChapterNavigation
            currentSlug={currentSlug}
            tutorials={tutorialsWithTranslations}
            translations={{
              chapters: t("learn.navigation.chapters"),
              chapterNavigationAriaLabel: t(
                "learn.navigation.chapterNavigationAriaLabel",
              ),
              chapterNumber: t.raw("learn.navigation.chapterNumber") as string,
            }}
          />
        </div>
      </div>
    </div>
  );
}
