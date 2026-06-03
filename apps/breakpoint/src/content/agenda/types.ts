export const AGENDA_DAY_TABS = [
  "Pre-Event",
  "Day 1",
  "Day 2",
  "Day 3",
] as const;

export type AgendaSpeaker = {
  company?: string;
  name: string;
  title?: string;
};

export type AgendaItem = {
  day: string;
  description?: string;
  duration?: string;
  id: string;
  location?: string;
  sortOrder: number;
  speakers: AgendaSpeaker[];
  tag?: string;
  time: string;
  title: string;
  variant?: "session" | "static";
};
