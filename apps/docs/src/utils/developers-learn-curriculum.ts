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

export const developersLearnHub = {
  kicker: "Developers Learn",
  title: "Video-first learning for Solana builders",
  description:
    "A long-lived learning library for Solana developers. The 2026 bootcamp is live now, and future focused courses can sit beside it over time.",
  supportPillars: [
    "Video-first learning paths",
    "Structured tracks and episodes",
    "MDX companion guides",
    "Local progress without sign-in",
  ],
  expansionPaths: [
    "Annual bootcamp iterations",
    "Focused project courses",
    "Tooling and framework deep dives",
  ],
} as const;

export const developersLearnFeaturedSeries = {
  label: "Featured series",
  title: "Solana Developer Bootcamp 2026",
  description:
    "The full 2026 bootcamp lives inside Developers Learn as four linked tracks with YouTube episodes, MDX companion guides, code, and local progress tracking.",
  type: "Annual bootcamp iteration",
  primaryMedium: "YouTube",
  companionMedium: "MDX companion guides",
  videoUrl: "https://youtu.be/2pcm7ICRJKU",
  trackCount: 4,
  episodeCount: 16,
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
      "Start with the bootcamp structure, learn the Solana mental model, set up the stack, and ship your first app.",
    level: "beginner",
    estimatedDuration: "5 episodes",
    trackNumber: 1,
    format: "YouTube episodes with MDX companion guides",
    focus:
      "Orientation, mental model, local setup, your first app, and AI workflow",
    delivery:
      "Watch each episode first, then use the companion page for notes, links, and build checkpoints.",
    outcomes: [
      "Understand the bootcamp flow and how to use the companion guides",
      "Understand the Solana mental model",
      "Set up the local developer toolchain",
      "Start from create-solana-dapp",
      "Build with AI while verifying critical blockchain details",
    ],
    repoUrl: developersLearnFeaturedSeries.repoUrl,
    lessons: [
      {
        id: 1,
        slug: "bootcamp-intro",
        title: "Bootcamp Intro",
        instructor: "Solana Dev Team",
        type: "intro",
        description:
          "Get oriented to the 2026 bootcamp, the track structure, and how the companion docs fit into the video flow.",
        expectation: "Bootcamp roadmap",
        buildType: "Mixed",
        video: {
          platform: "YouTube",
          status: "Live",
          url: "https://youtu.be/0pp7HyTadPg",
        },
        resourceLinks: [
          {
            label: "Bootcamp repo",
            href: developersLearnFeaturedSeries.repoUrl,
          },
        ],
      },
      {
        id: 2,
        slug: "quick-intro-to-blockchain",
        title: "Intro to Blockchain",
        instructor: "Solana Dev Team",
        type: "intro",
        description:
          "Understand the blockchain mental model and how Solana differs.",
        expectation: "Solana mental model",
        buildType: "Mixed",
        video: {
          platform: "YouTube",
          status: "Live",
          url: "https://youtu.be/rW4zWO08ttc",
        },
      },
      {
        id: 3,
        slug: "local-installation",
        title: "Local Installation",
        instructor: "Solana Dev Team",
        type: "project",
        description:
          "Install the shared bootcamp stack and validate a working local setup.",
        expectation: "Local toolchain setup",
        buildType: "Mixed",
        video: {
          platform: "YouTube",
          status: "Live",
          url: "https://youtu.be/_Um3PGeTNI4",
        },
      },
      {
        id: 4,
        slug: "hello-world",
        title: "Hello World",
        instructor: "Solana Dev Team",
        type: "project",
        description:
          "Start from create-solana-dapp and ship your first fullstack Solana app.",
        expectation: "create-solana-dapp",
        buildType: "Fullstack",
        video: {
          platform: "YouTube",
          status: "Live",
          url: "https://youtu.be/LkA2PPbKK3o",
        },
        resourceLinks: [
          {
            label: "Bootcamp repo",
            href: developersLearnFeaturedSeries.repoUrl,
          },
        ],
      },
      {
        id: 5,
        slug: "ai-best-practices",
        title: "Bonus Lesson: AI Best Practices",
        instructor: "Solana Dev Team",
        type: "bonus",
        description:
          "Use AI tools effectively while still verifying blockchain-critical details.",
        expectation: "AI-assisted development discipline",
        buildType: "Mixed",
        video: {
          platform: "YouTube",
          status: "Live",
          url: "https://youtu.be/pk8iIZiGKtM",
        },
      },
    ],
  },
  {
    id: 2,
    slug: "program-patterns",
    title: "Program Patterns",
    description:
      "Move from basics into reusable onchain patterns for state, escrow, token flows, swaps, and security reviews.",
    level: "intermediate",
    estimatedDuration: "5 episodes",
    trackNumber: 2,
    format: "YouTube episodes with MDX companion guides",
    focus: "State, token mechanics, swap patterns, and security review",
    delivery:
      "Watch each episode first, then use the companion page for notes, links, and build checkpoints.",
    outcomes: [
      "Model program state with confidence",
      "Use escrow and authority patterns",
      "Reason about token mint and swap flows",
      "Review programs with security in mind",
    ],
    repoUrl: developersLearnFeaturedSeries.repoUrl,
    lessons: [
      {
        id: 1,
        slug: "voting",
        title: "Voting",
        instructor: "Solana Dev Team",
        type: "project",
        description:
          "Build a voting app to practice state initialization, updates, and account-driven program logic.",
        expectation: "State and instruction design",
        buildType: "Program",
        video: {
          platform: "YouTube",
          status: "Live",
          url: "https://youtu.be/Pwq6Kc7MlC0",
        },
        resourceLinks: [
          {
            label: "Bootcamp repo",
            href: developersLearnFeaturedSeries.repoUrl,
          },
        ],
      },
      {
        id: 2,
        slug: "escrow-application",
        title: "Escrow Application",
        instructor: "Solana Dev Team",
        type: "project",
        description:
          "Implement an escrow flow with explicit state transitions, PDAs, and authority checks.",
        expectation: "Escrow state transitions",
        buildType: "Program",
        video: {
          platform: "YouTube",
          status: "Live",
          url: "https://youtu.be/lWyrONFrBuI",
        },
        resourceLinks: [
          {
            label: "Bootcamp repo",
            href: developersLearnFeaturedSeries.repoUrl,
          },
        ],
      },
      {
        id: 3,
        slug: "stable-coin",
        title: "Stable Coin",
        instructor: "Solana Dev Team",
        type: "project",
        description:
          "Create a stable coin style token flow and understand mint, authority, and supply management.",
        expectation: "Token mint and transfer flows",
        buildType: "Program",
        video: {
          platform: "YouTube",
          status: "Live",
          url: "https://youtu.be/GKxYdyD1Otk",
        },
        resourceLinks: [
          {
            label: "Bootcamp repo",
            href: developersLearnFeaturedSeries.repoUrl,
          },
        ],
      },
      {
        id: 4,
        slug: "stable-swap",
        title: "Stable Swap",
        instructor: "Solana Dev Team",
        type: "project",
        description:
          "Work through a stable swap implementation and the core rules behind pool behavior.",
        expectation: "AMM mechanics",
        buildType: "Program",
        video: {
          platform: "YouTube",
          status: "Live",
          url: "https://youtu.be/7KloeSesgPw",
        },
        resourceLinks: [
          {
            label: "Bootcamp repo",
            href: developersLearnFeaturedSeries.repoUrl,
          },
        ],
      },
      {
        id: 5,
        slug: "security",
        title: "Security",
        instructor: "Solana Dev Team",
        type: "project",
        description:
          "Audit the patterns you have used so far and learn the checks to make before shipping.",
        expectation: "Threat modeling and review",
        buildType: "Program",
        video: {
          platform: "YouTube",
          status: "Live",
          url: "https://youtu.be/UgUPbdGWowM",
        },
        resourceLinks: [
          {
            label: "Bootcamp repo",
            href: developersLearnFeaturedSeries.repoUrl,
          },
        ],
      },
    ],
  },
  {
    id: 3,
    slug: "fullstack-apps",
    title: "Fullstack Applications",
    description:
      "Pair onchain programs with app UX, integrations, and real product flows.",
    level: "intermediate",
    estimatedDuration: "4 episodes",
    trackNumber: 3,
    format: "YouTube episodes with MDX companion guides",
    focus:
      "Client UX, integration patterns, and product-shaped Solana applications",
    delivery:
      "Watch each episode first, then use the companion page for notes, links, and build checkpoints.",
    outcomes: [
      "Connect onchain actions to product UX",
      "Apply payment and protocol integrations",
      "Reason through vertical use cases",
      "Ship end-to-end application flows",
    ],
    repoUrl: developersLearnFeaturedSeries.repoUrl,
    lessons: [
      {
        id: 1,
        slug: "private-transfers",
        title: "Private Transfers",
        instructor: "Solana Dev Team",
        type: "project",
        description:
          "Build a fullstack flow for private transfers and reason about UX, state, and privacy tradeoffs.",
        expectation: "Private transaction flow",
        buildType: "Fullstack",
        video: {
          platform: "YouTube",
          status: "Live",
          url: "https://youtu.be/ElCcz76ZnSE",
        },
        resourceLinks: [
          {
            label: "Bootcamp repo",
            href: developersLearnFeaturedSeries.repoUrl,
          },
        ],
      },
      {
        id: 2,
        slug: "x402",
        title: "x402",
        instructor: "Solana Dev Team",
        type: "project",
        description:
          "Apply x402 patterns in a product context and understand how onchain payments map to app requests.",
        expectation: "x402 integration",
        buildType: "Fullstack",
        video: {
          platform: "YouTube",
          status: "Live",
          url: "https://youtu.be/-TGLnDP0U5k",
        },
        resourceLinks: [
          {
            label: "Bootcamp repo",
            href: developersLearnFeaturedSeries.repoUrl,
          },
        ],
      },
      {
        id: 3,
        slug: "real-world-assets",
        title: "Real-World Assets",
        instructor: "Solana Dev Team",
        type: "project",
        description:
          "Connect the bootcamp stack to a real-world asset use case and think through product constraints.",
        expectation: "RWA product design",
        buildType: "Fullstack",
        video: {
          platform: "YouTube",
          status: "Live",
          url: "https://youtu.be/WLQkD7e-te8",
        },
        resourceLinks: [
          {
            label: "Bootcamp repo",
            href: developersLearnFeaturedSeries.repoUrl,
          },
        ],
      },
      {
        id: 4,
        slug: "prediction-market",
        title: "Prediction Market",
        instructor: "Solana Dev Team",
        type: "project",
        description:
          "Ship a prediction market flow with market mechanics, user actions, and application-layer guardrails.",
        expectation: "Market mechanics",
        buildType: "Fullstack",
        video: {
          platform: "YouTube",
          status: "Live",
          url: "https://youtu.be/c3qgfZmdbc0",
        },
        resourceLinks: [
          {
            label: "Bootcamp repo",
            href: developersLearnFeaturedSeries.repoUrl,
          },
        ],
      },
    ],
  },
  {
    id: 4,
    slug: "shipping-production",
    title: "Shipping & Production",
    description:
      "Close the loop with indexing, production readiness, and the operational details required to ship.",
    level: "advanced",
    estimatedDuration: "2 episodes",
    trackNumber: 4,
    format: "YouTube episodes with MDX companion guides",
    focus: "Indexing, observability, deployment, and launch readiness",
    delivery:
      "Watch each episode first, then use the companion page for notes, links, and build checkpoints.",
    outcomes: [
      "Index onchain data for product surfaces",
      "Prepare launch checklists and monitoring",
      "Tighten operational readiness before release",
    ],
    repoUrl: developersLearnFeaturedSeries.repoUrl,
    lessons: [
      {
        id: 1,
        slug: "indexing",
        title: "Bonus Lesson 2: Indexing",
        instructor: "Solana Dev Team",
        type: "bonus",
        description:
          "Add indexing to the stack so product surfaces can query and present onchain data reliably.",
        expectation: "Data pipelines and read models",
        buildType: "Mixed",
        video: {
          platform: "YouTube",
          status: "Live",
          url: "https://youtu.be/cQY320Mo-HQ",
        },
        resourceLinks: [
          {
            label: "Bootcamp repo",
            href: developersLearnFeaturedSeries.repoUrl,
          },
        ],
      },
      {
        id: 2,
        slug: "production-readiness",
        title: "Production Readiness",
        instructor: "Solana Dev Team",
        type: "project",
        description:
          "Review deployment, monitoring, security, and team processes that turn a prototype into a production app.",
        expectation: "Launch readiness",
        buildType: "Mixed",
        video: {
          platform: "YouTube",
          status: "Live",
          url: "https://youtu.be/ezaNcGLcruU",
        },
        resourceLinks: [
          {
            label: "Bootcamp repo",
            href: developersLearnFeaturedSeries.repoUrl,
          },
        ],
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
      "Start here: get oriented, learn the Solana mental model, set up the stack, and build your first app.",
    status: "Available now",
    buildType: "Mixed",
    estimatedDuration: "5 episodes",
    projects: [
      "Bootcamp Intro",
      "Intro to Blockchain",
      "Local Installation",
      "Hello World",
      "Bonus Lesson: AI Best Practices",
    ],
    outcomes: [
      "Bootcamp flow",
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
      "Program-first episodes for state, escrow, token primitives, swap logic, and security hygiene.",
    status: "Available now",
    buildType: "Program",
    estimatedDuration: "5 episodes",
    projects: [
      "Voting",
      "Escrow Application",
      "Stable Coin",
      "Stable Swap",
      "Security",
    ],
    outcomes: [
      "Stateful programs",
      "Authority patterns",
      "Token and swap mechanics",
      "Security review muscle",
    ],
  },
  {
    id: 3,
    slug: "fullstack-apps",
    title: "Fullstack Applications",
    description:
      "Fullstack builds where the program is only part of the product surface.",
    status: "Available now",
    buildType: "Fullstack",
    estimatedDuration: "4 episodes",
    projects: [
      "Private Transfers",
      "x402",
      "Real-World Assets",
      "Prediction Market",
    ],
    outcomes: [
      "Fullstack transaction flows",
      "Product integrations",
      "Vertical application design",
      "Market mechanics",
    ],
  },
  {
    id: 4,
    slug: "shipping-production",
    title: "Shipping & Production",
    description:
      "Episodes focused on getting from prototype to indexed, monitored, production-ready shipping.",
    status: "Available now",
    buildType: "Mixed",
    estimatedDuration: "2 episodes",
    projects: ["Bonus Lesson 2: Indexing", "Production Readiness"],
    outcomes: [
      "Indexing pipelines",
      "Deployment readiness",
      "Operational launch checklist",
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
