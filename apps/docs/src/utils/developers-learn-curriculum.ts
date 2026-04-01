export type DevelopersLearnLessonType = "intro" | "project" | "bonus";
export type DevelopersLearnBuildType =
  | "Mixed"
  | "Program"
  | "Fullstack"
  | "Client only";

export type DevelopersLearnResourceLink = {
  label: string;
  href: string;
};

export type DevelopersLearnVideo = {
  platform: "YouTube";
  status: "Publishing soon" | "Live";
  url?: string;
  note?: string;
};

export type DevelopersLearnLesson = {
  id: number;
  slug: string;
  title: string;
  instructor: string;
  type: DevelopersLearnLessonType;
  description: string;
  expectation: string;
  buildType: DevelopersLearnBuildType;
  video: DevelopersLearnVideo;
  resourceLinks?: DevelopersLearnResourceLink[];
};

export type DevelopersLearnCourse = {
  id: number;
  slug: string;
  title: string;
  description: string;
  level: "beginner" | "intermediate" | "advanced";
  estimatedDuration: string;
  trackNumber: number;
  format: string;
  focus: string;
  delivery: string;
  outcomes: string[];
  repoUrl: string;
  lessons: DevelopersLearnLesson[];
};

export type DevelopersLearnRoadmapTrack = {
  id: number;
  slug: string;
  title: string;
  description: string;
  status: "Available now" | "Coming soon";
  buildType: DevelopersLearnBuildType;
  estimatedDuration: string;
  projects: string[];
  outcomes: string[];
};

export const developersLearnProgram = {
  kicker: "Developers Learn",
  title: "Solana Bootcamp 2026",
  description:
    "A video-first YouTube bootcamp that turns the latest Solana curriculum into structured learning tracks. Each episode is paired with companion notes, code, and local progress tracking.",
  primaryMedium: "YouTube",
  companionMedium: "MDX companion guides",
  repoUrl: "https://github.com/solana-foundation/solana-bootcamp-2026",
  stack: [
    "create-solana-dapp",
    "Anchor v2",
    "LiteSVM",
    "Surfpool",
    "Framework Kit",
    "Security Roadmap",
    "Next.js client + server",
  ],
  supportPillars: [
    "Video-first episodes",
    "Written companion notes",
    "Code and script links",
    "Local progress without sign-in",
  ],
  learningLoop: [
    "Watch the YouTube episode",
    "Use the companion guide",
    "Open the code and scripts",
    "Track progress locally",
  ],
} as const;

export const developersLearnCourses: DevelopersLearnCourse[] = [
  {
    id: 1,
    slug: "foundations",
    title: "Foundations",
    description:
      "Start with the shared bootcamp stack, learn the Solana mental model, and ship your first end-to-end build.",
    level: "beginner",
    estimatedDuration: "4 episodes",
    trackNumber: 1,
    format: "YouTube episodes with MDX companion guides",
    focus: "Mental model, local setup, and your first fullstack Solana app",
    delivery:
      "Watch each episode first, then use the companion page for notes, links, and build checkpoints.",
    outcomes: [
      "Understand the Solana mental model",
      "Set up the local developer toolchain",
      "Start from create-solana-dapp",
      "Build with AI while verifying critical blockchain details",
    ],
    repoUrl: developersLearnProgram.repoUrl,
    lessons: [
      {
        id: 1,
        slug: "quick-intro-to-blockchain",
        title: "Quick Intro to Blockchain",
        instructor: "Gui",
        type: "intro",
        description:
          "Understand the blockchain mental model and how Solana differs.",
        expectation: "Solana mental model",
        buildType: "Mixed",
        video: {
          platform: "YouTube",
          status: "Publishing soon",
          note: "Episode link will be added when the YouTube upload is live.",
        },
        resourceLinks: [
          {
            label: "Script",
            href: "https://docs.google.com/document/d/1FbwPKniPoPcT2Ikt0vWxuvJUO7-DvNbUGSg4-aUwr7Q/edit?usp=sharing",
          },
        ],
      },
      {
        id: 2,
        slug: "local-installation",
        title: "Local Installation",
        instructor: "Bri",
        type: "project",
        description:
          "Install the shared bootcamp stack and validate a working local setup.",
        expectation: "Local toolchain setup",
        buildType: "Mixed",
        video: {
          platform: "YouTube",
          status: "Publishing soon",
          note: "Episode link will be added when the YouTube upload is live.",
        },
        resourceLinks: [
          {
            label: "Script",
            href: "https://docs.google.com/document/d/1ih6qpZnXeeDeCdC0Aryhn3wbQlpKmGZVQumCoiwcrek/edit?usp=sharing",
          },
        ],
      },
      {
        id: 3,
        slug: "hello-world",
        title: "Hello World",
        instructor: "Gui",
        type: "project",
        description:
          "Start from create-solana-dapp and ship your first fullstack Solana app.",
        expectation: "create-solana-dapp",
        buildType: "Fullstack",
        video: {
          platform: "YouTube",
          status: "Publishing soon",
          note: "Episode link will be added when the YouTube upload is live.",
        },
        resourceLinks: [
          {
            label: "Bootcamp repo",
            href: developersLearnProgram.repoUrl,
          },
        ],
      },
      {
        id: 4,
        slug: "ai-best-practices",
        title: "AI Best Practices",
        instructor: "Gui",
        type: "bonus",
        description:
          "Use AI tools effectively while still verifying blockchain-critical details.",
        expectation: "AI-assisted development discipline",
        buildType: "Mixed",
        video: {
          platform: "YouTube",
          status: "Publishing soon",
          note: "Episode link will be added when the YouTube upload is live.",
        },
      },
    ],
  },
];

