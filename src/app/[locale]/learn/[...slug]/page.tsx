import { notFound } from "next/navigation";
import { learnSource } from "@/app/sources/learn";
import { mdxComponents } from "@/app/mdx-components";
import Link from "next/link";
import { serverTranslation } from "@/i18n/translation";
import { tutorialOrder, learnTutorials } from "@/utils/learn-tutorials";

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

  return (
    <div className="container-fluid py-8 md:py-12">
      <div className="container">
        <div className="relative flex justify-center">
          <main className="w-full max-w-4xl px-4">
            <article role="article" aria-labelledby="article-title">
              {/* Chapter Indicator with Next Button */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-6">
                  <div
                    className="flex-shrink-0 w-20 h-20 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center"
                    aria-hidden="true"
                  >
                    <span className="text-3xl font-bold text-white">
                      {currentIndex + 1}
                    </span>
                  </div>
                  <div>
                    <p className="text-zinc-400 text-sm uppercase tracking-wider mb-1">
                      <span className="sr-only">
                        {t("learn.navigation.currentChapter")}:{" "}
                      </span>
                      {t("learn.navigation.chapter")} {currentIndex + 1}
                    </p>
                    <p
                      className="text-2xl font-medium text-white"
                      aria-label={t("learn.navigation.chapterCategory", {
                        category: t(
                          `learn.tutorials.items.${currentSlug}.category`,
                        ),
                      })}
                    >
                      {t(`learn.tutorials.items.${currentSlug}.category`)}
                    </p>
                  </div>
                </div>

                {/* Next Chapter Button */}
                {nextSlug && (
                  <Link
                    href={`/learn/${nextSlug}`}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-800 hover:border-zinc-600 transition-all group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-black"
                    aria-label={t("learn.navigation.goToNextChapter", {
                      title: nextTitle,
                    })}
                  >
                    <span className="text-sm text-zinc-400 group-hover:text-white transition-colors hidden sm:inline">
                      {t("learn.navigation.next")}
                    </span>
                    <svg
                      className="w-5 h-5 text-zinc-400 group-hover:text-white group-hover:translate-x-1 transition-all"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                )}
              </div>

              {/* Mobile Chapter Navigation Dropdown */}
              <div className="xl:hidden sticky top-16 z-10 -mx-4 px-4 pb-6">
                <details className="rounded-lg">
                  <summary
                    className="px-4 py-3 cursor-pointer flex items-center justify-between text-white hover:bg-zinc-800 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-black"
                    aria-label={t("learn.navigation.toggleChapterNavigation")}
                  >
                    <span className="text-sm font-medium">
                      {t("learn.navigation.chapters")}
                    </span>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </summary>
                  <nav
                    className="px-2 pb-2"
                    aria-label={t(
                      "learn.navigation.chapterNavigationAriaLabel",
                    )}
                  >
                    {learnTutorials.map((tutorial, index) => {
                      const isActive = tutorial.slug === currentSlug;
                      const tutorialTitle = t(
                        `learn.tutorials.items.${tutorial.slug}.title`,
                      );

                      return (
                        <Link
                          key={tutorial.id}
                          href={`/learn/${tutorial.slug}`}
                          className={`
                            block px-3 py-2 rounded-md transition-all text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-black
                            ${
                              isActive
                                ? "text-primary font-medium"
                                : "text-zinc-300 hover:bg-zinc-800 hover:text-white"
                            }
                          `}
                          aria-current={isActive ? "page" : undefined}
                        >
                          <span
                            className={`mr-2 ${isActive ? "text-primary" : "text-zinc-500"}`}
                            aria-hidden="true"
                          >
                            {index + 1}.
                          </span>
                          <span className="sr-only">
                            {t("learn.navigation.chapterNumber", {
                              number: index + 1,
                            })}{" "}
                          </span>
                          {tutorialTitle}
                        </Link>
                      );
                    })}
                  </nav>
                </details>
              </div>

              <header className="mb-8">
                <h1 id="article-title" className="h1 mb-4">
                  {data.h1 || data.title}
                </h1>
                {data.description && (
                  <p className="lead text-white">{data.description}</p>
                )}
              </header>

              <div className="prose prose-lg max-w-none">
                <MDX components={mdxComponents} />
              </div>

              {/* Navigation */}
              <nav
                className="mt-12 pt-8 border-t border-zinc-800"
                aria-label={t("learn.navigation.tutorialNavigationAriaLabel")}
              >
                <div className="flex justify-between items-center">
                  {prevSlug ? (
                    <Link
                      href={`/learn/${prevSlug}`}
                      className="group flex items-center text-white hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-black rounded-lg p-2 -m-2"
                      aria-label={t(
                        "learn.navigation.previousChapterAriaLabel",
                        { title: prevTitle },
                      )}
                    >
                      <svg
                        className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                      <div className="text-left">
                        <div className="text-sm text-zinc-400">
                          {t("learn.navigation.previous")} • Part {currentIndex}
                          : {prevCategory}
                        </div>
                        <div className="font-medium">{prevTitle}</div>
                      </div>
                    </Link>
                  ) : (
                    <div />
                  )}

                  {nextSlug ? (
                    <Link
                      href={`/learn/${nextSlug}`}
                      className="group flex items-center text-white hover:text-primary transition-colors text-right focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-black rounded-lg p-2 -m-2"
                      aria-label={t("learn.navigation.nextChapterAriaLabel", {
                        title: nextTitle,
                      })}
                    >
                      <div className="text-right">
                        <div className="text-sm text-zinc-400">
                          {t("learn.navigation.next")} • Part {currentIndex + 2}
                          : {nextCategory}
                        </div>
                        <div className="font-medium">{nextTitle}</div>
                      </div>
                      <svg
                        className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                  ) : (
                    <div />
                  )}
                </div>
              </nav>
            </article>
          </main>

          {/* Chapter Navigation Dropdown */}
          <aside
            className="hidden xl:block sticky top-24 h-fit ml-8 w-64"
            aria-label={t("learn.navigation.chapterNavigationAriaLabel")}
          >
            <div className="rounded-lg p-4">
              <h2
                id="chapters-heading"
                className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3"
              >
                {t("learn.navigation.chapters")}
              </h2>
              <nav className="space-y-1" aria-labelledby="chapters-heading">
                {learnTutorials.map((tutorial, index) => {
                  const isActive = tutorial.slug === currentSlug;
                  const tutorialTitle = t(
                    `learn.tutorials.items.${tutorial.slug}.title`,
                  );
                  const tutorialCategory = t(
                    `learn.tutorials.items.${tutorial.slug}.category`,
                  );

                  return (
                    <Link
                      key={tutorial.id}
                      href={`/learn/${tutorial.slug}`}
                      className={`
                        block px-3 py-2 rounded-md transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-black
                        ${
                          isActive
                            ? "text-primary font-medium"
                            : "text-zinc-300 hover:bg-zinc-800 hover:text-white"
                        }
                      `}
                      aria-current={isActive ? "page" : undefined}
                    >
                      <div className="flex items-start">
                        <span
                          className={`text-xs mr-2 mt-0.5 ${isActive ? "text-primary" : "text-zinc-500"}`}
                          aria-hidden="true"
                        >
                          {index + 1}.
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm truncate">
                            <span className="sr-only">
                              {t("learn.navigation.chapterNumber", {
                                number: index + 1,
                              })}{" "}
                            </span>
                            {tutorialTitle}
                          </div>
                          <div
                            className={`text-xs mt-0.5 truncate ${isActive ? "text-primary" : "text-zinc-400"}`}
                          >
                            {tutorialCategory}
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
