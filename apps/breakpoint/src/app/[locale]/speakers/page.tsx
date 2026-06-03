import type { Metadata } from "next";
import ComingSoonPage from "@/components/pages/ComingSoonPage";
import { getPageMetadata } from "@/app/metadata";

const pageMetadata = {
  path: "/speakers",
  title: "Speakers",
  description:
    "Breakpoint 2026 speaker announcements are coming soon for the London conference.",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return getPageMetadata(locale, pageMetadata);
}

export default function LocaleSpeakersPage() {
  return (
    <ComingSoonPage
      title="Speakers"
      description="Speaker announcements are coming soon. Check back for the builders, institutions, and policymakers joining Breakpoint 2026 in London."
    />
  );
}
