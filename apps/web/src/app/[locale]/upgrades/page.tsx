import { UpgradesPage } from "./upgrades-page";
import fs from "fs";
import path from "path";

export const revalidate = 3600; // Revalidate every hour

type Props = { params: Promise<{ locale: string }> };

export default async function Page(_props: Props) {
  const contentDir = path.join(process.cwd(), "content", "upgrades");
  const availableSlugs = fs
    .readdirSync(contentDir)
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => fileName.replace(/\.md$/, ""));

  return <UpgradesPage availableSlugs={availableSlugs} />;
}

export async function generateMetadata(_props: Props) {
  return {
    title: "Solana Upgrades | Core Protocol Improvements, SIMDs & Proposals",
    description:
      "Core protocol work being done to improve security, increase bandwidth, and reduce latency on Solana.",
    alternates: {
      canonical: "/upgrades",
      languages: {
        "x-default": "/upgrades",
        en: "/upgrades",
        ar: "/ar/upgrades",
        de: "/de/upgrades",
        el: "/el/upgrades",
        es: "/es/upgrades",
        fi: "/fi/upgrades",
        fr: "/fr/upgrades",
        hi: "/hi/upgrades",
        id: "/id/upgrades",
        it: "/it/upgrades",
        ja: "/ja/upgrades",
        ko: "/ko/upgrades",
        nl: "/nl/upgrades",
        pl: "/pl/upgrades",
        pt: "/pt/upgrades",
        ru: "/ru/upgrades",
        tr: "/tr/upgrades",
        uk: "/uk/upgrades",
        vi: "/vi/upgrades",
        zh: "/zh/upgrades",
      },
    },
    openGraph: {
      title: "Solana Upgrades | Core Protocol Improvements, SIMDs & Proposals",
      description:
        "Core protocol work being done to improve security, increase bandwidth, and reduce latency on Solana.",
    },
  };
}
