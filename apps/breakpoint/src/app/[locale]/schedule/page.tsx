import type { Metadata } from "next";
import ComingSoonPage from "@/components/pages/ComingSoonPage";
import { getPageMetadata } from "@/app/metadata";

const pageMetadata = {
  path: "/schedule",
  title: "Schedule",
  description:
    "The Breakpoint 2026 schedule is coming soon for the London conference.",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return getPageMetadata(locale, pageMetadata);
}

export default function LocaleSchedulePage() {
  return (
    <ComingSoonPage
      title="Schedule"
      description="The Breakpoint 2026 schedule is coming soon. In the meantime, plan your trip, explore community side events, and reserve your ticket."
    />
  );
}
