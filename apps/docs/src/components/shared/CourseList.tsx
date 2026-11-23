import defaultMdxComponents from "fumadocs-ui/mdx";
import { Edit } from "@boxicons/react/Edit";
import FumaLink from "fumadocs-core/link";

export type CourseListItem = {
  title: string;
  /** Internal docs path the card links to. */
  href: string;
  subtext?: string;
  /** Number of videos in the course, shown as "N videos". */
  videos?: number;
  /** Number of projects in the course, shown as "N projects". */
  projects?: number;
  /** Number of timestamped chapters, shown as "N chapters". */
  chapters?: number;
  /** Total runtime, shown as-is, e.g. "27 min" or "5 hr 12 min". */
  runtime?: string;
  level?: "Beginner" | "Intermediate" | "Advanced";
};

function Pill({
  children,
  accent,
}: {
  children: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <span
      className={
        accent
          ? "rounded-full border border-fd-primary/40 bg-fd-primary/10 px-2.5 py-0.5 text-xs font-medium text-fd-primary"
          : "rounded-full border border-fd-border px-2.5 py-0.5 text-xs font-medium text-fd-foreground/80"
      }
    >
      {children}
    </span>
  );
}

function Pills({ course }: { course: CourseListItem }) {
  return (
    <span className="flex flex-wrap gap-2">
      {course.level ? <Pill accent>{course.level}</Pill> : null}
      {course.videos ? (
        <Pill>
          {course.videos} {course.videos === 1 ? "video" : "videos"}
        </Pill>
      ) : null}
      {course.projects ? <Pill>{course.projects} projects</Pill> : null}
      {course.chapters ? <Pill>{course.chapters} chapters</Pill> : null}
      {course.runtime ? <Pill>{course.runtime}</Pill> : null}
    </span>
  );
}

/**
 * A large featured card for the single course a newcomer should open first.
 */
export function CourseHero({
  course,
  cta = "Start the course",
  plain = false,
}: {
  course: CourseListItem;
  cta?: string;
  /** Drop the filled card background, leaving just the border. */
  plain?: boolean;
}) {
  return (
    <FumaLink
      href={course.href}
      className={`not-prose group mt-1 mb-2 block rounded-xl border border-fd-border p-5 ${plain ? "" : "bg-fd-card"} transition-colors hover:border-fd-primary/50`}
    >
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="text-xl font-semibold leading-snug">
            {course.title}
          </span>
          {course.subtext ? (
            <span className="text-sm text-fd-muted-foreground">
              {course.subtext}
            </span>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <Pills course={course} />
          <span className="text-sm font-medium text-fd-primary group-hover:underline">
            {cta} →
          </span>
        </div>
      </div>
    </FumaLink>
  );
}

/**
 * A grid of compact course cards, each with a description and pills for level, video count and runtime.
 */
export function CourseList({ courses }: { courses: CourseListItem[] }) {
  return (
    <div className="not-prose mt-1 mb-2 grid grid-cols-1 gap-2 lg:grid-cols-2">
      {courses.map((course) => (
        <FumaLink
          key={course.href}
          href={course.href}
          className="group flex rounded-xl border border-fd-border p-5 transition-colors hover:border-fd-primary/50"
        >
          <div className="flex min-w-0 flex-col gap-3">
            <span className="font-semibold leading-snug group-hover:underline">
              {course.title}
            </span>
            {course.subtext ? (
              <span className="text-sm text-fd-muted-foreground">
                {course.subtext}
              </span>
            ) : null}
            <Pills course={course} />
          </div>
        </FumaLink>
      ))}
    </div>
  );
}

/**
 * A section heading with a short description on the same line, wrapping
 * below the heading on narrow screens.
 */
export function SectionHeading({
  id,
  title,
  description,
  link,
  tight = false,
}: {
  id: string;
  title: string;
  description?: string;
  /** A link shown on the same line as the heading. */
  link?: { label: string; href: string };
  /** Drop the top margin, for a heading that follows an intro paragraph. */
  tight?: boolean;
}) {
  const H2 = defaultMdxComponents.h2;
  const A = defaultMdxComponents.a;
  return (
    <div className="flex flex-wrap items-baseline gap-x-4">
      <H2 id={id} className={tight ? "mt-0 mb-0" : "mt-6 mb-0"}>
        {title}
      </H2>
      {description ? <p className="m-0">{description}</p> : null}
      {link ? (
        <p className="m-0">
          <A href={link.href} className="inline-flex items-center gap-1.5">
            {link.label}
            <Edit className="size-4" aria-hidden />
          </A>
        </p>
      ) : null}
    </div>
  );
}
