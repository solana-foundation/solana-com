export type AgendaSessionType =
  | "keynote"
  | "panel"
  | "fireside"
  | "lightning"
  | "break"
  | "demo"
  | "closing";

export interface AgendaSpeaker {
  name?: string;
  title?: string;
  company?: string;
}

export interface AgendaSession {
  id: string;
  time?: string;
  title: string;
  subtitle?: string;
  type: AgendaSessionType;
  format?: string;
  formats?: string[];
  location?: string;
  track?: string;
  duration?: string;
  moderator?: AgendaSpeaker;
  speakers?: AgendaSpeaker[];
}

export interface AgendaData {
  event?: {
    name: string;
    date?: string;
    venue?: string;
    hall?: string;
    mc?: string;
  };
  focusTopics?: Array<{ title: string; description: string }>;
  sessions: AgendaSession[];
}
