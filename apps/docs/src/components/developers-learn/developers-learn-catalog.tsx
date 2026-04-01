"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useDevelopersLearnProgress } from "@/hooks/useDevelopersLearnProgress";
import {
  developersLearnFeaturedSeries,
  developersLearnHub,
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
          {developersLearnHub.kicker}
        </p>
        <h1 className="mb-4 text-4xl font-semibold text-zinc-950 dark:text-zinc-50 md:text-5xl">
          {developersLearnHub.title}
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-300">
          {developersLearnHub.description}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {developersLearnHub.supportPillars.map((pillar) => (
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
            Open featured series
          </Link>
          <a
            href={developersLearnFeaturedSeries.repoUrl}
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

      <section className="mb-12 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/80">
          <p className="text-xs tracking-[0.2em] uppercase text-zinc-500 dark:text-zinc-400">
            {developersLearnFeaturedSeries.label}
          </p>
          <h2 className="text-2xl font-semibold text-zinc-950 dark:text-zinc-50">
            {developersLearnFeaturedSeries.title}
          </h2>
          <p className="mt-2 text-zinc-600 dark:text-zinc-300">
            {developersLearnFeaturedSeries.description}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full border border-zinc-200 bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
              {developersLearnFeaturedSeries.type}
            </span>
            <span className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200">
              Primary medium: {developersLearnFeaturedSeries.primaryMedium}
            </span>
            <span className="rounded-full border border-zinc-200 bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
              Companion: {developersLearnFeaturedSeries.companionMedium}
            </span>
          </div>
          <p className="mt-5 text-sm text-zinc-600 dark:text-zinc-300">
            This is the current live series inside Developers Learn. Other
            courses and future bootcamp iterations should be able to sit beside
            it without rewriting the top-level IA.
          </p>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {developersLearnFeaturedSeries.learningLoop.map((step, index) => (
              <div
                key={step}
                className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/80"
              >
                <p className="text-xs tracking-[0.2em] uppercase text-zinc-500 dark:text-zinc-400">
                  Step {index + 1}
                </p>
                <p className="mt-2 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/80">
          <h2 className="text-2xl font-semibold text-zinc-950 dark:text-zinc-50">
            How Developers Learn can expand
          </h2>
          <div className="mt-4 space-y-4 text-sm text-zinc-600 dark:text-zinc-300">
            <p>
              Bootcamp 2026 is one series, not the whole product. The umbrella
              should support multiple learning shapes over time.
            </p>
            <div className="flex flex-wrap gap-2">
              {developersLearnHub.expansionPaths.map((path) => (
                <span
                  key={path}
                  className="rounded-full border border-zinc-200 bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
                >
                  {path}
                </span>
              ))}
            </div>
            <p>
              A future 2027 bootcamp, a wallet course, or a focused Anchor
              series should all feel native here.
            </p>
            <p>
              The current POC keeps only Foundations live, while leaving room
              for more series and tracks later.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <div className="mb-6 max-w-3xl">
          <h2 className="text-2xl font-semibold text-zinc-950 dark:text-zinc-50">
            {developersLearnFeaturedSeries.title} roadmap
          </h2>
          <p className="mt-2 text-zinc-600 dark:text-zinc-300">
            Inside this featured series, we&apos;re organizing the bootcamp into
            tracks and episodes. Foundations is the first live track in the POC.
            The next tracks map to the work already planned across program
            patterns, fullstack apps, and production shipping.
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
                <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                  Primary medium: YouTube episodes
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
                        {progress?.isComplete
                          ? "Review track"
                          : "Browse episodes"}
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
                    Planned next. This should become its own track landing page
                    once the YouTube series is ready.
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
            Every track in {developersLearnFeaturedSeries.title} builds on the
            same stack so the series feels cumulative instead of disconnected.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {developersLearnFeaturedSeries.stack.map((item) => (
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
