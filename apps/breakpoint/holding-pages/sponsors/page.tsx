import type { Metadata } from "next";
import SponsorsPage from "@/components/pages/sponsors/SponsorsPage";

export const metadata: Metadata = {
  title: "Sponsors | Breakpoint 2026",
  description:
    "Meet the Breakpoint 2026 sponsors supporting the Solana ecosystem in London.",
};

export default function LocaleSponsorsPage() {
  return <SponsorsPage />;
}
