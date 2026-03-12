"use client";

import ValidatorsHero from "@/components/validators/ValidatorsHero";
import ValidatorsCards from "@/components/validators/ValidatorsCards";
import ValidatorsDefinition from "@/components/validators/ValidatorsDefinition";
import ValidatorsRewards from "@/components/validators/ValidatorsRewards";
import ValidatorsGettingStarted from "@/components/validators/ValidatorsGettingStarted";
import ValidatorsFAQ from "@/components/validators/ValidatorsFAQ";
import { useInView } from "react-intersection-observer";

export function ValidatorsPage() {
  const { ref, inView } = useInView({
    threshold: 0,
    initialInView: true,
  });

  return (
    <div className="relative -mt-32 pt-32 pb-12">
      <ValidatorsHero ref={ref} />
      <ValidatorsCards visible={inView} />
      <ValidatorsDefinition />
      <ValidatorsRewards />
      <ValidatorsFAQ />
      <ValidatorsGettingStarted />
    </div>
  );
}
