"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useDevelopersLearnProgress } from "@/hooks/useDevelopersLearnProgress";
import {
  developersLearnCourses,
  getDevelopersLearnCourseBySlug,
  getDevelopersLearnCourseProgress,
  getDevelopersLearnNextIncompleteLesson,
  getDevelopersLearnPrerequisiteCourseSlug,
  isDevelopersLearnCourseUnlocked,
} from "@/utils/developers-learn-curriculum";

export default function DevelopersLearnCatalog() {
  const { completedLessonsSet, isHydrated, clearProgress } =
    useDevelopersLearnProgress();

  const summary = useMemo(() => {
    const totalLessonCount = developersLearnCourses.reduce(
      (count, course) => count + course.lessons.length,
      0,
    );
    const completedCount = developersLearnCourses.reduce((count, course) => {
      return (
        count +
        course.lessons.filter((lesson) =>
          completedLessonsSet.has(`${course.slug}/${lesson.slug}`),
        ).length
      );
    }, 0);

    return { totalLessonCount, completedCount };
  }, [completedLessonsSet]);

  return (
    <div className="container py-8 md:py-12">
      <header className="mb-10 max-w-3xl">
        <p className="mb-2 text-xs tracking-[0.2em] uppercase text-zinc-400">
          Developers Learn
        </p>
        <h1 className="mb-4 text-4xl font-semibold text-white md:text-5xl">
          Foundations Course (POC)
        </h1>
        <p className="text-lg text-zinc-300">
          Learn through video-first lessons in the initial Foundations track.
          This is a POC for the full Developers Learn experience.
        </p>
        <p className="mt-4 text-sm text-zinc-400">
          {isHydrated
            ? `${summary.completedCount} of ${summary.totalLessonCount} lessons complete`
            : "Loading progress..."}
        </p>
        {isHydrated ? (
          <button
            type="button"
            onClick={() => clearProgress()}
            className="mt-4 rounded-md border border-zinc-700 px-3 py-2 text-xs uppercase tracking-wide text-zinc-300 transition-colors hover:border-zinc-500 hover:bg-zinc-900 hover:text-white"
          >
            Reset progress
          </button>
        ) : null}
      </header>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {developersLearnCourses.map((course, index) => {
          const progress = getDevelopersLearnCourseProgress(
            course,
            completedLessonsSet,
          );
          const courseUnlocked = isDevelopersLearnCourseUnlocked(
            course.slug,
            completedLessonsSet,
          );
          const nextIncompleteLesson = getDevelopersLearnNextIncompleteLesson(
            course.slug,
            completedLessonsSet,
          );
          const prerequisiteCourseSlug =
            getDevelopersLearnPrerequisiteCourseSlug(course.slug);
          const prerequisiteCourseTitle = prerequisiteCourseSlug
            ? getDevelopersLearnCourseBySlug(prerequisiteCourseSlug)?.title
            : null;

          return (
            <section
              key={course.id}
              className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-6"
            >
              <p className="mb-2 text-xs tracking-[0.2em] uppercase text-zinc-400">
                Course {index + 1}
              </p>
              <h2 className="mb-2 text-2xl font-semibold text-white">
                {course.title}
              </h2>
              <p className="mb-4 text-sm text-zinc-300">{course.description}</p>
              <p className="mb-4 text-xs uppercase tracking-wide text-zinc-500">
                {course.level} · {course.estimatedDuration}
              </p>

              <div className="mb-3 h-2 overflow-hidden rounded-full bg-zinc-800">
                <div
                  className="h-full rounded-full bg-emerald-400 transition-all"
                  style={{ width: `${progress.percent}%` }}
                />
              </div>
              <p className="mb-5 text-sm text-zinc-400">
                {progress.completedCount}/{progress.totalCount} lessons completed
              </p>

              {courseUnlocked ? (
                <>
                  <Link
                    href={`/developers/learn/${course.slug}`}
                    className="inline-flex items-center rounded-md border border-zinc-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:border-zinc-500 hover:bg-zinc-900"
                  >
                    {progress.isComplete ? "Review course" : "Open course"}
                  </Link>
                  {!progress.isComplete && nextIncompleteLesson ? (
                    <p className="mt-3 text-xs text-zinc-500">
                      Next lesson: {nextIncompleteLesson.title}
                    </p>
                  ) : null}
                </>
              ) : (
                <p className="text-sm text-amber-300">
                  Locked until {prerequisiteCourseTitle || "previous course"} is
                  completed.
                </p>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
