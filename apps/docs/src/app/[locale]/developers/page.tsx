import type { Metadata } from "next";
import { getAlternates } from "@workspace/i18n/routing";
import { DeveloperHub } from "@/components/developers/DeveloperHub/DeveloperHub";
import { getLatestDeveloperUpdates } from "@/lib/developer-media";

type Props = { params: Promise<{ locale: string }> };

export const revalidate = 900;

export default async function Page() {
  const updates = await getLatestDeveloperUpdates();
  return <DeveloperHub updates={updates} />;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "Build on Solana",
    description:
      "Start building on Solana with core documentation, templates, migration guides, developer products, implementation partners, and the latest engineering updates.",
    alternates: getAlternates("/developers", locale),
  };
}
