export type DevelopersLearnLessonType = "intro" | "project" | "bonus";

export type DevelopersLearnLesson = {
  id: number;
  slug: string;
  title: string;
  instructor: string;
  type: DevelopersLearnLessonType;
  description: string;
};

export type DevelopersLearnCourse = {
  id: number;
  slug: string;
  title: string;
  description: string;
  level: "beginner" | "intermediate" | "advanced";
  estimatedDuration: string;
  lessons: DevelopersLearnLesson[];
};

export const developersLearnCourses: DevelopersLearnCourse[] = [
  {
    id: 1,
    slug: "foundations",
    title: "Solana Bootcamp Foundations",
    description:
      "From blockchain fundamentals to your first on-chain program setup.",
    level: "beginner",
    estimatedDuration: "4 lessons",
    lessons: [
      {
        id: 1,
        slug: "quick-intro-to-blockchain",
        title: "Quick Intro to Blockchain",
        instructor: "Gui",
        type: "intro",
        description:
          "Understand the blockchain mental model and how Solana differs.",
      },
      {
        id: 2,
        slug: "local-installation",
        title: "Project 1: Local Installation",
        instructor: "Bri",
        type: "project",
        description:
          "Install your local toolchain and validate a working dev setup.",
      },
      {
        id: 3,
        slug: "hello-world",
        title: "Project 2: Hello World",
        instructor: "Gui",
        type: "project",
        description:
          "Build and run your first Solana project end-to-end on local/devnet.",
      },
      {
        id: 4,
        slug: "ai-best-practices",
        title: "Bonus Lesson 1: AI Best Practices",
        instructor: "Gui",
        type: "bonus",
        description:
          "Use AI tools effectively while still verifying blockchain-critical details.",
      },
    ],
  },
];

export const developersLearnCourseOrder = developersLearnCourses.map(
  (course) => course.slug,
);

export function getDevelopersLearnCourseBySlug(courseSlug: string) {
  return developersLearnCourses.find((course) => course.slug === courseSlug);
}

export function getDevelopersLearnCourseIndex(courseSlug: string) {
  return developersLearnCourses.findIndex((course) => course.slug === courseSlug);
}

export function getDevelopersLearnLesson(
  courseSlug: string,
  lessonSlug: string,
) {
  return getDevelopersLearnCourseBySlug(courseSlug)?.lessons.find(
    (lesson) => lesson.slug === lessonSlug,
  );
}

export function getDevelopersLearnLessonIndex(
  courseSlug: string,
  lessonSlug: string,
) {
  const course = getDevelopersLearnCourseBySlug(courseSlug);
  if (!course) {
    return -1;
  }
  return course.lessons.findIndex((lesson) => lesson.slug === lessonSlug);
}

export function getDevelopersLearnLessonKey(
  courseSlug: string,
  lessonSlug: string,
) {
  return `${courseSlug}/${lessonSlug}`;
}

export function getDevelopersLearnPrerequisiteCourseSlug(courseSlug: string) {
  const courseIndex = getDevelopersLearnCourseIndex(courseSlug);
  if (courseIndex <= 0) {
    return null;
  }

  return developersLearnCourses[courseIndex - 1].slug;
}

export function getDevelopersLearnCourseProgress(
  course: DevelopersLearnCourse,
  completedLessons: ReadonlySet<string>,
) {
  const totalCount = course.lessons.length;
  const completedCount = course.lessons.reduce((count, lesson) => {
    const lessonKey = getDevelopersLearnLessonKey(course.slug, lesson.slug);
    return completedLessons.has(lessonKey) ? count + 1 : count;
  }, 0);

  return {
    totalCount,
    completedCount,
    percent:
      totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0,
    isComplete: completedCount > 0 && completedCount === totalCount,
  };
}

export function isDevelopersLearnCourseUnlocked(
  courseSlug: string,
  completedLessons: ReadonlySet<string>,
) {
  const prerequisiteCourseSlug =
    getDevelopersLearnPrerequisiteCourseSlug(courseSlug);
  if (!prerequisiteCourseSlug) {
    return true;
  }

  const prerequisiteCourse = getDevelopersLearnCourseBySlug(
    prerequisiteCourseSlug,
  );
  if (!prerequisiteCourse) {
    return false;
  }

  return prerequisiteCourse.lessons.every((lesson) =>
    completedLessons.has(
      getDevelopersLearnLessonKey(prerequisiteCourseSlug, lesson.slug),
    ),
  );
}

export function isDevelopersLearnLessonUnlocked(
  courseSlug: string,
  lessonSlug: string,
  completedLessons: ReadonlySet<string>,
) {
  const course = getDevelopersLearnCourseBySlug(courseSlug);
  if (!course) {
    return false;
  }

  if (!isDevelopersLearnCourseUnlocked(courseSlug, completedLessons)) {
    return false;
  }

  const lessonIndex = course.lessons.findIndex((lesson) => lesson.slug === lessonSlug);
  if (lessonIndex < 0) {
    return false;
  }

  if (lessonIndex === 0) {
    return true;
  }

  const previousLessonSlug = course.lessons[lessonIndex - 1].slug;
  return completedLessons.has(
    getDevelopersLearnLessonKey(courseSlug, previousLessonSlug),
  );
}

export function getDevelopersLearnNextLesson(
  courseSlug: string,
  lessonSlug: string,
) {
  const course = getDevelopersLearnCourseBySlug(courseSlug);
  if (!course) {
    return null;
  }

  const lessonIndex = course.lessons.findIndex((lesson) => lesson.slug === lessonSlug);
  if (lessonIndex < 0 || lessonIndex >= course.lessons.length - 1) {
    return null;
  }

  return course.lessons[lessonIndex + 1];
}

export function getDevelopersLearnNextCourse(courseSlug: string) {
  const courseIndex = getDevelopersLearnCourseIndex(courseSlug);
  if (courseIndex < 0 || courseIndex >= developersLearnCourses.length - 1) {
    return null;
  }
  return developersLearnCourses[courseIndex + 1];
}

export function getDevelopersLearnNextIncompleteLesson(
  courseSlug: string,
  completedLessons: ReadonlySet<string>,
) {
  const course = getDevelopersLearnCourseBySlug(courseSlug);
  if (!course) {
    return null;
  }

  for (const lesson of course.lessons) {
    const lessonKey = getDevelopersLearnLessonKey(courseSlug, lesson.slug);
    if (!completedLessons.has(lessonKey)) {
      return lesson;
    }
  }

  return null;
}

export function getDevelopersLearnDependentLessonKeys(
  courseSlug: string,
  lessonSlug: string,
) {
  const courseIndex = getDevelopersLearnCourseIndex(courseSlug);
  const lessonIndex = getDevelopersLearnLessonIndex(courseSlug, lessonSlug);

  if (courseIndex < 0 || lessonIndex < 0) {
    return [];
  }

  const dependentLessonKeys: string[] = [];

  for (
    let courseCursor = courseIndex;
    courseCursor < developersLearnCourses.length;
    courseCursor++
  ) {
    const cursorCourse = developersLearnCourses[courseCursor];
    const lessonStartIndex = courseCursor === courseIndex ? lessonIndex : 0;

    for (
      let lessonCursor = lessonStartIndex;
      lessonCursor < cursorCourse.lessons.length;
      lessonCursor++
    ) {
      const cursorLesson = cursorCourse.lessons[lessonCursor];
      dependentLessonKeys.push(
        getDevelopersLearnLessonKey(cursorCourse.slug, cursorLesson.slug),
      );
    }
  }

  return dependentLessonKeys;
}
