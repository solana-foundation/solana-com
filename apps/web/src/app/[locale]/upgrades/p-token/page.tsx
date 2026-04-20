import { Metadata } from "next";
import { PTokenPage } from "./p-token-page";
import fs from "fs";
import path from "path";

export const revalidate = 3600;

type Props = { params: Promise<{ locale: string }> };

export default async function Page(_props: Props) {
  // Load markdown content
  const markdownPath = path.join(
    process.cwd(),
    "content",
    "upgrades",
    "p-token.md",
  );
  const markdownContent = fs.readFileSync(markdownPath, "utf-8");

  return <PTokenPage markdownContent={markdownContent} />;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  return {
    title: "P-Token | Solana Upgrades - Optimized Token Program on Solana",
    description:
      "Up to 98% more efficient token operations on Solana with full backward compatibility. P-Token is a drop-in replacement for SPL Token built with the Pinocchio library.",
    alternates: {
      canonical: "/upgrades/p-token",
      languages: {
        "x-default": "/upgrades/p-token",
        en: "/upgrades/p-token",
        ar: "/ar/upgrades/p-token",
        de: "/de/upgrades/p-token",
        el: "/el/upgrades/p-token",
        es: "/es/upgrades/p-token",
        fi: "/fi/upgrades/p-token",
        fr: "/fr/upgrades/p-token",
        hi: "/hi/upgrades/p-token",
        id: "/id/upgrades/p-token",
        it: "/it/upgrades/p-token",
        ja: "/ja/upgrades/p-token",
        ko: "/ko/upgrades/p-token",
        nl: "/nl/upgrades/p-token",
        pl: "/pl/upgrades/p-token",
        pt: "/pt/upgrades/p-token",
        ru: "/ru/upgrades/p-token",
        tr: "/tr/upgrades/p-token",
        uk: "/uk/upgrades/p-token",
        vi: "/vi/upgrades/p-token",
        zh: "/zh/upgrades/p-token",
      },
    },
    openGraph: {
      title: "P-Token | Solana Upgrades - Optimized Token Program on Solana",
      description:
        "Up to 98% more efficient token operations on Solana with full backward compatibility. Learn about the P-Token upgrade.",
      type: "article",
    },
  };
}
