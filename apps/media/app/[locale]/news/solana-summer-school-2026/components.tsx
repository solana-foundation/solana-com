import Image from "next/image";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { StudentProjects } from "./student-projects";
import { StudentVoicesCarousel } from "./student-voices-carousel";
import {
  SummerSchoolCurriculum,
  SummerSchoolHero,
  SummerSchoolLecturers,
  SummerSchoolNextSteps,
  SummerSchoolNumbers,
} from "./zine-sections";

const uploadRoot = "/uploads/posts/solana-summer-school-2026";

const plates = {
  hero: {
    src: `${uploadRoot}/hero.webp`,
    width: 1512,
    height: 878,
    alt: "Solana Summer School 2026 collage with the program dates, June 15 through August 15.",
  },
  numbers: {
    src: `${uploadRoot}/numbers.webp`,
    width: 1512,
    height: 1181,
    alt: "A hand-drawn world map showing 1,164 applicants from 69 countries, five weeks of live classes, four weeks of capstone building, and 20 demo-day teams.",
  },
  curriculum: {
    src: `${uploadRoot}/curriculum.webp`,
    width: 1512,
    height: 1052,
    alt: "The six-part Solana Summer School curriculum, from architecture and Anchor through project office hours.",
  },
  "guest-lecturers": {
    src: `${uploadRoot}/guest-lecturers.webp`,
    width: 1512,
    height: 1467,
    alt: "Cutout portraits of guest lecturers Cat McGee, Dev Bharel, Dean Little, Chaerin Kim, André Correia, and Jacob Creech.",
  },
  "whats-next": {
    src: `${uploadRoot}/whats-next.webp`,
    width: 1512,
    height: 1175,
    alt: "What is next: the Solana School fall class and University Ambassador Program.",
  },
  credits: {
    src: `${uploadRoot}/credits.webp`,
    width: 1512,
    height: 825,
    alt: "Solana Summer School credits page.",
  },
} as const;

type PlateName = keyof typeof plates;

export function ZinePlate({
  name,
  priority = false,
}: {
  name: PlateName;
  priority?: boolean;
}) {
  const plate = plates[name];

  return (
    <figure className="not-prose relative mx-auto w-full max-w-[1512px] overflow-hidden">
      <Image
        src={plate.src}
        alt={plate.alt}
        width={plate.width}
        height={plate.height}
        priority={priority}
        className="block h-auto w-full max-w-none select-none"
        sizes="(max-width: 1512px) 100vw, 1512px"
      />
    </figure>
  );
}

const accentClasses = {
  green: "border-[#14f195] text-[#14f195]",
  yellow: "border-[#ffe45e] text-[#ffe45e]",
  purple: "border-[#9945ff] text-[#c9a7ff]",
} as const;

export function ZineCopy({
  eyebrow,
  title,
  accent = "green",
  children,
}: {
  eyebrow: string;
  title: string;
  accent?: keyof typeof accentClasses;
  children: ReactNode;
}) {
  return (
    <section className="not-prose mx-auto w-full max-w-[840px] px-6 py-20 md:px-10 md:py-28">
      <div className={`border-l-2 pl-6 md:pl-10 ${accentClasses[accent]}`}>
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.24em]">
          {eyebrow}
        </p>
        <h2 className="max-w-[700px] text-4xl font-light leading-[0.98] tracking-[-0.04em] text-white md:text-6xl">
          {title}
        </h2>
      </div>
      <div className="mt-10 space-y-6 text-lg font-light leading-8 text-white/70 md:ml-12 md:text-xl md:leading-9">
        {children}
      </div>
    </section>
  );
}

