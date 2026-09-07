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
import PokerGuidePage from "@/components/learn/poker-guide-page";
import { learnMdxComponents } from "@/components/learn/learn-mdx-components";
import styles from "@/components/learn/learn-content.module.scss";

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

  if (slug[0] === "poker-players-guide-to-crypto") {
    return (
      <PokerGuidePage
        title={data.h1 || data.title}
        description={data.description || ""}
      >
        {mdx}
      </PokerGuidePage>
    );
  }

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

              <div className={styles.content}>{mdx}</div>

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
