import { Metadata } from "next";
import { XdpPage } from "./xdp-page";
import fs from "fs";
import path from "path";

export const revalidate = 3600;

type Props = { params: Promise<{ locale: string }> };

export default async function Page(_props: Props) {
  const markdownPath = path.join(
    process.cwd(),
    "content",
    "upgrades",
    "xdp.md",
  );
  const markdownContent = fs.readFileSync(markdownPath, "utf-8");

  return <XdpPage markdownContent={markdownContent} />;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  return {
    title:
      "XDP Networking | Solana Upgrades - High-Performance Validator Networking",
    description:
      "XDP (eXpress Data Path) reduces validator packet processing latency by up to 200x, enabling 100M CU blocks on Solana. Available in Agave 4.0.0, enabled by default in Firedancer.",
    alternates: {
      canonical: "/upgrades/xdp",
      languages: {
        "x-default": "/upgrades/xdp",
        en: "/upgrades/xdp",
        ar: "/ar/upgrades/xdp",
        de: "/de/upgrades/xdp",
        el: "/el/upgrades/xdp",
        es: "/es/upgrades/xdp",
        fi: "/fi/upgrades/xdp",
        fr: "/fr/upgrades/xdp",
        hi: "/hi/upgrades/xdp",
        id: "/id/upgrades/xdp",
        it: "/it/upgrades/xdp",
        ja: "/ja/upgrades/xdp",
        ko: "/ko/upgrades/xdp",
        nl: "/nl/upgrades/xdp",
        pl: "/pl/upgrades/xdp",
        pt: "/pt/upgrades/xdp",
        ru: "/ru/upgrades/xdp",
        tr: "/tr/upgrades/xdp",
        uk: "/uk/upgrades/xdp",
        vi: "/vi/upgrades/xdp",
        zh: "/zh/upgrades/xdp",
      },
    },
    openGraph: {
      title:
        "XDP Networking | Solana Upgrades - High-Performance Validator Networking",
      description:
        "XDP reduces validator packet processing latency by up to 200x. Learn how to enable XDP on Agave and why Firedancer uses it by default.",
      type: "article",
    },
  };
}
