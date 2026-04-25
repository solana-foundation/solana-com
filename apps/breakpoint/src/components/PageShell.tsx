import type { ComponentProps, ReactNode } from "react";
import Navigation from "@/components/Navigation";
import SkipLink from "@/components/SkipLink";

type PageShellProps = {
  beforeNavigation?: ReactNode;
  children: ReactNode;
  contentId: string;
  navigation?: ComponentProps<typeof Navigation>;
};

export default function PageShell({
  beforeNavigation,
  children,
  contentId,
  navigation = {},
}: PageShellProps) {
  return (
    <main className="relative min-h-screen bg-black text-white">
      <SkipLink targetId={contentId} />
      {beforeNavigation}
      <Navigation {...navigation} />
      <div id={contentId}>{children}</div>
    </main>
  );
}
