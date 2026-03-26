import { PlayerProvider } from "@/components/podcast/player-context";
import { PersistentMiniPlayer } from "@/components/podcast/persistent-mini-player";

export default function PodcastsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PlayerProvider>
      {children}
      <PersistentMiniPlayer />
    </PlayerProvider>
  );
}
