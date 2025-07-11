import { notFound } from "next/navigation";
import { learnSource } from "@/app/sources/learn";
import { mdxComponents } from "@/app/mdx-components";
import { serverTranslation } from "@/i18n/translation";
import { tutorialOrder, learnTutorials } from "@/utils/learn-tutorials";
import ChapterIndicator from "@/components/learn/chapter-indicator";
import ChapterNavigation from "@/components/learn/chapter-navigation";
import MobileChapterNavigation from "@/components/learn/mobile-chapter-navigation";
import TutorialNavigation from "@/components/learn/tutorial-navigation";

type Props = {
  params: Promise<{ locale: string; slug: string[] }>;
};

export async function generateStaticParams() {
  return learnSource.generateParams();
}

export async function generateMetadata(props: Props) {
  const { locale, slug } = await props.params;
  const page = learnSource.getPage(slug, locale);

  if (!page) {
    notFound();
  }

  const data = await page.data;

  return {
    title: data.seoTitle || data.title,
    description: data.description,
  };
}

export default async function LearnContentPage(props: Props) {
  const { locale, slug } = await props.params;
  const { t } = await serverTranslation(locale, ["common"]);

  const page = learnSource.getPage(slug, locale);

  if (!page) {
    notFound();
  }

  const data = await page.data;
  const { body: MDX } = await data.load();

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
    <div className="container-fluid py-8 md:py-12">
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
                  chapterCategory: t("learn.navigation.chapterCategory"),
                  goToNextChapter: t("learn.navigation.goToNextChapter"),
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
                  chapterNumber: t("learn.navigation.chapterNumber"),
                }}
              />

              <header className="mb-8">
                <h1 id="article-title" className="h1 mb-4">
                  {data.h1 || data.title}
                </h1>
                {data.description && (
                  <p className="lead text-white">{data.description}</p>
                )}
              </header>

              <div className="prose prose-xl max-w-none">
                <MDX components={mdxComponents} />
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
                  previousChapterAriaLabel: t(
                    "learn.navigation.previousChapterAriaLabel",
                  ),
                  nextChapterAriaLabel: t(
                    "learn.navigation.nextChapterAriaLabel",
                  ),
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
              chapterNumber: t("learn.navigation.chapterNumber"),
            }}
          />
        </div>
      </div>
    </div>
  );
}
