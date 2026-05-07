import type { Metadata } from "next";
import ComingSoonPage from "@/components/pages/ComingSoonPage";
import { getPageMetadata } from "@/app/metadata";

const pageMetadata = {
  path: "/sponsors",
  title: "Sponsors",
  description:
    "Breakpoint 2026 sponsor announcements are coming soon for the London conference.",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return getPageMetadata(locale, pageMetadata);
}

export default function LocaleSponsorsPage() {
  return (
    <ComingSoonPage
      title="Sponsors"
      description="Sponsor announcements are coming soon. Check back for the teams supporting Breakpoint 2026 in London."
    />
  );
}
