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
} from "@/utils/developers-learn-curriculum";

type Props = {
  params: Promise<{ locale: string; courseSlug: string; lessonSlug: string }>;
};

export default async function Page(props: Props) {
  const { locale, courseSlug, lessonSlug } = await props.params;
  const course = getDevelopersLearnCourseBySlug(courseSlug);

  if (!course) {
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
          className="text-sm text-zinc-400 transition-colors hover:text-white"
        >
          ← {course.title}
        </Link>
      </div>

      <header className="mb-8 max-w-3xl">
        <p className="mb-2 text-xs tracking-[0.2em] uppercase text-zinc-400">
          {course.title}
        </p>
        <h1 className="mb-3 text-4xl font-semibold text-white md:text-5xl">
          {data.h1 || data.title}
        </h1>
        {data.description ? (
          <p className="text-lg text-zinc-300">{data.description}</p>
        ) : null}
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
