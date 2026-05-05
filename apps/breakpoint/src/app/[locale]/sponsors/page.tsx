import type { Metadata } from "next";
import ComingSoonPage from "@/components/pages/ComingSoonPage";

export const metadata: Metadata = {
  title: "Sponsors | Breakpoint 2026",
  description:
    "Breakpoint 2026 sponsor announcements are coming soon for the London conference.",
};

export default function LocaleSponsorsPage() {
  return (
    <ComingSoonPage
      title="Sponsors"
      description="Sponsor announcements are coming soon. Check back for the teams supporting Breakpoint 2026 in London."
    />
  );
}
