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
      <div className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-100">
        This lesson is locked. Complete previous lessons from this track first.
      </div>
    );
  }

  return (
    <div className="mb-8 rounded-xl border border-zinc-800 bg-zinc-950/80 p-4 md:p-5">
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() =>
            completed
              ? markLessonIncomplete(lessonKey)
              : markLessonComplete(lessonKey)
          }
          className="rounded-md border border-zinc-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:border-zinc-500 hover:bg-zinc-900"
        >
          {completed ? "Mark as incomplete" : "Mark lesson complete"}
        </button>

        {completed && nextLesson ? (
          <Link
            href={`/developers/learn/${courseSlug}/${nextLesson.slug}`}
            className="rounded-md border border-emerald-500/40 bg-emerald-500/15 px-4 py-2 text-sm font-medium text-emerald-200 transition-colors hover:bg-emerald-500/25"
          >
            Next lesson
          </Link>
        ) : null}

        {completed && !nextLesson ? (
          <Link
            href={`/developers/learn/${courseSlug}`}
            className="rounded-md border border-zinc-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:border-zinc-500 hover:bg-zinc-900"
          >
            Back to course
          </Link>
        ) : null}

        {completed && !nextLesson && nextCourse ? (
          <Link
            href={`/developers/learn/${nextCourse.slug}`}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              nextCourseUnlocked
                ? "border border-emerald-500/40 bg-emerald-500/15 text-emerald-200 hover:bg-emerald-500/25"
                : "border border-zinc-700 text-zinc-400"
            }`}
          >
            Open next course
          </Link>
        ) : null}
      </div>

      <p className="text-sm text-zinc-400">
        Course progress: {courseProgress.completedCount}/{courseProgress.totalCount}
        {" · "}
        {courseProgress.percent}%
      </p>
    </div>
  );
}
