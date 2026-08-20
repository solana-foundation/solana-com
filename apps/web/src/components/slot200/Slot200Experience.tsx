"use client";

import React from "react";
import { Divider } from "@/component-library/divider";
import { PulseHero } from "./PulseHero";
import { StatsStrip } from "./StatsStrip";
import { StagePath } from "./StagePath";
import { WhyItMatters } from "./WhyItMatters";
import { DayRecut } from "./DayRecut";
import { WorldPulse } from "./WorldPulse";
import { LinksCta } from "./LinksCta";
import { useSlotClock } from "./useSlotClock";

/** The /200ms page body: one live clock feeds every section. */
export default function Slot200Experience() {
  const { live, snap } = useSlotClock();

  return (
    <div className="bg-nd-bg text-nd-high-em-text">
      <PulseHero live={live} snap={snap} />
      <StatsStrip />
      <Divider />
      <StagePath live={live} />
      <Divider />
      <WhyItMatters />
      <Divider />
      <DayRecut />
      <Divider />
      <WorldPulse live={live} />
      <Divider />
      <LinksCta />
    </div>
  );
}
