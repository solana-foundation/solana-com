import Link from "next/link";
import { notFound } from "next/navigation";
import { mdxComponents } from "@@/src/app/mdx-components";
import { getMdxMetadata } from "@@/src/app/metadata";
import { developersLearnSource } from "@@/src/app/sources/developers-learn";
import DevelopersLearnLessonProgress from "@/components/developers-learn/developers-learn-lesson-progress";
import DevelopersLearnLessonSidebar from "@/components/developers-learn/developers-learn-lesson-sidebar";
import {
  developersLearnCourses,
  getDevelopersLearnCourseBySlug,
  getDevelopersLearnLesson,
} from "@/utils/developers-learn-curriculum";

type Props = {
  params: Promise<{ locale: string; courseSlug: string; lessonSlug: string }>;
};

export default async function Page(props: Props) {
  const { locale, courseSlug, lessonSlug } = await props.params;
  const course = getDevelopersLearnCourseBySlug(courseSlug);
  const lesson = getDevelopersLearnLesson(courseSlug, lessonSlug);

  if (!course || !lesson) {
    notFound();
  }

  const page = developersLearnSource.getPage([courseSlug, lessonSlug], locale);
  if (!page) {
    notFound();
  }

  const data = await page.data;
  const { body: MDX } = await data.load();

  return (
    <div className="container py-8 md:py-12">
      <div className="mb-8">
        <Link
          href={`/developers/learn/${courseSlug}`}
          className="text-sm text-zinc-500 transition-colors hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50"
        >
          ← {course.title} track
        </Link>
      </div>

      <header className="mb-8 max-w-3xl">
        <p className="mb-2 text-xs tracking-[0.2em] uppercase text-zinc-500 dark:text-zinc-400">
          {course.title} · Episode companion
        </p>
        <h1 className="mb-3 text-4xl font-semibold text-zinc-950 dark:text-zinc-50 md:text-5xl">
          {data.h1 || data.title}
        </h1>
        {data.description ? (
          <p className="text-lg text-zinc-600 dark:text-zinc-300">
            {data.description}
          </p>
        ) : null}
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full border border-zinc-200 bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
            {lesson.type}
          </span>
          <span className="rounded-full border border-zinc-200 bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
            {lesson.buildType}
          </span>
          <span className="rounded-full border border-zinc-200 bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
            Instructor: {lesson.instructor}
          </span>
          <span className="rounded-full border border-zinc-200 bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
            Learn: {lesson.expectation}
          </span>
        </div>
        {lesson.resourceLinks?.length ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {lesson.resourceLinks.map((resource) => (
              <a
                key={resource.href}
                href={resource.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                {resource.label}
              </a>
            ))}
          </div>
        ) : null}
        <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
          Video-first episode. Use this page as the written companion for notes,
          code, and supporting resources.
        </p>
      </header>

      <DevelopersLearnLessonProgress
        courseSlug={courseSlug}
        lessonSlug={lessonSlug}
      />

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_320px]">
        <article className="prose prose-xl max-w-none">
          <MDX components={mdxComponents} />
        </article>
        <DevelopersLearnLessonSidebar
          courseSlug={courseSlug}
          currentLessonSlug={lessonSlug}
        />
      </div>
    </div>
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
