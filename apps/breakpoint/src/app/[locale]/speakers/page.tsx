import type { Metadata } from "next";
import ComingSoonPage from "@/components/pages/ComingSoonPage";

export const metadata: Metadata = {
  title: "Speakers | Breakpoint 2026",
  description:
    "Breakpoint 2026 speaker announcements are coming soon for the London conference.",
};

export default function LocaleSpeakersPage() {
  return (
    <ComingSoonPage
      title="Speakers"
      description="Speaker announcements are coming soon. Check back for the builders, institutions, and policymakers joining Breakpoint 2026 in London."
    />
  );
}
