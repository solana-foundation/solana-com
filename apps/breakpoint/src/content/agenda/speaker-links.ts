import type { AgendaItem, AgendaSpeaker } from "@/content/agenda/types";
import type { BreakpointSpeaker } from "@/content/speakers/types";

function normalize(value: string | undefined) {
  return (value ?? "").trim().replace(/\s+/g, " ").toLowerCase();
}

function findProfile(
  speaker: AgendaSpeaker,
  byId: Map<string, BreakpointSpeaker>,
  byName: Map<string, BreakpointSpeaker[]>,
): BreakpointSpeaker | undefined {
  if (speaker.id && byId.has(speaker.id)) return byId.get(speaker.id);

  const candidates = byName.get(normalize(speaker.name)) ?? [];
  if (candidates.length === 1) return candidates[0];

  return candidates.find(
    (candidate) =>
      !speaker.company ||
      !candidate.company ||
      normalize(candidate.company) === normalize(speaker.company),
  );
}

/**
 * Agenda rows only carry a speaker's name, role and company. The published
 * speakers list carries the X profile, so copy it across by Airtable record id
 * and fall back to a name match for rows that are not linked yet.
 */
export function attachSpeakerProfiles(
  agenda: AgendaItem[],
  speakers: BreakpointSpeaker[],
): AgendaItem[] {
  if (speakers.length === 0) return agenda;

  const byId = new Map(speakers.map((speaker) => [speaker.id, speaker]));
  const byName = new Map<string, BreakpointSpeaker[]>();
  for (const speaker of speakers) {
    const key = normalize(speaker.name);
    byName.set(key, [...(byName.get(key) ?? []), speaker]);
  }

  return agenda.map((item) => ({
    ...item,
    speakers: item.speakers.map((speaker) => {
      const profile = findProfile(speaker, byId, byName);
      if (!profile?.xUrl) return speaker;
      return { ...speaker, xUrl: profile.xUrl };
    }),
  }));
}
