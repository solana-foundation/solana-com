import { PlayerProvider } from "@/components/podcast/player-context";

export default function PodcastsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PlayerProvider>{children}</PlayerProvider>;
}
