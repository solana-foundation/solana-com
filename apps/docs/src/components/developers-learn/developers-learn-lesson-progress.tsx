"use client";

import Link from "next/link";
import { useDevelopersLearnProgress } from "@/hooks/useDevelopersLearnProgress";
import {
  getDevelopersLearnCourseBySlug,
  getDevelopersLearnCourseProgress,
  getDevelopersLearnLessonKey,
  getDevelopersLearnNextCourse,
  getDevelopersLearnNextLesson,
  isDevelopersLearnCourseUnlocked,
  isDevelopersLearnLessonUnlocked,
} from "@/utils/developers-learn-curriculum";

export default function DevelopersLearnLessonProgress({
  courseSlug,
  lessonSlug,
}: {
  courseSlug: string;
  lessonSlug: string;
}) {
  const {
    completedLessonsSet,
    isLessonCompleted,
    markLessonComplete,
    markLessonIncomplete,
  } = useDevelopersLearnProgress();

  const course = getDevelopersLearnCourseBySlug(courseSlug);
  if (!course) {
    return null;
  }

  const courseUnlocked = isDevelopersLearnCourseUnlocked(
    courseSlug,
    completedLessonsSet,
  );
  const lessonUnlocked = isDevelopersLearnLessonUnlocked(
    courseSlug,
    lessonSlug,
    completedLessonsSet,
  );
  const lessonKey = getDevelopersLearnLessonKey(courseSlug, lessonSlug);
  const completed = isLessonCompleted(lessonKey);
  const courseProgress = getDevelopersLearnCourseProgress(
    course,
    completedLessonsSet,
  );
  const nextLesson = getDevelopersLearnNextLesson(courseSlug, lessonSlug);
  const nextCourse = getDevelopersLearnNextCourse(courseSlug);
  const nextCourseUnlocked = nextCourse
    ? isDevelopersLearnCourseUnlocked(nextCourse.slug, completedLessonsSet)
    : false;

  if (!courseUnlocked || !lessonUnlocked) {
    return (
      <div className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-900 dark:text-amber-100">
        This lesson is locked. Complete previous lessons from this track first.
      </div>
    );
  }

  return (
    <div className="mb-8 rounded-xl border bg-fd-card p-4 md:p-5">
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() =>
            completed
              ? markLessonIncomplete(lessonKey)
              : markLessonComplete(lessonKey)
          }
          className="rounded-md border bg-fd-card px-4 py-2 text-sm font-medium text-[hsl(var(--fd-accent-foreground))] transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground"
        >
          {completed ? "Mark as incomplete" : "Mark lesson complete"}
        </button>

        {completed && nextLesson ? (
          <Link
            href={`/developers/learn/${courseSlug}/${nextLesson.slug}`}
            className="rounded-md border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-500/20 dark:text-emerald-200"
          >
            Next lesson
          </Link>
        ) : null}

        {completed && !nextLesson ? (
          <Link
            href={`/developers/learn/${courseSlug}`}
            className="rounded-md border bg-fd-card px-4 py-2 text-sm font-medium text-[hsl(var(--fd-accent-foreground))] transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground"
          >
            Back to course
          </Link>
        ) : null}

        {completed && !nextLesson && nextCourse ? (
          <Link
            href={`/developers/learn/${nextCourse.slug}`}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              nextCourseUnlocked
                ? "border border-emerald-500/40 bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20 dark:text-emerald-200"
                : "border bg-fd-card text-fd-muted-foreground"
            }`}
          >
            Open next course
          </Link>
        ) : null}
      </div>

      <p className="text-sm text-fd-muted-foreground">
        Course progress: {courseProgress.completedCount}/
        {courseProgress.totalCount}
        {" · "}
        {courseProgress.percent}%
      </p>
    </div>
  );
}
