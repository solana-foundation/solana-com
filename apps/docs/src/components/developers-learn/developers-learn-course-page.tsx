"use client";

import Link from "next/link";
import { useDevelopersLearnProgress } from "@/hooks/useDevelopersLearnProgress";
import {
  getDevelopersLearnCourseBySlug,
  getDevelopersLearnCourseProgress,
  getDevelopersLearnLessonKey,
  getDevelopersLearnNextIncompleteLesson,
  getDevelopersLearnPrerequisiteCourseSlug,
  isDevelopersLearnCourseUnlocked,
  isDevelopersLearnLessonUnlocked,
} from "@/utils/developers-learn-curriculum";

export default function DevelopersLearnCoursePage({
  courseSlug,
}: {
  courseSlug: string;
}) {
  const course = getDevelopersLearnCourseBySlug(courseSlug);
  const { completedLessonsSet } = useDevelopersLearnProgress();

  if (!course) {
    return null;
  }

  const progress = getDevelopersLearnCourseProgress(
    course,
    completedLessonsSet,
  );
  const nextIncompleteLesson = getDevelopersLearnNextIncompleteLesson(
    courseSlug,
    completedLessonsSet,
  );
  const courseUnlocked = isDevelopersLearnCourseUnlocked(
    courseSlug,
    completedLessonsSet,
  );
  const prerequisiteCourseSlug =
    getDevelopersLearnPrerequisiteCourseSlug(courseSlug);
  const prerequisiteCourse = prerequisiteCourseSlug
    ? getDevelopersLearnCourseBySlug(prerequisiteCourseSlug)
    : null;

  return (
    <div className="container py-8 md:py-12">
      <div className="mb-8">
        <Link
          href="/developers/learn"
          className="text-sm text-fd-muted-foreground transition-colors hover:text-fd-accent-foreground"
        >
          ← All bootcamp courses
        </Link>
      </div>

      <header className="mb-8 max-w-3xl">
        <p className="mb-2 text-xs tracking-[0.2em] uppercase text-fd-muted-foreground">
          Course
        </p>
        <h1 className="mb-3 text-4xl font-semibold text-[hsl(var(--fd-accent-foreground))] md:text-5xl">
          {course.title}
        </h1>
        <p className="mb-5 text-lg text-fd-muted-foreground">
          {course.description}
        </p>
        <p className="mb-5 text-sm uppercase tracking-wide text-fd-muted-foreground">
          {course.level} · {course.estimatedDuration}
        </p>

        <div className="mb-3 h-2 max-w-xl overflow-hidden rounded-full bg-fd-secondary">
          <div
            className="h-full rounded-full bg-emerald-400 transition-all"
            style={{ width: `${progress.percent}%` }}
          />
        </div>
        <p className="text-sm text-fd-muted-foreground">
          {progress.completedCount}/{progress.totalCount} lessons completed
        </p>

        {courseUnlocked && nextIncompleteLesson ? (
          <Link
            href={`/developers/learn/${courseSlug}/${nextIncompleteLesson.slug}`}
            className="mt-5 inline-flex items-center rounded-md border bg-fd-card px-4 py-2 text-sm font-medium text-[hsl(var(--fd-accent-foreground))] transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground"
          >
            Continue from {nextIncompleteLesson.title}
          </Link>
        ) : null}
      </header>

      {!courseUnlocked ? (
        <section className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-6 text-amber-900 dark:text-amber-100">
          <h2 className="mb-2 text-xl font-semibold">Course locked</h2>
          <p className="mb-4 text-sm">
            Complete {prerequisiteCourse?.title || "the previous course"} to
            unlock this track.
          </p>
          {prerequisiteCourse ? (
            <Link
              href={`/developers/learn/${prerequisiteCourse.slug}`}
              className="inline-flex items-center rounded-md border border-amber-400/50 px-4 py-2 text-sm font-medium text-amber-900 transition-colors hover:bg-amber-400/10 dark:text-amber-100"
            >
              Open prerequisite course
            </Link>
          ) : null}
        </section>
      ) : (
        <section className="space-y-4">
          {course.lessons.map((lesson, index) => {
            const previousLesson = index > 0 ? course.lessons[index - 1] : null;
            const lessonKey = getDevelopersLearnLessonKey(
              courseSlug,
              lesson.slug,
            );
            const lessonCompleted = completedLessonsSet.has(lessonKey);
            const lessonUnlocked = isDevelopersLearnLessonUnlocked(
              courseSlug,
              lesson.slug,
              completedLessonsSet,
            );
            const lessonHref = `/developers/learn/${courseSlug}/${lesson.slug}`;

            return (
              <article
                key={lesson.id}
                className="rounded-xl border bg-fd-card p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-xs tracking-[0.2em] uppercase text-fd-muted-foreground">
                    Lesson {index + 1}
                  </p>
                  <span className="rounded-full border bg-fd-secondary px-2 py-0.5 text-xs text-fd-muted-foreground">
                    {lesson.type}
                  </span>
                  <span className="rounded-full border bg-fd-secondary px-2 py-0.5 text-xs text-fd-muted-foreground">
                    Instructor: {lesson.instructor}
                  </span>
                  {lessonCompleted ? (
                    <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-700 dark:text-emerald-300">
                      Completed
                    </span>
                  ) : null}
                  {!lessonUnlocked ? (
                    <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-xs text-amber-700 dark:text-amber-300">
                      Locked
                    </span>
                  ) : null}
                </div>

                <h2 className="mt-3 text-2xl font-semibold text-[hsl(var(--fd-accent-foreground))]">
                  {lesson.title}
                </h2>
                <p className="mt-2 text-sm text-fd-muted-foreground">
                  {lesson.description}
                </p>

                {lessonUnlocked ? (
                  <Link
                    href={lessonHref}
                    className="mt-4 inline-flex items-center rounded-md border bg-fd-card px-4 py-2 text-sm font-medium text-[hsl(var(--fd-accent-foreground))] transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground"
                  >
                    {lessonCompleted ? "Review lesson" : "Start lesson"}
                  </Link>
                ) : (
                  <p className="mt-4 text-sm text-fd-muted-foreground">
                    Finish {previousLesson?.title || "the previous lesson"}{" "}
                    first to unlock this lesson.
                  </p>
                )}
              </article>
            );
          })}
        </section>
      )}
    </div>
  );
}
