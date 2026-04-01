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
    <aside className="sticky top-24 rounded-xl border bg-fd-card p-4">
      <h2 className="mb-3 text-lg font-semibold text-[hsl(var(--fd-accent-foreground))]">
        Course lessons
      </h2>
      <p className="mb-4 text-sm text-fd-muted-foreground">
        {courseProgress.completedCount}/{courseProgress.totalCount} completed
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
          const lessonHref = `/developers/learn/${courseSlug}/${lesson.slug}`;

          const itemContent = (
            <div
              className={`rounded-md border p-3 text-sm transition-colors ${
                isCurrentLesson
                  ? "border-emerald-500/40 bg-emerald-500/10"
                  : "hover:bg-fd-accent/40"
              }`}
            >
              <p className="text-xs uppercase tracking-wide text-fd-muted-foreground">
                Lesson {index + 1}
              </p>
              <p className="font-medium text-[hsl(var(--fd-accent-foreground))]">
                {lesson.title}
              </p>
              <p className="mt-1 text-xs text-fd-muted-foreground">
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
