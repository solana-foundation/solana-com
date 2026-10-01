import FumaLink from "fumadocs-core/link";
import { PlayCircle } from "@boxicons/react/PlayCircle";
import { MediaThumbnail } from "./MediaThumbnail";

export type CourseCard = {
  title: string;
  /** Internal docs path the card links to. */
  href: string;
  /** Any YouTube URL from the course, used for the card thumbnail. */
  thumbnail: string;
  subtext?: string;
  /** Number of videos in the course, shown as "N videos". */
  videos?: number;
  /** Number of timestamped chapters, shown as "N chapters". */
  chapters?: number;
  /** Total runtime, shown as-is, e.g. "27 min" or "5 hr 12 min". */
  runtime?: string;
  /** Difficulty tag shown as a pill. */
  level?: "Beginner" | "Intermediate" | "Advanced";
  /** Small label above the title, e.g. "Start here" or "Step 2". */
  badge?: string;
};

/**
 * A grid of links to video course pages, each with a YouTube thumbnail.
 * Unlike ProjectCardGrid (whose cards open a video), these link to a docs
 * page, so they suit a landing page that groups several courses.
 */
export function CourseCardGrid({ courses }: { courses: CourseCard[] }) {
  return (
    <div className="not-prose grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {courses.map((course) => (
        <FumaLink
          key={course.href}
          href={course.href}
          className="group flex flex-col gap-3"
        >
          <MediaThumbnail
            href={course.thumbnail}
            placeholderIcon={<PlayCircle className="size-6" />}
          />
          <div className="flex flex-col gap-1">
            {course.badge ? (
              <span className="text-xs font-medium tracking-wide text-fd-primary uppercase">
                {course.badge}
              </span>
            ) : null}
            <span className="font-semibold leading-snug group-hover:underline">
              {course.title}
            </span>
            {course.subtext ? (
              <span className="text-sm text-fd-muted-foreground">
                {course.subtext}
              </span>
            ) : null}
            {course.videos ||
            course.chapters ||
            course.runtime ||
            course.level ? (
              <span className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-fd-muted-foreground">
                {course.level ? (
                  <span className="rounded-full border border-fd-border px-2 py-0.5 font-medium text-fd-foreground">
                    {course.level}
                  </span>
                ) : null}
                {course.videos ? (
                  <span>
                    {course.videos} {course.videos === 1 ? "video" : "videos"}
                  </span>
                ) : null}
                {course.chapters ? (
                  <span>{course.chapters} chapters</span>
                ) : null}
                {(course.videos || course.chapters) && course.runtime ? (
                  <span>·</span>
                ) : null}
                {course.runtime ? (
                  <span className="font-medium text-fd-foreground">
                    {course.runtime}
                  </span>
                ) : null}
              </span>
            ) : null}
          </div>
        </FumaLink>
      ))}
    </div>
  );
}
