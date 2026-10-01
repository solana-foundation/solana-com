import type { Metadata } from "next";
import { getBaseMetadata } from "@/app/metadata";
import { DvpDemo } from "./dvp-demo";

type Props = { params: Promise<{ locale: string }> };

export default function Page() {
  return <DvpDemo />;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    ...getBaseMetadata(locale),
    title: "DvP devnet demo",
    description:
      "Follow a real delivery-versus-payment trade from account creation to atomic settlement on Solana devnet.",
    robots: { index: false, follow: false },
  };
}
