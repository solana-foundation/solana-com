import { Metadata } from "next";
import { SkillsPageContent } from "./skills-page";
import { getAlternates } from "@workspace/i18n/routing";

type Props = { params: Promise<{ locale: string }> };

export default async function Page(_props: Props) {
  return <SkillsPageContent />;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "Developer Skills | AI Agent Skills for Solana Development",
    description:
      "Equip your AI assistant with specialized knowledge for Solana development. Curated skills covering frontend, smart contracts, testing, security, and more.",
    alternates: getAlternates("/skills", locale),
  };
}
