import type { ReactNode } from "react";
import {
  ArchivedCampaignLayout,
  archivedCampaignMetadata,
} from "@/components/archived-campaign-layout";

export const metadata = archivedCampaignMetadata;

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <ArchivedCampaignLayout
      period="February–March 2026"
      noticeKey="graveyardHack"
    >
      {children}
    </ArchivedCampaignLayout>
  );
}
