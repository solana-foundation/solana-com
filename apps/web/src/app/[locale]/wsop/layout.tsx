import type { ReactNode } from "react";
import { Anton } from "next/font/google";
import "./wsop.css";
import {
  ArchivedCampaignLayout,
  archivedCampaignMetadata,
} from "@/components/archived-campaign-layout";

export const metadata = archivedCampaignMetadata;

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--wsop-display",
  display: "swap",
});

export default function WsopLayout({ children }: { children: ReactNode }) {
  return (
    <ArchivedCampaignLayout period="2026" noticeKey="wsop">
      <div className={`wsop-page ${anton.variable}`}>{children}</div>
    </ArchivedCampaignLayout>
  );
}
