import type { ReactNode } from "react";
import {
  ArchivedCampaignLayout,
  archivedCampaignMetadata,
} from "@/components/archived-campaign-layout";

export const metadata = archivedCampaignMetadata;

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <ArchivedCampaignLayout period="December 2024" noticeKey="artBasel">
      {children}
    </ArchivedCampaignLayout>
  );
}
