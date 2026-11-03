"use client";

import ValidatorsHero from "@/components/validators/ValidatorsHero";
import ValidatorsCards, {
  type ValidatorsCardsProps,
} from "@/components/validators/ValidatorsCards";
import ValidatorsDefinition from "@/components/validators/ValidatorsDefinition";
import ValidatorsRewards from "@/components/validators/ValidatorsRewards";
import ValidatorsGettingStarted from "@/components/validators/ValidatorsGettingStarted";
import ValidatorsFAQ from "@/components/validators/ValidatorsFAQ";

export function ValidatorsPage({
  metrics,
}: {
  metrics: ValidatorsCardsProps["metrics"];
}) {
  return (
    <div className="relative -mt-32 pt-32 pb-12">
      <ValidatorsHero />
      <ValidatorsCards metrics={metrics} />
      <ValidatorsDefinition />
      <ValidatorsRewards />
      <ValidatorsFAQ />
      <ValidatorsGettingStarted />
    </div>
  );
}
