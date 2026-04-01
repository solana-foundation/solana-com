"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useDevelopersLearnProgress } from "@/hooks/useDevelopersLearnProgress";
import {
  developersLearnProgram,
  developersLearnRoadmapTracks,
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
    const availableTracks = developersLearnRoadmapTracks.filter(
      (track) => track.status === "Available now",
    );
    const totalEpisodeCount = availableTracks.reduce((count, track) => {
      const course = getDevelopersLearnCourseBySlug(track.slug);
      return count + (course?.lessons.length ?? 0);
    }, 0);
    const completedCount = availableTracks.reduce((count, track) => {
      const course = getDevelopersLearnCourseBySlug(track.slug);
      if (!course) {
        return count;
      }

      return (
        count +
        course.lessons.filter((lesson) =>
          completedLessonsSet.has(`${course.slug}/${lesson.slug}`),
        ).length
      );
    }, 0);

    return { totalEpisodeCount, completedCount };
  }, [completedLessonsSet]);

  return (
    <div className="container py-8 md:py-12">
      <header className="mb-10 max-w-4xl">
        <p className="mb-2 text-xs tracking-[0.2em] uppercase text-zinc-500 dark:text-zinc-400">
          {developersLearnProgram.kicker}
        </p>
        <h1 className="mb-4 text-4xl font-semibold text-zinc-950 dark:text-zinc-50 md:text-5xl">
          {developersLearnProgram.title}
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-300">
          {developersLearnProgram.description}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {developersLearnProgram.supportPillars.map((pillar) => (
            <span
              key={pillar}
              className="rounded-full border border-zinc-200 bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
            >
              {pillar}
            </span>
          ))}
        </div>

        <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
          {isHydrated
            ? `${summary.completedCount} of ${summary.totalEpisodeCount} episodes complete`
            : "Loading progress..."}
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/developers/learn/foundations"
            className="inline-flex items-center rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:border-zinc-500 dark:hover:bg-zinc-900"
          >
            Open foundations track
          </Link>
          <a
            href={developersLearnProgram.repoUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-950 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:border-zinc-500 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
          >
            Explore bootcamp repo
          </a>
          {isHydrated ? (
            <button
              type="button"
              onClick={() => clearProgress()}
              className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-950 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:border-zinc-500 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
            >
              Reset progress
            </button>
          ) : null}
        </div>
      </header>

      <section className="mb-12">
        <div className="mb-6 max-w-3xl">
          <h2 className="text-2xl font-semibold text-zinc-950 dark:text-zinc-50">
            Program shape
          </h2>
          <p className="mt-2 text-zinc-600 dark:text-zinc-300">
            We&apos;re organizing the bootcamp as one flagship video program,
            broken into tracks, then into episodes. Foundations is the first
            track live in this POC. The next tracks map to the work already
            planned across programs, fullstack apps, and production shipping.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          {developersLearnRoadmapTracks.map((track, index) => {
            const course = getDevelopersLearnCourseBySlug(track.slug);
            const progress = course
              ? getDevelopersLearnCourseProgress(course, completedLessonsSet)
              : null;
            const courseUnlocked = course
              ? isDevelopersLearnCourseUnlocked(
                  course.slug,
                  completedLessonsSet,
                )
              : false;
            const nextIncompleteEpisode = course
              ? getDevelopersLearnNextIncompleteLesson(
                  course.slug,
                  completedLessonsSet,
                )
              : null;
            const prerequisiteTrackSlug = course
              ? getDevelopersLearnPrerequisiteCourseSlug(course.slug)
              : null;
            const prerequisiteTrackTitle = prerequisiteTrackSlug
              ? getDevelopersLearnCourseBySlug(prerequisiteTrackSlug)?.title
              : null;

            return (
              <section
                key={track.id}
                className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/80"
              >
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <p className="text-xs tracking-[0.2em] uppercase text-zinc-500 dark:text-zinc-400">
                    Track {index + 1}
                  </p>
                  <span
                    className={`rounded-full border px-2 py-0.5 text-xs font-medium ${
                      track.status === "Available now"
                        ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                        : "border-zinc-200 bg-zinc-100 text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
                    }`}
                  >
                    {track.status}
                  </span>
                  <span className="rounded-full border border-zinc-200 bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
                    {track.buildType}
                  </span>
                </div>

                <h3 className="text-2xl font-semibold text-zinc-950 dark:text-zinc-50">
                  {track.title}
                </h3>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
                  {track.description}
                </p>
                <p className="mt-4 text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                  {track.estimatedDuration}
                </p>

                {course && progress ? (
                  <>
                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                      <div
                        className="h-full rounded-full bg-emerald-400 transition-all"
                        style={{ width: `${progress.percent}%` }}
                      />
                    </div>
                    <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
                      {progress.completedCount}/{progress.totalCount} episodes
                      completed
                    </p>
                  </>
                ) : (
                  <div className="mt-4">
                    <p className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                      Planned projects
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {track.projects.map((project) => (
                        <span
                          key={project}
                          className="rounded-full border border-zinc-200 bg-zinc-100 px-3 py-1 text-xs text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
                        >
                          {project}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-5">
                  <p className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                    Learning outcomes
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {track.outcomes.map((outcome) => (
                      <span
                        key={outcome}
                        className="rounded-full border border-zinc-200 bg-zinc-100 px-3 py-1 text-xs text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
                      >
                        {outcome}
                      </span>
                    ))}
                  </div>
                </div>

                {course ? (
                  courseUnlocked ? (
                    <>
                      <Link
                        href={`/developers/learn/${course.slug}`}
                        className="mt-5 inline-flex items-center rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:border-zinc-500 dark:hover:bg-zinc-900"
                      >
                        {progress?.isComplete ? "Review track" : "Open track"}
                      </Link>
                      {!progress?.isComplete && nextIncompleteEpisode ? (
                        <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">
                          Next episode: {nextIncompleteEpisode.title}
                        </p>
                      ) : null}
                    </>
                  ) : (
                    <p className="mt-5 text-sm text-amber-700 dark:text-amber-300">
                      Locked until {prerequisiteTrackTitle || "previous track"}{" "}
                      is completed.
                    </p>
                  )
                ) : (
                  <p className="mt-5 text-sm text-zinc-500 dark:text-zinc-400">
                    Planned next. This should become its own landing page once
                    the video series is ready.
                  </p>
                )}
              </section>
            );
          })}
        </div>
      </section>

      <section>
        <div className="mb-4 max-w-3xl">
          <h2 className="text-2xl font-semibold text-zinc-950 dark:text-zinc-50">
            Shared stack
          </h2>
          <p className="mt-2 text-zinc-600 dark:text-zinc-300">
            Every track builds on the same stack so the program feels cumulative
            instead of disconnected.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {developersLearnProgram.stack.map((item) => (
            <span
              key={item}
              className="rounded-full border border-zinc-200 bg-zinc-100 px-3 py-1 text-sm font-medium text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
            >
              {item}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
