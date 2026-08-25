export type BreakpointSpeaker = {
  company?: string;
  headshotPng?: string;
  headshotWebm?: string;
  id: string;
  name: string;
  role?: string;
  slug: string;
  sortOrder: number;
  xUrl?: string;
};

export type SpeakerDeliveryItem = {
  company: string | null;
  headshotPng: string | null;
  headshotWebm: string | null;
  id: string;
  name: string;
  role: string | null;
  xUrl: string | null;
};

export function toSpeakerDeliveryItem(
  speaker: BreakpointSpeaker,
): SpeakerDeliveryItem {
  return {
    company: speaker.company ?? null,
    headshotPng: speaker.headshotPng ?? null,
    headshotWebm: speaker.headshotWebm ?? null,
    id: speaker.id,
    name: speaker.name,
    role: speaker.role ?? null,
    xUrl: speaker.xUrl ?? null,
  };
}
