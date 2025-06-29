import { notFound } from "next/navigation";
import { learnSource } from "@/app/sources/learn";
import { mdxComponents } from "@/app/mdx-components";
import { InlineTOC } from "fumadocs-ui/components/inline-toc";
import Link from "next/link";
import { serverTranslation } from "@/i18n/translation";
import { tutorialOrder } from "@/utils/learn-tutorials";

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
  const { body: MDX, toc } = await data.load();

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
          <div className="w-full max-w-4xl px-4">
            <article>
              {/* Chapter Indicator with Next Button */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-6">
                  <div className="flex-shrink-0 w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center">
                    <span className="text-3xl font-bold text-white">
                      {currentIndex + 1}
                    </span>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm uppercase tracking-wider mb-1">
                      {t("learn.navigation.chapter")} {currentIndex + 1}
                    </p>
                    <h2 className="text-2xl font-medium text-white">
                      {t(`learn.tutorials.items.${currentSlug}.category`)}
                    </h2>
                  </div>
                </div>

                {/* Next Chapter Button */}
                {nextSlug && (
                  <Link
                    href={`/learn/${nextSlug}`}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-700 hover:border-gray-500 transition-all group"
                    aria-label={`Go to Chapter ${currentIndex + 2}: ${nextCategory}`}
                  >
                    <span className="text-sm text-gray-400 group-hover:text-white transition-colors hidden sm:inline">
                      {t("learn.navigation.next")}
                    </span>
                    <svg
                      className="w-5 h-5 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
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

              <header className="mb-8">
                <h1 className="h1 mb-4">{data.h1 || data.title}</h1>
                {data.description && (
                  <p className="lead text-white">{data.description}</p>
                )}
              </header>

              <div className="prose prose-lg max-w-none">
                <MDX components={mdxComponents} />
              </div>

              {/* Navigation */}
              <nav className="mt-12 pt-8 border-t border-gray-700">
                <div className="flex justify-between items-center">
                  {prevSlug ? (
                    <Link
                      href={`/learn/${prevSlug}`}
                      className="group flex items-center text-white hover:text-primary transition-colors"
                    >
                      <svg
                        className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                      <div className="text-left">
                        <div className="text-sm text-gray-400">
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
                      className="group flex items-center text-white hover:text-primary transition-colors text-right"
                    >
                      <div className="text-right">
                        <div className="text-sm text-gray-400">
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
          </div>

          {!data.hideTableOfContents && toc && toc.length > 0 && (
            <aside className="hidden xl:block sticky top-24 h-fit ml-8 w-64 max-h-[calc(100vh-8rem)] overflow-y-auto">
              <InlineTOC items={toc} />
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