export const developersLearnRoadmapTracks: DevelopersLearnRoadmapTrack[] = [
  {
    id: 1,
    slug: "foundations",
    title: "Foundations",
    description:
      "Start here: learn the Solana mental model, set up the stack, and build your first app.",
    status: "Available now",
    buildType: "Mixed",
    estimatedDuration: "4 episodes",
    projects: [
      "Quick Intro to Blockchain",
      "Local Installation",
      "Hello World",
      "AI Best Practices",
    ],
    outcomes: [
      "Shared developer stack",
      "create-solana-dapp",
      "First end-to-end build",
    ],
  },
  {
    id: 2,
    slug: "program-patterns",
    title: "Program Patterns",
    description:
      "Program-first episodes for state, PDAs, token primitives, and security hygiene.",
    status: "Coming soon",
    buildType: "Program",
    estimatedDuration: "4 episodes",
    projects: [
      "Voting",
      "Escrow Application",
      "Stablecoin",
      "Security Checklist",
    ],
    outcomes: [
      "Counter state",
      "PDAs",
      "Token creation",
      "Security review muscle",
    ],
  },
  {
    id: 3,
    slug: "fullstack-apps",
    title: "Fullstack Applications",
    description:
      "Fullstack builds where the program is only part of the product surface.",
    status: "Coming soon",
    buildType: "Fullstack",
    estimatedDuration: "3 episodes",
    projects: ["Private Transfers", "Stable Swap", "Prediction Market"],
    outcomes: ["zkCompression + infra", "Special rules", "Market mechanics"],
  },
  {
    id: 4,
    slug: "shipping-production",
    title: "Shipping & Production",
    description:
      "Episodes focused on getting from prototype to real-world deployment and monetization.",
    status: "Coming soon",
    buildType: "Mixed",
    estimatedDuration: "3 episodes",
    projects: ["Production Deployment", "x402", "RWA - Labubu"],
    outcomes: ["Indexing + prod", "x402 basics", "Anchor + Kit + Codama"],
  },
];

export const developersLearnCourseOrder = developersLearnCourses.map(
  (course) => course.slug,
);

export function getDevelopersLearnCourseBySlug(courseSlug: string) {
  return developersLearnCourses.find((course) => course.slug === courseSlug);
}

export function getDevelopersLearnCourseIndex(courseSlug: string) {
  return developersLearnCourses.findIndex(
    (course) => course.slug === courseSlug,
  );
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

  const lessonIndex = course.lessons.findIndex(
    (lesson) => lesson.slug === lessonSlug,
  );
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

  const lessonIndex = course.lessons.findIndex(
    (lesson) => lesson.slug === lessonSlug,
  );
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
