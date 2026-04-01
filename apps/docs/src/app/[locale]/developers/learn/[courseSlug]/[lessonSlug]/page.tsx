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
          <span className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200">
            {lesson.video.platform}
          </span>
          <span className="rounded-full border border-zinc-200 bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
            {lesson.video.status}
          </span>
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

      <section className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/80">
          <p className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Primary medium
          </p>
          <h2 className="mt-2 text-xl font-semibold text-zinc-950 dark:text-zinc-50">
            Watch on {lesson.video.platform}
          </h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
            This episode page should sit beside the published video, not replace
            it.
          </p>
          {lesson.video.url ? (
            <a
              href={lesson.video.url}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:border-zinc-500 dark:hover:bg-zinc-900"
            >
              Open video
            </a>
          ) : (
            <div className="mt-4 rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-100">
              <p className="font-medium">YouTube link publishing soon</p>
              <p className="mt-1">
                {lesson.video.note ||
                  "Add the YouTube URL here once the episode is uploaded."}
              </p>
            </div>
          )}
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/80">
          <p className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Companion role
          </p>
          <h2 className="mt-2 text-xl font-semibold text-zinc-950 dark:text-zinc-50">
            Use this guide while you watch and build
          </h2>
          <div className="mt-3 space-y-2 text-sm text-zinc-600 dark:text-zinc-300">
            <p>Follow the checkpoints and notes from the episode.</p>
            <p>Open scripts or code without leaving the lesson flow.</p>
            <p>Mark the episode complete locally when you finish it.</p>
          </div>
        </div>
      </section>

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
