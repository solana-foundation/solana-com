import Image from "next/image";
import type { ComponentPropsWithoutRef } from "react";
import { StudentProjects } from "./student-projects";
import { StudentVoicesCarousel } from "./student-voices-carousel";
import styles from "./summer-school.module.css";
import {
  SummerSchoolCurriculum,
  SummerSchoolHero,
  SummerSchoolLecturers,
  SummerSchoolNextSteps,
  SummerSchoolNumbers,
} from "./zine-sections";

const uploadRoot = "/uploads/posts/solana-summer-school-2026";

export function ZineCredits() {
  return (
    <section className={`not-prose ${styles.canvas} ${styles.credits}`}>
      <h2>Credits</h2>
      <p className={styles.creditsIntro}>program team, instructors, design</p>
      <p className={styles.creditsTbu}>TBU</p>
      <Image
        src={`${uploadRoot}/credit-cloud.webp`}
        alt="Solana.com"
        width={390}
        height={270}
        className={styles.creditsCloud}
        loading="eager"
      />
      <Image
        src={`${uploadRoot}/credit-solana.webp`}
        alt="Solana"
        width={190}
        height={80}
        className={styles.creditsSolana}
        loading="eager"
      />
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
