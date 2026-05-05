import type { Metadata } from "next";
import ComingSoonPage from "@/components/pages/ComingSoonPage";

export const metadata: Metadata = {
  title: "Schedule | Breakpoint 2026",
  description:
    "The Breakpoint 2026 schedule is coming soon for the London conference.",
};

export default function LocaleSchedulePage() {
  return (
    <ComingSoonPage
      title="Schedule"
      description="The Breakpoint 2026 schedule is coming soon. In the meantime, plan your trip, explore community side events, and reserve your ticket."
    />
  );
}
