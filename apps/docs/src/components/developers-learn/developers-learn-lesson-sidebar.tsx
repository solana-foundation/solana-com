"use client";

import Link from "next/link";
import { useDevelopersLearnProgress } from "@/hooks/useDevelopersLearnProgress";
import {
  getDevelopersLearnCourseBySlug,
  getDevelopersLearnCourseProgress,
  getDevelopersLearnLessonKey,
  isDevelopersLearnLessonUnlocked,
} from "@/utils/developers-learn-curriculum";

export default function DevelopersLearnLessonSidebar({
  courseSlug,
  currentLessonSlug,
}: {
  courseSlug: string;
  currentLessonSlug: string;
}) {
  const course = getDevelopersLearnCourseBySlug(courseSlug);
  const { completedLessonsSet } = useDevelopersLearnProgress();

  if (!course) {
    return null;
  }

  const courseProgress = getDevelopersLearnCourseProgress(
    course,
    completedLessonsSet,
  );

  return (
    <aside className="sticky top-24 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/80">
      <h2 className="mb-3 text-lg font-semibold text-zinc-950 dark:text-zinc-50">
        Track episodes
      </h2>
      <p className="mb-4 text-sm text-zinc-500 dark:text-zinc-400">
        {courseProgress.completedCount}/{courseProgress.totalCount} companion
        guides completed
      </p>

      <nav className="space-y-2" aria-label="Course navigation">
        {course.lessons.map((lesson, index) => {
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
          const isCurrentLesson = lesson.slug === currentLessonSlug;
          const lessonHref = `/developers/bootcamp/${courseSlug}/${lesson.slug}`;

          const itemContent = (
            <div
              className={`rounded-md border p-3 text-sm transition-colors ${
                isCurrentLesson
                  ? "border-emerald-500/40 bg-emerald-500/10"
                  : "border-zinc-200 hover:bg-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-900/80"
              }`}
            >
              <p className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                Episode {index + 1}
              </p>
              <p className="font-medium text-zinc-950 dark:text-zinc-50">
                {lesson.title}
              </p>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                {lessonCompleted
                  ? "Completed"
                  : lessonUnlocked
                    ? "Unlocked"
                    : "Locked"}
              </p>
            </div>
          );

          return lessonUnlocked ? (
            <Link key={lesson.id} href={lessonHref}>
              {itemContent}
            </Link>
          ) : (
            <div key={lesson.id} className="opacity-65">
              {itemContent}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
