import type { ComponentPropsWithoutRef } from "react";
import { StudentProjects } from "./student-projects";
import { StudentVoicesCarousel } from "./student-voices-carousel";
import {
  SummerSchoolCurriculum,
  SummerSchoolHero,
  SummerSchoolLecturers,
  SummerSchoolNextSteps,
  SummerSchoolNumbers,
} from "./zine-sections";

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
