import { notFound } from "next/navigation";
import { DocsPage } from "@@/src/app/components/docs-page";
import { mdxComponents } from "@@/src/app/mdx-components";
import { getMdxMetadata } from "@@/src/app/metadata";
import { developersLearnSource } from "@@/src/app/sources/developers-learn";
import {
  developersLearnCourses,
  getDevelopersLearnLesson,
} from "@/utils/developers-learn-curriculum";

type Props = {
  params: Promise<{ locale: string; courseSlug: string; lessonSlug: string }>;
};

export default async function Page(props: Props) {
  const { locale, courseSlug, lessonSlug } = await props.params;
  const lesson = getDevelopersLearnLesson(courseSlug, lessonSlug);

  if (!lesson) {
    notFound();
  }

  const page = developersLearnSource.getPage([courseSlug, lessonSlug], locale);
  if (!page) {
    notFound();
  }

  const data = await page.data;
  const { body: MDX, toc } = await data.load();
  const markdown = await page.data.getText("raw");
  const embeddedVideoUrl = getYoutubeEmbedUrl(lesson.video.url);

  return (
    <DocsPage
      toc={toc}
      full={data.full}
      title={data.h1 || data.title}
      description={data.description}
      filePath={data.info.path}
      hideTableOfContents={data.hideTableOfContents}
      pageTree={developersLearnSource.pageTree[locale]}
      href={page.url}
      markdown={markdown}
      rootHref="/developers/bootcamp"
      showPageActions={false}
      editPathPrefix="content/developers-learn"
    >
      {embeddedVideoUrl ? (
        <section className="mb-4">
          <div className="overflow-hidden rounded-xl border border-zinc-200 bg-black shadow-sm dark:border-zinc-800">
            <div className="aspect-video">
              <iframe
                src={embeddedVideoUrl}
                title={`${lesson.title} video`}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          </div>
        </section>
      ) : lesson.video.url ? (
        <section className="mb-4">
          <a
            href={lesson.video.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:border-zinc-500 dark:hover:bg-zinc-900"
          >
            Open video
          </a>
        </section>
      ) : null}
      {lesson.resourceLinks?.length ? (
        <div className="mb-8 flex w-full flex-wrap items-center justify-end gap-4">
          {lesson.resourceLinks.map((resource) => (
            <a
              key={resource.href}
              href={resource.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center text-sm font-medium text-violet-600 underline decoration-violet-400 underline-offset-4 transition-colors hover:text-violet-700 hover:decoration-violet-500 dark:text-violet-300 dark:hover:text-violet-200"
            >
              {resource.label === "Bootcamp repo"
                ? "See the code"
                : resource.label}
              {resource.label === "Bootcamp repo" ? (
                <span aria-hidden="true" className="ml-1 text-xs">
                  →
                </span>
              ) : null}
            </a>
          ))}
        </div>
      ) : null}
      <MDX components={mdxComponents} />
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return developersLearnCourses.flatMap((course) =>
    course.lessons.map((lesson) => ({
      courseSlug: course.slug,
      lessonSlug: lesson.slug,
    })),
  );
}

export async function generateMetadata(props: Props) {
  const { locale, courseSlug, lessonSlug } = await props.params;
  const page = developersLearnSource.getPage([courseSlug, lessonSlug], locale);
  if (!page) {
    notFound();
  }

  return getMdxMetadata(page);
}

function getYoutubeEmbedUrl(url?: string) {
  if (!url) {
    return null;
  }

  try {
    const parsedUrl = new URL(url);

    if (parsedUrl.hostname === "youtu.be") {
      const videoId = parsedUrl.pathname.slice(1);
      return videoId ? `https://www.youtube.com/embed/${videoId}?rel=0` : null;
    }

    if (
      parsedUrl.hostname === "www.youtube.com" ||
      parsedUrl.hostname === "youtube.com"
    ) {
      if (parsedUrl.pathname.startsWith("/embed/")) {
        return parsedUrl.toString();
      }

      const videoId = parsedUrl.searchParams.get("v");
      return videoId ? `https://www.youtube.com/embed/${videoId}?rel=0` : null;
    }
  } catch {
    return null;
  }

  return null;
}
