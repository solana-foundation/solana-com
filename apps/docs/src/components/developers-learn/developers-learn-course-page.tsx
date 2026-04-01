"use client";

import Link from "next/link";
import { useDevelopersLearnProgress } from "@/hooks/useDevelopersLearnProgress";
import {
  developersLearnProgram,
  developersLearnRoadmapTracks,
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
  const nextIncompleteEpisode = getDevelopersLearnNextIncompleteLesson(
    courseSlug,
    completedLessonsSet,
  );
  const courseUnlocked = isDevelopersLearnCourseUnlocked(
    courseSlug,
    completedLessonsSet,
  );
  const prerequisiteTrackSlug =
    getDevelopersLearnPrerequisiteCourseSlug(courseSlug);
  const prerequisiteTrack = prerequisiteTrackSlug
    ? getDevelopersLearnCourseBySlug(prerequisiteTrackSlug)
    : null;
  const upcomingTracks = developersLearnRoadmapTracks.filter(
    (track) => track.slug !== courseSlug,
  );

  return (
    <div className="container py-8 md:py-12">
      <div className="mb-8">
        <Link
          href="/developers/learn"
          className="text-sm text-zinc-500 transition-colors hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50"
        >
          ← All bootcamp tracks
        </Link>
      </div>

      <header className="mb-10 max-w-4xl">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <p className="text-xs tracking-[0.2em] uppercase text-zinc-500 dark:text-zinc-400">
            Track {course.trackNumber}
          </p>
          <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-300">
            Available now
          </span>
        </div>
        <h1 className="mb-3 text-4xl font-semibold text-zinc-950 dark:text-zinc-50 md:text-5xl">
          {course.title}
        </h1>
        <p className="mb-5 text-lg text-zinc-600 dark:text-zinc-300">
          {course.description}
        </p>

        <div className="mb-5 flex flex-wrap gap-2">
          <span className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200">
            Primary medium: {developersLearnProgram.primaryMedium}
          </span>
          <span className="rounded-full border border-zinc-200 bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
            Companion: {developersLearnProgram.companionMedium}
          </span>
          <span className="rounded-full border border-zinc-200 bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
            {course.level}
          </span>
          <span className="rounded-full border border-zinc-200 bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
            {course.estimatedDuration}
          </span>
          <span className="rounded-full border border-zinc-200 bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
            {course.focus}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/80">
            <p className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Format
            </p>
            <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">
              {course.format}
            </p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/80">
            <p className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Delivery
            </p>
            <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">
              {course.delivery}
            </p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/80">
            <p className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Track focus
            </p>
            <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">
              {course.focus}
            </p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/80">
            <p className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Bootcamp repo
            </p>
            <a
              href={course.repoUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex text-sm font-medium text-zinc-950 underline-offset-4 hover:underline dark:text-zinc-50"
            >
              Open source materials
            </a>
          </div>
        </div>

        <div className="mt-6 h-2 max-w-xl overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
          <div
            className="h-full rounded-full bg-emerald-400 transition-all"
            style={{ width: `${progress.percent}%` }}
          />
        </div>
        <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
          {progress.completedCount}/{progress.totalCount} episodes completed
        </p>
        <p className="mt-2 max-w-2xl text-sm text-zinc-500 dark:text-zinc-400">
          Episode pages are companion guides. The primary watch surface will be
          YouTube as each upload goes live.
        </p>

        {courseUnlocked && nextIncompleteEpisode ? (
          <Link
            href={`/developers/learn/${courseSlug}/${nextIncompleteEpisode.slug}`}
            className="mt-5 inline-flex items-center rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:border-zinc-500 dark:hover:bg-zinc-900"
          >
            Continue with {nextIncompleteEpisode.title}
          </Link>
        ) : null}
      </header>

      {!courseUnlocked ? (
        <section className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-6 text-amber-900 dark:text-amber-100">
          <h2 className="mb-2 text-xl font-semibold">Track locked</h2>
          <p className="mb-4 text-sm">
            Complete {prerequisiteTrack?.title || "the previous track"} to
            unlock this track.
          </p>
          {prerequisiteTrack ? (
            <Link
              href={`/developers/learn/${prerequisiteTrack.slug}`}
              className="inline-flex items-center rounded-md border border-amber-400/50 px-4 py-2 text-sm font-medium text-amber-900 transition-colors hover:bg-amber-400/10 dark:text-amber-100"
            >
              Open prerequisite track
            </Link>
          ) : null}
        </section>
      ) : (
        <>
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-zinc-950 dark:text-zinc-50">
              What this track teaches
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {course.outcomes.map((outcome) => (
                <span
                  key={outcome}
                  className="rounded-full border border-zinc-200 bg-zinc-100 px-3 py-1 text-sm font-medium text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
                >
                  {outcome}
                </span>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            {course.lessons.map((lesson, index) => {
              const previousLesson =
                index > 0 ? course.lessons[index - 1] : null;
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
                  className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/80"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-xs tracking-[0.2em] uppercase text-zinc-500 dark:text-zinc-400">
                      Episode {index + 1}
                    </p>
                    <span className="rounded-full border border-zinc-200 bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
                      {lesson.type}
                    </span>
                    <span className="rounded-full border border-zinc-200 bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
                      {lesson.buildType}
                    </span>
                    <span className="rounded-full border border-rose-200 bg-rose-50 px-2 py-0.5 text-xs text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200">
                      {lesson.video.platform}
                    </span>
                    <span className="rounded-full border border-zinc-200 bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
                      {lesson.video.status}
                    </span>
                    <span className="rounded-full border border-zinc-200 bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
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

                  <h2 className="mt-3 text-2xl font-semibold text-zinc-950 dark:text-zinc-50">
                    {lesson.title}
                  </h2>
                  <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
                    {lesson.description}
                  </p>
                  <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
                    Learn: {lesson.expectation}
                  </p>
                  <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                    Companion guide for the {lesson.video.platform} episode.
                    {lesson.video.note ? ` ${lesson.video.note}` : ""}
                  </p>

                  {lesson.resourceLinks?.length ? (
                    <div className="mt-4">
                      <p className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                        Companion assets
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
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
                    </div>
                  ) : null}

                  {lessonUnlocked ? (
                    <Link
                      href={lessonHref}
                      className="mt-4 inline-flex items-center rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:border-zinc-500 dark:hover:bg-zinc-900"
                    >
                      {lessonCompleted
                        ? "Review companion guide"
                        : "Open companion guide"}
                    </Link>
                  ) : (
                    <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
                      Finish {previousLesson?.title || "the previous episode"}{" "}
                      first to unlock this one.
                    </p>
                  )}
                </article>
              );
            })}
          </section>

          <section className="mt-12">
            <h2 className="text-2xl font-semibold text-zinc-950 dark:text-zinc-50">
              Where this track leads next
            </h2>
            <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-3">
              {upcomingTracks.map((track) => (
                <article
                  key={track.id}
                  className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/80"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-zinc-200 bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
                      {track.status}
                    </span>
                    <span className="rounded-full border border-zinc-200 bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
                      {track.buildType}
                    </span>
                  </div>
                  <h3 className="mt-3 text-xl font-semibold text-zinc-950 dark:text-zinc-50">
                    {track.title}
                  </h3>
                  <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
                    {track.description}
                  </p>
                </article>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
