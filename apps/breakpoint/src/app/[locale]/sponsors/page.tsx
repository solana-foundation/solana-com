import type { Metadata } from "next";
import SponsorsPage from "@/components/pages/sponsors/SponsorsPage";
import { getPageMetadata } from "@/app/metadata";

const pageMetadata = {
  path: "/sponsors",
  title: "Sponsors",
  description:
    "Meet the teams sponsoring Breakpoint 2026 in London — reach 7,000+ high-intent builders, investors, and institutions shaping Solana.",
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
  return <SponsorsPage />;
}
