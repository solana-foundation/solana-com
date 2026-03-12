export interface Speaker {
  slug: string;
  name: string;
  firstName: string;
  lastName: string;
  title: string;
  company: string;
  image: string;
}

export interface SpeakersData {
  syncedAt: string;
  speakers: Speaker[];
}
