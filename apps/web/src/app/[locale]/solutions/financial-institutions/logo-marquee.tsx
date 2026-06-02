"use client";

import { Logos } from "@/component-library/logos";
import { LOGOS } from "@/data/solutions/financial-institutions";

export function FinancialInstitutionsLogoMarquee() {
  return (
    <Logos
      logos={LOGOS}
      itemClassName="h-[28px] md:h-[32px] xl:h-[36px] mr-10 md:mr-16 xl:mr-24"
      speed={60}
    />
  );
}