const lecturers = [
  {
    name: "Cat McGee",
    role: "Developer Relations Engineer, Solana Foundation",
    handle: "@catmcgee",
    href: "https://x.com/catmcgee",
  },
  {
    name: "Dev Bharel",
    role: "Developer Relations Engineer, AI, Solana Foundation",
    handle: "@spacemandev",
    href: "https://x.com/spacemandev",
  },
  {
    name: "Dean Little",
    role: "Founder, Blueshift",
    handle: "@deanmlittle",
    href: "https://x.com/deanmlittle",
  },
  {
    name: "Chaerin Kim",
    role: "Developer Relations",
    handle: "@decentra1ized_",
    href: "https://x.com/decentra1ized_",
  },
  {
    name: "André Correia",
    role: "Head of Developer Relations, Solana Foundation",
    handle: "@andrescorreia",
    href: "https://x.com/andrescorreia",
  },
  {
    name: "Jacob Creech",
    role: "VP of Technology, Solana Foundation",
    handle: "@jacobvcreech",
    href: "https://x.com/jacobvcreech",
  },
] as const;

export function LecturerLinks() {
  return (
    <div className="not-prose mt-12 grid gap-x-12 md:grid-cols-2">
      {lecturers.map((lecturer) => (
        <a
          key={lecturer.name}
          href={lecturer.href}
          target="_blank"
          rel="noreferrer"
          className="group border-t border-white/20 py-6 text-white no-underline outline-none transition-colors hover:border-[#14f195] focus-visible:border-[#14f195] focus-visible:ring-2 focus-visible:ring-[#14f195] focus-visible:ring-offset-4 focus-visible:ring-offset-[#191918]"
        >
          <span className="flex items-baseline justify-between gap-4">
            <span className="text-xl font-medium tracking-[-0.02em]">
              {lecturer.name}
            </span>
            <span className="text-xs font-bold text-[#14f195] transition-transform group-hover:-translate-y-0.5 motion-reduce:transform-none">
              {lecturer.handle} ↗
            </span>
          </span>
          <span className="mt-2 block text-sm leading-6 text-white/50">
            {lecturer.role}
          </span>
        </a>
      ))}
    </div>
  );
}

export function ZineCredits() {
  const plate = plates.credits;

  return (
    <section className="not-prose relative mx-auto w-full max-w-[1512px] overflow-hidden">
      <Image
        src={plate.src}
        alt=""
        width={plate.width}
        height={plate.height}
        className="block h-auto w-full max-w-none select-none"
        sizes="(max-width: 1512px) 100vw, 1512px"
      />
      <div
        className="absolute left-1/2 top-[25%] flex h-[18%] w-[34%] -translate-x-1/2 items-center justify-center bg-[#191918] bg-cover text-center"
        style={{ backgroundImage: `url(${uploadRoot}/texture.webp)` }}
      >
        <p className="text-[clamp(0.65rem,1.4vw,1.1rem)] uppercase tracking-[0.22em] text-[#ffe45e]">
          Program team · instructors · student builders
        </p>
      </div>
    </section>
  );
}

const Paragraph = (props: ComponentPropsWithoutRef<"p">) => (
  <p {...props} className="m-0" />
);

const Anchor = (props: ComponentPropsWithoutRef<"a">) => (
  <a
    {...props}
    className="font-medium text-[#14f195] underline decoration-[#14f195]/40 underline-offset-4 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14f195]"
  />
);

export const summerSchoolMdxComponents = {
  ZinePlate,
  ZineCopy,
  LecturerLinks,
  StudentProjects,
  StudentVoicesCarousel,
  SummerSchoolHero,
  SummerSchoolNumbers,
  SummerSchoolCurriculum,
  SummerSchoolLecturers,
  SummerSchoolNextSteps,
  ZineCredits,
  p: Paragraph,
  a: Anchor,
  strong: (props: ComponentPropsWithoutRef<"strong">) => (
    <strong {...props} className="font-medium text-white" />
  ),
  ul: (props: ComponentPropsWithoutRef<"ul">) => (
    <ul {...props} className="m-0 space-y-3 pl-6 marker:text-[#ffe45e]" />
  ),
  li: (props: ComponentPropsWithoutRef<"li">) => (
    <li {...props} className="pl-2" />
  ),
};
