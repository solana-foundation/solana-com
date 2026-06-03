export type SpeakerSocials = {
  linkedin?: string;
  website?: string;
  x?: string;
};

export type SpeakerSession = {
  day?: string;
  format?: string;
  title?: string;
};

export type BreakpointSpeaker = {
  company?: string;
  id: string;
  image?: string;
  name: string;
  session?: SpeakerSession;
  slug: string;
  socials: SpeakerSocials;
  sortOrder: number;
  title?: string;
};
