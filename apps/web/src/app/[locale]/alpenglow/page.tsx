import type { Metadata } from "next";
import FinalFormExperience from "@/components/alpenglow/FinalFormExperience";

export const metadata: Metadata = {
  title: "Final Form — Live Alpenglow artwork | Solana",
  description:
    "A live generative artwork made from the distance between a Solana block appearing and becoming final.",
};

export default function AlpenglowPage() {
  return <FinalFormExperience />;
}
