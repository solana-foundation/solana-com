import type { Metadata } from "next";
import TravelPage from "@/components/pages/travel/TravelPage";

export const metadata: Metadata = {
  title: "Travel | Breakpoint 2026",
  description:
    "Plan travel to Breakpoint 2026 in London with airport, flight, hotel, visa, and local recommendations.",
};

export default function LocaleTravelPage() {
  return <TravelPage />;
}
