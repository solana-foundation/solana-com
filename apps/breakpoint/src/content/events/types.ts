export interface HighlightedEvent {
  id: string;
  title: string;
  url: string;
  coverUrl: string | null;
  startAt: string;
  endAt: string | null;
  timezone: string | null;
  city: string | null;
}
