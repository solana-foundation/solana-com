import type { Metadata } from "next";
import FinalFormExperience from "@/components/alpenglow/FinalFormExperience";

export const metadata: Metadata = {
  title: "Alpenglow finality | Solana",
  description:
    "See live Solana transactions move from streaming to confirmed to finalized, and compare today's finality with Alpenglow.",
};

export default function AlpenglowPage() {
  return <FinalFormExperience />;
}
