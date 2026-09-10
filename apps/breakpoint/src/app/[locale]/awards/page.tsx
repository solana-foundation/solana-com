import type { Metadata } from "next";
import AwardsPage from "@/components/pages/awards/AwardsPage";
import { getPageMetadata } from "@/app/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return getPageMetadata(locale, {
    path: "/awards",
    title: "Community Awards",
    description:
      "Nominate outstanding members of the Solana community for recognition.",
  });
}

export default function LocaleAwardsPage() {
  return <AwardsPage />;
}
