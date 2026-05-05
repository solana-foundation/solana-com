import type { Metadata } from "next";
import TravelPage from "@/components/pages/travel/TravelPage";
import { getPageMetadata } from "@/app/metadata";

const pageMetadata = {
  path: "/travel",
  title: "Travel",
  description:
    "Plan travel to Breakpoint 2026 in London with airport, flight, hotel, visa, and local recommendations.",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return getPageMetadata(locale, pageMetadata);
}

export default function LocaleTravelPage() {
  return <TravelPage />;
}
